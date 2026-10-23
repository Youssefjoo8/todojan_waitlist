"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { useWaitlist } from "@/context/WaitlistContext";
import { useSession } from "@/context/SessionContext";
import { submitIdea } from "@/lib/mockApi";

export default function IdeaPopup() {
  const { isIdeaPopupOpen, setIsIdeaPopupOpen, setIdeas } = useWaitlist();
  const { user } = useSession();
  
  const [ideaText, setIdeaText] = useState("");
  const [email, setEmail] = useState("");
  const closeTimerRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const textareaRef = useRef(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isIdeaPopupOpen) {
      setErrorMsg("");
      setIsSuccess(false);
      // Prefill with the mock session email for a frictionless demo.
      setEmail((prev) => prev || user.email);
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isIdeaPopupOpen, user.email]);

  // Clear any pending auto-close timer on unmount.
  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  const handleClose = () => {
    clearTimeout(closeTimerRef.current);
    setIsIdeaPopupOpen(false);
    // Clear state after transition out
    setTimeout(() => {
      setIdeaText("");
      setEmail("");
      setPhone("");
      setIsSuccess(false);
      setErrorMsg("");
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ideaText.trim()) {
      setErrorMsg("Please write your suggestion first.");
      return;
    }
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const result = await submitIdea({ idea: ideaText, email });

      if (result.status !== "success") {
        throw new Error(result.message || "Failed to submit.");
      }

      // Add to the locally persisted feature board
      setIdeas(prev => [result.idea, ...prev]);
      setIsSuccess(true);
      setIsSubmitting(false);

      // Reward success with confetti
      fireConfetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#06B6D4", "#A7F3D0"]
      });

      // Close automatically after 3 seconds
      closeTimerRef.current = setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isIdeaPopupOpen && (
        <>
          {/* Fullscreen Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 z-[999] w-[92%] max-w-[460px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform-gpu gpu-force"
          >
            {/* Modal Card wrapper */}
            <div className="relative p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/5 text-charcoal">
              {/* Close Icon Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal/85 transition-colors p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 text-accent-purple">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Suggest a Feature</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-charcoal leading-tight">
                      Share your thoughts
                    </h3>
                    <p className="text-charcoal/50 text-[11px] leading-relaxed mt-1">
                      Help us shape Todojan. Tell us what integrations, metrics, or widgets you want to see built!
                    </p>
                  </div>

                  {/* Suggestion Textarea */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-charcoal/60 uppercase">
                      Feature Idea *
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      placeholder="Write your idea here..."
                      className="w-full h-24 p-3 rounded-xl border border-black/10 bg-slate-50 text-charcoal placeholder-charcoal/40 text-sm focus:border-accent-purple focus:outline-none resize-none transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-charcoal/60 uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-slate-50 text-charcoal placeholder-charcoal/40 text-sm focus:border-accent-purple focus:outline-none transition-colors"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-charcoal/60 uppercase">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 bg-slate-50 text-charcoal placeholder-charcoal/40 text-sm focus:border-accent-purple focus:outline-none transition-colors"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Disclaimer block */}
                  <div className="flex gap-2 p-3 rounded-lg bg-slate-50 border border-black/5 text-[11px] text-charcoal/50 leading-relaxed items-start">
                    <ShieldCheck className="w-4 h-4 text-accent-purple flex-shrink-0 mt-0.5" />
                    <p>
                      Local demo mode: your idea is saved only in this browser. Email and phone are validated but never stored or sent anywhere.
                    </p>
                  </div>

                  {/* Errors */}
                  {errorMsg && (
                    <p className="text-xs font-semibold text-red-600">{errorMsg}</p>
                  )}

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl font-bold bg-charcoal text-light hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-light" />
                        Submitting Idea...
                      </>
                    ) : (
                      <>
                        Submit Suggestion
                        <Send className="w-4 h-4 text-light" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Success view */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-8 gap-3"
                >
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mb-2 border border-green-500/20 animate-pulse">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-charcoal">
                    Thank You!
                  </h3>
                  <p className="text-charcoal/60 text-xs px-4 leading-relaxed font-medium">
                    Thank you! Your idea has been successfully submitted to our feature board.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-6 py-2 rounded-lg text-xs font-bold text-charcoal bg-slate-50 border border-black/5 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
