import React from "react";
import { GitBranch, Search, MessageSquare, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            How Chat with Repo Works
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Get started in seconds with just a GitHub repository. No complex
            setup or configuration required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            {
              number: 1,
              icon: <GitBranch className="h-6 w-6" />,
              title: "Enter a GitHub Repository",
              description:
                "Paste the name of any public GitHub repository you want to explore or understand. (e.g. facebook/react)",
            },
            {
              number: 2,
              icon: <Search className="h-6 w-6" />,
              title: "AI Analyzes the Repository",
              description:
                "Our AI quickly scans the repository structure, code, and documentation to build a comprehensive understanding.",
            },
            {
              number: 3,
              icon: <MessageSquare className="h-6 w-6" />,
              title: "Ask Questions Naturally",
              description:
                "Chat with the AI using natural language. Ask about architecture, implementation details, or specific functionality.",
            },
            {
              number: 4,
              icon: <Code className="h-6 w-6" />,
              title: "Receive Contextual Answers",
              description:
                "Get clear explanations with relevant code snippets, documentation references, and helpful insights.",
            },
          ].map((step) => (
            <Card
              key={step.number}
              className="group relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-8">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {step.icon}
                </div>
                <div className="mt-4">
                  <span className="inline-block text-sm font-medium text-primary mb-3">
                    Step {step.number}
                  </span>
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
