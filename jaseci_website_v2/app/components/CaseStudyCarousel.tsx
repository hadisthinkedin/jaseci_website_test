"use client";

import { useState } from "react";
import styles from "./ProofGrid.module.css";

/* ───────────────────────────────────────────────
   Enterprise case-study carousel.
   The "01 · Enterprise-backed" marquee, now a
   carousel: move through partner companies with the
   tabs or the ‹ › arrows. Pocketnest is real; Ally
   and TruSelph use placeholder figures — replace
   `stats`/`quote`/`cite`/`href` with the real ones.
   Client island; drops into ProofGrid's .feature
   grid cell and reuses ProofGrid.module.css.
   ─────────────────────────────────────────────── */

type CaseStudy = {
  brand: string;
  lede: string;
  stats: { num: string; label: string }[];
  quote: string;
  cite: string;
  href: string;
};

const CASES: CaseStudy[] = [
  {
    brand: "Pocketnest",
    lede: "Already shipping in production.",
    stats: [
      { num: "73%", label: "More members completing a financial plan" },
      { num: "3×", label: "Higher cross-sell conversion for partners" },
      { num: "<3 min", label: "To move a member’s money forward" },
    ],
    quote:
      "Pocketnest turned passive account-holders into engaged members chasing real financial goals.",
    cite: "Jordan Avery — Pocketnest",
    href: "#cases",
  },
  {
    brand: "Ally",
    lede: "Scaled to production in weeks.",
    stats: [
      { num: "2.4×", label: "Faster agent responses in support flows" },
      { num: "48%", label: "Fewer escalations to a human agent" },
      { num: "24/7", label: "Autonomous coverage across channels" },
    ],
    quote:
      "We replaced a brittle pipeline of glue code with a single Jac graph our team can actually reason about.",
    cite: "Platform Engineering — Ally",
    href: "#cases",
  },
  {
    brand: "TruSelph",
    lede: "From prototype to live in one sprint.",
    stats: [
      { num: "5×", label: "Faster to build a new agent workflow" },
      { num: "60%", label: "Less code than the previous stack" },
      { num: "0", label: "Third-party orchestration tools needed" },
    ],
    quote:
      "byLLM let us express reasoning in a line where we used to maintain hundreds of lines of prompt plumbing.",
    cite: "Founding Team — TruSelph",
    href: "#cases",
  },
];

export default function CaseStudyCarousel() {
  const [i, setI] = useState(0);
  const c = CASES[i];
  const go = (step: number) =>
    setI((prev) => (prev + step + CASES.length) % CASES.length);

  return (
    <article className={styles.feature} aria-roledescription="carousel">
      <div className={styles.featureTop}>
        <div className={styles.caseNav}>
          <button
            type="button"
            className={styles.caseArrow}
            onClick={() => go(-1)}
            aria-label="Previous case study"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.caseArrow}
            onClick={() => go(1)}
            aria-label="Next case study"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.caseTabs} role="tablist" aria-label="Case studies">
        {CASES.map((cs, n) => (
          <button
            key={cs.brand}
            type="button"
            role="tab"
            aria-selected={n === i}
            className={`${styles.caseTab} ${
              n === i ? styles.caseTabActive : ""
            }`}
            onClick={() => setI(n)}
          >
            {cs.brand}
          </button>
        ))}
      </div>

      <div key={i} className={styles.caseSlide}>
        <div className={styles.featureBrand}>{c.brand}</div>
        <p className={styles.featureLede}>{c.lede}</p>

        <div className={styles.stats}>
          {c.stats.map((s, n) => (
            <div className={styles.stat} key={n}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <blockquote className={styles.quote}>
          {`“${c.quote}”`}
          <cite>{c.cite}</cite>
        </blockquote>
      </div>

      <a href={c.href} className={styles.featureFoot}>
        Read the case study →
      </a>
    </article>
  );
}
