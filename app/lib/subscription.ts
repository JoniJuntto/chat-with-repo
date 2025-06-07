import { db } from "@/app/db";
import { subscriptionTable, usersTable } from "@/app/db/schema";
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
  stripeSubscriptionId?: string,
  email?: string
): Promise<void> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) {
    await db.insert(usersTable).values({ id: userId, email });
  }
  await db
    .insert(subscriptionTable)
    .values({
      userId,
      isActive,
      stripeCustomerId,
      stripeSubscriptionId,
    })
    .returning();
}

export async function removeSubscription(userId: string): Promise<void> {
  await db
    .delete(subscriptionTable)
    .where(eq(subscriptionTable.userId, userId));
}
