"use client";

import { useEffect, useState } from "react";

type Segment = { text: string; code: boolean };

const LINES: Segment[][] = [
  [
    {
      text: "Replaces Python, JavaScript, and C/Zig/Rust with full access to PyPI, npm, and C-ABI — backend, frontend, and AI in one language.",
      code: false,
    },
  ],
  [
    { text: "", code: false },
    { text: "by llm()", code: true },
    {
      text: " turns your function signature into the prompt. No prompt engineering required.",
      code: false,
    },
  ],
  [
    {
      text: "No REST endpoints. No HTTP clients. No CORS. Frontend calls backend directly.",
      code: false,
    },
  ],
];

const LINE_LENGTHS = LINES.map((line) =>
  line.reduce((sum, seg) => sum + seg.text.length, 0),
);

// Longest line by char count — used as the invisible spacer that locks the
// container's height so the layout never shifts while text changes.
const LONGEST_LINE_IDX = LINE_LENGTHS.reduce(
  (max, len, idx) => (len > LINE_LENGTHS[max] ? idx : max),
  0,
);

function sliceLine(line: Segment[], length: number): Segment[] {
  const result: Segment[] = [];
  let remaining = length;
  for (const seg of line) {
    if (remaining <= 0) break;
    if (remaining >= seg.text.length) {
      result.push(seg);
      remaining -= seg.text.length;
    } else {
      result.push({ text: seg.text.slice(0, remaining), code: seg.code });
      remaining = 0;
    }
  }
  return result;
}

function renderSegments(segments: Segment[]) {
  return segments.map((seg, i) =>
    seg.code ? (
      <span key={i} className="tw__code">
        {seg.text}
      </span>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

const TYPE_MS = 40;
const DELETE_MS = 22;
const HOLD_MS = 1900;
const PAUSE_MS = 400;

type Phase = "typing" | "holding" | "deleting" | "pausing";

export default function TypewriterDescription() {
  // Default to non-animated. SSR + first client render produce the same DOM
  // (line 1 static), avoiding hydration mismatch. After mount we check the
  // user's motion preference and flip into animated mode if allowed.
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimating(!mql.matches);
    const onChange = (e: MediaQueryListEvent) => setAnimating(!e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <div>
      <p className="tw" aria-hidden="true">
        {/* Invisible spacer — locks height to the tallest line at the current width */}
        <span className="tw__ghost">
          {renderSegments(LINES[LONGEST_LINE_IDX])}
        </span>

        {/* Visible layer — animated or static depending on motion preference */}
        {animating ? <AnimatedLine /> : <StaticLine />}
      </p>

      {/* SR-only static content — assistive tech reads each line once */}
      <ul className="sr-only">
        {LINES.map((line, i) => (
          <li key={i}>{line.map((s) => s.text).join("")}</li>
        ))}
      </ul>
    </div>
  );
}

function StaticLine() {
  return (
    <span className="tw__display">
      <span className="tw__text">{renderSegments(LINES[0])}</span>
    </span>
  );
}

function AnimatedLine() {
  // Start with line 1 fully shown to avoid a blank flash when swapping in.
  const [rendered, setRendered] = useState<Segment[]>(() => LINES[0]);

  useEffect(() => {
    let lineIdx = 0;
    let length = LINE_LENGTHS[0];
    let phase: Phase = "holding";
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const line = LINES[lineIdx];
      const total = LINE_LENGTHS[lineIdx];

      if (phase === "typing") {
        length += 1;
        setRendered(sliceLine(line, length));
        if (length >= total) {
          phase = "holding";
          timeoutId = setTimeout(tick, HOLD_MS);
        } else {
          timeoutId = setTimeout(tick, TYPE_MS);
        }
      } else if (phase === "holding") {
        phase = "deleting";
        tick();
      } else if (phase === "deleting") {
        length -= 1;
        setRendered(sliceLine(line, length));
        if (length <= 0) {
          phase = "pausing";
          timeoutId = setTimeout(tick, PAUSE_MS);
        } else {
          timeoutId = setTimeout(tick, DELETE_MS);
        }
      } else if (phase === "pausing") {
        lineIdx = (lineIdx + 1) % LINES.length;
        length = 0;
        phase = "typing";
        tick();
      }
    };

    // Hold the already-shown line 1 first, then begin deletion
    timeoutId = setTimeout(tick, HOLD_MS);

    return () => {
      cancelled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <span className="tw__display">
      <span className="tw__text">{renderSegments(rendered)}</span>
      <span className="tw__caret" aria-hidden="true">
        │
      </span>
    </span>
  );
}
