import { auth } from "@/auth";
import { hasActiveSubscription } from "./subscription";
import { prisma } from "./db";

// Reset rate limits daily
const RATE_LIMIT_RESET_HOURS = 24;

interface RateLimitRecord {
  lastReset: Date;
}

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

  // Get or create rate limit
  const rateLimit = await prisma.rateLimit.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      messageCount: 0,
      lastReset: new Date(),
    },
    update: {
      // Reset count if 24 hours have passed
      messageCount: {
        set:
          new Date().getTime() -
            new Date(
              prisma.rateLimit
                .findUnique({
                  where: { userId: user.id },
                })
                .then(
                  (rl: RateLimitRecord | null) => rl?.lastReset || new Date()
                )
            ).getTime() >
          RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000
            ? 0
            : undefined,
      },
      lastReset: {
        set:
          new Date().getTime() -
            new Date(
              prisma.rateLimit
                .findUnique({
                  where: { userId: user.id },
                })
                .then(
                  (rl: RateLimitRecord | null) => rl?.lastReset || new Date()
                )
            ).getTime() >
          RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000
            ? new Date()
            : undefined,
      },
    },
  });

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
  await prisma.rateLimit.update({
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
