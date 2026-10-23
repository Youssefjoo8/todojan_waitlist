"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { useSession } from "@/context/SessionContext";
import { useMediaQuery } from "@/hooks/useMediaQueryHook";
import { useTasks } from "@/hooks/useTasks";
import TaskBoard from "@/components/TaskBoard";

const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function Hero() {
  const isMobileOrTablet = useMediaQuery("(max-width: 1023px)");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-400, 400], [-5, 5]);

  const isDraggingRef = useRef(false);

  const handleMouseMove = (e) => {
    if (isMobileOrTablet || isDraggingRef.current) return;
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Local, persisted task store (no backend)
  const taskStore = useTasks();
  const { tasks, hydrated } = taskStore;
  const { user } = useSession();
  const dashboardRef = useRef(null);
  const prevAllDoneRef = useRef(null);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  // Pause the 3D tilt while a task is being dragged so pointer math stays accurate
  const handleDragStateChange = (dragging) => {
    isDraggingRef.current = dragging;
    if (dragging) handleMouseLeave();
  };

  // Celebrate only when the user completes the last open task (not on page load)
  useEffect(() => {
    if (!hydrated) return;
    const wasAllDone = prevAllDoneRef.current;
    prevAllDoneRef.current = allDone;
    if (wasAllDone !== false || !allDone) return;

    const rect = dashboardRef.current?.getBoundingClientRect();
    if (!rect) return;
    fireConfetti({
      particleCount: 120,
      spread: 75,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ["#8B5CF6", "#06B6D4", "#A7F3D0", "#F59E0B"],
    });
  }, [allDone, hydrated]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden z-10">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-purple/5 border border-accent-purple/20 text-xs font-semibold text-accent-purple mb-8 relative"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-mint opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-mint"></span>
        </span>
        Launching Soon — iOS, Android & Web
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-center text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.08] mb-6 text-charcoal"
      >
        Master Your Day,{" "}
        <span className="bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-mint bg-clip-text text-transparent">
          One Task at a Time
        </span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center text-charcoal/55 text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
      >
        The all-in-one productivity workspace that learns your rhythm. Smart scheduling, gamified progress, and focus tools — designed for people who get things done.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mb-6 z-10 flex flex-col items-center gap-4"
      >
        <a
          href="#waitlist-section"
          className="cta-shimmer px-10 py-4 rounded-full font-bold bg-charcoal text-light hover:bg-charcoal/95 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-charcoal/10 flex items-center justify-center gap-2 text-base"
        >
          Reserve Your Spot
        </a>
        <p className="text-charcoal/35 text-xs">Free forever for early adopters • No credit card required</p>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-16 flex items-center gap-6 text-charcoal/30 text-xs font-medium"
      >
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" />
          Smart Engine
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" />
          Cross-Platform
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" />
          Privacy-First
        </span>
      </motion.div>

      {/* Interactive Application Preview Card (Light Theme) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-4xl perspective transform-gpu gpu-force"
        ref={dashboardRef}
      >
        <div className="relative w-full rounded-2xl border border-black/5 bg-white/70 backdrop-blur-xl shadow-xl p-1 overflow-hidden group transform-gpu gpu-force">
          {/* Subtle light border animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 via-accent-cyan/10 to-accent-mint/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Window Mockup Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-slate-50/50">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-xs text-charcoal/40 font-mono select-none">todojan.app/dashboard</div>
            <div className="w-12" />
          </div>

          {/* Dashboard Body */}
          <div className="p-6 md:p-8 bg-white/95 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Metrics Panel */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="text-xs font-bold text-charcoal/40 uppercase tracking-wider">Metrics</div>
              
              {/* Stat card 1 — Dynamic Daily Progress */}
              <div className="p-4 rounded-xl bg-slate-50 border border-black/5 flex flex-col gap-1 gpu-force">
                <span className="text-xs text-charcoal/50">Daily Progress</span>
                <div className="flex items-baseline gap-1.5">
                  <motion.span
                    key={completedCount}
                    initial={{ scale: 1.3, color: "#8B5CF6" }}
                    animate={{ scale: 1, color: "#8B5CF6" }}
                    className="text-2xl font-bold"
                  >
                    {completedCount}/{totalCount}
                  </motion.span>
                  <span className="text-xs text-charcoal/30">completed</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="bg-accent-purple h-full rounded-full transform-gpu gpu-force"
                    animate={{ width: `${(completedCount / (totalCount || 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Stat card 2 — Focus Level */}
              <div className="p-4 rounded-xl bg-slate-50 border border-black/5 flex flex-col gap-1 gpu-force">
                <span className="text-xs text-charcoal/50">Focus Level</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-accent-cyan">
                    85%
                  </span>
                  <span className="text-xs text-green-600 font-medium">+12% vs yesterday</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-accent-cyan h-full rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Tasks Panel */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-charcoal/40 uppercase tracking-wider">Focus Schedule</div>
                <div
                  className="flex items-center gap-2 text-xs text-accent-purple bg-accent-purple/10 pl-1 pr-2 py-0.5 rounded-full font-mono"
                  title={`Signed in locally as ${user.email}`}
                >
                  <span className="w-5 h-5 rounded-full bg-accent-purple text-white text-[10px] font-bold flex items-center justify-center font-sans">
                    {initialsOf(user.name)}
                  </span>
                  {user.name} • Level {user.level}
                </div>
              </div>

              {/* Tasks List (local, persisted) */}
              <div className="min-h-[220px]">
                <TaskBoard store={taskStore} onDragStateChange={handleDragStateChange} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
