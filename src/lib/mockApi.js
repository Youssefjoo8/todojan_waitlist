/**
 * Local mock backend.
 *
 * Replaces the former remote endpoints (Google Apps Script / Google Sheets /
 * Firebase) with a browser-only implementation backed by localStorage.
 * Responses mimic the shape of the old API so the UI code stays simple, and
 * a small artificial latency keeps loading states visible.
 *
 * Nothing in this module performs network requests.
 */

import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";

const SIMULATED_LATENCY_MS = 450;

const wait = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

/**
 * Registers an email on the local waitlist.
 * @param {string} email
 * @returns {Promise<{status: "success" | "duplicate" | "error", message?: string}>}
 */
export async function joinWaitlist(email) {
  await wait();

  const normalized = normalizeEmail(email);
  if (!normalized || !normalized.includes("@")) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const emails = readJSON(STORAGE_KEYS.waitlistEmails, []);
  if (emails.includes(normalized)) {
    return { status: "duplicate" };
  }

  writeJSON(STORAGE_KEYS.waitlistEmails, [...emails, normalized]);
  return { status: "success" };
}

/**
 * Accepts a feature suggestion and returns the public idea record.
 * Contact details are validated but intentionally NOT persisted.
 * @param {{ idea: string, email: string }} payload
 */
export async function submitIdea({ idea, email }) {
  await wait();

  const text = String(idea || "").trim();
  if (!text || !normalizeEmail(email).includes("@")) {
    return { status: "error", message: "Missing required fields." };
  }

  return {
    status: "success",
    idea: { id: `user-${Date.now()}`, text, upvotes: 0, language: "en" },
  };
}
