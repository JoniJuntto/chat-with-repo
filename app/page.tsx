import React from "react";
import HeroSection from "@/components/lander/Hero";
import HowItWorksSection from "@/components/lander/HowItWorks";
import Footer from "@/components/lander/Footer";
import CTASection from "@/components/lander/CtaSection";

function App() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/10 to-background" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_60deg,transparent_120deg)] opacity-50" />

      <div className="relative">
        <main className="flex flex-col">
          <HeroSection />
          <HowItWorksSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
