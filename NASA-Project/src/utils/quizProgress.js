// Tiny store that remembers which cards' quizzes the user has finished.
// Saved in localStorage so the stars stay filled after a refresh.
import { useSyncExternalStore } from "react";

const KEY = "nasa-quiz-progress";
const listeners = new Set();

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

let snapshot = read();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// keep other browser tabs in sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      snapshot = read();
      emit();
    }
  });
}

export function markQuizDone(cardId) {
  snapshot = { ...snapshot, [cardId]: true };
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* storage blocked: still works until the page is refreshed */
  }
  emit();
}

export function resetQuizProgress() {
  snapshot = {};
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

// plain (non-hook) check, handy for route guards
export function isQuizDone(cardId) {
  return !!snapshot[cardId];
}

// returns an object like { "viking-1": true }
export function useQuizProgress() {
  return useSyncExternalStore(subscribe, () => snapshot, () => ({}));
}