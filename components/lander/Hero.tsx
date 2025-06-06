import React from "react";
import {
  ArrowRight,
  MessageSquare,
  Github,
  Star,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <section className="relative pb-16 pt-12 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-red-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                Makkara
              </h1>
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-muted/50">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                <span className="text-muted-foreground">
                  New: AI-powered code understanding
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-red-400 bg-clip-text text-transparent">
                Chat With Any GitHub Repo Using AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Instantly understand any codebase through natural conversation.
                No more endless file browsing or confusing documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/chat">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Try It Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center border-b border-border pb-3 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary mr-2" />
                  <div className="text-sm font-medium">react/react</div>
                </div>
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">You</span>
                        <span className="text-xs text-muted-foreground">
                          2:45 PM
                        </span>
                      </div>
                      <div className="bg-muted rounded-lg py-2 px-3 break-words">
                        <p className="text-sm">
                          How does React's fiber reconciliation algorithm work?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          AI Assistant
                        </span>
                        <span className="text-xs text-muted-foreground">
                          2:45 PM
                        </span>
                      </div>
                      <div className="bg-primary rounded-lg py-2 px-3 break-words">
                        <p className="text-sm text-primary-foreground">
                          React Fiber is a complete rewrite of React's
                          reconciliation algorithm. It breaks the rendering work
                          into chunks and can pause and resume work to avoid
                          blocking the main thread.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">You</span>
                        <span className="text-xs text-muted-foreground">
                          2:46 PM
                        </span>
                      </div>
                      <div className="bg-muted rounded-lg py-2 px-3 break-words">
                        <p className="text-sm">
                          Show me an example of how to use useEffect.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          AI Assistant
                        </span>
                        <span className="text-xs text-muted-foreground">
                          2:46 PM
                        </span>
                      </div>
                      <div className="bg-primary rounded-lg py-2 px-3 break-words">
                        <p className="text-sm text-primary-foreground">
                          Here's an example from the repo:
                        </p>
                        <pre className="mt-2 text-xs bg-muted text-accent-foreground p-2 rounded overflow-x-auto whitespace-pre-wrap">
                          <code>{`useEffect(() => {
                            document.title = \`You clicked \${count} times\`;
                          }, [count]);`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask about this repository..."
                    className="flex-1"
                  />
                  <Link href="/chat">
                    <Button size="icon" className="shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats/Social Proof */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "100+", label: "Repositories Analyzed" },
            { value: "24/7", label: "AI Availability" },
            { value: "1000+", label: "Developer Hours Saved" },
            { value: "5⭐", label: "Average Rating" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border-border/50"
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
