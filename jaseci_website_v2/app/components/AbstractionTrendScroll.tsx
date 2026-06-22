"use client";

import { useEffect, useRef } from "react";
import styles from "./AbstractionTrendScroll.module.css";

/* ───────────────────────────────────────────────
   Scroll-driven abstraction trendline.
   Assembly → C → Java → Python → Jac draws in on
   mount (the lineage + the orange "leap"). Then, as
   the section scrolls through the viewport, a sixth
   point — Jaseci — appears and skyrockets near-
   vertically off the top of the chart. The reveal is
   driven by a single CSS var (--reveal, 0→1) set from
   scroll progress; the graph itself is pinned (sticky)
   by its column so it follows you down as you read.
   ─────────────────────────────────────────────── */

const AXIS_X = 60;
const BASE_Y = 430;

const NODES = [
  { id: "asm", label: "Assembly", x: 95, y: 400 },
  { id: "c", label: "C", x: 180, y: 355 },
  { id: "java", label: "Java", x: 265, y: 305 },
  { id: "py", label: "Python", x: 350, y: 240 },
  { id: "jac", label: "Jac", x: 435, y: 150, accent: true },
];

const JASECI = { x: 510, y: 32 };
const LEGACY = "M95 400 H180 V355 H265 V305 H350 V240"; // asm → c → java → py (steps)
const LEAP = "M350 240 H435 V150"; // py → jac (the leap, a tall step)
const SKYROCKET = "M435 150 C 490 150 512 104 510 32"; // jac → jaseci (hockey-stick)

export default function AbstractionTrendScroll() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (t: number) => t * t * (3 - 2 * t);

    // NOTE: we intentionally do NOT early-return for prefers-reduced-motion —
    // the descent is scroll-linked (not autoplay) and is the whole point of the
    // section. Under reduced motion we just skip the skyrocket's draw-in.
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    // The graph sits in a full-viewport sticky stage inside a tall section. As
    // the section scrolls through, the graph descends the stage (from the top,
    // level with the header, down to ~the bottom, just above the next section's
    // heading) and the Jaseci skyrocket draws in (--reveal). Both are driven by
    // one scroll progress p (0 at the section top, 1 at its bottom).
    const section = wrap.closest("section");

    // apply the descent as a DIRECT inline transform — no CSS-var indirection,
    // so nothing in the cascade can override or fail to read it
    const setTravel = (px: number) => {
      wrap.style.transform = `translateY(${px.toFixed(1)}px)`;
    };

    const compute = () => {
      // Below 900px the layout stacks and the graph isn't pinned — show the
      // finished trend, no travel.
      if (window.innerWidth <= 900 || !section) {
        wrap.style.setProperty("--reveal", "1");
        setTravel(0);
        return;
      }
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - vh; // scroll distance through section
      const p = range > 0 ? clamp01(-rect.top / range) : 0;

      // descend from the top of the sticky stage to ~its bottom, leaving a small
      // gap so the graph only NEARLY touches the next heading
      const maxTravel = Math.max(0, vh - wrap.offsetHeight - 32);
      setTravel(p * maxTravel);

      // skyrocket: shown immediately under reduced motion, otherwise it draws in
      // over the middle stretch of the descent
      wrap.style.setProperty(
        "--reveal",
        reduceMotion ? "1" : smooth(clamp01((p - 0.1) / 0.6)).toFixed(4)
      );
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        compute();
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      role="img"
      aria-label="Abstraction over time, rising through Assembly, C, Java and Python — leaping to Jac, then skyrocketing to Jaseci."
    >
      <svg
        className={styles.svg}
        viewBox="0 0 580 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="skyGrad"
            gradientUnits="userSpaceOnUse"
            x1="435"
            y1="150"
            x2="510"
            y2="32"
          >
            <stop offset="0" stopColor="#ee5a24" />
            <stop offset="0.45" stopColor="#ff2d9b" />
            <stop offset="0.75" stopColor="#8b3bff" />
            <stop offset="1" stopColor="#19e6a0" />
          </linearGradient>
          <radialGradient id="skyGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#c06bff" stopOpacity="0.85" />
            <stop offset="0.45" stopColor="#8b3bff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#19e6a0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* axes */}
        <line
          className={styles.axis}
          x1={AXIS_X}
          y1={36}
          x2={AXIS_X}
          y2={BASE_Y}
        />
        <line
          className={styles.axis}
          x1={AXIS_X}
          y1={BASE_Y}
          x2={560}
          y2={BASE_Y}
        />
        <text
          className={styles.axisLabel}
          transform={`translate(22 ${(36 + BASE_Y) / 2}) rotate(-90)`}
          textAnchor="middle"
        >
          ABSTRACTION ↑
        </text>

        {/* vertical guides for the lineage nodes */}
        {NODES.map((n, i) => (
          <line
            key={n.id}
            className={styles.guide}
            x1={n.x}
            y1={BASE_Y}
            x2={n.x}
            y2={n.y}
            style={{ animationDelay: `${0.3 + i * 0.26}s` }}
          />
        ))}

        {/* the trend — legacy ladder, then the leap (draw in on mount) */}
        <path className={styles.legacy} d={LEGACY} pathLength={1} />
        <path className={styles.leap} d={LEAP} pathLength={1} />

        <text
          className={styles.annotation}
          x={435}
          y={128}
          textAnchor="middle"
          style={{ animationDelay: "1.85s" }}
        >
          THE LEAP
        </text>

        {/* lineage nodes */}
        {NODES.map((n, i) => (
          <circle
            key={n.id}
            className={`${styles.node} ${n.accent ? styles.nodeAccent : ""}`}
            cx={n.x}
            cy={n.y}
            r={n.accent ? 8 : 5.5}
            style={{ animationDelay: `${0.45 + i * 0.26}s` }}
          />
        ))}

        {/* x-axis labels */}
        {NODES.map((n, i) => (
          <text
            key={n.id}
            className={`${styles.xlabel} ${n.accent ? styles.xlabelAccent : ""}`}
            x={n.x}
            y={BASE_Y + 28}
            textAnchor="middle"
            style={{ animationDelay: `${0.55 + i * 0.26}s` }}
          >
            {n.label}
          </text>
        ))}

        {/* ── scroll-revealed: the Jaseci skyrocket ── */}
        <line
          className={styles.jaseciGuide}
          x1={JASECI.x}
          y1={BASE_Y}
          x2={JASECI.x}
          y2={JASECI.y}
        />
        <path
          className={styles.skyrocket}
          d={SKYROCKET}
          pathLength={1}
          stroke="url(#skyGrad)"
        />
        <g className={styles.jaseci}>
          <circle
            className={styles.jaseciRing}
            cx={JASECI.x}
            cy={JASECI.y}
            r="20"
          />
          <circle
            className={styles.jaseciRing}
            cx={JASECI.x}
            cy={JASECI.y}
            r="20"
            style={{ animationDelay: "0.8s" }}
          />
          <circle
            className={styles.jaseciGlow}
            cx={JASECI.x}
            cy={JASECI.y}
            r="58"
            fill="url(#skyGlow)"
          />
          <circle
            className={styles.jaseciCore}
            cx={JASECI.x}
            cy={JASECI.y}
            r="9"
          />
        </g>
        <text
          className={styles.jaseciLabel}
          x={JASECI.x - 26}
          y={JASECI.y + 4}
          textAnchor="end"
        >
          Jaseci
        </text>
        <text
          className={styles.jaseciSub}
          x={JASECI.x - 26}
          y={JASECI.y + 24}
          textAnchor="end"
        >
          the ecosystem era
        </text>
        <text
          className={`${styles.xlabel} ${styles.jaseciXLabel}`}
          x={JASECI.x}
          y={BASE_Y + 28}
          textAnchor="middle"
        >
          Jaseci
        </text>
      </svg>
    </div>
  );
}
