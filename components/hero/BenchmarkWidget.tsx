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
import LiquidGradient from "../code-compare/LiquidGradient";

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

// Real numbers from the 20-game chess benchmark. Widths are
// proportional to wall time with the slowest row at 100%.
// (C++ reference is intentionally omitted.)
const ROWS: BarRow[] = [
  { name: "Jac",    version: "AOT, run only", pct: 35,  time: "2.313 s", variant: "accent" },
  { name: "Python", version: "chess.py",      pct: 100, time: "6.584 s", variant: "gray"   },
];

const BENCHMARK_URL =
  "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/chess";

export default function BenchmarkWidget() {
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
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
      <LiquidGradient active={hover} />
      <h3 className="benchmark__title">End-to-End Wall-Clock Metrics</h3>

      <figure
        ref={cardRef}
        className="benchmark__card"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="benchmark__chart">
          {ROWS.map((row, idx) => (
            <Row key={row.name} row={row} idx={idx} inView={inView} />
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          <a
            href={BENCHMARK_URL}
            className="hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            View benchmark →
          </a>
        </div>
      </figure>
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
