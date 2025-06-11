import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const res = await fetch("/api/account/subscription", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to load subscription");
  }

  const { subscription } = await res.json();

  const isActive = subscription?.isActive ?? false;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{isActive ? "Active" : "Inactive"}</p>
          {subscription?.stripeCustomerId && (
            <form action="/api/billing-portal" method="POST">
              <Button>Open Billing Portal</Button>
            </form>
          )}
          {!isActive && (
            <Button asChild>
              <a href="/pricing">Subscribe</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
