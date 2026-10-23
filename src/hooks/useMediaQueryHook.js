"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook that returns true if the media query matches.
 * SSR-safe: returns false during server rendering.
 *
 * @param {string} query The media query to evaluate (e.g. '(max-width: 1023px)')
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
