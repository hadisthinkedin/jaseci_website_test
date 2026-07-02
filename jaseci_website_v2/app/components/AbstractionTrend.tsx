import styles from "./AbstractionTrend.module.css";

/* ───────────────────────────────────────────────
   Abstraction trendline (hero visual). Assembly →
   Fortran → C → C++ → Java → Python → JS/TS, each
   generation plotted by how much it raised
   abstraction. Fortran, C++ and JS/TS sit flat (no
   real gain), so they recede to small muted dots
   between the milestones — then Jac: the leap, in
   orange.

   Structure: an HTML header row (mono eyebrow title
   + the "1940s → NOW" span, matching the site's
   label convention) above the SVG plot. The figure
   furniture (hairline frame, dotted tier gridlines,
   axis ticks, hatched areas, in-plot legend, era
   labels and the "≈ 50 years" dimension line)
   carries the same story as the copy: fifty years
   of incremental steps, one leap.

   Pure CSS animation, no client JS: draw-in on
   load, then an infinite radar pulse on the Jac
   node. Honours prefers-reduced-motion (renders
   the final frame, pulse off).
   ─────────────────────────────────────────────── */

type Tier = "primary" | "muted" | "accent";

const NODES: {
  id: string;
  label: string;
  era: string;
  x: number;
  y: number;
  tier: Tier;
}[] = [
  { id: "asm", label: "Assembly", era: "1940s", x: 96, y: 457, tier: "primary" },
  { id: "fortran", label: "Fortran", era: "1950s", x: 176, y: 457, tier: "muted" },
  { id: "c", label: "C", era: "1970s", x: 256, y: 375, tier: "primary" },
  { id: "cpp", label: "C++", era: "1980s", x: 336, y: 375, tier: "muted" },
  { id: "java", label: "Java", era: "1990s", x: 416, y: 302, tier: "primary" },
  { id: "py", label: "Python", era: "1990s", x: 496, y: 229, tier: "primary" },
  { id: "jsts", label: "JS/TS", era: "1990s", x: 576, y: 229, tier: "muted" },
  { id: "jac", label: "Jac", era: "NOW", x: 656, y: 91, tier: "accent" },
];

// named abstraction tiers — one per plateau in the staircase
const LEVELS: { label: string; y: number; accent?: boolean }[] = [
  { label: "MACHINE", y: 457 },
  { label: "SYSTEMS", y: 375 },
  { label: "MANAGED", y: 302 },
  { label: "DYNAMIC", y: 229 },
  { label: "AI-NATIVE", y: 91, accent: true },
];

const FRAME = { x: 72, y: 40, w: 612, h: 472 };
const BASE_Y = FRAME.y + FRAME.h; // 512

// step ladder through the legacy languages, then the tall final leap to Jac
const LEGACY = "M96 457 H256 V375 H416 V302 H496 V229 H576";
const LEAP = "M576 229 H656 V91";

// hatched areas under the staircase and under the leap run
const LEGACY_AREA =
  "M96 512 V457 H256 V375 H416 V302 H496 V229 H576 V512 Z";
const LEAP_AREA = "M576 512 V229 H656 V512 Z";

const RADIUS: Record<Tier, number> = { primary: 6.5, muted: 4.5, accent: 9 };

export default function AbstractionTrend() {
  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label="Chart: programming-language abstraction rising over fifty years — Assembly, Fortran, C, C++, Java, Python and JS/TS climb from machine level to dynamic — then the leap to Jac, AI-native."
    >
      {/* header row — same mono eyebrow treatment as the rest of the site */}
      <div className={styles.figHead}>
        <span className={styles.figTitle}>
          ABSTRACTION PER LANGUAGE GENERATION
        </span>
        <span className={styles.figMeta}>1940s → NOW</span>
      </div>

      <svg
        className={styles.svg}
        viewBox="-20 32 740 576"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="at-hatch-fg"
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <line className={styles.hatchLine} x1={0} y1={0} x2={0} y2={7} />
          </pattern>
          <pattern
            id="at-hatch-accent"
            patternUnits="userSpaceOnUse"
            width="7"
            height="7"
            patternTransform="rotate(45)"
          >
            <line
              className={styles.hatchLineAccent}
              x1={0}
              y1={0}
              x2={0}
              y2={7}
            />
          </pattern>
        </defs>

        {/* hatched areas — fifty years of gains, then the leap zone */}
        <path className={styles.hatchLegacy} d={LEGACY_AREA} fill="url(#at-hatch-fg)" />
        <path className={styles.hatchLeap} d={LEAP_AREA} fill="url(#at-hatch-accent)" />

        {/* dotted tier gridlines + named abstraction levels */}
        {LEVELS.map((l, i) => (
          <line
            key={`grid-${l.label}`}
            className={l.accent ? styles.gridlineAccent : styles.gridline}
            x1={FRAME.x}
            y1={l.y}
            x2={FRAME.x + FRAME.w}
            y2={l.y}
            style={{ animationDelay: l.accent ? "1.9s" : `${0.3 + i * 0.1}s` }}
          />
        ))}
        {LEVELS.map((l, i) => (
          <text
            key={`lvl-${l.label}`}
            className={`${styles.levelLabel} ${
              l.accent ? styles.levelLabelAccent : ""
            }`}
            x={FRAME.x - 12}
            y={l.y + 3.5}
            textAnchor="end"
            style={{ animationDelay: l.accent ? "2s" : `${0.4 + i * 0.1}s` }}
          >
            {l.label}
          </text>
        ))}

        {/* hairline plot frame + axis ticks */}
        <rect
          className={styles.frame}
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
          pathLength={1}
        />
        {LEVELS.map((l) => (
          <line
            key={`ytick-${l.label}`}
            className={l.accent ? styles.tickAccent : styles.tick}
            x1={FRAME.x - 6}
            y1={l.y}
            x2={FRAME.x}
            y2={l.y}
          />
        ))}
        {NODES.map((n) => (
          <line
            key={`xtick-${n.id}`}
            className={n.tier === "accent" ? styles.tickAccent : styles.tick}
            x1={n.x}
            y1={BASE_Y}
            x2={n.x}
            y2={BASE_Y + 6}
          />
        ))}

        {/* in-plot legend — decodes the node tiers, fills the empty upper-left */}
        <g className={styles.legend}>
          <circle className={styles.legendDotPrimary} cx={102} cy={119} r={5.5} />
          <text className={styles.legendText} x={117} y={123}>
            RAISED ABSTRACTION
          </text>
          <circle className={styles.legendDotMuted} cx={102} cy={141} r={4.5} />
          <text className={styles.legendText} x={117} y={145}>
            NO REAL GAIN
          </text>
        </g>

        {/* one faint guide grounding the leap to Jac */}
        <line className={styles.guide} x1={656} y1={BASE_Y} x2={656} y2={91} />

        {/* the trend — legacy ladder, then the leap */}
        <path className={styles.legacy} d={LEGACY} pathLength={1} />
        <path className={styles.leap} d={LEAP} pathLength={1} />

        {/* emphasis ring + infinite radar pulse + annotation on Jac;
            the label is right-aligned to the frame edge so its tracking
            doesn't spill past the plot */}
        <circle className={styles.halo} cx={656} cy={91} r={16.5} />
        <circle className={styles.pulse} cx={656} cy={91} r={11} />
        <text className={styles.annotation} x={678} y={63} textAnchor="end">
          THE LEAP
        </text>

        {/* nodes */}
        {NODES.map((n, i) => (
          <circle
            key={n.id}
            className={`${styles.node} ${
              n.tier === "accent"
                ? styles.nodeAccent
                : n.tier === "muted"
                  ? styles.nodeMuted
                  : styles.nodePrimary
            }`}
            cx={n.x}
            cy={n.y}
            r={RADIUS[n.tier]}
            style={{
              animationDelay:
                n.tier === "accent" ? "2s" : `${0.5 + i * 0.14}s`,
            }}
          />
        ))}

        {/* x-axis labels + eras */}
        {NODES.map((n, i) => (
          <text
            key={n.id}
            className={`${styles.xlabel} ${
              n.tier === "accent"
                ? styles.xlabelAccent
                : n.tier === "muted"
                  ? styles.xlabelMuted
                  : styles.xlabelPrimary
            }`}
            x={n.x}
            y={BASE_Y + 26}
            textAnchor="middle"
            style={{
              animationDelay:
                n.tier === "accent" ? "2.15s" : `${0.6 + i * 0.14}s`,
            }}
          >
            {n.label}
          </text>
        ))}
        {NODES.map((n, i) => (
          <text
            key={`era-${n.id}`}
            className={`${styles.eraLabel} ${
              n.tier === "accent" ? styles.eraLabelAccent : ""
            }`}
            x={n.x}
            y={BASE_Y + 45}
            textAnchor="middle"
            style={{
              animationDelay:
                n.tier === "accent" ? "2.3s" : `${0.7 + i * 0.14}s`,
            }}
          >
            {n.era}
          </text>
        ))}

        {/* dimension line — the fifty years the staircase took, drawn L→R */}
        <g className={styles.dimension}>
          <text className={styles.dimText} x={336} y={574} textAnchor="middle">
            ≈ 50 YEARS OF INCREMENTAL STEPS
          </text>
          <line
            className={styles.dimRule}
            x1={96}
            y1={584}
            x2={576}
            y2={584}
            pathLength={1}
          />
          <line className={styles.dimLine} x1={96} y1={579} x2={96} y2={589} />
          <line
            className={`${styles.dimLine} ${styles.dimLineEnd}`}
            x1={576}
            y1={579}
            x2={576}
            y2={589}
          />
        </g>
      </svg>
    </div>
  );
}
