"use client";

import { useEffect, useRef } from "react";
import styles from "./InteropTerminal.module.css";

/* ───────────────────────────────────────────────
   InteropTerminal — the animated proof for "npm, PyPI and C-ABI
   interoperable". A looping terminal window on the site's locked system
   (hairline chrome, hatched titlebar, sharp corners, mono, orange accent)
   that cats a real Jac file, compiles it against one of the three targets,
   and stamps the takeaway in a bordered legend box. Three segments — PyPI
   (python bytecode), npm (javascript), C-ABI (native machine code); the
   code is shaped verbatim on the jaseci README + day-planner tutorial
   (`import from numpy { array }`, `cl import from react { useState }`,
   `jac nacompile`).

   Time-driven, not tweened: a pure render(t) over a compiled step
   timeline, repainted via rAF only when the frame's HTML actually
   changes. IntersectionObserver pauses it offscreen;
   prefers-reduced-motion gets one static completed frame.
   ─────────────────────────────────────────────── */

type Span = [cls: string, text: string]; // cls "" → plain token

type Step =
  | { k: "type"; text: string } // "$ …" typed per-char
  | { k: "print"; lines: Span[][] } // cat output, line-staggered
  | { k: "progress"; label: string; dur: number; done: Span[] }
  | { k: "out"; lines: Span[][] }
  | { k: "box"; legend: string; big: string; sub: string; desc: string }
  | { k: "pause"; dur: number };

type Segment = { steps: Step[] };

const SEGMENTS: Segment[] = [
  // ── 1/3 · PyPI — Jac compiles to Python bytecode ──────────────────────
  {
    steps: [
      { k: "type", text: "cat mean.jac" },
      {
        k: "print",
        lines: [
          [
            ["kw", "import from"],
            ["", " numpy { array }"],
            ["com", "  # PyPI"],
          ],
          [["", ""]],
          [
            ["kw", "with entry"],
            ["", " {"],
          ],
          [["", "    stats = array([3, 1, 4, 1, 5]);"]],
          [["", "    print(stats.mean());"]],
          [["", "}"]],
        ],
      },
      { k: "pause", dur: 0.4 },
      { k: "type", text: "jac run mean.jac" },
      {
        k: "progress",
        label: "jac → python bytecode",
        dur: 0.9,
        done: [
          ["acc", "⡇"],
          ["dim", " compiled → python bytecode"],
        ],
      },
      { k: "out", lines: [[["", "2.8"]]] },
      {
        k: "box",
        legend: "Target 1/3 — Python bytecode",
        big: "PyPI",
        sub: "0 wrappers · 0 FFI",
        desc: "numpy, pandas, torch — the entire Python ecosystem imports directly.",
      },
      { k: "pause", dur: 3.3 },
    ],
  },

  // ── 2/3 · npm — the same language compiles to JavaScript ─────────────
  {
    steps: [
      { k: "type", text: "cat app.jac" },
      {
        k: "print",
        lines: [
          [
            ["kw", "cl import from"],
            ["", " react { useState }"],
            ["com", "  # npm"],
          ],
          [["", ""]],
          [
            ["kw", "cl def:pub"],
            ["", " app -> JsxElement {"],
          ],
          [["", "    (n, set_n) = useState(0);"]],
          [
            ["", "    "],
            ["kw", "def"],
            ["", " bump { set_n(n + 1); }"],
          ],
          [
            ["", "    "],
            ["kw", "return"],
            ["", " "],
            ["tag", "<button"],
            ["", " onClick={bump}"],
            ["tag", ">"],
          ],
          [["", "        + {n}"]],
          [
            ["", "    "],
            ["tag", "</button>"],
            ["", ";"],
          ],
          [["", "}"]],
        ],
      },
      { k: "pause", dur: 0.4 },
      { k: "type", text: "jac start app.jac" },
      {
        k: "progress",
        label: "vite · bundling → javascript",
        dur: 0.95,
        done: [
          ["acc", "⡇"],
          ["dim", " react@18.2.0 via npm · bundled"],
        ],
      },
      {
        k: "out",
        lines: [
          [
            ["acc", "➜"],
            ["", " http://localhost:8000"],
          ],
        ],
      },
      {
        k: "box",
        legend: "Target 2/3 — JavaScript",
        big: "npm",
        sub: "frontend + backend, one file",
        desc: "react, vite, tailwind — the whole npm registry, beside your server code.",
      },
      { k: "pause", dur: 3.3 },
    ],
  },

  // ── 3/3 · C-ABI — native machine code via LLVM ────────────────────────
  {
    steps: [
      { k: "type", text: "cat fib.jac" },
      {
        k: "print",
        lines: [
          [
            ["kw", "def"],
            ["", " fib(n: int) -> int {"],
            ["com", "  # native"],
          ],
          [
            ["", "    "],
            ["kw", "return"],
            ["", " n "],
            ["kw", "if"],
            ["", " n < 2 "],
            ["kw", "else"],
          ],
          [["", "        fib(n - 1) + fib(n - 2);"]],
          [["", "}"]],
          [
            ["kw", "with entry"],
            ["", " { print(fib(35)); }"],
          ],
        ],
      },
      { k: "pause", dur: 0.4 },
      { k: "type", text: "jac nacompile fib.jac" },
      {
        k: "progress",
        label: "llvm → native machine code",
        dur: 1.05,
        done: [
          ["acc", "⡇"],
          ["dim", " emitted ./fib · arm64 · 1.9 MB"],
        ],
      },
      { k: "pause", dur: 0.45 },
      { k: "type", text: "./fib" },
      {
        k: "out",
        lines: [
          [["", "9227465"]],
          [["dim", "0.04s · no vm · no python runtime"]],
        ],
      },
      {
        k: "box",
        legend: "Target 3/3 — Machine code",
        big: "C-ABI",
        sub: "links any C library",
        desc: "LLVM-compiled native binaries — nothing between you and the metal.",
      },
      { k: "pause", dur: 3.6 },
    ],
  },
];

// ── timing constants ─────────────────────────────────────────────────────
const TYPE_LEAD = 0.22; // beat before the first char of a command
const TYPE_CHAR = 0.045;
const TYPE_TAIL = 0.18; // beat after the last char, before output starts
const PRINT_STAG = 0.095; // cat lines land one per this interval
const PRINT_TAIL = 0.25;
const PROG_TAIL = 0.12;
const OUT_STAG = 0.12;
const OUT_TAIL = 0.18;
const BOX_DUR = 0.5;
const BLINK = 0.53;

function stepDur(s: Step): number {
  switch (s.k) {
    case "type":
      return TYPE_LEAD + s.text.length * TYPE_CHAR + TYPE_TAIL;
    case "print":
      return s.lines.length * PRINT_STAG + PRINT_TAIL;
    case "progress":
      return s.dur + PROG_TAIL;
    case "out":
      return s.lines.length * OUT_STAG + OUT_TAIL;
    case "box":
      return BOX_DUR;
    case "pause":
      return s.dur;
  }
}

type Timed = { s: Step; start: number; dur: number };
type Compiled = { steps: Timed[]; total: number };

const COMPILED: Compiled[] = SEGMENTS.map((seg) => {
  let t = 0;
  const steps = seg.steps.map((s) => {
    const dur = stepDur(s);
    const timed = { s, start: t, dur };
    t += dur;
    return timed;
  });
  return { steps, total: t };
});
const OFFSETS: number[] = [];
let acc = 0;
for (const seg of COMPILED) {
  OFFSETS.push(acc);
  acc += seg.total;
}
const TOTAL = acc;

export default function InteropTerminal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const term = termRef.current;
    if (!root || !term) return;

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const spansHtml = (spans: Span[]) =>
      spans
        .map(([c, x]) =>
          c ? `<span class="${styles[c]}">${esc(x)}</span>` : esc(x),
        )
        .join("");
    // &nbsp; keeps empty separator lines from collapsing to zero height
    const line = (html: string) =>
      `<div class="${styles.line}">${html || "&nbsp;"}</div>`;
    const prompt = `<span class="${styles.prompt}">$ </span>`;
    const cursor = (vis: boolean) =>
      `<span class="${styles.cursor}"${vis ? "" : ' style="opacity:0"'}></span>`;
    const blinkOn = (t: number) => Math.floor(t / BLINK) % 2 === 0;

    const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
    const BAR_W = 16;
    const progressLine = (label: string, frac: number) => {
      const sp = SPIN[Math.floor(frac * 20) % SPIN.length];
      const fill = Math.round(frac * BAR_W);
      const pct = String(Math.round(frac * 100)).padStart(3, " ");
      return line(
        `<span class="${styles.acc}">${sp}</span> ` +
          `<span class="${styles.dim}">${esc(label)}</span> ` +
          `<span class="${styles.acc}">${"█".repeat(fill)}</span>` +
          `<span class="${styles.faint}">${"░".repeat(BAR_W - fill)}</span>` +
          `<span class="${styles.dim}"> ${pct}%</span>`,
      );
    };

    const boxHtml = (
      s: Extract<Step, { k: "box" }>,
      p: number, // opacity 0→1
      e: number, // eased scale progress 0→1
    ) =>
      `<div class="${styles.box}" style="opacity:${p.toFixed(3)};transform:scaleY(${(
        0.55 +
        0.45 * e
      ).toFixed(3)})">` +
      `<div class="${styles.legend}">${esc(s.legend)}</div>` +
      `<div class="${styles.boxL}">` +
      `<div class="${styles.boxBig}">${esc(s.big)}</div>` +
      `<div class="${styles.boxSub}">${esc(s.sub)}</div>` +
      `</div>` +
      `<div class="${styles.boxR}">${esc(s.desc)}</div>` +
      `</div>`;

    // a step's finished, committed markup (pauses leave nothing behind)
    const finalHtml = (s: Step): string => {
      switch (s.k) {
        case "type":
          return line(prompt + esc(s.text));
        case "print":
          return s.lines.map((l) => line(spansHtml(l))).join("");
        case "progress":
          return line(spansHtml(s.done));
        case "out":
          return s.lines.map((l) => line(spansHtml(l))).join("");
        case "box":
          return boxHtml(s, 1, 1);
        case "pause":
          return "";
      }
    };

    // a step mid-flight at local time t (tAbs = global loop time, for blink)
    const partialHtml = (s: Step, t: number, tAbs: number): string => {
      switch (s.k) {
        case "type": {
          const n = Math.max(
            0,
            Math.min(
              s.text.length,
              Math.floor((t - TYPE_LEAD) / TYPE_CHAR + 1e-6),
            ),
          );
          const typing = t >= TYPE_LEAD && n < s.text.length;
          return line(
            prompt + esc(s.text.slice(0, n)) + cursor(typing || blinkOn(tAbs)),
          );
        }
        case "print": {
          const n = Math.min(
            s.lines.length,
            Math.floor(t / PRINT_STAG + 1e-6) + 1,
          );
          return s.lines
            .slice(0, n)
            .map((l) => line(spansHtml(l)))
            .join("");
        }
        case "progress":
          return t < s.dur
            ? progressLine(s.label, Math.min(1, t / s.dur))
            : line(spansHtml(s.done));
        case "out": {
          const n = Math.min(s.lines.length, Math.floor(t / OUT_STAG) + 1);
          return s.lines
            .slice(0, n)
            .map((l) => line(spansHtml(l)))
            .join("");
        }
        case "box": {
          const p = Math.min(1, t / BOX_DUR);
          return boxHtml(s, p, 1 - Math.pow(1 - p, 3));
        }
        case "pause":
          // idle prompt with a blinking cursor — the "ready" beat
          return line(prompt + cursor(blinkOn(tAbs)));
      }
    };

    // committed markup per segment, built once
    const segFinal = COMPILED.map((seg) =>
      seg.steps.map(({ s }) => finalHtml(s)).join(""),
    );

    const renderSegment = (idx: number, t: number, tAbs: number) => {
      let html = "";
      for (const { s, start, dur } of COMPILED[idx].steps) {
        if (t >= start + dur) html += finalHtml(s);
        else if (t >= start) html += partialHtml(s, t - start, tAbs);
      }
      return html;
    };

    let lastHtml = "";
    let lastSeg = -1;
    const paint = (t: number) => {
      let seg = 0;
      while (seg < OFFSETS.length - 1 && t >= OFFSETS[seg + 1]) seg++;
      const html =
        segFinal.slice(0, seg).join("") +
        renderSegment(seg, t - OFFSETS[seg], t);
      if (seg !== lastSeg) {
        root.dataset.seg = String(seg);
        lastSeg = seg;
      }
      if (html !== lastHtml) {
        term.innerHTML = html;
        term.scrollTop = term.scrollHeight;
        lastHtml = html;
      }
    };

    // reduced motion → one static completed frame (first segment), no loop
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.seg = "0";
      term.innerHTML = segFinal[0];
      term.scrollTop = term.scrollHeight;
      return;
    }

    let paused = true;
    let tAccum = 0;
    let lastNow = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      if (!paused) {
        // clamp so a background-tab gap doesn't lurch the loop forward
        const dt = Math.min((now - lastNow) / 1000, 0.1);
        tAccum = (tAccum + dt) % TOTAL;
        paint(tAccum);
      }
      lastNow = now;
      raf = requestAnimationFrame(frame);
    };

    paint(0);

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis && paused) lastNow = performance.now();
        paused = !vis;
      },
      { threshold: 0.05 },
    );
    io.observe(root);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.win}
      data-seg="0"
      role="img"
      aria-label="Terminal demo: the same Jac language importing numpy from PyPI, react from npm, and compiling to a native C-ABI binary."
    >
      <div className={styles.chrome}>
        <div className={styles.lights} aria-hidden="true">
          <i className={styles.light} />
          <i className={styles.light} />
          <i className={styles.light} />
        </div>
        <div className={styles.title}>jac · one language · three targets</div>
        {/* segment position — the active target lights up orange via
            .win[data-seg] as the loop advances */}
        <div className={styles.chips} aria-hidden="true">
          <span className={styles.chip}>PyPI</span>
          <span className={styles.chip}>npm</span>
          <span className={styles.chip}>C-ABI</span>
        </div>
      </div>
      <div ref={termRef} className={styles.term} aria-hidden="true" />
    </div>
  );
}
