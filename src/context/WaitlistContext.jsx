"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

const WaitlistContext = createContext(null);

// Seed data shown on first visit. User submissions and vote counts are
// persisted locally on top of this list.

const INITIAL_MOCK_IDEAS = [
  { id: "mock-1", text: "Add a Pomodoro timer integrated with task difficulty levels.", upvotes: 24, language: "en" },
  { id: "mock-2", text: "Add a water intake tracker synced with phone notifications.", upvotes: 42, language: "en" },
  { id: "mock-3", text: "Direct integration with Notion templates and Google Calendar.", upvotes: 18, language: "en" },
  { id: "mock-4", text: "Full calendar sync with reminders for holidays and important dates.", upvotes: 56, language: "en" },
  { id: "mock-5", text: "Smart task auto-scheduling using deep work slots and calendar gaps.", upvotes: 31, language: "en" },
  { id: "mock-6", text: "Auto dark mode based on ambient lighting and user location.", upvotes: 12, language: "en" },
  { id: "mock-7", text: "Voice-to-task parsing using natural language command processing.", upvotes: 67, language: "en" },
  { id: "mock-8", text: "Daily challenges with bonus XP rewards for completing habit streaks.", upvotes: 29, language: "en" },
  { id: "mock-9", text: "Collaborative shared boards with real-time cursor presence for teams.", upvotes: 73, language: "en" },
  { id: "mock-10", text: "Weekly productivity reports with personalized improvement tips.", upvotes: 45, language: "en" },
  { id: "mock-11", text: "Kanban board view with drag-and-drop and custom column labels.", upvotes: 38, language: "en" },
  { id: "mock-12", text: "Focus mode that blocks distracting apps while a task timer is running.", upvotes: 61, language: "en" },
  { id: "mock-13", text: "Recurring task templates for weekly meal prep, workouts, and routines.", upvotes: 22, language: "en" },
  { id: "mock-14", text: "End-of-day reflection prompts with mood tracking and journaling.", upvotes: 35, language: "en" },
];

export function WaitlistProvider({ children }) {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resetFormsTrigger, setResetFormsTrigger] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isIdeaPopupOpen, setIsIdeaPopupOpen] = useState(false);
  const [ideas, setIdeas] = useState(INITIAL_MOCK_IDEAS);
  const [hydrated, setHydrated] = useState(false);

  // Restore persisted ideas after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    const stored = readJSON(STORAGE_KEYS.ideas, null);
    if (Array.isArray(stored) && stored.length > 0) {
      setIdeas(stored.filter((idea) => idea && typeof idea.text === "string"));
    }
    setHydrated(true);
  }, []);

  // Persist every change once hydrated.
  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.ideas, ideas);
  }, [ideas, hydrated]);

  const openSuccessModal = (email) => {
    setSubmittedEmail(email);
    setIsSuccessOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessOpen(false);
    setSubmittedEmail("");
    // Increment the trigger to notify components to reset their form states
    setResetFormsTrigger((prev) => prev + 1);
  };

  return (
    <WaitlistContext.Provider
      value={{
        isSuccessOpen,
        submittedEmail,
        openSuccessModal,
        closeSuccessModal,
        resetFormsTrigger,
        isPopupOpen,
        setIsPopupOpen,
        isIdeaPopupOpen,
        setIsIdeaPopupOpen,
        ideas,
        setIdeas,
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return context;
}
