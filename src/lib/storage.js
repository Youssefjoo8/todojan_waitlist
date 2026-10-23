/**
 * Tiny, SSR-safe wrapper around window.localStorage.
 *
 * Every call is guarded so the app never throws when storage is unavailable
 * (server rendering, Safari private mode, quota exceeded, corrupted JSON).
 */

const PREFIX = "todojan_";

export const STORAGE_KEYS = {
  tasks: `${PREFIX}tasks`,
  ideas: `${PREFIX}ideas`,
  votedIdeas: `${PREFIX}voted_features`,
  waitlistEmails: `${PREFIX}waitlist_emails`,
  waitlistJoined: `${PREFIX}waitlist_joined`,
  waitlistDismissed: `${PREFIX}waitlist_dismissed`,
  session: `${PREFIX}session`,
};

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export function readJSON(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked; the app keeps working with in-memory state.
  }
}

export function readFlag(key) {
  if (!isBrowser()) return false;
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function setFlag(key) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    // ignore
  }
}

export function removeKey(key) {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
