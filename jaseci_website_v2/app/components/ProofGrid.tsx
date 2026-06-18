import styles from "./ProofGrid.module.css";

/* ───────────────────────────────────────────────
   PROOF — static frame.
   The proof receipts, organized into one neat
   bordered frame (three hairline-divided columns).
   No reveal, no grid, no glow. Pure server
   component — no client JS.
   ─────────────────────────────────────────────── */

const LOGOS = [
  { src: "/logos/nvidia.svg", label: "NVIDIA" },
  {
    src: "/logos/nsf.svg",
    label: "U.S. National Science Foundation",
  },
  {
    src: "/logos/umich.svg",
    label: "University of Michigan",
  },
];

export default function ProofGrid() {
  return (
    <section className={styles.frame} aria-label="Proof — organized">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div className={styles.eyebrow}>Proof</div>
          <h2 className={styles.headline}>
            Backed by the names you already trust.
          </h2>
        </header>

        <div className={styles.grid}>
          {/* 01 — Enterprise */}
          <article className={styles.col}>
            <div className={styles.colNum}>01</div>
            <div className={styles.colLabel}>Enterprise-backed</div>
            <h3 className={styles.colTitle}>Already shipping in production.</h3>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>73%</span>
                <span className={styles.statLabel}>
                  More members completing a financial plan
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>3×</span>
                <span className={styles.statLabel}>
                  Higher cross-sell conversion for partners
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>&lt;3 min</span>
                <span className={styles.statLabel}>
                  To move a member&rsquo;s money forward
                </span>
              </div>
            </div>

            <blockquote className={styles.quote}>
              &ldquo;Pocketnest turned passive account-holders into engaged
              members chasing real financial goals.&rdquo;
              <cite>Jordan Avery — Pocketnest</cite>
            </blockquote>

            <a href="#cases" className={styles.foot}>
              Read the case study →
            </a>
          </article>

          {/* 02 — Company */}
          <article className={styles.col}>
            <div className={styles.colNum}>02</div>
            <div className={styles.colLabel}>Company-backed</div>
            <h3 className={styles.colTitle}>NVIDIA. The NSF. Michigan.</h3>

            <div className={styles.logos}>
              {LOGOS.map((l) => (
                <div className={styles.logoCell} key={l.src}>
                  <span
                    className={styles.logoMark}
                    role="img"
                    aria-label={l.label}
                    style={{ backgroundImage: `url(${l.src})` }}
                  />
                </div>
              ))}
            </div>
          </article>

          {/* 03 — Research */}
          <article className={styles.col}>
            <div className={styles.colNum}>03</div>
            <div className={styles.colLabel}>Research-backed</div>
            <h3 className={styles.colTitle}>Peer-reviewed. Not vibe-coded.</h3>

            <div className={styles.papers}>
              <a
                className={styles.paper}
                href="https://arxiv.org/abs/2503.15812"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.paperKey}>OSP</span>
                <span className={styles.paperMeta}>
                  <span className={styles.paperTitle}>
                    Object-Spatial Programming
                  </span>
                  <span className={styles.paperVenue}>
                    arXiv:2503.15812 · cs.PL
                  </span>
                </span>
                <span className={styles.paperArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
              <a
                className={styles.paper}
                href="https://arxiv.org/abs/2405.08965"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.paperKey}>byLLM</span>
                <span className={styles.paperMeta}>
                  <span className={styles.paperTitle}>
                    MTP: A Meaning-Typed Language Abstraction
                  </span>
                  <span className={styles.paperVenue}>
                    OOPSLA 2025 · arXiv:2405.08965
                  </span>
                </span>
                <span className={styles.paperArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>

            <a
              href="https://jaseci.engin.umich.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.foot}
            >
              All the research →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
