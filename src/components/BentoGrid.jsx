"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Smartphone, BrainCircuit, Trophy } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQueryHook";

// Typewriter command pool with contextual parsed tags
const TYPEWRITER_COMMANDS = [
  {
    text: "Block 90 minutes tomorrow for deep work on the pitch deck",
    tags: [
      { label: "Task: pitch deck deep work", color: "accent-purple" },
      { label: "Duration: 90 min tomorrow", color: "accent-cyan" },
    ],
  },
  {
    text: "Schedule a 1-on-1 with Sarah every Friday at 2 PM",
    tags: [
      { label: "Event: 1-on-1 with Sarah", color: "accent-purple" },
      { label: "Recurrence: Fridays 2 PM", color: "accent-cyan" },
    ],
  },
  {
    text: "Remind me to review PRs and merge the feature branch by 5 PM",
    tags: [
      { label: "Task: review PRs & merge", color: "accent-purple" },
      { label: "Deadline: today 5 PM", color: "accent-cyan" },
    ],
  },
  {
    text: "Track my water intake as a daily habit starting Monday",
    tags: [
      { label: "Habit: water intake", color: "accent-purple" },
      { label: "Start: Monday, daily", color: "accent-cyan" },
    ],
  },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function useInfiniteTypewriter(disabled = false) {
  const [displayText, setDisplayText] = useState("");
  const [currentCommand, setCurrentCommand] = useState(TYPEWRITER_COMMANDS[0]);
  const [showTags, setShowTags] = useState(false);
  const queueRef = useRef(shuffleArray(TYPEWRITER_COMMANDS));
  const indexRef = useRef(0);
  const phaseRef = useRef("typing"); // typing | holding | deleting | pausing
  const charRef = useRef(0);
  const timerRef = useRef(null);

  const getNextCommand = useCallback(() => {
    indexRef.current++;
    if (indexRef.current >= queueRef.current.length) {
      queueRef.current = shuffleArray(TYPEWRITER_COMMANDS);
      indexRef.current = 0;
    }
    return queueRef.current[indexRef.current];
  }, []);

  useEffect(() => {
    if (disabled) {
      setDisplayText(TYPEWRITER_COMMANDS[0].text);
      setCurrentCommand(TYPEWRITER_COMMANDS[0]);
      setShowTags(true);
      return;
    }

    const tick = () => {
      const cmd = queueRef.current[indexRef.current];

      switch (phaseRef.current) {
        case "typing": {
          if (charRef.current <= cmd.text.length) {
            setDisplayText(cmd.text.substring(0, charRef.current));
            charRef.current++;
            timerRef.current = setTimeout(tick, 55);
          } else {
            setShowTags(true);
            phaseRef.current = "holding";
            timerRef.current = setTimeout(tick, 2000);
          }
          break;
        }
        case "holding": {
          setShowTags(false);
          phaseRef.current = "deleting";
          timerRef.current = setTimeout(tick, 200);
          break;
        }
        case "deleting": {
          if (charRef.current > 0) {
            charRef.current--;
            setDisplayText(cmd.text.substring(0, charRef.current));
            timerRef.current = setTimeout(tick, 25);
          } else {
            phaseRef.current = "pausing";
            timerRef.current = setTimeout(tick, 400);
          }
          break;
        }
        case "pausing": {
          const next = getNextCommand();
          setCurrentCommand(next);
          charRef.current = 0;
          phaseRef.current = "typing";
          timerRef.current = setTimeout(tick, 300);
          break;
        }
      }
    };

    setCurrentCommand(queueRef.current[0]);
    phaseRef.current = "typing";
    charRef.current = 0;
    timerRef.current = setTimeout(tick, 600);

    return () => clearTimeout(timerRef.current);
  }, [getNextCommand, disabled]);

  return { displayText, currentCommand, showTags };
}

// Official Apple Logo SVG
function AppleLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 384 512" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
  );
}

// Official Google Play Triangle SVG
function GooglePlayLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor">
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
    </svg>
  );
}

export default function BentoGrid() {
  const isMobileOrTablet = useMediaQuery("(max-width: 1023px)");
  const { displayText, currentCommand, showTags } = useInfiniteTypewriter(isMobileOrTablet);

  return (
    <section id="features-section" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-xs font-bold text-accent-purple tracking-wider uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Core Features
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-charcoal">
          Everything You Need to Stay Sharp
        </h2>
        <p className="text-charcoal/55 text-lg max-w-xl mx-auto">
          A modular toolkit that adapts to how you work — not the other way around.
        </p>
      </motion.div>

      {/* Irregular Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Magic Input (Col Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5 }}
          className="md:col-span-2 rounded-2xl border border-black/5 bg-white/50 backdrop-blur-sm p-8 flex flex-col justify-between min-h-[300px] overflow-hidden group relative transform-gpu gpu-force"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 text-accent-purple mb-4">
              <BrainCircuit className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Natural Parsing</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Smart NLP Input</h3>
            <p className="text-charcoal/50 text-sm max-w-md">
              {"Type naturally. Todojan's smart parser understands context, extracts deadlines, and creates structured tasks instantly."}
            </p>
          </div>

          <div className="mt-8 bg-slate-50 border border-black/5 rounded-xl p-5 shadow-sm relative">
            <div className="absolute top-3 left-4 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-charcoal/10" />
              <span className="w-2 h-2 rounded-full bg-charcoal/10" />
            </div>
            
            <div className="mt-3 font-mono text-sm min-h-[44px] flex items-center text-charcoal/90">
              {displayText}
              <span className="w-1.5 h-4 bg-accent-purple animate-pulse ml-0.5 inline-block flex-shrink-0" />
            </div>

            {/* Dynamic auto-highlight parser animation */}
            <div className="h-6 mt-4 flex items-center gap-2 overflow-hidden text-xs">
              <AnimatePresence>
                {showTags && currentCommand.tags.map((tag, i) => (
                  <motion.span
                    key={`${currentCommand.text}-${i}`}
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.1 }}
                    className={`px-2.5 py-0.5 rounded border ${
                      tag.color === "accent-purple"
                        ? "border-accent-purple/30 bg-accent-purple/5 text-accent-purple"
                        : "border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan"
                    } font-medium transform-gpu`}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Gamification / Level Curve (Col Span 1, Tall) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -5 }}
          className="md:col-span-1 rounded-2xl border border-black/5 bg-white/50 backdrop-blur-sm p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group transform-gpu gpu-force"
        >
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent-cyan/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 text-accent-cyan mb-4">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Gamification</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">XP & Levels</h3>
            <p className="text-charcoal/50 text-sm">
              Turn your habits into a game. Earn XP for every completed task and level up your productivity rank.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {/* Level stats */}
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs text-charcoal/40 block">Current Rank</span>
                <span className="text-2xl font-bold text-charcoal">Level 14</span>
              </div>
              <span className="text-xs text-accent-cyan font-mono">940 / 1200 XP</span>
            </div>
            
            {/* XP progress bar */}
            <div className="w-full bg-black/5 border border-black/5 h-3 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "78%" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="bg-gradient-to-r from-accent-purple to-accent-cyan h-full rounded-full transform-gpu gpu-force"
              />
            </div>

            {/* XP Curve Vector Chart */}
            <div className="h-20 w-full mt-2 relative">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,25 C15,24 30,12 45,15 C60,18 75,5 100,2"
                  fill="none"
                  stroke="url(#xpGradient)"
                  strokeWidth="2"
                  className="stroke-accent-cyan"
                />
                <path
                  d="M0,25 C15,24 30,12 45,15 C60,18 75,5 100,2 L100,30 L0,30 Z"
                  fill="url(#xpGradient)"
                />
                {/* Dots on peak */}
                <circle cx="45" cy="15" r="2.5" fill="#8B5CF6" />
                <circle cx="100" cy="2" r="2.5" fill="#06B6D4" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Proactive Assistant (Col Span 1, Standard) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -5 }}
          className="md:col-span-1 rounded-2xl border border-black/5 bg-white/50 backdrop-blur-sm p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group transform-gpu gpu-force"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent-mint/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 text-accent-purple mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Proactive Assistant</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Focus Guard</h3>
            <p className="text-charcoal/50 text-sm">
              Your proactive assistant detects overloaded schedules and suggests breaks before burnout hits.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white border border-black/5 shadow-sm flex flex-col gap-3 relative">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent-purple/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
              </div>
              <span className="text-xs font-semibold text-accent-purple font-mono">Jan Suggestion</span>
            </div>
            
            <p className="text-xs text-charcoal/80 leading-relaxed">
              {"\"You have 3 meetings back-to-back this afternoon. Want me to add a 15-min buffer before your design review?\""}
            </p>
            
            <div className="flex gap-2 mt-1">
              <button className="text-[10px] font-bold text-light bg-charcoal px-2.5 py-1 rounded transition-transform active:scale-95">
                Insert Break
              </button>
              <button className="text-[10px] font-bold text-charcoal/50 hover:text-charcoal px-2 py-1">
                Keep Schedule
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Mobile App Badges (Col Span 2, Wide) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="md:col-span-2 rounded-2xl border border-black/5 bg-white/50 backdrop-blur-sm p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group transform-gpu gpu-force"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 text-accent-purple mb-4">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Multi-Platform</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">Go Anywhere</h3>
            <p className="text-charcoal/50 text-sm max-w-md">
              Your tasks follow you everywhere. Native iOS and Android apps with beautiful widgets, offline sync, and smart notifications.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            {/* Apple App Store Badge */}
            <div className="relative group/badge">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-black/5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none">
                <AppleLogo className="w-7 h-7 text-charcoal" />
                <div className="text-left">
                  <div className="text-[9px] text-charcoal/40 uppercase tracking-widest leading-none">Download on the</div>
                  <div className="text-sm font-bold text-charcoal leading-tight">App Store</div>
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-charcoal border border-charcoal rounded-lg shadow-lg opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300 pointer-events-none text-[11px] font-bold text-light whitespace-nowrap">
                Under Development
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal rotate-45" />
              </div>
            </div>

            {/* Google Play Badge */}
            <div className="relative group/badge2">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-black/5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none">
                <GooglePlayLogo className="w-6 h-6 text-charcoal" />
                <div className="text-left">
                  <div className="text-[9px] text-charcoal/40 uppercase tracking-widest leading-none">Get it on</div>
                  <div className="text-sm font-bold text-charcoal leading-tight">Google Play</div>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-charcoal border border-charcoal rounded-lg shadow-lg opacity-0 group-hover/badge2:opacity-100 transition-opacity duration-300 pointer-events-none text-[11px] font-bold text-light whitespace-nowrap">
                Under Development
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal rotate-45" />
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
