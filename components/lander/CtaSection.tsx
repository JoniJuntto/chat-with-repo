import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}

      <div className="container mx-auto px-4 relative">
        <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-medium">Ready to get started?</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start chatting with{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                any public repository
              </span>{" "}
              today
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join developers who are already using our platform to understand
              code faster. No setup required, just give a GitHub repository and
              start chatting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Try It Free Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              No credit card required for trial • Free daily messages
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
