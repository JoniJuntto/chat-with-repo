import { NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/app/config/stripe";
import { getProduct } from "@/lib/utils";
import { auth } from "@/auth";
import { serverEnvs } from "@/app/env/server";
import { db } from "@/app/db";
import { usersTable } from "@/app/db/schema";

export async function POST() {
  const headersList = await headers();
  const product = await getProduct();
  const session = await auth();
  try {
    console.log(session);
    if (!session?.user?.id) {
      return NextResponse.redirect(`${headersList.get("origin")}/login`, {
        status: 303,
      });
    }
    // Ensure the authenticated user exists in the database so that
    // subscription webhooks can reference a valid user record
    if (session.user?.id) {
      await db
        .insert(usersTable)
        .values({ id: session.user.id, email: session.user.email || null })
        .onConflictDoUpdate({
          target: [usersTable.id],
          set: { email: session.user.email || null },
        });
    }
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product:
              serverEnvs.NODE_ENV === "production"
                ? "prod_SSH5vUPLhhrvvR"
                : "prod_SRrxTxYQcEBa51",
            unit_amount: product.price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${headersList.get(
        "origin"
      )}/chat?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${headersList.get("origin")}/pricing`,
      subscription_data: {
        metadata: {
          user_id: session?.user?.id,
        },
      },
      metadata: {
        userId: session?.user?.id ?? "",
        email: session?.user?.email ?? "",
      },
    });

    return NextResponse.redirect(checkoutSession.url ?? "/", {
      status: 303,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
