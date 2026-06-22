import styles from "./AbstractionTrend.module.css";

/* ───────────────────────────────────────────────
   Abstraction trendline.
   Assembly → C → Java → Python → Jac, plotted as a
   rising trend (each language a leap in abstraction).
   The line draws itself in on load; the final
   segment to Jac is the leap, in orange. Pure CSS
   animation — no client JS.
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
  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label="Abstraction over time, rising through Assembly, C, Java and Python — then leaping to Jac."
    >
      <svg
        className={styles.svg}
        viewBox="0 0 560 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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

        {/* "the leap" annotation by Jac */}
        <text
          className={styles.annotation}
          x={500}
          y={66}
          textAnchor="middle"
          style={{ animationDelay: "1.95s" }}
        >
          THE LEAP
        </text>

        {/* nodes */}
        {NODES.map((n, i) => (
          <circle
            key={n.id}
            className={`${styles.node} ${n.accent ? styles.nodeAccent : ""}`}
            cx={n.x}
            cy={n.y}
            r={n.accent ? 8 : 5.5}
            style={{ animationDelay: `${0.45 + i * 0.28}s` }}
          />
        ))}

        {/* x-axis labels */}
        {NODES.map((n, i) => (
          <text
            key={n.id}
            className={`${styles.xlabel} ${n.accent ? styles.xlabelAccent : ""}`}
            x={n.x}
            y={BASE_Y + 28}
            textAnchor="middle"
            style={{ animationDelay: `${0.55 + i * 0.28}s` }}
          >
            {n.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
