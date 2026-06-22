import styles from "./ProofGrid.module.css";

/* ───────────────────────────────────────────────
   PROOF — card grid (per layout sketch).
   Top zone: a narrow stack of backer logos beside a
   wide enterprise case-study marquee (Pocketnest).
   Bottom zone: two research-paper cards side by side.
   Separate bordered cards on white, hairline borders,
   orange accent — no frame, no glow, no gradients.
   Pure server component — no client JS.
   ─────────────────────────────────────────────── */

const LOGOS = [
  { src: "/logos/nvidia.svg", label: "NVIDIA" },
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
                      className={styles.logoMark}
                      role="img"
                      aria-label={l.label}
                      style={{ backgroundImage: `url(${l.src})` }}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.colCap}>
                <span className={styles.colCapNum}>02</span> Company-backed
              </div>
            </div>

            {/* 01 — Enterprise-backed: Pocketnest case study */}
            <article className={styles.feature}>
              <div className={styles.featureEyebrow}>
                <span className={styles.featureNum}>01</span> Enterprise-backed
              </div>
              <div className={styles.featureBrand}>Pocketnest</div>
              <p className={styles.featureLede}>
                Already shipping in production.
              </p>

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

              <a href="#cases" className={styles.featureFoot}>
                Read the case study →
              </a>
            </article>
          </div>

          {/* ── Bottom zone: research papers ── */}
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
          </div>

          <div className={styles.researchCap}>
            <div className={styles.colCap}>
              <span className={styles.colCapNum}>03</span> Research-backed
            </div>
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
