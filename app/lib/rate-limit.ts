import { auth } from "@/auth";

// Simple in-memory store for demo purposes
// In production, you should use Redis or similar
const messageCounts = new Map<string, number>();

export async function checkRateLimit(req: Request) {
  const session = await auth();
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userId = session?.user?.email || ip;

  const currentCount = messageCounts.get(userId) || 0;
  const isAuthenticated = !!session?.user;
  const maxMessages = isAuthenticated ? 3 : 1;

  if (currentCount >= maxMessages) {
    return {
      allowed: false,
      remaining: 0,
      limit: maxMessages,
      isAuthenticated,
    };
  }

  messageCounts.set(userId, currentCount + 1);

  return {
    allowed: true,
    remaining: maxMessages - (currentCount + 1),
    limit: maxMessages,
    isAuthenticated,
  };
}
