import { useEffect, useRef, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cycles through `phrases` with a type -> hold -> backspace effect.
// Returns { text, index, motion }. When reduced-motion is on, it returns the
// first phrase statically and runs no timers.
export default function useTypewriter(
  phrases,
  { typeMs = 55, holdMs = 1600, backMs = 30 } = {}
) {
  const [text, setText] = useState(phrases[0] || "");
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (prefersReduced() || phrases.length === 0) {
      setText(phrases[0] || "");
      setIndex(0);
      return;
    }

    let i = 0; // phrase index
    let pos = 0; // char position
    let deleting = false;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const phrase = phrases[i];

      if (!deleting) {
        pos++;
        setText(phrase.slice(0, pos));
        if (pos === phrase.length) {
          deleting = true;
          timer.current = setTimeout(tick, holdMs);
          return;
        }
        timer.current = setTimeout(tick, typeMs);
      } else {
        pos--;
        setText(phrase.slice(0, pos));
        if (pos === 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
          setIndex(i);
          timer.current = setTimeout(tick, typeMs);
          return;
        }
        timer.current = setTimeout(tick, backMs);
      }
    };

    timer.current = setTimeout(tick, typeMs);
    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { text, index, motion: !prefersReduced() };
}
