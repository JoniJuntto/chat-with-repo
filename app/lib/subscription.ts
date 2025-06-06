import prisma from "./db";

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  return subscription?.isActive || false;
}

export async function setSubscriptionStatus(
  userId: string,
  isActive: boolean,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<void> {
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      isActive,
      stripeCustomerId,
      stripeSubscriptionId,
    },
    update: {
      isActive,
      stripeCustomerId,
      stripeSubscriptionId,
    },
  });
}

export async function removeSubscription(userId: string): Promise<void> {
  await prisma.subscription.delete({
    where: { userId },
  });
}
