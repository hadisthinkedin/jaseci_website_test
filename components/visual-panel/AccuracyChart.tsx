"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import LiquidGradient from "../code-compare/LiquidGradient";

// Placeholder benchmarks — swap for real numbers later. Each carousel
// slide is its own accuracy benchmark on a different dataset; total is
// derived from seriesA + seriesB.
type Benchmark = {
  name: string;
  title: string;
  sub: string;
  seriesA: number;
  seriesB: number;
  trend: string;
  caption: string;
};

const BENCHMARKS: Benchmark[] = [
  {
    name: "MMLU",
    title: "Accuracy Benchmark",
    sub: "MMLU (placeholder)",
    seriesA: 570,
    seriesB: 1260,
    trend: "Trending up by 5.2% this run",
    caption: "Placeholder copy",
  },
  {
    name: "GSM8K",
    title: "Accuracy Benchmark",
    sub: "GSM8K (placeholder)",
    seriesA: 690,
    seriesB: 1040,
    trend: "Trending up by 3.8% this run",
    caption: "Placeholder copy",
  },
  {
    name: "HumanEval",
    title: "Accuracy Benchmark",
    sub: "HumanEval (placeholder)",
    seriesA: 420,
    seriesB: 1420,
    trend: "Trending up by 8.1% this run",
    caption: "Placeholder copy",
  },
];

export default function AccuracyChart() {
  // Mirrors the Hero BenchmarkWidget pattern: bars start at 0 and tween up
  // to their real values when the card enters the snap viewport. Each
  // re-entry replays the animation. Recharts' built-in animation handles
  // the tween between the two states.
  const [inView, setInView] = useState(false);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [amberClip, setAmberClip] = useState<string | undefined>(undefined);
  const cardRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const root = document.querySelector<HTMLElement>(".scroll-root");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setInView(true);
          else setInView(false);
        }
      },
      { root, threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Track the amber bar's SVG path so the LiquidGradient canvas (overlaid
  // exactly on the recharts SVG) can be clipped to that bar's shape. The
  // bar's `d` attribute is recomputed by recharts on data change and during
  // its ~1.2s tween — MutationObserver catches each frame, plus we poll
  // for a short window so the initial mount (recharts renders async, may
  // miss the first attribute set) reliably locks onto the final path.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    let lastD = "";
    const updateClip = () => {
      const bars = chart.querySelectorAll<SVGPathElement>(
        "path.recharts-radial-bar-sector",
      );
      // seriesA is rendered first (orange), seriesB second (amber).
      const amber = bars[1];
      const d = amber?.getAttribute("d");
      if (!d || d === lastD) return;
      lastD = d;
      // recharts emits `d` with embedded newlines/tabs which CSS path()
      // rejects — collapse to single spaces.
      setAmberClip(`path("${d.replace(/\s+/g, " ").trim()}")`);
    };

    let rafId = 0;
    let pollUntil = performance.now() + 1500;
    const poll = () => {
      updateClip();
      if (performance.now() < pollUntil) {
        rafId = requestAnimationFrame(poll);
      } else {
        rafId = 0;
      }
    };
    const kick = () => {
      pollUntil = performance.now() + 200;
      if (!rafId) rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);

    const mo = new MutationObserver(kick);
    mo.observe(chart, {
      subtree: true,
      attributes: true,
      attributeFilter: ["d"],
      childList: true,
    });
    const ro = new ResizeObserver(kick);
    ro.observe(chart);

    return () => {
      mo.disconnect();
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [idx, inView]);

  const current = BENCHMARKS[idx];
  const total = current.seriesA + current.seriesB;
  const data = [
    {
      name: "current",
      seriesA: inView ? current.seriesA : 0,
      seriesB: inView ? current.seriesB : 0,
    },
  ];
  const displayedTotal = inView ? total : 0;

  const prev = () =>
    setIdx((i) => (i - 1 + BENCHMARKS.length) % BENCHMARKS.length);
  const next = () => setIdx((i) => (i + 1) % BENCHMARKS.length);

  return (
    <article
      ref={cardRef}
      className="accuracy"
      aria-label="Accuracy benchmarks"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <header className="accuracy__head">
        <button
          type="button"
          className="accuracy__nav"
          onClick={prev}
          aria-label="Previous benchmark"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <div className="accuracy__head-text">
          <h3 className="accuracy__title">{current.title}</h3>
          <p className="accuracy__sub">{current.sub}</p>
        </div>
        <button
          type="button"
          className="accuracy__nav"
          onClick={next}
          aria-label="Next benchmark"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="accuracy__chart" ref={chartRef}>
        <ResponsiveContainer width="100%" height={360}>
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={125}
            outerRadius={175}
            cy="60%"
          >
            <RadialBar
              dataKey="seriesA"
              stackId="a"
              cornerRadius={5}
              fill="var(--accent)"
              stroke="transparent"
              strokeWidth={2}
              isAnimationActive
              animationDuration={45}
              animationEasing="ease-out"
            />
            <RadialBar
              dataKey="seriesB"
              stackId="a"
              cornerRadius={5}
              fill="#f4a93c"
              stroke="transparent"
              strokeWidth={2}
              isAnimationActive
              animationDuration={45}
              animationEasing="ease-out"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const cx = viewBox.cx ?? 0;
                    const cy = viewBox.cy ?? 0;
                    return (
                      <text x={cx} y={cy} textAnchor="middle">
                        <tspan
                          x={cx}
                          y={cy - 14}
                          className="accuracy__total"
                        >
                          {displayedTotal.toLocaleString()}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 14}
                          className="accuracy__total-sub"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
        <LiquidGradient active={hover} clipPath={amberClip} />
      </div>

      <footer className="accuracy__foot">
        <div className="accuracy__trend">
          {current.trend}
          <TrendingUp className="accuracy__trend-icon" aria-hidden="true" />
        </div>
        <div className="accuracy__caption">{current.caption}</div>
      </footer>

      <div
        className="accuracy__dots"
        role="tablist"
        aria-label="Benchmark slides"
      >
        {BENCHMARKS.map((b, i) => (
          <button
            key={b.name}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Show ${b.name}`}
            className={`accuracy__dot${i === idx ? " accuracy__dot--active" : ""}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </article>
  );
}
