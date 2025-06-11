import React from "react";
import { ArrowRight, Star, Bot, User, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            New: Enhanced AI-powered code understanding
          </Badge>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chat With Any
              </span>
              <br />
              <span className="text-foreground">GitHub Repo</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
              Transform code exploration with AI. Ask questions, understand
              architecture, and debug faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Start Chatting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-background"
                    />
                  ))}
                </div>
                <span>1000+ developers</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-1">5.0 rating</span>
              </div>
            </div>
          </div>

          {/* hide on mobile */}
          <div className="lg:w-1/2 hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl" />
              <Card className="relative bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Github className="h-4 w-4" />
                      facebook/react
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
                    <ChatMessage
                      type="user"
                      message="How does React's reconciliation work?"
                      time="2:45 PM"
                    />
                    <ChatMessage
                      type="ai"
                      message="React's reconciliation is the process of comparing the new virtual DOM tree with the previous one. It uses a diffing algorithm to identify changes and updates only the necessary DOM elements, making it highly efficient."
                      time="2:45 PM"
                      showCode={true}
                    />
                    <ChatMessage
                      type="user"
                      message="Show me an example of useEffect"
                      time="2:46 PM"
                    />
                  </div>

                  {/* Input */}
                  <div className="p-6 border-t border-border/50">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Ask about this repository..."
                        className="flex-1 bg-muted/50"
                      />
                      <Button size="icon" className="shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ChatMessageProps {
  type: "user" | "ai";
  message: string;
  time: string;
  showCode?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  message,
  time,
  showCode,
}) => {
  return (
    <div className={`flex gap-3 ${type === "user" ? "justify-end" : ""}`}>
      {type === "ai" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${type === "user" ? "order-first" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">
            {type === "user" ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 ${
            type === "user"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white ml-auto"
              : "bg-muted/50"
          }`}
        >
          <p className="text-sm">{message}</p>
          {showCode && (
            <pre className="mt-3 text-xs bg-background/50 p-3 rounded-lg overflow-x-auto">
              <code>{`function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(/* ... */);
  } else {
    workInProgress.child = reconcileChildFibers(/* ... */);
  }
}`}</code>
            </pre>
          )}
        </div>
      </div>

      {type === "user" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
