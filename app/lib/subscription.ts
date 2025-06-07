import { db } from "@/app/db";
import { subscriptionTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const [subscription] = await db
    .select()
    .from(subscriptionTable)
    .where(eq(subscriptionTable.userId, userId));
  return subscription?.isActive || false;
}

export async function setSubscriptionStatus(
  userId: string,
  isActive: boolean,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<void> {
  await db
    .insert(subscriptionTable)
    .values({
      userId,
      isActive,
      stripeCustomerId,
      stripeSubscriptionId,
    })
    .onConflictDoUpdate({
      target: [subscriptionTable.userId],
      set: {
        isActive,
        stripeCustomerId,
        stripeSubscriptionId,
      },
    })
    .returning();
}

export async function removeSubscription(userId: string): Promise<void> {
  await db
    .delete(subscriptionTable)
    .where(eq(subscriptionTable.userId, userId));
}
