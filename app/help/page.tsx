import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    q: "How do I start a chat?",
    a: "Navigate to the Chat page and enter a public GitHub repository in the input field.",
  },
  {
    q: "Can I analyze private repositories?",
    a: "Currently only public repositories are supported.",
  },
  {
    q: "Where do I report issues?",
    a: "Please open an issue on our GitHub project or contact support@example.com.",
  },
];

export default function HelpPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
        <AppSidebar />
        <main className="flex-1 p-8 w-full space-y-6">
          <h1 className="text-3xl font-bold">Help Center</h1>
          {faqs.map((faq) => (
            <Card key={faq.q} className="bg-card/70 backdrop-blur-md border-border/40">
              <CardHeader>
                <CardTitle className="text-base">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </SidebarProvider>
  );
}
