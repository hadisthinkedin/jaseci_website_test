import styles from "./AbstractionTrend.module.css";

/* ───────────────────────────────────────────────
   Abstraction trendline (hero visual). Assembly →
   Fortran → C → C++ → Java → Python → JS/TS, each
   generation plotted by how much it raised
   abstraction. Fortran, C++ and JS/TS sit flat (no
   real gain), so they recede to small muted dots
   between the milestones — then Jac: the leap, in
   orange.

   The hero stacks headline-over-graph, so the chart
   ships in two spreads sharing one y-geometry: a
   landscape variant that fills the full hero row on
   desktop, and the compact variant for ≤900px. Both
   render on the server; CSS swaps them (no JS).

   Structure: an HTML header row (mono eyebrow title
   + the "1940s → NOW" span, matching the site's
   label convention) above the SVG plot. The figure
   furniture (hairline frame, dotted tier gridlines,
   axis ticks, hatched areas, in-plot legend, era
   labels and the "≈ 50 years" dimension line)
   carries the same story as the copy: fifty years
   of incremental steps, one leap.

   Pure CSS animation: draw-in on load, then an
   infinite radar pulse on the Jac node. Honours
   prefers-reduced-motion (renders the final frame,
   pulse off).
   ─────────────────────────────────────────────── */

type Tier = "primary" | "muted" | "accent";

// shared y-geometry — the abstraction story is identical in both spreads
const NODE_DEFS: {
  id: string;
  label: string;
  era: string;
  y: number;
  tier: Tier;
}[] = [
  { id: "asm", label: "Assembly", era: "1940s", y: 457, tier: "primary" },
  { id: "fortran", label: "Fortran", era: "1950s", y: 457, tier: "muted" },
  { id: "c", label: "C", era: "1970s", y: 375, tier: "primary" },
  { id: "cpp", label: "C++", era: "1980s", y: 375, tier: "muted" },
  { id: "java", label: "Java", era: "1990s", y: 302, tier: "primary" },
  { id: "py", label: "Python", era: "1990s", y: 229, tier: "primary" },
  { id: "jsts", label: "JS/TS", era: "1990s", y: 229, tier: "muted" },
  { id: "jac", label: "Jac", era: "NOW", y: 91, tier: "accent" },
];

// named abstraction tiers — one per plateau in the staircase
const LEVELS: { label: string; y: number; accent?: boolean }[] = [
  { label: "MACHINE", y: 457 },
  { label: "SYSTEMS", y: 375 },
  { label: "MANAGED", y: 302 },
  { label: "DYNAMIC", y: 229 },
  { label: "AI-NATIVE", y: 91, accent: true },
];

const FRAME_X = 72;
const FRAME_Y = 40;
const FRAME_H = 472;
const BASE_Y = FRAME_Y + FRAME_H; // 512

// derive one spread of the chart from the first node's x and the node pitch
function geometry(x0: number, dx: number) {
  const nodes = NODE_DEFS.map((n, i) => ({ ...n, x: x0 + i * dx }));
  const [asm, , c, , java, py, jsts, jac] = nodes.map((n) => n.x);
  const frameW = jac + 28 - FRAME_X;
  const frameRight = FRAME_X + frameW;
  return {
    nodes,
    frameW,
    // 20 of left margin for the level labels, 36 of right margin
    viewBox: `-20 32 ${frameRight + 36 + 20} 576`,
    legacy: `M${asm} 457 H${c} V375 H${java} V302 H${py} V229 H${jsts}`,
    leap: `M${jsts} 229 H${jac} V91`,
    legacyArea: `M${asm} 512 V457 H${c} V375 H${java} V302 H${py} V229 H${jsts} V512 Z`,
    leapArea: `M${jsts} 512 V229 H${jac} V512 Z`,
    jacX: jac,
    annoX: frameRight - 6,
    dimStart: asm,
    dimEnd: jsts,
    dimMid: Math.round((asm + jsts) / 2),
  };
}

const WIDE = geometry(120, 130); // landscape — fills the hero row
const NARROW = geometry(96, 80); // compact — single-column ≤900px

const RADIUS: Record<Tier, number> = { primary: 6.5, muted: 4.5, accent: 9 };

function Plot({
  g,
  ids,
  className,
}: {
  g: ReturnType<typeof geometry>;
  ids: string;
  className: string;
}) {
  return (
    <svg
      className={`${styles.svg} ${className}`}
      viewBox={g.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`at-hatch-fg-${ids}`}
          patternUnits="userSpaceOnUse"
          width="7"
          height="7"
          patternTransform="rotate(45)"
        >
          <line className={styles.hatchLine} x1={0} y1={0} x2={0} y2={7} />
        </pattern>
        <pattern
          id={`at-hatch-accent-${ids}`}
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
      <path
        className={styles.hatchLegacy}
        d={g.legacyArea}
        fill={`url(#at-hatch-fg-${ids})`}
      />
      <path
        className={styles.hatchLeap}
        d={g.leapArea}
        fill={`url(#at-hatch-accent-${ids})`}
      />

      {/* dotted tier gridlines + named abstraction levels */}
      {LEVELS.map((l, i) => (
        <line
          key={`grid-${l.label}`}
          className={l.accent ? styles.gridlineAccent : styles.gridline}
          x1={FRAME_X}
          y1={l.y}
          x2={FRAME_X + g.frameW}
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
          x={FRAME_X - 12}
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
        x={FRAME_X}
        y={FRAME_Y}
        width={g.frameW}
        height={FRAME_H}
        pathLength={1}
      />
      {LEVELS.map((l) => (
        <line
          key={`ytick-${l.label}`}
          className={l.accent ? styles.tickAccent : styles.tick}
          x1={FRAME_X - 6}
          y1={l.y}
          x2={FRAME_X}
          y2={l.y}
        />
      ))}
      {g.nodes.map((n) => (
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
      <line className={styles.guide} x1={g.jacX} y1={BASE_Y} x2={g.jacX} y2={91} />

      {/* the trend — legacy ladder, then the leap */}
      <path className={styles.legacy} d={g.legacy} pathLength={1} />
      <path className={styles.leap} d={g.leap} pathLength={1} />

      {/* emphasis ring + infinite radar pulse + annotation on Jac;
          the label is right-aligned to the frame edge so its tracking
          doesn't spill past the plot */}
      <circle className={styles.halo} cx={g.jacX} cy={91} r={16.5} />
      <circle className={styles.pulse} cx={g.jacX} cy={91} r={11} />
      <text className={styles.annotation} x={g.annoX} y={63} textAnchor="end">
        THE LEAP
      </text>

      {/* nodes */}
      {g.nodes.map((n, i) => (
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
            animationDelay: n.tier === "accent" ? "2s" : `${0.5 + i * 0.14}s`,
          }}
        />
      ))}

      {/* x-axis labels + eras */}
      {g.nodes.map((n, i) => (
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
            animationDelay: n.tier === "accent" ? "2.15s" : `${0.6 + i * 0.14}s`,
          }}
        >
          {n.label}
        </text>
      ))}
      {g.nodes.map((n, i) => (
        <text
          key={`era-${n.id}`}
          className={`${styles.eraLabel} ${
            n.tier === "accent" ? styles.eraLabelAccent : ""
          }`}
          x={n.x}
          y={BASE_Y + 45}
          textAnchor="middle"
          style={{
            animationDelay: n.tier === "accent" ? "2.3s" : `${0.7 + i * 0.14}s`,
          }}
        >
          {n.era}
        </text>
      ))}

      {/* dimension line — the fifty years the staircase took, drawn L→R */}
      <g className={styles.dimension}>
        <text className={styles.dimText} x={g.dimMid} y={574} textAnchor="middle">
          ≈ 50 YEARS OF INCREMENTAL STEPS
        </text>
        <line
          className={styles.dimRule}
          x1={g.dimStart}
          y1={584}
          x2={g.dimEnd}
          y2={584}
          pathLength={1}
        />
        <line
          className={styles.dimLine}
          x1={g.dimStart}
          y1={579}
          x2={g.dimStart}
          y2={589}
        />
        <line
          className={`${styles.dimLine} ${styles.dimLineEnd}`}
          x1={g.dimEnd}
          y1={579}
          x2={g.dimEnd}
          y2={589}
        />
      </g>
    </svg>
  );
}

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

      <Plot g={WIDE} ids="w" className={styles.svgWide} />
      <Plot g={NARROW} ids="n" className={styles.svgNarrow} />
    </div>
  );
}
