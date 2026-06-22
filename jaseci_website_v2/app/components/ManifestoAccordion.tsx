"use client";

import { useState } from "react";
import styles from "./ManifestoAccordion.module.css";

/* ───────────────────────────────────────────────
   Manifesto, as expandable claims.
   Each box is the one-sentence main topic; the +
   button reveals the supporting paragraph (the
   original copy, split by idea). Boxes toggle
   independently. Body height animates via the
   grid-template-rows 0fr→1fr trick.
   ─────────────────────────────────────────────── */

const ITEMS = [
  {
    headline: "Python became the home of Machine Learning, not AI.",
    body: "Python became the home of Machine Learning, not Artificial Intelligence — but companies pretend like it was born for it.",
  },
  {
    headline: "Stacking libraries on Python only makes the tools worse.",
    body: "Companies pancake libraries and frameworks on top, constantly abstracting over a language never designed to build agents. That’s why, no matter how hard they try, these tools are always sh*tty.",
  },
  {
    headline: "The fix isn’t more abstraction — it’s a new language.",
    body: "Instead of abstraction, let’s build a language that’s aware of the advancements of the past year.",
  },
  {
    headline: "An OSP walker collapses agent state into one graph traversal.",
    body: "Instead of an OOP agent wrangling its own state, an OSP walker collapses everything into a single graph traversal — running 4.75× faster at runtime and built 3.2× faster by developers.",
  },
  {
    headline: "byLLM replaces a 500-word prompt with a single line.",
    body: "Instead of a 500-word prompt, use byLLM in a single line (that’s developer-friendly :D). Jac is the language built for pro-AI communities today.",
  },
];

export default function ManifestoAccordion({
  items = ITEMS,
}: {
  items?: { headline: string; body: string }[];
}) {
  // single-open accordion: opening one box collapses whichever was open
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className={styles.box} key={i} data-open={isOpen}>
            <button
              type="button"
              className={styles.head}
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              <span className={styles.headline}>{item.headline}</span>
              <span className={styles.icon} aria-hidden="true" />
            </button>
            <div className={styles.bodyWrap}>
              <div className={styles.bodyInner}>
                <p className={styles.body}>{item.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
