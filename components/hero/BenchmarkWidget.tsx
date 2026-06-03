"use client";

/**
 * BenchmarkWidget — title + row chart + link.
 *
 * Row layout follows the "label + bar + numeric value" pattern from
 * benchmark widgets on similar marketing sites. The widths and timings
 * below are STYLIZED (proportional rank order is faithful; the exact
 * numbers are placeholders for the real chess benchmark linked at the
 * bottom). Swap for real numbers when wiring up to the actual run.
 */

import { useEffect, useRef, useState } from "react";

type BarVariant = "accent" | "gray";

type BarRow = {
  name: string;
  /** Sub-label below the name, e.g. compiler version or runtime tag. */
  version: string;
  /** Stylized width %, proportional to time vs. slowest in the set. */
  pct: number;
  /** Numeric time string shown on the right. */
  time: string;
  variant: BarVariant;
};

const ROWS: BarRow[] = [
  { name: "Native binary",     version: "C++ (gcc -O3)",     pct: 21,  time: "95 ms",   variant: "accent" },
  { name: "Jac --autonative",  version: "jac compile",       pct: 48,  time: "215 ms",  variant: "accent" },
  { name: "Jac chess.na.jac",  version: "jac run",           pct: 53,  time: "240 ms",  variant: "accent" },
  { name: "Python",            version: "CPython 3.12",      pct: 100, time: "450 ms",  variant: "gray"   },
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
      <div className={`benchmark__row-label benchmark__row-label--${row.variant}`} aria-hidden="true">
        <div className="benchmark__row-name">{row.name}</div>
        <div className="benchmark__row-version">{row.version}</div>
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
      <div className={`benchmark__row-time benchmark__row-time--${row.variant}`} aria-hidden="true">
        {row.time}
      </div>
    </>
  );
}
