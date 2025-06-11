"use client";
import {
  Github,
  Loader2,
  AlertCircle,
  Star,
  GitFork,
  Bug,
  Calendar,
  Globe,
  Code2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-group";
import { Skeleton } from "@/components/ui/skeleton";
import { clsx } from "clsx";
import Image from "next/image";
import { signIn } from "@/auth";

interface RepoInfo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  owner: string;
  avatar_url: string;
  homepage: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  open_issues: number;
  visibility: string;
  default_branch: string;
  size: number;
}

interface RecentChat {
  repository: string;
  createdAt?: string;
}

export default function ChooseRepoPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex bg-gradient-to-br from-background via-background to-muted/20 w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center px-4 py-12 w-full">
          <div className="w-full flex flex-col items-center gap-8">
            <Content />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

const Content = () => {
  const { data: session } = useSession();
  const [repository, setRepository] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const validateRepo = async () => {
      if (!repository.includes("/")) {
        setRepoInfo(null);
        setError(null);
        return;
      }

      const [owner, repo] = repository.split("/");
      if (!owner || !repo) {
        setError("Please enter a valid repository in the format: owner/repo");
        setRepoInfo(null);
        return;
      }

      setIsValidating(true);
      setError(null);

      try {
        const { data } = await octokit.rest.repos.get({ owner, repo });
        setRepoInfo({
          name: data.full_name,
          description: data.description,
          language: data.language,
          stars: data.stargazers_count,
          forks: data.forks_count,
          url: data.html_url,
          owner: data.owner.login,
          avatar_url: data.owner.avatar_url,
          homepage: data.homepage,
          topics: data.topics || [],
          created_at: data.created_at,
          updated_at: data.updated_at,
          open_issues: data.open_issues_count,
          visibility: data.visibility || "unknown",
          default_branch: data.default_branch,
          size: data.size,
        });
        setError(null);
      } catch (err) {
        console.error(err);
        const error = err as { status?: number };
        if (!session && error.status === 404) {
          setError("Private repository. Please sign in to access.");
        } else {
          setError("Repository not found. Please check the name and try again.");
        }
        setRepoInfo(null);
      } finally {
        setIsValidating(false);
      }
    };

    const debounceTimer = setTimeout(validateRepo, 500);
    return () => clearTimeout(debounceTimer);
  }, [repository]);

  useEffect(() => {
    const load = async () => {
      try {
        if (session?.user) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`);
          const data = await res.json();
          setRecentChats(data);
        } else {
          const local = JSON.parse(localStorage.getItem("chat-history") || "[]");
          setRecentChats(local);
        }
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    };
    load();
  }, [session]);

  const handleRepositorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repository.trim() && repoInfo) {
      const [owner, repo] = repository.split("/");
      router.push(`/chat/${repo}?owner=${owner}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg mb-2">
            <Github className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Chat with GitHub Repositories
          </h1>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-md">
            Enter any public GitHub repository to start an intelligent conversation about its codebase.
          </p>
        </div>

        {/* Search Section */}
        <Card className="w-full bg-white/10 backdrop-blur border-none shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleRepositorySubmit} className="flex flex-col md:flex-row gap-3 items-center w-full">
              <Input
                id="repository"
                type="text"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
                placeholder="owner/repository (e.g., facebook/react)"
                className={clsx(
                  "h-12 text-base pl-5 pr-12 border-2 rounded-xl transition-all duration-200 w-full md:w-auto flex-1 bg-white/30 backdrop-blur border-transparent focus:border-primary",
                  error && "border-destructive focus:border-destructive",
                  repoInfo && "border-green-500 focus:border-green-500"
                )}
                required
                autoComplete="off"
              />
              <Button
                type="submit"
                size="lg"
                disabled={!repoInfo || isValidating}
                className="h-12 px-6 text-base font-semibold rounded-xl shadow-md transition-all duration-150"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    Start Chatting
                    <Github className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
            <div className="h-5 mt-2 w-full text-center">
              {error && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-destructive flex items-center gap-2 justify-center">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                  {!session && error.includes("Private repository") && (
                    <Button size="sm" onClick={() => signIn("github")}>Sign in</Button>
                  )}
                </div>
              )}
              {!error && !repoInfo && repository && (
                <p className="text-xs text-muted-foreground">Format: owner/repository-name</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Repository Preview - reserved area, smooth transition */}
        <div className="w-full transition-all duration-300">
          <Card className="w-full bg-white/10 backdrop-blur border-none shadow-xl rounded-2xl min-h-[220px] flex flex-col justify-center">
            <CardHeader className="pb-2">
              <h3 className="text-base font-semibold">Repository Preview</h3>
            </CardHeader>
            <CardContent>
              {isValidating && (
                <div className="space-y-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              )}
              {repoInfo && !isValidating && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <Image
                      src={repoInfo.avatar_url}
                      alt={`${repoInfo.owner}'s avatar`}
                      className="w-12 h-12 rounded-full border border-border shadow"
                      width={48}
                      height={48}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg font-semibold text-foreground">
                          {repoInfo.name}
                        </h4>
                        <Badge variant="secondary" className="capitalize">
                          {repoInfo.visibility}
                        </Badge>
                        {repoInfo.language && (
                          <Badge variant="outline" className="gap-1">
                            <Code2 className="h-3 w-3" />
                            {repoInfo.language}
                          </Badge>
                        )}
                      </div>
                      {repoInfo.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {repoInfo.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/40">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-medium">
                        {repoInfo.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/40">
                      <GitFork className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium">
                        {repoInfo.forks.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/40">
                      <Bug className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-medium">
                        {repoInfo.open_issues}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/40">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium">
                        {new Date(repoInfo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {repoInfo.topics && repoInfo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {repoInfo.topics.slice(0, 6).map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {repoInfo.topics.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{repoInfo.topics.length - 6} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/30">
                    <span>Branch: {repoInfo.default_branch}</span>
                    <span>•</span>
                    <span>Size: {Math.round(repoInfo.size / 1024)} KB</span>
                    {repoInfo.homepage && (
                      <>
                        <span>•</span>
                        <a
                          href={repoInfo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          Website
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
              {!isValidating && !repoInfo && (
                <div className="flex flex-col items-center justify-center h-24 text-muted-foreground opacity-60">
                  <Github className="h-7 w-7 mb-1" />
                  <span className="text-xs">Repository details will appear here</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

          {/* Recent Chats */}
          {recentChats.length > 0 && (
            <Card className="w-full bg-white/10 backdrop-blur border-none shadow-xl rounded-2xl mb-4">
              <CardHeader className="pb-2">
                <h3 className="text-base font-semibold">Recent Chats</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentChats.map((chat, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-muted/40 rounded-xl"
                      onClick={() => {
                        const path = chat.repository.replace("https://github.com/", "");
                        const [owner, name] = path.split("/");
                        router.push(`/chat/${name}?owner=${owner}`);
                      }}
                    >
                      {chat.repository}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Popular Repositories */}
        <Card className="w-full bg-white/10 backdrop-blur border-none shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <h3 className="text-base font-semibold">Try Popular Repositories</h3>
            <p className="text-xs text-muted-foreground">
              Click on any repository below to get started quickly
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  repo: "facebook/react",
                  desc: "JavaScript library for building UIs",
                },
                {
                  repo: "vercel/next.js",
                  desc: "React framework for production",
                },
                { repo: "microsoft/vscode", desc: "Visual Studio Code editor" },
                {
                  repo: "tailwindlabs/tailwindcss",
                  desc: "Utility-first CSS framework",
                },
                { repo: "nodejs/node", desc: "JavaScript runtime built on V8" },
                { repo: "vuejs/vue", desc: "Progressive JavaScript framework" },
              ].map(({ repo, desc }) => (
                <Button
                  key={repo}
                  variant="ghost"
                  className="h-auto p-3 justify-start text-left hover:bg-muted/40 transition-colors rounded-xl shadow-sm"
                  onClick={() => setRepository(repo)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Github className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{repo}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
