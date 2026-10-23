"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-black/5 shadow-[0_2px_15px_rgba(0,0,0,0.05)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo & Social */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-charcoal">
              Todo<span className="text-accent-purple">jan</span>
            </span>
          </a>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features-section"
            className="text-sm font-medium text-charcoal/50 hover:text-charcoal transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#waitlist-section"
            className="text-sm font-medium text-charcoal/50 hover:text-charcoal transition-colors duration-200"
          >
            Waitlist
          </a>
          <a
            href="#ideas-section"
            className="text-sm font-medium text-charcoal/50 hover:text-charcoal transition-colors duration-200"
          >
            Feature Board
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#waitlist-section"
            className="text-xs sm:text-sm font-semibold bg-charcoal hover:bg-charcoal/90 text-[#FAFAF9] py-2.5 px-6 rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          >
            Get Early Access
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
