"use client";
import {
  Github,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Star,
  GitFork,
  Bug,
  Calendar,
  Globe,
  Code2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-group";
import { Octokit } from "@octokit/rest";
import { Skeleton } from "@/components/ui/skeleton";
import { clsx } from "clsx";
import Image from "next/image";

const octokit = new Octokit();

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

export default function ChooseRepoPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
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
  const [isValidating, setIsValidating] = useState(false);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        setError("Repository not found. Please check the name and try again.");
        setRepoInfo(null);
      } finally {
        setIsValidating(false);
      }
    };

    const debounceTimer = setTimeout(validateRepo, 500);
    return () => clearTimeout(debounceTimer);
  }, [repository]);

  const handleRepositorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repository.trim() && repoInfo) {
      const [owner, repo] = repository.split("/");
      router.push(`/chat/${repo}?owner=${owner}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 mb-6">
            <Github className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Chat with GitHub Repositories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter any public GitHub repository to start an intelligent
              conversation about its codebase
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="border-2 border-dashed border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleRepositorySubmit} className="space-y-6">
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    id="repository"
                    type="text"
                    value={repository}
                    onChange={(e) => setRepository(e.target.value)}
                    placeholder="Enter repository (e.g., facebook/react)"
                    className={clsx(
                      "h-14 text-lg pl-6 pr-14 border-2 transition-all duration-200",
                      error && "border-destructive focus:border-destructive",
                      repoInfo && "border-green-500 focus:border-green-500",
                      !error && !repoInfo && "focus:border-primary"
                    )}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isValidating && (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                    {error && !isValidating && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    {repoInfo && !isValidating && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="h-5">
                    {error && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </p>
                    )}
                    {!error && !repoInfo && repository && (
                      <p className="text-sm text-muted-foreground">
                        Format: owner/repository-name
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!repoInfo || isValidating}
                    className="px-8 h-12 text-base font-medium"
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
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Repository Preview */}
        {(isValidating || repoInfo) && (
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold">Repository Preview</h3>
            </CardHeader>
            <CardContent>
              {isValidating && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              )}

              {repoInfo && !isValidating && (
                <div className="space-y-6">
                  {/* Repository Header */}
                  <div className="flex items-start gap-4">
                    <Image
                      src={repoInfo.avatar_url}
                      alt={`${repoInfo.owner}'s avatar`}
                      className="w-16 h-16 rounded-full border-2 border-border"
                      width={64}
                      height={64}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-xl font-semibold text-foreground">
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
                        <p className="text-muted-foreground text-base leading-relaxed">
                          {repoInfo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Repository Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {repoInfo.stars.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Stars</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <GitFork className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {repoInfo.forks.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Forks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Bug className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {repoInfo.open_issues}
                        </p>
                        <p className="text-xs text-muted-foreground">Issues</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(repoInfo.updated_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Updated</p>
                      </div>
                    </div>
                  </div>

                  {/* Topics */}
                  {repoInfo.topics && repoInfo.topics.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Topics
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {repoInfo.topics.slice(0, 8).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                        {repoInfo.topics.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{repoInfo.topics.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
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
            </CardContent>
          </Card>
        )}

        {/* Popular Repositories */}
        <Card className="border border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Try Popular Repositories</h3>
            <p className="text-sm text-muted-foreground">
              Click on any repository below to get started quickly
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="h-auto p-4 justify-start text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setRepository(repo)}
                >
                  <div className="flex items-center gap-3 w-full">
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
