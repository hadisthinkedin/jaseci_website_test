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
  { id: "asm", label: "Assembly", era: "1940s", x: 96, y: 404, tier: "primary" },
  { id: "fortran", label: "Fortran", era: "1950s", x: 176, y: 404, tier: "muted" },
  { id: "c", label: "C", era: "1970s", x: 256, y: 332, tier: "primary" },
  { id: "cpp", label: "C++", era: "1980s", x: 336, y: 332, tier: "muted" },
  { id: "java", label: "Java", era: "1990s", x: 416, y: 268, tier: "primary" },
  { id: "py", label: "Python", era: "1990s", x: 496, y: 204, tier: "primary" },
  { id: "jsts", label: "JS/TS", era: "1990s", x: 576, y: 204, tier: "muted" },
  { id: "jac", label: "Jac", era: "NOW", x: 656, y: 84, tier: "accent" },
];

// named abstraction tiers — one per plateau in the staircase
const LEVELS: { label: string; y: number; accent?: boolean }[] = [
  { label: "MACHINE", y: 404 },
  { label: "SYSTEMS", y: 332 },
  { label: "MANAGED", y: 268 },
  { label: "DYNAMIC", y: 204 },
  { label: "AI-NATIVE", y: 84, accent: true },
];

const FRAME = { x: 72, y: 40, w: 612, h: 412 };
const BASE_Y = FRAME.y + FRAME.h; // 452

// step ladder through the legacy languages, then the tall final leap to Jac
const LEGACY = "M96 404 H256 V332 H416 V268 H496 V204 H576";
const LEAP = "M576 204 H656 V84";

// hatched areas under the staircase and under the leap run
const LEGACY_AREA =
  "M96 452 V404 H256 V332 H416 V268 H496 V204 H576 V452 Z";
const LEAP_AREA = "M576 452 V204 H656 V452 Z";

const RADIUS: Record<Tier, number> = { primary: 6, muted: 4, accent: 8 };

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
        viewBox="-20 32 740 516"
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
          <circle className={styles.legendDotPrimary} cx={102} cy={112} r={5} />
          <text className={styles.legendText} x={116} y={116}>
            RAISED ABSTRACTION
          </text>
          <circle className={styles.legendDotMuted} cx={102} cy={134} r={4} />
          <text className={styles.legendText} x={116} y={138}>
            NO REAL GAIN
          </text>
        </g>

        {/* one faint guide grounding the leap to Jac */}
        <line className={styles.guide} x1={656} y1={BASE_Y} x2={656} y2={84} />

        {/* the trend — legacy ladder, then the leap */}
        <path className={styles.legacy} d={LEGACY} pathLength={1} />
        <path className={styles.leap} d={LEAP} pathLength={1} />

        {/* emphasis ring + infinite radar pulse + annotation on Jac */}
        <circle className={styles.halo} cx={656} cy={84} r={15} />
        <circle className={styles.pulse} cx={656} cy={84} r={10} />
        <text className={styles.annotation} x={656} y={56} textAnchor="middle">
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
          <text className={styles.dimText} x={336} y={514} textAnchor="middle">
            ≈ 50 YEARS OF INCREMENTAL STEPS
          </text>
          <line
            className={styles.dimRule}
            x1={96}
            y1={524}
            x2={576}
            y2={524}
            pathLength={1}
          />
          <line className={styles.dimLine} x1={96} y1={519} x2={96} y2={529} />
          <line
            className={`${styles.dimLine} ${styles.dimLineEnd}`}
            x1={576}
            y1={519}
            x2={576}
            y2={529}
          />
        </g>
      </svg>
    </div>
  );
}
