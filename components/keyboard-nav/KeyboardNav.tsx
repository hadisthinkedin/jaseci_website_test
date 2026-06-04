"use client";

/* Section-by-section keyboard navigation.
   ArrowDown / ArrowRight / PageDown / Space → next .snap-section
   ArrowUp / ArrowLeft / PageUp → previous .snap-section
   Home → first .snap-section · End → last .snap-section
   Skipped when focus is in an editable element (inputs, textareas,
   contenteditable) or when a modifier key (Ctrl/Cmd/Alt) is held, so
   in-component arrow handlers (tab strips, etc.) still work as expected. */

import { useEffect } from "react";

const NAV_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  // Monaco editor mounts <textarea> hosts, but also paints into a
  // contenteditable div — the isContentEditable check above covers it.
  return false;
}

export default function KeyboardNav() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!NAV_KEYS.has(e.key)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isEditable(e.target)) return;

      const root = document.querySelector<HTMLElement>(".scroll-root");
      if (!root) return;
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>(".snap-section"),
      );
      if (sections.length === 0) return;

      // Find the section whose top is closest to the current scrollTop —
      // accounts for proximity-snap (we may be mid-section).
      const scrollTop = root.scrollTop;
      const offsets = sections.map((s) => s.offsetTop);
      let current = 0;
      let bestDelta = Infinity;
      for (let i = 0; i < offsets.length; i++) {
        const delta = Math.abs(offsets[i] - scrollTop);
        if (delta < bestDelta) {
          bestDelta = delta;
          current = i;
        }
      }

      let target = current;
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        target = Math.min(sections.length - 1, current + 1);
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp"
      ) {
        target = Math.max(0, current - 1);
      } else if (e.key === "Home") {
        target = 0;
      } else if (e.key === "End") {
        target = sections.length - 1;
      }

      if (target === current) {
        // Already at the edge — let the browser handle it (or do nothing).
        // Still preventDefault so Space doesn't double-scroll.
        if (e.key === " ") e.preventDefault();
        return;
      }

      e.preventDefault();
      sections[target].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
