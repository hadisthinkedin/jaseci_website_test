"use client";

import { useState, type CSSProperties } from "react";
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
    headline: "Your application is unstable, relying on so many abstractions",
    body: "When you need to change something on the frontend, you need to change something on the backend (and the middleware). Long term maintenance is easy because everything is done with 13x less files — the same app that takes a Python + React stack 13 files is a single .jac file.",
  },
  {
    headline: "Prompts can be simplified. It should be simplified. Jac makes it simplified.",
    body: "We know the obvious: coders are the ones coding. So we made a typed syntax — by llm() — that compresses your 500 word prompt into a single line of code, and the compiler derives the prompt from the meaning already in your program.",
  },
  {
    headline: "Machine learning was bolted onto Python, Jac was primarily built for artificial intelligence",
    body: "Jac is built today, so that it can acknowledge Artificial Intelligence, Deployments, Cloud Infrastructure, Middleware, everything that came after Python was designed. When it comes to AI, Jac beats Python because the time for Jac was right.",
  },
  {
    headline: "Jac’s Object Spatial Programming is optimized for AI",
    body: "AI agents face three problems OOP is bad at: memory (scattered across databases, arrays, and caches you manually merge), decision flow (state machines and callback chains you maintain separately from the data), and context filtering (hand-picking what’s relevant for the LLM’s token limit). OSP solves all three structurally: the agent’s memory is just nodes in the graph, the decision flow is the graph topology itself (walk an edge instead of writing an if/else), and context is naturally scoped by where the walker currently sits. Traditional apps have fixed logic you know at compile time, but AI agents make runtime decisions about what to do next; OOP forces you to pre-define every path in code, while OSP lets the agent discover paths by traversing a graph that grows and changes as it reasons.",
  },
  {
    headline: "Jac is multiparadigmatic, so it never has to rely on other dependencies",
    body: "AI apps aren’t one problem. They’re several at once, each fitting a different programming style: OOP to model your domain (users, sessions, documents), functional programming for clean data transforms (chaining LLM outputs, filtering lists without side effects), declarative components for UI (what React uses, describing what the interface looks like, not how to update it), and graph-based traversal for agent reasoning (navigating knowledge, making decisions step by step). In a traditional stack, each paradigm means a separate dependency: Python for OOP, LangChain for agent flows, NetworkX for graphs, React for UI, each with its own install, API, version conflicts, and CVEs. Jac gives you all four natively: obj for domain models, pure functions and comprehensions for data pipelines, cl blocks for React-style declarative components, and walkers on graphs for agent logic, all in the same file, same language, zero external dependencies. Fewer dependencies means less to install, less that breaks, fewer CVEs to patch, and fewer abstractions fighting each other.",
  },
];

export default function ManifestoAccordion({
  items = ITEMS,
  variant = "default",
}: {
  items?: { headline: string; body: string }[];
  // "tower" pairs the accordion with the BlockTower beside it: each claim
  // becomes a 3D block and the stack widens as it descends.
  variant?: "default" | "tower";
}) {
  // single-open accordion: opening one box collapses whichever was open
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <div
      className={`${styles.list} ${variant === "tower" ? styles.tower : ""}`}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            className={styles.box}
            key={i}
            data-open={isOpen}
            // index + count drive the per-block width ramp in the tower variant
            style={{ "--i": i, "--n": items.length } as CSSProperties}
          >
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
