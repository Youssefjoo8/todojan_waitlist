"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

/**
 * Mock authentication.
 *
 * There is no real auth backend. Every visitor is automatically signed in as a
 * persistent local "Demo User" so all interactive features work offline.
 */

export const DEMO_USER = Object.freeze({
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  level: 10,
  
});

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER);

  // Restore (or create) the persisted demo session after mount.
  useEffect(() => {
    const stored = readJSON(STORAGE_KEYS.session, null);
    if (stored && typeof stored === "object" && stored.id) {
      setUser({ ...DEMO_USER, ...stored });
    } else {
      writeJSON(STORAGE_KEYS.session, DEMO_USER);
    }
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(STORAGE_KEYS.session, next);
      return next;
    });
  }, []);

  const resetSession = useCallback(() => {
    writeJSON(STORAGE_KEYS.session, DEMO_USER);
    setUser(DEMO_USER);
  }, []);

  return (
    <SessionContext.Provider
      value={{ user, isAuthenticated: true, updateUser, resetSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
