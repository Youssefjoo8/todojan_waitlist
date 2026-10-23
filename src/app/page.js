import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import WaitlistPopup from "@/components/WaitlistPopup";
import BottomWaitlistForm from "@/components/BottomWaitlistForm";
import IdeaMarquee from "@/components/IdeaMarquee";
import IdeaPopup from "@/components/IdeaPopup";

export const metadata = {
  title: "Todojan — Master Your Day, One Task at a Time",
  description: "The all-in-one productivity workspace with smart scheduling, gamified progress, and focus tools. Join the waitlist for early access.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-light text-charcoal select-none">
      {/* Background Mesh Gradient Orbs */}
      <div className="mesh-bg">
        <div className="mesh-orb orb-purple" />
        <div className="mesh-orb orb-teal" />
        <div className="mesh-orb orb-lime" />
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Bento Features Grid */}
        <BentoGrid />

        {/* Dedicated Bottom Waitlist Section */}
        <section id="waitlist-section" className="py-24 max-w-4xl mx-auto px-6 relative z-10">
          <div className="p-8 md:p-12 rounded-3xl border border-black/5 bg-white/70 backdrop-blur-xl shadow-xl text-center flex flex-col items-center gap-6">
            <BottomWaitlistForm />
          </div>
        </section>

        {/* Infinite Idea Board Marquee */}
        <section id="ideas-section">
          <IdeaMarquee />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/5 bg-white/40 py-14 text-sm text-charcoal/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-charcoal font-bold text-lg">Todo<span className="text-accent-purple">jan</span></span>
            </div>
            <span className="text-charcoal/35 text-xs">Master Your Day, One Task at a Time</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <a href="#features-section" className="hover:text-charcoal transition-colors">Features</a>
            <a href="#waitlist-section" className="hover:text-charcoal transition-colors">Waitlist</a>
            <a href="#ideas-section" className="hover:text-charcoal transition-colors">Feature Board</a>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Open-source demo • Runs 100% locally</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll-Triggered waitlist popup */}
      <WaitlistPopup />

      {/* Floating Suggest Feature popup */}
      <IdeaPopup />
    </div>
  );
}
