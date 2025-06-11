"use client";

import { useChat } from "@ai-sdk/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Send,
  Github,
  Bot,
  User,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Star,
  GitFork,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { AssistantMessageRenderer } from "./AssistantMessageRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Octokit } from "@octokit/rest";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  initializeAnalytics,
  trackEvent,
} from "@/instrumentation-client";



const SUGGESTED_QUESTIONS = [
  {
    icon: "🏗️",
    text: "Explain the main architecture of this repository",
    category: "Architecture",
  },
  {
    icon: "📦",
    text: "What are the key dependencies used?",
    category: "Dependencies",
  },
  {
    icon: "🚀",
    text: "Show me the entry point of the application",
    category: "Structure",
  },
  {
    icon: "⚠️",
    text: "How does error handling work?",
    category: "Error Handling",
  },
  {
    icon: "🧪",
    text: "What testing framework is used?",
    category: "Testing",
  },
  {
    icon: "🔨",
    text: "Explain the build process",
    category: "Build",
  },
  {
    icon: "🚢",
    text: "What's the deployment strategy?",
    category: "Deployment",
  },
  {
    icon: "🔌",
    text: "Show me examples of API usage",
    category: "API",
  },
];

interface RepoInfo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

export default function ChatComponent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
// @ts-expect-error - accessToken is not typed in the session object
const octokit = new Octokit({ auth: session?.accessToken as string });
  const owner = searchParams.get("owner");
  const repo =
    typeof params.repository === "string"
      ? params.repository
      : Array.isArray(params.repository)
      ? params.repository[0]
      : "";

  const [repository, setRepository] = useState("");

  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [model, setModel] = useState<"gemini" | "gpt-4o">("gemini");
  const [harshness, setHarshness] = useState(5);
  const router = useRouter();

  

  useEffect(() => {
    initializeAnalytics();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const validateRepo = async () => {
      if (!owner || !repo) {
        setRepoError("Invalid repository URL");
        setIsValidating(false);
        return;
      }

      try {
        const response = await octokit.rest.repos.get({ owner, repo });
        const repoData = response.data;

        setRepository(`${owner}/${repo}`);
        setRepoInfo({
          name: repoData.name,
          description: repoData.description || "No description available",
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          language: repoData.language || "Unknown",
          url: repoData.html_url,
        });
        setRepoError(null);
      } catch (error) {
        console.error(error);
        const err = error as { status?: number };
        if (!session && err.status === 404) {
          setRepoError("Private repository. Please sign in to access.");
        } else {
          setRepoError(
            "Repository not found. Please check the URL and try again."
          );
        }
        toast.error("Repository not found");
      } finally {
        setIsValidating(false);
      }
    };

    validateRepo();
  }, [owner, repo, session, octokit.rest.repos]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: "/api/chat",

    body: { repository, model, harshness },

    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.error) {
          setRateLimitError(errorData.error);
          if (!errorData.isAuthenticated) {
            toast.error("Please sign in to continue chatting");
          }
        }
      } catch {
        toast.error("An error occurred while processing your request");
      }
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Save chat history when messages update
  useEffect(() => {
    if (isLoading || messages.length === 0 || !repository) return;

    const saveHistory = async () => {
      try {
        const local = JSON.parse(
          localStorage.getItem("chat-history") || "[]"
        );
        local.unshift({ repository, messages });
        localStorage.setItem("chat-history", JSON.stringify(local.slice(0, 5)));

        if (session?.user) {
          await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repository, messages }),
          });
        }
      } catch (err) {
        console.error("Failed to save chat", err);
      }
    };

    saveHistory();
  }, [messages, isLoading, repository, session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || rateLimitError) return;

    setRateLimitError(null);
    trackEvent("message_sent", { model, harshness });
    await originalHandleSubmit(e);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleModelChange = (value: "gemini" | "gpt-4o") => {
    setModel(value);
    trackEvent("model_selected", { model: value });
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Validating Repository
            </h3>
            <p className="text-muted-foreground">
              Checking repository access and gathering information...
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (repoError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-md w-full mx-auto p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {repoError.includes("Private repository")
                ? "Private Repository"
                : "Repository Not Found"}
            </h3>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{repoError}</AlertDescription>
          </Alert>

          {!session && repoError.includes("Private repository") && (
            <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Choose Another Repository
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Enhanced Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/chat")}
                className="shrink-0 hover:bg-muted/80"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Github className="h-5 w-5 text-primary" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-foreground text-lg">
                      {repository}
                    </h1>
                    {repoInfo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => window.open(repoInfo.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {repoInfo && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{repoInfo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        <span>{repoInfo.forks.toLocaleString()}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {repoInfo.language}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {model === "gemini" ? "Gemini" : "GPT-4o"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleModelChange("gemini")}>Gemini</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModelChange("gpt-4o")}>GPT-4o</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.length === 0 && (
              <>
                {/* Welcome Section */}
                <div className="text-center py-12 space-y-6">
                  <div className="relative inline-block">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      Ready to explore {repository}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {repoInfo?.description ||
                        "Ask me anything about this repository's code, architecture, or implementation details."}
                    </p>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Enhanced Suggested Questions */}
                <div className="space-y-6  hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">
                      Suggested Questions
                    </h4>
                  </div>

                  <div className="gap-3">
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto m-1 p-4 text-left justify-start hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
                        onClick={() => handleSuggestedQuestion(question.text)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <span className="text-lg flex-shrink-0 mt-0.5">
                            {question.icon}
                          </span>
                          <div className="space-y-1 text-left">
                            <div className="font-medium text-sm">
                              {question.text}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {question.category}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx(
                  "flex gap-4 group",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="flex-shrink-0">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground border-primary/20 shadow-lg shadow-primary/20"
                        : "bg-muted text-muted-foreground border-border group-hover:border-primary/30"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <div
                  className={clsx(
                    "flex-1 max-w-[85%] rounded-xl px-5 py-4 shadow-sm transition-all duration-200",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-primary/10"
                      : "bg-card border border-border/50 hover:border-border group-hover:shadow-md"
                  )}
                >
                  {message.role === "assistant" ? (
                    <AssistantMessageRenderer message={message} />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                    <Bot className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 max-w-[85%] rounded-xl px-5 py-4 bg-card border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Analyzing repository...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          {rateLimitError && (
            <div className="max-w-4xl mx-auto mb-4">
              <Alert
                variant="destructive"
                className="border-destructive/50 bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{rateLimitError}</span>
                  <div className="flex gap-2">
                    {!session && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => signIn("github")}
                        className="border-destructive/30 hover:bg-destructive/10"
                      >
                        Sign in with GitHub
                      </Button>
                    )}
                    {rateLimitError.includes("subscribe") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/pricing")}
                        className="border-blue-500/30 hover:bg-blue-500/10 text-blue-600"
                      >
                        Subscribe
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

            </div>
          )}
          
          <div className="max-w-4xl mx-auto mb-4 flex items-center gap-3">
            <span className="text-xs">Mom</span>
            <input
              type="range"
              min={0}
              max={10}
              value={harshness}
              onChange={(e) => setHarshness(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs">Linus Torvalds</span>
          </div>


          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">

            <div className="flex gap-3 p-2 bg-background rounded-xl border border-border/50 shadow-sm focus-within:border-primary/50 focus-within:shadow-md transition-all duration-200">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={
                  !session
                    ? "Sign in to start chatting..."
                    : "Ask about the repository..."
                }
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                disabled={isLoading || !!rateLimitError}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading || !!rateLimitError}
                className="px-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
