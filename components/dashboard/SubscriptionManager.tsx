"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasActiveSubscription } from "@/app/lib/subscription";

interface SubscriptionManagerProps {
  userId: string;
}

export function SubscriptionManager({ userId }: SubscriptionManagerProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const active = await hasActiveSubscription(userId);
        setIsActive(active);
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [userId]);

  const handleSubscribe = async () => {
    // Redirect to Stripe checkout
    window.location.href = "/api/stripe/create-checkout-session";
  };

  const handleManageSubscription = async () => {
    // Redirect to Stripe customer portal
    window.location.href = "/api/stripe/create-portal-session";
  };

  if (loading) {
    return <div>Ladataan...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tilauksen hallinta</CardTitle>
        <CardDescription>
          {isActive
            ? "Sinulla on aktiivinen tilaus"
            : "Tilaa palvelu saadaksesi lisää viestejä ja ominaisuuksia"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Tilauksen tila</h3>
              <p className="text-sm text-muted-foreground">
                {isActive ? "Aktiivinen" : "Ei aktiivista tilausta"}
              </p>
            </div>
            {isActive ? (
              <Button onClick={handleManageSubscription}>
                Hallitse tilausta
              </Button>
            ) : (
              <Button onClick={handleSubscribe}>Tilaa palvelu</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
