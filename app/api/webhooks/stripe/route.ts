import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/app/config/stripe";
import {
  setSubscriptionStatus,
  removeSubscription,
} from "@/app/lib/subscription";

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = await req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "Missing stripe signature or webhook secret" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.user_id;
        if (userId) {
          setSubscriptionStatus(userId, subscription.status === "active");
        }
        console.log("Subscription status updated:", subscription.status);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedUserId = deletedSubscription.metadata.user_id;
        if (deletedUserId) {
          removeSubscription(deletedUserId);
        }
        console.log("Subscription cancelled:", deletedSubscription.id);
        break;

      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionUserId = session.metadata?.userId;
        if (sessionUserId) {
          // When checkout is completed, we set the subscription as active
          // The subscription status will be updated again when the subscription.created event arrives
          setSubscriptionStatus(sessionUserId, true);
        }
        console.log(
          "Checkout completed and subscription activated for user:",
          sessionUserId
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
