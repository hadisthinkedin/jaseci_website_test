"use client";

import { useState } from "react";
import styles from "./ProofGrid.module.css";

/* ───────────────────────────────────────────────
   Enterprise case-study carousel.
   The "01 · Enterprise-backed" marquee, now a
   carousel: move through partner companies with the
   tabs or the ‹ › arrows. Tobu (the default slide)
   is real; Pocketnest, Ally and TruSelph are "Under
   Development" stubs — swap the X placeholders in
   `stats`/`quote`/`cite`/`href` for the real data.
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
    brand: "Tobu",
    lede: "From concept to production-ready in 6 weeks.",
    stats: [
      { num: "$1.5M", label: "Raised so far on the Jaseci-built platform" },
      { num: "92.84%", label: "Retrieval accuracy on real Tobu user data" },
      { num: "2.2×", label: "Fewer missed memories than traditional RAG" },
    ],
    quote:
      "With Jac, the structure of the product stayed close to the structure of the code. A memory was treated not as an isolated record, but as part of a larger network of people, places, stories, and relationships.",
    cite: "From the Tobu case study",
    href: "https://blogs.jaseci.org/blog/posts/tobu-memory-graph-case-study",
  },
  {
    brand: "Pocketnest",
    lede: "Under Development.",
    stats: [
      { num: "X", label: "X" },
      { num: "X", label: "X" },
      { num: "X", label: "X" },
    ],
    quote: "X",
    cite: "X",
    href: "#cases",
  },
  {
    brand: "Ally",
    lede: "Under Development.",
    stats: [
      { num: "X", label: "X" },
      { num: "X", label: "X" },
      { num: "X", label: "X" },
    ],
    quote: "X",
    cite: "X",
    href: "#cases",
  },
  {
    brand: "TrueSelph",
    lede: "Under Development.",
    stats: [
      { num: "X", label: "X" },
      { num: "X", label: "X" },
      { num: "X", label: "X" },
    ],
    quote: "X",
    cite: "X",
    href: "#cases",
  },
];

export default function CaseStudyCarousel() {
  const [i, setI] = useState(0);
  const c = CASES[i];
  const go = (step: number) =>
    setI((prev) => (prev + step + CASES.length) % CASES.length);
  // external case studies (e.g. the Tobu blog post) open in a new tab;
  // placeholder #cases anchors keep navigating in-page
  const external = c.href.startsWith("http");

  return (
    <article className={styles.feature} aria-roledescription="carousel">
      <div className={styles.featureTop}>
        <a
          href={c.href}
          className={styles.featureFoot}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          Read the case study →
        </a>
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
    </article>
  );
}
