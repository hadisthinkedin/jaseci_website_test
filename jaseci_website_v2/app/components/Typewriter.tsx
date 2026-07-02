"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Typewriter.module.css";

/* ───────────────────────────────────────────────
   Typewriter — types a word, holds, backspaces it,
   then types the next, looping forever. Sits right
   after "…built for" in the hero headline.

   The "AI " prefix rides on the line above the cycling
   word (a <br/> splits them), so the headline reads
   "built for AI" / "Applications." Most words carry the
   prefix, and it stays put between them — we backspace
   only the trailing word and type the next, so "AI" never
   flickers. Only when the loop reaches "everything." (no
   prefix) is the "AI" backspaced away too — leaving
   "built for" / "everything." — then typed back in full
   when the loop returns to a prefixed word. "AI" renders
   in the headline colour, the cycling word in accent.

   SSR renders the first word complete (no empty flash);
   the loop then backspaces and cycles, so the full
   type-out is visible every revolution.
   ─────────────────────────────────────────────── */

const DEFAULT_WORDS = [
  "AI Applications.",
  "AI Agents.",
  "AI Workflows.",
  "everything.",
];

const AI_PREFIX = "AI";

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
    // How far back to delete before the next word. Consecutive AI-prefixed
    // words share the "AI " prefix, so we stop there and leave it standing
    // rather than backspacing and retyping it every cycle. Only when the next
    // word drops the prefix ("everything.") do we delete "AI" too.
    const next = words[(index + 1) % words.length];
    const floor =
      word.startsWith(AI_PREFIX) && next.startsWith(AI_PREFIX)
        ? `${AI_PREFIX} `
        : "";
    let t: ReturnType<typeof setTimeout>;

    if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), HOLD_MS);
    } else if (phase === "deleting") {
      if (text.length > floor.length) {
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

  // Colour the leading "AI" like the headline (black) and the rest in accent —
  // but only while the current word actually carries the prefix, so the lone
  // "everything." stays fully accent. The prefix sits on the line above; the
  // separating space is dropped in favour of the <br/>.
  const aiPrefixed = words[index].startsWith(AI_PREFIX);
  const lead = aiPrefixed ? text.slice(0, AI_PREFIX.length) : "";
  const rest = aiPrefixed ? text.slice(AI_PREFIX.length + 1) : text;

  return (
    <span className={styles.tw}>
      <span className={styles.word} aria-hidden="true">
        {lead ? <span className={styles.lead}>{lead}</span> : null}
        <br />
        {rest}
      </span>
      {/* static, screen-reader-only copy so the headline still reads in full */}
      <span className={styles.srOnly}>{words.join(" ")}</span>
    </span>
  );
}
