import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { subscriptionTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import stripe from "@/app/config/stripe";

export async function POST() {
  const session = await auth();
  const origin = (await headers()).get("origin") || "";

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(`${origin}/login`, { status: 303 });
  }

  const [subscription] = await db
    .select({ customerId: subscriptionTable.stripeCustomerId })
    .from(subscriptionTable)
    .where(eq(subscriptionTable.userId, session.user.id));

  if (!subscription?.customerId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.customerId,
    return_url: `${origin}/account/billing`,
  });

  return NextResponse.redirect(portal.url, { status: 303 });
}
