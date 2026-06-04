"use client";

/* "Build with Jac" section — pulls projects from jaseci-labs/jacpacks.
   Shows 3 cards by default; a "Show more" button reveals the rest.
   Each card has a custom SVG thumbnail drawn in the existing
   architectural white-on-dark style. */

import { useState } from "react";

type Card = {
  slug: string;
  brand: string;
  headline: string;
  description: string;
  href: string;
  Glyph: () => React.JSX.Element;
  Diagram: () => React.JSX.Element;
};

const REPO_BASE = "https://github.com/jaseci-labs/jacpacks/tree/main";

const CARDS: Card[] = [
  {
    slug: "jac-playground",
    brand: "jac-playground",
    headline: "Run Jac in the browser.",
    description:
      "Interactive code editor and runner — entirely client-side via WebAssembly and Pyodide.",
    href: `${REPO_BASE}/jac-playground`,
    Glyph: GlyphPlay,
    Diagram: DiagramPlayground,
  },
  {
    slug: "jac-gpt",
    brand: "jac-gpt",
    headline: "A docs assistant for Jac.",
    description:
      "Fullstack Jac app that answers questions about the language and its standard library.",
    href: `${REPO_BASE}/jac-gpt`,
    Glyph: GlyphChat,
    Diagram: DiagramGpt,
  },
  {
    slug: "ai-study-helper",
    brand: "AI_Study_Helper",
    headline: "Notes in, study material out.",
    description:
      "Multi-agent study companion that turns raw text into structured flashcards and summaries.",
    href: `${REPO_BASE}/AI_Study_Helper`,
    Glyph: GlyphBook,
    Diagram: DiagramStudy,
  },
  {
    slug: "algo",
    brand: "Algo",
    headline: "Voice-first personal assistant.",
    description:
      "Speak to your calendar, email, and GitHub — Jac walkers handle the tool routing.",
    href: `${REPO_BASE}/Algo`,
    Glyph: GlyphMic,
    Diagram: DiagramAlgo,
  },
  {
    slug: "multi-user-todo-app",
    brand: "multi-user-todo-app",
    headline: "Auth + nested todos in one file.",
    description:
      "Hierarchical sub-todos and per-user priorities, served from a single Jac graph.",
    href: `${REPO_BASE}/multi-user-todo-app`,
    Glyph: GlyphCheck,
    Diagram: DiagramTodo,
  },
  {
    slug: "multi-user-todo-meals-app",
    brand: "multi-user-todo-meals-app",
    headline: "Todos that plan your meals.",
    description:
      "Adds a Claude-powered meal planner with shopping lists, costs, and nutrition.",
    href: `${REPO_BASE}/multi-user-todo-meals-app`,
    Glyph: GlyphPlate,
    Diagram: DiagramMeals,
  },
];

const INITIAL_COUNT = 3;
const REPO_URL = "https://github.com/jaseci-labs/jacpacks";

export default function Ecosystem() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? CARDS : CARDS.slice(0, INITIAL_COUNT);
  const hiddenCount = CARDS.length - INITIAL_COUNT;

  return (
    <section className="eco" aria-label="Build with the Jac framework family">
      <header className="eco__header">
        <h2 className="eco__title">
          Build with the
          <br />
          Jac framework family
        </h2>
        <p className="eco__lede">
          Real apps from the jacpacks registry — full source, ready to scaffold
          with <code className="eco__lede-code">jac create</code>.
        </p>
      </header>

      <div className="eco__grid">
        {visible.map(({ slug, brand, headline, description, href, Glyph, Diagram }) => (
          <article key={slug} className="eco__card">
            <a
              className="eco__diagram"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${brand} on GitHub`}
            >
              <Diagram />
            </a>
            <div className="eco__brand">
              <span className="eco__glyph" aria-hidden="true">
                <Glyph />
              </span>
              <span className="eco__wordmark">{brand}</span>
            </div>
            <h3 className="eco__cardline">{headline}</h3>
            <p className="eco__carddesc">{description}</p>
            <a
              className="eco__explore"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Explore {brand}</span>
              <span className="eco__explore-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          </article>
        ))}
      </div>

      <div className="eco__actions">
        {hiddenCount > 0 && (
          <button
            type="button"
            className="eco__showmore"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : `Show ${hiddenCount} more`}
          </button>
        )}

        <a
          className="eco__all"
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>All packs on github</span>
          <span className="eco__explore-arrow" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </a>
      </div>
    </section>
  );
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.9852 4L12 10.7704H10.9314V6.60741L10.9462 5.80741L4.74211 12L4 11.2444L10.2041 5.03704L9.47681 5.05185L5.21707 5.05185V4L11.9852 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ───────── Brand glyphs ───────── */

function GlyphPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10 9 L15 12 L10 15 Z" fill="currentColor" />
    </svg>
  );
}

function GlyphChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6 h12 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-6 l-4 3 v-3 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2 Z" />
    </svg>
  );
}

function GlyphBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5 a2 2 0 0 1 2 -2 h12 v16 H6 a2 2 0 0 1 -2 -2 Z" />
      <path d="M8 7 h8 M8 11 h6" />
    </svg>
  );
}

function GlyphMic() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 12 a6 6 0 0 0 12 0 M12 18 v3" />
    </svg>
  );
}

function GlyphCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 12 L11 15 L16 9" />
    </svg>
  );
}

function GlyphPlate() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

/* ───────── Card diagrams (white on dark) ───────── */

const NODE_STYLE = {
  fill: "rgba(255,255,255,0.04)",
  stroke: "rgba(255,255,255,0.85)",
  strokeWidth: 1.2,
  rx: 4,
} as const;

const LABEL_STYLE: React.SVGAttributes<SVGTextElement> = {
  fill: "rgba(255,255,255,0.92)",
  fontFamily: "var(--font-code, monospace)",
  fontSize: 10,
  textAnchor: "middle",
  dominantBaseline: "middle",
};

function Node({
  x,
  y,
  w = 72,
  h = 26,
  label,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} {...NODE_STYLE} />
      <text x={x + w / 2} y={y + h / 2 + 0.5} {...LABEL_STYLE}>
        {label}
      </text>
    </g>
  );
}

const LINK_STYLE = {
  stroke: "rgba(255,255,255,0.7)",
  strokeWidth: 1.2,
  fill: "none",
  markerEnd: "url(#eco-arrow)",
} as const;

const LINK_DASHED = {
  ...LINK_STYLE,
  strokeDasharray: "3 3",
} as const;

function Arrowhead() {
  return (
    <defs>
      <marker
        id="eco-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.8)" />
      </marker>
    </defs>
  );
}

/* Editor window with a play triangle — jac-playground. */
function DiagramPlayground() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x={28} y={28} width={264} height={124} {...NODE_STYLE} rx={6} />
      {/* Window traffic dots */}
      <circle cx={44} cy={42} r={3} fill="rgba(255,255,255,0.6)" />
      <circle cx={56} cy={42} r={3} fill="rgba(255,255,255,0.4)" />
      <circle cx={68} cy={42} r={3} fill="rgba(255,255,255,0.3)" />
      {/* Mock code lines */}
      <line x1={44} y1={66} x2={196} y2={66} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      <line x1={44} y1={82} x2={156} y2={82} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      <line x1={44} y1={98} x2={184} y2={98} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      <line x1={44} y1={114} x2={120} y2={114} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      <line x1={44} y1={130} x2={172} y2={130} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2} />
      {/* Play button */}
      <circle cx={252} cy={98} r={22} {...NODE_STYLE} />
      <path d="M246 90 L246 106 L260 98 Z" fill="rgba(255,255,255,0.92)" />
    </svg>
  );
}

/* Chat exchange — jac-gpt docs assistant. */
function DiagramGpt() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      {/* User bubble */}
      <path d="M28 36 h130 a6 6 0 0 1 6 6 v22 a6 6 0 0 1 -6 6 h-110 l-12 10 v-10 a6 6 0 0 1 -8 -6 v-22 a6 6 0 0 1 0 -6 Z" {...NODE_STYLE} />
      <text x={92} y={55} {...LABEL_STYLE}>how do walkers work?</text>
      {/* Assistant bubble */}
      <path d="M298 100 h-140 a6 6 0 0 0 -6 6 v22 a6 6 0 0 0 6 6 h120 l12 10 v-10 a6 6 0 0 0 8 -6 v-22 a6 6 0 0 0 0 -6 Z" {...NODE_STYLE} />
      <text x={228} y={119} {...LABEL_STYLE}>walkers traverse the graph...</text>
      <path d="M160 80 L160 100" {...LINK_DASHED} />
    </svg>
  );
}

/* Notes → agents → flashcards — AI_Study_Helper. */
function DiagramStudy() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      <Node x={20} y={36} w={64} h={26} label="notes" />
      <Node x={20} y={118} w={64} h={26} label="syllabus" />
      <Node x={128} y={77} w={64} h={26} label="agents" />
      <Node x={236} y={36} w={64} h={26} label="cards" />
      <Node x={236} y={118} w={64} h={26} label="summary" />
      <path d="M84 49 L128 88" {...LINK_STYLE} />
      <path d="M84 131 L128 96" {...LINK_STYLE} />
      <path d="M192 88 L236 49" {...LINK_STYLE} />
      <path d="M192 92 L236 131" {...LINK_STYLE} />
    </svg>
  );
}

/* Voice in, integrations out — Algo. */
function DiagramAlgo() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      {/* Waveform */}
      <g stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} strokeLinecap="round">
        <line x1={28} y1={90} x2={28} y2={90} />
        <line x1={38} y1={78} x2={38} y2={102} />
        <line x1={48} y1={62} x2={48} y2={118} />
        <line x1={58} y1={74} x2={58} y2={106} />
        <line x1={68} y1={50} x2={68} y2={130} />
        <line x1={78} y1={70} x2={78} y2={110} />
        <line x1={88} y1={82} x2={88} y2={98} />
      </g>
      <Node x={120} y={77} w={72} h={26} label="walker" />
      <Node x={232} y={20} w={72} h={26} label="calendar" />
      <Node x={232} y={77} w={72} h={26} label="email" />
      <Node x={232} y={134} w={72} h={26} label="github" />
      <path d="M100 90 L120 90" {...LINK_STYLE} />
      <path d="M192 88 L232 33" {...LINK_STYLE} />
      <path d="M192 90 L232 90" {...LINK_STYLE} />
      <path d="M192 92 L232 147" {...LINK_STYLE} />
    </svg>
  );
}

/* User → checklist with sub-items — multi-user-todo-app. */
function DiagramTodo() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      <Node x={24} y={77} w={64} h={26} label="user" />
      <Node x={132} y={24} w={88} h={22} label="todo · high" />
      <Node x={132} y={56} w={88} h={22} label="todo · low" />
      <Node x={232} y={56} w={64} h={22} label="sub" />
      <Node x={132} y={88} w={88} h={22} label="todo · med" />
      <Node x={232} y={88} w={64} h={22} label="sub" />
      <Node x={232} y={120} w={64} h={22} label="sub" />
      <Node x={132} y={120} w={88} h={22} label="todo · low" />
      <path d="M88 87 L132 35" {...LINK_STYLE} />
      <path d="M88 89 L132 67" {...LINK_STYLE} />
      <path d="M88 91 L132 99" {...LINK_STYLE} />
      <path d="M88 93 L132 131" {...LINK_STYLE} />
      <path d="M220 67 L232 67" {...LINK_STYLE} />
      <path d="M220 99 L232 99" {...LINK_STYLE} />
      <path d="M220 131 L232 131" {...LINK_STYLE} />
    </svg>
  );
}

/* Todos + meal planner branch — multi-user-todo-meals-app. */
function DiagramMeals() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      <Node x={20} y={77} w={64} h={26} label="user" />
      <Node x={124} y={36} w={72} h={26} label="todos" />
      <Node x={124} y={120} w={72} h={26} label="meals" />
      <Node x={236} y={20} w={64} h={22} label="task" />
      <Node x={236} y={52} w={64} h={22} label="task" />
      <Node x={236} y={104} w={64} h={22} label="shop" />
      <Node x={236} y={136} w={64} h={22} label="nutri" />
      <path d="M84 87 L124 49" {...LINK_STYLE} />
      <path d="M84 93 L124 133" {...LINK_STYLE} />
      <path d="M196 42 L236 31" {...LINK_STYLE} />
      <path d="M196 46 L236 63" {...LINK_STYLE} />
      <path d="M196 130 L236 115" {...LINK_STYLE} />
      <path d="M196 134 L236 147" {...LINK_STYLE} />
      {/* "by llm" hint along the meals branch */}
      <text x={160} y={86} fill="rgba(255,255,255,0.55)" fontFamily="var(--font-code, monospace)" fontSize={9} textAnchor="middle">by llm</text>
    </svg>
  );
}
