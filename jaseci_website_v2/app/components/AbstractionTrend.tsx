import styles from "./AbstractionTrend.module.css";

/* ───────────────────────────────────────────────
   Abstraction trendline — "Dolly-to-Launch" hero.
   Assembly → C → Java → Python → Jac, plotted as a
   rising trend (each language a leap in abstraction).
   The line draws itself in on load; the final
   segment to Jac is the leap, in orange.

   After the draw-in settles (~2.85s) a seamless,
   infinite camera loop runs: the camera dollies in
   (.dolly) about the Jac peak while the legacy
   ladder recedes + fades (.graphLayer) and the Jac
   rocket cluster blooms forward (.rocketRig). A
   rocket welded to the (500,96) peak lifts and its
   flame ignites. Pure CSS — no client JS.
   ─────────────────────────────────────────────── */

const NODES = [
  { id: "asm", label: "Assembly", x: 80, y: 380 },
  { id: "c", label: "C", x: 185, y: 322 },
  { id: "java", label: "Java", x: 290, y: 264 },
  { id: "py", label: "Python", x: 395, y: 206 },
  { id: "jac", label: "Jac", x: 500, y: 96, accent: true },
];

const AXIS_X = 60;
const BASE_Y = 410;

const LEGACY = "M80 380 H185 V322 H290 V264 H395 V206"; // asm → c → java → py (steps)
const LEAP = "M395 206 H500 V96"; // py → jac (the leap, a tall final step)

export default function AbstractionTrend() {
  // Non-accent nodes/labels recede with the legacy ladder; the
  // accent (Jac) node + label travel with the rocket rig.
  const legacyNodes = NODES.filter((n) => !n.accent);

  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label="Abstraction over time, rising through Assembly, C, Java and Python — then leaping to Jac, which launches like a rocket."
    >
      <svg
        className={styles.svg}
        viewBox="0 0 560 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* CAMERA: pushes the whole scene in about the Jac peak */}
        <g className={styles.dolly}>
          {/* RECEDES + FADES: everything except the Jac hero cluster */}
          <g className={styles.graphLayer}>
            {/* axes */}
            <line className={styles.axis} x1={AXIS_X} y1={48} x2={AXIS_X} y2={BASE_Y} />
            <line className={styles.axis} x1={AXIS_X} y1={BASE_Y} x2={532} y2={BASE_Y} />
            <text
              className={styles.axisLabel}
              transform={`translate(20 ${(48 + BASE_Y) / 2}) rotate(-90)`}
              textAnchor="middle"
            >
              ABSTRACTION ↑
            </text>

            {/* vertical guides from each label up to its node */}
            {NODES.map((n, i) => (
              <line
                key={n.id}
                className={styles.guide}
                x1={n.x}
                y1={BASE_Y}
                x2={n.x}
                y2={n.y}
                style={{ animationDelay: `${0.3 + i * 0.28}s` }}
              />
            ))}

            {/* the trend — legacy ladder, then the leap */}
            <path className={styles.legacy} d={LEGACY} pathLength={1} />
            <path className={styles.leap} d={LEAP} pathLength={1} />

            {/* legacy nodes (asm, c, java, py — Jac excluded) */}
            {legacyNodes.map((n, i) => (
              <circle
                key={n.id}
                className={styles.node}
                cx={n.x}
                cy={n.y}
                r={5.5}
                style={{ animationDelay: `${0.45 + i * 0.28}s` }}
              />
            ))}

            {/* legacy x-axis labels (Jac excluded) */}
            {legacyNodes.map((n, i) => (
              <text
                key={n.id}
                className={styles.xlabel}
                x={n.x}
                y={BASE_Y + 28}
                textAnchor="middle"
                style={{ animationDelay: `${0.55 + i * 0.28}s` }}
              >
                {n.label}
              </text>
            ))}
          </g>

          {/* GROWS slightly: the Jac hero cluster (peak node + rocket) */}
          <g className={styles.rocketRig}>
            <circle
              className={`${styles.node} ${styles.nodeAccent}`}
              cx={500}
              cy={96}
              r={8}
              style={{ animationDelay: "1.57s" }}
            />
            <text
              className={styles.annotation}
              x={500}
              y={66}
              textAnchor="middle"
              style={{ animationDelay: "1.95s" }}
            >
              THE LEAP
            </text>
            <text
              className={`${styles.xlabel} ${styles.xlabelAccent}`}
              x={500}
              y={BASE_Y + 28}
              textAnchor="middle"
              style={{ animationDelay: "1.67s" }}
            >
              Jac
            </text>

            {/* rocket glyph, welded to the (500,96) peak (local coords, nose up) */}
            <g className={styles.rocket}>
              <path
                className={styles.flame}
                d="M-5 12 Q0 32 5 12 Q2 20 0 22 Q-2 20 -5 12 Z"
              />
              <path className={styles.flameCore} d="M-2 12 Q0 24 2 12 Z" />
              <path
                className={styles.rocketBody}
                d="M0 -14 C5 -8 6 0 6 6 L6 9 C6 11 -6 11 -6 9 L-6 6 C-6 0 -5 -8 0 -14 Z"
              />
              <path className={styles.fin} d="M-6 4 L-11 11 L-6 9 Z" />
              <path className={styles.fin} d="M6 4 L11 11 L6 9 Z" />
              <path className={styles.nozzle} d="M-4 9 L4 9 L3 12 L-3 12 Z" />
              <circle className={styles.rocketWindow} cx={0} cy={-2} r={2.4} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
