import { auth } from "@/auth";
import { hasActiveSubscription } from "./subscription";
import { db } from "@/app/db";
import { rateLimitTable, usersTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

// Reset rate limits daily
const RATE_LIMIT_RESET_HOURS = 24;

export async function checkRateLimit(req: Request) {
  const session = await auth();
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const id = session?.user?.id;
  const userIdentifier = id || `ip_${ip}`;
  const isAuthenticated = !!session?.user;

  // Try to find an existing user either by id or email
  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userIdentifier));

  if (!user && session?.user?.email) {
    [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, session.user.email));
  }

  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({
        id: userIdentifier,
        email: session?.user?.email || null,
        ipAddress: !id ? ip : null,
      })
      .returning();
  } else {
    // Keep user record up to date
    [user] = await db
      .update(usersTable)
      .set({
        email: session?.user?.email || user.email,
        ipAddress: !id ? ip : user.ipAddress,
      })
      .where(eq(usersTable.id, user.id))
      .returning();
  }

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
  let [rateLimit] = await db
    .select()
    .from(rateLimitTable)
    .where(eq(rateLimitTable.userId, user.id));

  const now = new Date();
  const shouldReset =
    rateLimit &&
    now.getTime() - new Date(rateLimit.lastReset ?? "").getTime() >
      RATE_LIMIT_RESET_HOURS * 60 * 60 * 1000;

  // Create or update rate limit
  if (!rateLimit) {
    [rateLimit] = await db
      .insert(rateLimitTable)
      .values({
        userId: user.id,
        messageCount: 0,
        lastReset: now.toISOString(),
      })
      .returning();
  } else if (shouldReset) {
    [rateLimit] = await db
      .update(rateLimitTable)
      .set({
        messageCount: 0,
        lastReset: now.toISOString(),
      })
      .returning();
  }

  const maxMessages = isAuthenticated ? 10 : 3;
  const currentCount = rateLimit.messageCount;

  if (currentCount >= maxMessages) {
    return {
      allowed: false,
      remaining: 0,
      limit: maxMessages,
      isAuthenticated,
    };
  }

  [rateLimit] = await db
    .update(rateLimitTable)
    .set({ messageCount: currentCount + 1 })
    .where(eq(rateLimitTable.userId, user.id))
    .returning();

  return {
    allowed: true,
    remaining: maxMessages - (currentCount + 1),
    limit: maxMessages,
    isAuthenticated,
  };
}
