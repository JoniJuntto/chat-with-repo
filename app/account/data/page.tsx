import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AccountDataPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  const res = await fetch("/api/account/data", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to load account data");
  }

  const { user, favoriteCount, chatCount } = await res.json();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Your Data</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Favorite repositories: {favoriteCount}</p>
          <p>Chat sessions: {chatCount}</p>
        </CardContent>
      </Card>

      <form action="/api/delete-account" method="POST">
        <Button variant="destructive">Delete My Data</Button>
      </form>
    </div>
  );
}
