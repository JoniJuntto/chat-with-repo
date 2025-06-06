"use client";
import { Github, MessageSquare, Settings, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-group";

export default function ChooseRepoPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 ml-[6rem] flex flex-col">
          <div className="flex-1 p-6">
            <Content />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

const Content = () => {
  const [repository, setRepository] = useState("");
  const router = useRouter();

  const handleRepositorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repository.trim()) {
      const [owner, repo] = repository.split("/");
      router.push(`/chat/${repo}?owner=${owner}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Github className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  Chat with Any Public GitHub Repository
                </h2>
                <p className="text-muted-foreground">
                  Enter a repository name to start a conversation about its code
                </p>
              </div>

              <form onSubmit={handleRepositorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        id="repository"
                        type="text"
                        value={repository}
                        onChange={(e) => setRepository(e.target.value)}
                        placeholder="owner/repo (e.g., facebook/react)"
                        className="w-full"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg">
                      Start Chat
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter a GitHub repository in the format: owner/repository
                  </p>
                </div>
              </form>

              {/* Example Repositories */}
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-3">
                  Popular Repositories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "facebook/react",
                    "vercel/next.js",
                    "microsoft/vscode",
                    "tailwindlabs/tailwindcss",
                  ].map((repo) => (
                    <Button
                      key={repo}
                      variant="outline"
                      className="justify-start text-sm"
                      onClick={() => {
                        setRepository(repo);
                        router.push(`/chat/${repo}`);
                      }}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      {repo}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
