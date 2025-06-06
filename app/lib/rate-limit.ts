import { auth } from "@/auth";
import { hasActiveSubscription } from "./subscription";
import prisma from "./db";

// Reset rate limits daily
const RATE_LIMIT_RESET_HOURS = 24;

export async function checkRateLimit(req: Request) {
  const session = await auth();
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const email = session?.user?.email;
  const isAuthenticated = !!session?.user;

  // Get or create user
  const user = await prisma.user.upsert({
    where: {
      email: email || `ip_${ip}`,
    },
    create: {
      email: email || `ip_${ip}`,
      ipAddress: !email ? ip : null,
    },
    update: {},
  });

  // If user has an active subscription, they have unlimited messages
  if (isAuthenticated && (await hasActiveSubscription(user.id))) {
    return {
      allowed: true,
      remaining: Infinity,
      limit: Infinity,
      isAuthenticated,
    };
  }

  // Get current rate limit
  let rateLimit = await prisma.rateLimit.findUnique({
    where: { userId: user.id },
  });

  const now = new Date();
  const shouldReset =
    rateLimit &&
    now.getTime() - rateLimit.lastReset.getTime() >
      RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000;

  // Create or update rate limit
  if (!rateLimit) {
    rateLimit = await prisma.rateLimit.create({
      data: {
        userId: user.id,
        messageCount: 0,
        lastReset: now,
      },
    });
  } else if (shouldReset) {
    rateLimit = await prisma.rateLimit.update({
      where: { userId: user.id },
      data: {
        messageCount: 0,
        lastReset: now,
      },
    });
  }

  const maxMessages = isAuthenticated ? 3 : 1;
  const currentCount = rateLimit.messageCount;

  if (currentCount >= maxMessages) {
    return {
      allowed: false,
      remaining: 0,
      limit: maxMessages,
      isAuthenticated,
    };
  }

  // Increment message count
  rateLimit = await prisma.rateLimit.update({
    where: { userId: user.id },
    data: { messageCount: { increment: 1 } },
  });

  return {
    allowed: true,
    remaining: maxMessages - (currentCount + 1),
    limit: maxMessages,
    isAuthenticated,
  };
}
