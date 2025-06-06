import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/app/config/stripe";
import { getProduct } from "@/lib/utils";
import { auth } from "@/auth";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = await headers();
  const product = await getProduct();
  const session = await auth();
  try {
    console.log(session);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product: product.id,
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
