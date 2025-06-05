import React from "react";
import { Sparkles, MessageSquareText, Zap, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const IntroSection: React.FC = () => {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <Card className="relative bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Badge variant="secondary" className="mr-4">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                    AI Code Companion
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Your AI Code Companion
                </h2>
                <p className="text-lg mb-8 text-muted-foreground">
                  Chat with Repo transforms how you understand code by giving
                  you an AI assistant that can answer any question about any
                  public GitHub repository.
                </p>
                <div className="space-y-6">
                  <Feature
                    icon={
                      <MessageSquareText className="h-6 w-6 text-primary" />
                    }
                    title="Natural Conversations"
                    description="Ask questions in plain English and get clear, contextual explanations."
                  />
                  <Feature
                    icon={<Zap className="h-6 w-6 text-yellow-400" />}
                    title="Instant Answers"
                    description="No more digging through files - get answers in seconds, not hours."
                  />
                  <Feature
                    icon={<Bot className="h-6 w-6 text-green-400" />}
                    title="Powered by latest AI models"
                    description="Leveraging Google's advanced AI to understand code context and nuances."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Decorative code snippets floating in background */}
            <div className="absolute z-10 -top-8 -left-8 bg-primary/20 p-4 rounded-lg shadow-lg transform rotate-3 text-xs font-mono text-primary hidden md:block">
              <pre>{`useEffect(() => {
  }, []);`}</pre>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="pl-0 md:pl-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="inline-block w-12 h-1 bg-primary mr-4"></span>
                Understand Any Codebase Instantly
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Ask About Architecture",
                    description:
                      "Explain the overall architecture of this React application and how data flows between components.",
                    gradient: "from-blue-400 to-indigo-500",
                  },
                  {
                    title: "Debug Issues",
                    description:
                      "Why might this API call be failing? Can you show me where the error handling is implemented?",
                    gradient: "from-indigo-500 to-purple-500",
                  },
                  {
                    title: "Learn Implementation Details",
                    description:
                      "How is authentication implemented in this application? Show me the relevant code.",
                    gradient: "from-purple-500 to-pink-500",
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2 text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <div
                        className={`h-1 w-full bg-gradient-to-r ${item.gradient} rounded-full`}
                      ></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default IntroSection;
