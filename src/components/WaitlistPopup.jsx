"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import { useWaitlist } from "@/context/WaitlistContext";
import { useMediaQuery } from "@/hooks/useMediaQueryHook";
import { joinWaitlist } from "@/lib/mockApi";
import { STORAGE_KEYS, readFlag, setFlag } from "@/lib/storage";

export default function WaitlistPopup() {
  const isMobileOrTablet = useMediaQuery("(max-width: 1023px)");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    isSuccessOpen,
    submittedEmail,
    openSuccessModal,
    closeSuccessModal,
    resetFormsTrigger,
    isPopupOpen,
    setIsPopupOpen,
    setIsIdeaPopupOpen,
  } = useWaitlist();

  const inputRef = useRef(null);

  useEffect(() => {
    // Check if user has already signed up or dismissed the popup
    const hasOptedOut = () =>
      readFlag(STORAGE_KEYS.waitlistJoined) || readFlag(STORAGE_KEYS.waitlistDismissed);
    if (hasOptedOut()) return;

    const handleScroll = () => {
      // Check dynamically in case user has clicked dismiss/joined on this page view
      if (hasOptedOut()) {
        window.removeEventListener("scroll", handleScroll);
        return;
      }

      // Trigger popup at exactly 90% scroll depth
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      
      if (currentScroll >= scrollHeight * 0.9) {
        setIsPopupOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsPopupOpen]);

  // Fire confetti dynamically when the success modal becomes active
  useEffect(() => {
    if (isSuccessOpen) {
      fireConfetti({
        particleCount: isMobileOrTablet ? 15 : 100,
        spread: isMobileOrTablet ? 40 : 70,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#06B6D4", "#A7F3D0"],
      });
    }
  }, [isSuccessOpen, isMobileOrTablet]);

  // Reset inputs and submit states when closing or resetting forms
  useEffect(() => {
    if (resetFormsTrigger > 0) {
      setEmail("");
      setIsSubmitting(false);
      setErrorMessage("");
    }
  }, [resetFormsTrigger]);

  // Focus input when popup opens
  useEffect(() => {
    if (isPopupOpen && !isSuccessOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen, isSuccessOpen]);

  const handleClose = () => {
    if (isSuccessOpen) {
      closeSuccessModal();
    } else {
      setIsPopupOpen(false);
      setFlag(STORAGE_KEYS.waitlistDismissed);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await joinWaitlist(email);

      if (data.status === "duplicate") {
        setErrorMessage("This email is already registered on our waitlist!");
        setIsSubmitting(false);
      } else if (data.status === "success") {
        setFlag(STORAGE_KEYS.waitlistJoined);
        openSuccessModal(email);
        setIsPopupOpen(false);
      } else {
        setErrorMessage(data.message || "Failed to join waitlist. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to join waitlist. Please try again.");
      setIsSubmitting(false);
    }
  };

  const showModal = isPopupOpen || isSuccessOpen;

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Fullscreen Translucent Backdrop with Glass Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[998]"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 z-[999] w-[90%] max-w-[400px] moving-border-glow shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform-gpu gpu-force"
          >
            {/* Main Card Wrapper (Light theme) */}
            <div className="relative p-6 rounded-2xl bg-white/95 backdrop-blur-xl overflow-hidden text-charcoal">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal/80 transition-colors p-1 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content states */}
              {!isSuccessOpen ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 text-accent-purple">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Join the Waitlist</span>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-charcoal mb-1">Secure Your Spot</h4>
                    <p className="text-charcoal/60 text-xs leading-relaxed">
                      Be the first to unlock your Peak Productivity with organization that fits your workflow. Launching soon.
                    </p>
                  </div>

                  {/* Input with icon */}
                  <div className="relative mt-2">
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 bg-slate-50 text-charcoal placeholder-charcoal/40 text-sm focus:border-accent-purple focus:outline-none transition-colors"
                      disabled={isSubmitting}
                      required
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/35" />
                  </div>

                  {/* Error message */}
                  {errorMessage && (
                    <p className="text-red-600 text-xs font-semibold">{errorMessage}</p>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl font-bold bg-charcoal text-light hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-light" />
                        Saving Reservation...
                      </>
                    ) : (
                      <>
                        Reserve Pre-launch Spot
                        <Send className="w-4 h-4 text-light" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6 gap-3"
                >
                  <div className="w-12 h-12 bg-accent-purple/10 rounded-full flex items-center justify-center text-accent-purple mb-2 border border-accent-purple/20 animate-pulse">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-extrabold text-charcoal">{"You're On The List!"}</h4>
                  <p className="text-charcoal/60 text-xs px-4 leading-relaxed">
                    {"Thank you for reserving your slot. We've saved "}<strong className="text-charcoal/95 font-semibold">{submittedEmail}</strong>{" locally in this browser (demo mode, nothing was sent)."}
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-6 py-2 rounded-lg text-xs font-bold text-charcoal bg-slate-50 border border-black/5 hover:bg-slate-100 transition-colors"
                  >
                    Close window
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setIsIdeaPopupOpen(true);
                    }}
                    className="text-accent-purple hover:text-accent-purple/80 hover:underline text-xs font-semibold mt-2 transition-colors cursor-pointer"
                  >
                    Have an idea or feedback?
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
