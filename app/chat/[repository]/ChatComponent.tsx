"use client";

import { useChat } from "@ai-sdk/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Send, Github, Bot, User, ArrowLeft, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { toast } from "sonner";
import { AssistantMessageRenderer } from "./AssistantMessageRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

const SUGGESTED_QUESTIONS = [
  "Explain the main architecture of this repository",
  "What are the key dependencies used?",
  "Show me the entry point of the application",
  "How does error handling work?",
  "What testing framework is used?",
  "Explain the build process",
  "What's the deployment strategy?",
  "Show me examples of API usage",
];

const handleError = (error: string) => {
  switch (error) {
    case "Repository not found":
      toast.error("Repository not found");
      break;
    default:
      toast.error("An error occurred");
  }
};

export default function ChatComponent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = useParams();
  const owner = searchParams.get("owner");
  const repo = params.repository;
  const [repository, setRepository] = useState("");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  useEffect(() => {
    if (owner && repo) {
      setRepository(`${owner}/${repo}`);
    }
  }, [owner, repo]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    error,
    isLoading,
    setInput,
  } = useChat({
    api: "/api/chat",
    body: {
      repository,
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.error) {
          setRateLimitError(errorData.error);
          if (!errorData.isAuthenticated) {
            toast.error("Please sign in to continue chatting");
          }
        } else {
          handleError(error.message);
        }
      } catch {
        handleError(error.message);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRateLimitError(null);
    await originalHandleSubmit(e);
  };

  if (error) {
    console.error(error);
    handleError(error.message);
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="font-medium text-foreground">
                    {repository || "Loading..."}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Chat with repository
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {rateLimitError && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {rateLimitError}
                {!session && (
                  <Button
                    variant="link"
                    className="ml-2 p-0 h-auto text-destructive hover:text-destructive/80"
                    onClick={() => signIn("github")}
                  >
                    Sign in with GitHub
                  </Button>
                )}
              </div>
            )}

            {messages.length === 0 && (
              <>
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Ready to explore {repository}
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Ask me anything about this repository's code, architecture,
                    or implementation details.
                  </p>
                </div>

                {/* Suggested Questions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    <span>Try asking about:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-sm font-normal"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx(
                  "flex gap-4",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="flex-shrink-0">
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div
                  className={clsx(
                    "flex-1 max-w-[85%] rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-foreground"
                  )}
                >
                  {message.role === "assistant" ? (
                    <AssistantMessageRenderer message={message} />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm text-left">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 max-w-[85%] rounded-lg px-4 py-3 bg-muted/50">
                  <div className="flex gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={
                !session
                  ? "Sign in to chat more..."
                  : "Ask about the repository..."
              }
              className="flex-1"
              disabled={isLoading || !!rateLimitError}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || !!rateLimitError}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
