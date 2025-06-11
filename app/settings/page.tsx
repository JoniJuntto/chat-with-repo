import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
        <AppSidebar />
        <main className="flex-1 p-8 w-full space-y-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Card className="bg-card/70 backdrop-blur-md border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Email Notifications</span>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>Enable Tips</span>
                <input type="checkbox" className="h-4 w-4" />
              </label>
            </CardContent>
          </Card>
          <Button>Save Changes</Button>
        </main>
      </div>
    </SidebarProvider>
  );
}
