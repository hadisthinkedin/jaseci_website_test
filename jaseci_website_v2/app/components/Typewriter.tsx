"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Typewriter.module.css";

/* ───────────────────────────────────────────────
   Typewriter — types a word, holds, backspaces it,
   then types the next, looping forever. Used in the
   hero headline after "…built to program AI ___".
   SSR renders the first word complete (no empty
   flash); the loop then backspaces and cycles, so
   the full type-out is visible every revolution.
   ─────────────────────────────────────────────── */

const DEFAULT_WORDS = ["Applications.", "Agents.", "Workflows.", "Everything."];

type Phase = "hold" | "deleting" | "typing" | "pre";

const TYPE_MS = 85; // per character while typing
const DELETE_MS = 42; // per character while backspacing (a bit quicker)
const HOLD_MS = 1500; // pause once a word is fully typed
const PRE_MS = 450; // pause when empty before the next word

export default function Typewriter({
  words = DEFAULT_WORDS,
}: {
  words?: string[];
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [phase, setPhase] = useState<Phase>("hold");
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced.current) return; // hold on the first word — no animation

    const word = words[index];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        t = setTimeout(() => setText((s) => s.slice(0, -1)), DELETE_MS);
      } else {
        t = setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        }, PRE_MS);
      }
    } else if (phase === "typing") {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS);
      } else {
        t = setTimeout(() => setPhase("hold"), 0);
      }
    }

    return () => clearTimeout(t);
  }, [text, phase, index, words]);

  return (
    <span className={styles.tw}>
      <span className={styles.word} aria-hidden="true">
        {text}
      </span>
      {/* static, screen-reader-only copy so the headline still reads in full */}
      <span className={styles.srOnly}>{words.join(" ")}</span>
    </span>
  );
}
