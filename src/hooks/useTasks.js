"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

export const PRIORITIES = ["High", "Medium", "Low"];

export const PRIORITY_STYLES = {
  High: "text-red-600 bg-red-500/10",
  Medium: "text-amber-600 bg-amber-500/10",
  Low: "text-accent-cyan bg-accent-cyan/10",
};

export const MAX_TASK_LENGTH = 120;

/** Demo tasks shown to first-time visitors (and restored by "Reset demo"). */
export const SEED_TASKS = Object.freeze([
  { id: "seed-1", text: "Finalize quarterly growth strategy and share with the team", priority: "High", completed: false },
  { id: "seed-2", text: "Review calendar blocks for tomorrow's deep work session", priority: "Medium", completed: false },
  { id: "seed-3", text: "Draft executive summary for the product launch", priority: "Low", completed: true },
  { id: "seed-4", text: "Drag the handle on the left to reorder tasks", priority: "Low", completed: false },
]);

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Defensive parsing so corrupted/old storage never crashes the UI. */
function sanitizeTasks(value) {
  if (!Array.isArray(value)) return null;
  const seen = new Set();
  return value
    .filter((t) => t && typeof t.text === "string" && t.text.trim() && t.id != null)
    .filter((t) => (seen.has(t.id) ? false : seen.add(t.id)))
    .map((t) => ({
      id: String(t.id),
      text: t.text.slice(0, MAX_TASK_LENGTH),
      priority: PRIORITIES.includes(t.priority) ? t.priority : "Medium",
      completed: Boolean(t.completed),
    }));
}

const cloneSeed = () => SEED_TASKS.map((t) => ({ ...t }));

/**
 * Local task store persisted in localStorage.
 * Works fully offline; there is no remote sync.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(cloneSeed);
  const [hydrated, setHydrated] = useState(false);

  // Restore persisted tasks after mount (keeps SSR markup deterministic).
  useEffect(() => {
    const stored = sanitizeTasks(readJSON(STORAGE_KEYS.tasks, null));
    if (stored) setTasks(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.tasks, tasks);
  }, [tasks, hydrated]);

  const addTask = useCallback((text, priority = "Medium") => {
    const clean = String(text || "").trim().slice(0, MAX_TASK_LENGTH);
    if (!clean) return false;
    setTasks((prev) => [
      { id: makeId(), text: clean, priority: PRIORITIES.includes(priority) ? priority : "Medium", completed: false },
      ...prev,
    ]);
    return true;
  }, []);

  const updateTask = useCallback((id, patch) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, ...patch };
        if (typeof patch.text === "string") {
          const clean = patch.text.trim().slice(0, MAX_TASK_LENGTH);
          next.text = clean || t.text; // never allow empty text
        }
        return next;
      })
    );
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const cyclePriority = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, priority: PRIORITIES[(PRIORITIES.indexOf(t.priority) + 1) % PRIORITIES.length] }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reorderTasks = useCallback((next) => setTasks(next), []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const resetTasks = useCallback(() => setTasks(cloneSeed()), []);

  return {
    tasks,
    hydrated,
    addTask,
    updateTask,
    toggleTask,
    cyclePriority,
    deleteTask,
    reorderTasks,
    clearCompleted,
    resetTasks,
  };
}
