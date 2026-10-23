"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { useWaitlist } from "@/context/WaitlistContext";
import { joinWaitlist } from "@/lib/mockApi";
import { STORAGE_KEYS, setFlag } from "@/lib/storage";

export default function BottomWaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { openSuccessModal, resetFormsTrigger } = useWaitlist();

  useEffect(() => {
    if (resetFormsTrigger > 0) {
      setEmail("");
      setIsSubmitting(false);
      setErrorMessage("");
    }
  }, [resetFormsTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await joinWaitlist(email);

      if (data.status === "duplicate") {
        setErrorMessage("This email is already registered on our waitlist!");
        setIsSubmitting(false);
      } else if (data.status === "success") {
        setFlag(STORAGE_KEYS.waitlistJoined);
        openSuccessModal(email);
      } else {
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center gap-6 gpu-force"
    >
      {/* Premium Pill Badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-bold tracking-wider uppercase mb-2 shadow-sm animate-pulse">
        <Mail className="w-3.5 h-3.5 text-accent-purple" />
        Limited Spots Available
      </div>

      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-charcoal">
        Don{"'"}t Miss the Launch
      </h2>
      
      <p className="text-charcoal/55 text-lg max-w-lg leading-relaxed text-center">
        Be among the first to experience Todojan. Early adopters get lifetime free access and a voice in shaping the product.
      </p>

      <form 
        id="waitlistForm" 
        onSubmit={handleSubmit} 
        className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-2"
      >
        <div className="relative flex-1">
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-white/50 backdrop-blur-md text-charcoal placeholder-charcoal/40 text-sm focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 focus:outline-none transition-all shadow-sm"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          id="submitBtn"
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3.5 rounded-xl font-bold bg-charcoal hover:bg-charcoal/90 text-light active:scale-[0.98] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-charcoal/10"
        >
          {isSubmitting ? "Sending..." : "Claim My Spot"}
        </button>
      </form>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-xs font-semibold mt-2">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}
    </motion.div>
  );
}
