"use client";

import React, { useState, useEffect } from "react";
import { Heart, Lightbulb, PlusCircle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useWaitlist } from "@/context/WaitlistContext";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

export default function IdeaMarquee() {
  const { ideas, setIdeas, setIsIdeaPopupOpen } = useWaitlist();
  const [upvotedIds, setUpvotedIds] = useState([]);

  // Initialize Embla Carousel with AutoScroll plugin for continuous scrolling.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: false,
    },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  // Re-initialize Embla Carousel when slides list changes dynamically
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, ideas]);

  // Ideas are provided (and persisted) by WaitlistContext; no remote fetch.

  // Load upvoted items from localStorage on mount
  useEffect(() => {
    const stored = readJSON(STORAGE_KEYS.votedIdeas, []);
    if (Array.isArray(stored)) setUpvotedIds(stored);
  }, []);

  const handleVote = (id, e) => {
    e.stopPropagation();
    const isAlreadyVoted = upvotedIds.includes(id);
    const updatedVotedIds = isAlreadyVoted
      ? upvotedIds.filter((item) => item !== id)
      : [...upvotedIds, id];

    setUpvotedIds(updatedVotedIds);
    writeJSON(STORAGE_KEYS.votedIdeas, updatedVotedIds);

    // Adjust the upvote count in global context state
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? {
            ...idea,
            upvotes: isAlreadyVoted ? Math.max(0, idea.upvotes - 1) : idea.upvotes + 1,
          }
          : idea
      )
    );
  };

  // Triple the list array to guarantee Embla always has enough DOM elements to wrap cleanly
  const tripledIdeas = [...ideas, ...ideas, ...ideas];

  return (
    <section className="w-full py-16 overflow-hidden relative z-10 border-t border-black/5 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-xs font-bold text-accent-purple tracking-wider uppercase mb-3 shadow-sm">
            <Lightbulb className="w-3.5 h-3.5 text-accent-purple" />
            Feedback Loop
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-charcoal">
            Community Feature Requests
          </h2>
          <p className="text-charcoal/50 text-sm mt-1">
            See what others are proposing for Todojan. Upvote or submit your own concept!
          </p>
        </div>

        <button
          onClick={() => setIsIdeaPopupOpen(true)}
          className="px-5 py-2.5 rounded-xl font-bold bg-charcoal text-light hover:bg-charcoal/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center gap-2 self-start md:self-end text-sm"
        >
          <PlusCircle className="w-4 h-4 text-light" />
          <span>Suggest a Feature</span>
        </button>
      </div>

      {/* Scrolling Marquee Wrapper */}
      <div className="w-full relative py-4 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Embla Viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          {/* Embla Container — render tripledIdeas; loop:true and containScroll:false handle the infinite wrap */}
          <div className="flex backface-hidden touch-pan-y gap-6 select-none">
            {tripledIdeas.map((idea, idx) => {
              const isVoted = upvotedIds.includes(idea.id);
              const moniker = String(idea.id).startsWith("user-") ? "You" : "Community";

              return (
                <div
                  key={`${idea.id}-${idx}`}
                  className="min-w-[280px] w-[280px] flex-shrink-0 p-5 rounded-2xl border border-black/5 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-black/15 transition-all duration-300 flex flex-col justify-between"
                >
                  <p
                    className="text-charcoal/80 text-sm leading-relaxed mb-4 text-start whitespace-normal break-words font-medium"
                    dir="auto"
                  >
                    {idea.text}
                  </p>

                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-xs font-semibold text-charcoal/40 tracking-wider">
                      {moniker}
                    </span>

                    <button
                      onClick={(e) => handleVote(idea.id, e)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-black/5 text-charcoal/60 hover:text-red-500 hover:border-red-200 transition-colors group/heart"
                      aria-label="Upvote feature suggestion"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform duration-300 active:scale-125 ${isVoted
                            ? "fill-red-500 text-red-500"
                          : "text-charcoal/40 group-hover/heart:text-red-500"
                          }`}
                      />
                      <span className="text-xs font-bold font-mono">{idea.upvotes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}   