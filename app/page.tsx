import React from "react";
import HeroSection from "@/components/lander/Hero";
import IntroSection from "@/components/lander/IntroSection";
import HowItWorksSection from "@/components/lander/HowItWorks";
import Footer from "@/components/lander/Footer";

function App() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />
      <div className="relative">
        <main className="flex flex-col gap-24">
          <HeroSection />
          <HowItWorksSection />
          <IntroSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
