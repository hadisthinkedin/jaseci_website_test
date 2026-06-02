"use client";

/**
 * BenchmarkWidget — title + stylized bar chart + link.
 *
 * Honesty note: the bar widths below are an intentionally STYLIZED hero
 * visual. They exaggerate the gaps between backends to tell the speed-ranking
 * story at a glance, but rank order is faithful. No numeric timings are
 * shown anywhere — the real benchmark data is one click away behind the
 * "View benchmark →" link.
 */

import { useEffect, useRef, useState } from "react";

type BarVariant = "accent" | "gray";

type BarRow = {
  name: string;
  /** Stylized width %, not a real measurement. */
  pct: number;
  variant: BarVariant;
};

const ROWS: BarRow[] = [
  { name: "Native binary", pct: 18, variant: "accent" },
  { name: "Jac --autonative", pct: 40, variant: "accent" },
  { name: "Jac chess.na.jac", pct: 44, variant: "accent" },
  { name: "Python", pct: 84, variant: "gray" },
];

const BENCHMARK_URL =
  "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/chess";

export default function BenchmarkWidget() {
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setInView(true);
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="benchmark">
      <h3 className="benchmark__title">End-to-End Wall-Clock Metrics</h3>

      <figure ref={cardRef} className="benchmark__card">
        <div className="benchmark__chart">
          {ROWS.map((row, idx) => (
            <Row key={row.name} row={row} idx={idx} inView={inView} />
          ))}
        </div>
      </figure>

      <a
        className="benchmark__view-link"
        href={BENCHMARK_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        View benchmark →
      </a>
    </section>
  );
}

function Row({
  row,
  idx,
  inView,
}: {
  row: BarRow;
  idx: number;
  inView: boolean;
}) {
  return (
    <>
      <div className="benchmark__row-label" aria-hidden="true">
        {row.name}
      </div>
      <div className="benchmark__row-track" aria-hidden="true">
        <div
          className={`benchmark__row-bar benchmark__row-bar--${row.variant}`}
          style={{
            width: inView ? `${row.pct}%` : "0%",
            transitionDelay: `${idx * 60}ms`,
          }}
        />
      </div>
    </>
  );
}
