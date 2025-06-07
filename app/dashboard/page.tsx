import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <TabsContent value="subscription">
            <p>Sb</p>
          </TabsContent>
        </TabsList>
      </Tabs>
    </div>
  );
}
