import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/app/config/stripe";
import {
  setSubscriptionStatus,
  removeSubscription,
} from "@/app/lib/subscription";
import { serverEnvs } from "@/app/env/server";

const webhookSecret = serverEnvs.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    console.log(body);
    const signature = await req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      console.error("Missing stripe signature or webhook secret", {
        hasSignature: !!signature,
        hasWebhookSecret: !!webhookSecret,
      });
      return NextResponse.json(
        { error: "Missing stripe signature or webhook secret" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Successfully verified webhook signature for event:", {
        type: event.type,
        id: event.id,
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", {
        error: err instanceof Error ? err.message : "Unknown error",
      });
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
        console.log("Processing subscription event:", {
          type: event.type,
          subscriptionId: subscription.id,
          userId,
          status: subscription.status,
        });
        if (userId) {
          setSubscriptionStatus(userId, subscription.status === "active");
          console.log("Updated subscription status for user:", {
            userId,
            isActive: subscription.status === "active",
          });
        } else {
          console.warn("No user_id found in subscription metadata:", {
            subscriptionId: subscription.id,
          });
        }
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedUserId = deletedSubscription.metadata.user_id;
        console.log("Processing subscription deletion:", {
          subscriptionId: deletedSubscription.id,
          userId: deletedUserId,
          cancelAt: deletedSubscription.cancel_at
            ? new Date(deletedSubscription.cancel_at * 1000).toISOString()
            : null,
        });
        if (deletedUserId) {
          removeSubscription(deletedUserId);
          console.log("Removed subscription for user:", {
            userId: deletedUserId,
          });
        } else {
          console.warn("No user_id found in deleted subscription metadata:", {
            subscriptionId: deletedSubscription.id,
          });
        }
        break;

      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionUserId = session.metadata?.userId;
        console.log("Processing checkout completion:", {
          sessionId: session.id,
          userId: sessionUserId,
          subscriptionId: session.subscription,
          customerId: session.customer,
        });
        if (sessionUserId) {
          setSubscriptionStatus(sessionUserId, true);
          console.log("Activated subscription for user after checkout:", {
            userId: sessionUserId,
          });
        } else {
          console.warn("No userId found in checkout session metadata:", {
            sessionId: session.id,
          });
        }
        break;

      default:
        console.log("Received unhandled event type:", {
          type: event.type,
          id: event.id,
        });
    }

    console.log("Successfully processed webhook event:", {
      type: event.type,
      id: event.id,
    });
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error processing webhook:", {
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
