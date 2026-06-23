import type { CSSProperties } from "react";
import styles from "./ProofGrid.module.css";
import CaseStudyCarousel from "./CaseStudyCarousel";

/* ───────────────────────────────────────────────
   PROOF — card grid (per layout sketch).
   Top zone: a narrow stack of backer logos beside a
   wide enterprise case-study marquee (Pocketnest).
   Bottom zone: two research-paper cards side by side.
   Separate bordered cards on white, hairline borders,
   orange accent — no frame, no glow, no gradients.
   Pure server component — no client JS.
   ─────────────────────────────────────────────── */

// Logos render B&W and pop to their real brand colors on hover. umich + nsf
// already carry real color, so a grayscale filter that lifts on hover does it.
// nvidia.svg is a single black wordmark with no colour of its own, so it's drawn
// as a CSS mask and tinted NVIDIA green (#76b900) on hover instead.
const LOGOS = [
  { src: "/logos/nvidia.svg", label: "NVIDIA", brand: "#76b900" },
  { src: "/logos/umich.svg", label: "University of Michigan" },
  { src: "/logos/nsf.svg", label: "U.S. National Science Foundation" },
];

const PAPERS = [
  {
    key: "OSP",
    title: "Object-Spatial Programming",
    venue: "arXiv:2503.15812 · cs.PL",
    href: "https://arxiv.org/abs/2503.15812",
  },
  {
    key: "byLLM",
    title: "MTP: A Meaning-Typed Language Abstraction",
    venue: "OOPSLA 2025 · arXiv:2405.08965",
    href: "https://arxiv.org/abs/2405.08965",
  },
];

export default function ProofGrid() {
  return (
    <section className={styles.frame} aria-label="Proof">
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.headline}>
            Backed by the names you already trust.
          </h2>
        </header>

        <div className={styles.layout}>
          {/* ── Top zone: logo stack + enterprise marquee ── */}
          <div className={styles.topRow}>
            {/* 02 — Company-backed: backer logos */}
            <div className={styles.logoCol} aria-label="Company-backed">
              <div className={styles.logoStack}>
                {LOGOS.map((l) => (
                  <div className={styles.logoCard} key={l.src}>
                    <span
                      className={`${styles.logoMark} ${
                        l.brand ? styles.logoMarkMask : styles.logoMarkImg
                      }`}
                      role="img"
                      aria-label={l.label}
                      style={
                        l.brand
                          ? ({
                              "--logo": `url(${l.src})`,
                              "--brand": l.brand,
                            } as CSSProperties)
                          : { backgroundImage: `url(${l.src})` }
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 01 — Enterprise-backed: case-study carousel */}
            <CaseStudyCarousel />
          </div>

          {/* ── Bottom zone: research papers + "all the research" CTA, one row ── */}
          <div className={styles.bottomRow}>
            {PAPERS.map((p) => (
              <a
                key={p.href}
                className={styles.paper}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.paperKey}>{p.key}</span>
                <span className={styles.paperMeta}>
                  <span className={styles.paperTitle}>{p.title}</span>
                  <span className={styles.paperVenue}>{p.venue}</span>
                </span>
                <span className={styles.paperArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
            <a
              href="https://jaseci.engin.umich.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.researchLink}
            >
              All the research →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
