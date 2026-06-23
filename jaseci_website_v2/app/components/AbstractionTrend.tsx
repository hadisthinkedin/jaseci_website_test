import styles from "./AbstractionTrend.module.css";

/* ───────────────────────────────────────────────
   Abstraction trendline.
   Assembly → Fortran → C → C++ → Java → Python →
   JS/TS → Jac, plotted as a rising trend. Fortran,
   C++ and JS/TS sit flat at the level of the language
   before them; the real steps are C, Java, Python —
   then the leap to Jac, in orange. The line draws
   itself in on load. Pure CSS animation — no client JS.
   ─────────────────────────────────────────────── */

const NODES = [
  { id: "asm", label: "Assembly", x: 80, y: 510 },
  { id: "fortran", label: "Fortran", x: 166, y: 510 },
  { id: "c", label: "C", x: 252, y: 430 },
  { id: "cpp", label: "C++", x: 338, y: 430 },
  { id: "java", label: "Java", x: 424, y: 350 },
  { id: "py", label: "Python", x: 510, y: 270 },
  { id: "jsts", label: "JS/TS", x: 596, y: 270 },
  { id: "jac", label: "Jac", x: 682, y: 110, accent: true },
];

const AXIS_X = 60;
const AXIS_TOP = 70;
const BASE_Y = 540;

// Fortran, C++ and JS/TS sit flat (no step up) at the level of the language
// before them; the real steps land on C, Java, Python — then the leap to Jac.
const LEGACY = "M80 510 H252 V430 H424 V350 H510 V270 H596";
const LEAP = "M596 270 H682 V110"; // js/ts → jac (the leap, a tall final step)

export default function AbstractionTrend() {
  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label="Abstraction over time, rising through Assembly, Fortran, C, C++, Java, Python and JS/TS — then leaping to Jac."
    >
      <svg
        className={styles.svg}
        viewBox="0 0 760 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* axes */}
        <line className={styles.axis} x1={AXIS_X} y1={AXIS_TOP} x2={AXIS_X} y2={BASE_Y} />
        <line className={styles.axis} x1={AXIS_X} y1={BASE_Y} x2={716} y2={BASE_Y} />
        <text
          className={styles.axisLabel}
          transform={`translate(20 ${(AXIS_TOP + BASE_Y) / 2}) rotate(-90)`}
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
            style={{ animationDelay: `${0.3 + i * 0.2}s` }}
          />
        ))}

        {/* the trend — legacy ladder, then the leap */}
        <path className={styles.legacy} d={LEGACY} pathLength={1} />
        <path className={styles.leap} d={LEAP} pathLength={1} />

        {/* "the leap" annotation by Jac */}
        <text
          className={styles.annotation}
          x={682}
          y={80}
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
            r={n.accent ? 10 : 7}
            style={{ animationDelay: `${0.45 + i * 0.2}s` }}
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
            style={{ animationDelay: `${0.55 + i * 0.2}s` }}
          >
            {n.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
