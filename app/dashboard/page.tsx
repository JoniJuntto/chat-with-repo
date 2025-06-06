import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionManager } from "@/components/dashboard/SubscriptionManager";
import { ChatHistory } from "@/components/dashboard/ChatHistory";
import { FavoriteRepos } from "@/components/dashboard/FavoriteRepos";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Käyttäjähallintapaneeli</h1>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscription">Tilaus</TabsTrigger>
          <TabsTrigger value="history">Keskusteluhistoria</TabsTrigger>
          <TabsTrigger value="favorites">Suosikkirepositoriot</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="mt-6">
          <SubscriptionManager userId={session.user.id!} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ChatHistory userId={session.user.id!} />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <FavoriteRepos userId={session.user.id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
