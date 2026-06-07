import { useEffect, useState } from "react";
import Carousel from "../Carousel.jsx";

// Widths are proportional to wall time, slowest row = 100%. Lower is better.
const BENCHES = [
  {
    title: "End-to-end wall-clock",
    sub: "Chess engine, 20 games.",
    win: "2.8× faster",
    url: "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/chess",
    rows: [
      { name: "Jac", version: "AOT, run only", pct: 35, time: "2.313 s", winner: true },
      { name: "Python", version: "chess.py", pct: 100, time: "6.584 s" },
    ],
  },
  {
    title: "Throughput",
    sub: "Parse and index 1M records.",
    win: "4.5× faster",
    url: "#",
    rows: [
      { name: "Jac", version: "compiled", pct: 22, time: "0.42 s", winner: true },
      { name: "Python", version: "json + loop", pct: 100, time: "1.90 s" },
    ],
  },
  {
    title: "Cold start",
    sub: "Boot to first request.",
    win: "3× faster",
    url: "#",
    rows: [
      { name: "Jac", version: "jac serve", pct: 33, time: "0.21 s", winner: true },
      { name: "Node", version: "express", pct: 100, time: "0.63 s" },
    ],
  },
];

function Card({ title, sub, win, url, rows }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="px-1">
      <div className="border border-black p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            {title}
          </p>
          <p className="text-xl font-bold tracking-tight">{win}</p>
        </div>
        <p className="mt-1 text-sm text-neutral-600">{sub} Lower is better.</p>

        <div className="mt-6 space-y-5">
          {rows.map((row, idx) => (
            <div key={row.name}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold tracking-tight">{row.name}</span>
                  <span className="font-mono text-xs text-neutral-500">{row.version}</span>
                </div>
                <span
                  className={`font-mono text-sm ${row.winner ? "font-bold" : "text-neutral-500"}`}
                >
                  {row.time}
                </span>
              </div>
              <div className="mt-2 h-3.5 w-full border border-black bg-white">
                <div
                  className={`h-full ${row.winner ? "bg-black" : "bg-neutral-300"}`}
                  style={{
                    width: inView ? `${row.pct}%` : "0%",
                    transition: "width 700ms ease-out",
                    transitionDelay: `${idx * 80}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-medium underline"
        >
          View benchmark ↗
        </a>
      </div>
    </div>
  );
}

export default function BenchmarkWidget() {
  return <Carousel slides={BENCHES.map((b) => <Card key={b.title} {...b} />)} interval={4500} />;
}
