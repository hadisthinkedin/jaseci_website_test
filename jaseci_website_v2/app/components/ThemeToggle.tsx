"use client";

import styles from "./ThemeToggle.module.css";

/* ThemeToggle — the nav's light/dark switch: a half-filled square (the site's
   brutalist take on the sun/moon glyph) that flips <html data-theme> and
   persists the choice as localStorage "jac-theme". First-visit default (OS
   preference) is applied by the pre-hydration script in layout.tsx.

   Stateless on purpose: the rendered markup is identical in both themes
   (the glyph reads as "flip the ink"), so there's nothing to hydrate
   against the pre-set attribute — the click just reads the live DOM. */

export default function ThemeToggle() {
  const flip = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("jac-theme", next);
    } catch {
      /* storage blocked (private mode) — the flip still applies this visit */
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={flip}
      aria-label="Toggle light / dark mode"
      title="Toggle light / dark mode"
    >
      <span className={styles.glyph} aria-hidden="true" />
    </button>
  );
}
