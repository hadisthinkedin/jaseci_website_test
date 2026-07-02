import type { CSSProperties } from "react";
import styles from "./BlockTower.module.css";

type Block = { name: string; logo?: string };

// bottom → top: Python is the foundation; the abstractions pile on and the
// stack leans further out of true the higher it climbs.
const BLOCKS: Block[] = [
  { name: "Python", logo: "/jar/python.svg?v=1" },
  { name: "LangChain", logo: "/jar/langchain.svg?v=5" },
  { name: "LangGraph", logo: "/jar/langgraph.svg?v=3" },
  { name: "LlamaIndex", logo: "/jar/llamaindex.svg?v=2" },
  { name: "Pydantic AI", logo: "/jar/pydanticai.svg?v=1" },
  { name: "CrewAI", logo: "/jar/crewai.svg?v=2" },
  { name: "AutoGen", logo: "/jar/autogen.svg?v=2" },
  { name: "DSPy", logo: "/jar/dspy.svg?v=2" },
  { name: "Haystack", logo: "/jar/haystack.svg?v=2" },
  { name: "Your Application" }, // the reader's own app — perched on top, about to fall
];

// The per-block lean. Every block stays LEVEL (no in-plane tilt) so one can
// never sink into another — the instability is a sideways drift + wander + a
// little plan-view twist that all RAMP UP super-linearly with height, so the
// base sits planted and each block leans + wobbles noticeably more than the one
// below it as the stack climbs. The top block is shoved off the edge of the
// stack: still level, just slid out so most of it cantilevers into space — about
// to fall. Deterministic (no random) so SSR/client agree. Vertical stacking is
// handled in CSS (var(--i) × var(--H)).

// horizontal drift + wander (the leaning offset) for the block at index i
function baseOffX(i: number, n: number): number {
  const t = n > 1 ? i / (n - 1) : 0;
  const drift = -68 * Math.pow(t, 1.7); // off-centre lean, accelerating upward
  const jitter = 32 * Math.sin(i * 2.6) * Math.pow(t, 1.5); // side-to-side wobble, grows with height
  return drift + jitter;
}

function blockLean(i: number, n: number): string {
  const t = n > 1 ? i / (n - 1) : 0; // 0 (base) → 1 (top)
  const isTop = i === n - 1;

  const offZ = 26 * Math.sin(i * 1.7) * Math.pow(t, 1.5); // depth wander, ramps up with height
  let offX = baseOffX(i, n);
  let rotY = 10 * Math.sin(i * 1.45) * Math.pow(t, 1.5); // plan-view twist, ramps up (no vertical penetration)

  if (isTop) {
    // shove the top block ("Your Application") right out to the edge of the one
    // below it — still level, but slid so far its centre of mass clears the block
    // beneath, so it teeters on the very edge, about to fall.
    offX = baseOffX(n - 2, n) - 150;
    rotY = 0;
  }

  return [
    `translateX(${offX.toFixed(1)}px)`,
    `translateZ(${offZ.toFixed(1)}px)`,
    `rotateY(${rotY.toFixed(1)}deg)`,
  ].join(" ");
}

export default function BlockTower() {
  const n = BLOCKS.length;
  const top = BLOCKS[n - 1].name;
  const label =
    "A leaning tower of blocks: Python at the base with " +
    BLOCKS.slice(1, -1)
      .map((b) => b.name)
      .join(", ") +
    ` piled on top — and "${top}" teetering right at the edge, about to fall.`;

  return (
    <div className={styles.scene} role="img" aria-label={label}>
      <div className={styles.tower} style={{ "--levels": n } as CSSProperties}>
        {BLOCKS.map((b, i) => {
          const transform = blockLean(i, n);
          return (
            <div
              key={b.name}
              className={`${styles.block} ${i === n - 1 ? styles.isDark : ""}`}
              style={{ "--i": i } as CSSProperties}
            >
              <div className={styles.lean} style={{ transform }}>
                {/* hidden-side faces keep each block looking solid when it leans */}
                <div className={`${styles.face} ${styles.back}`} />
                <div className={`${styles.face} ${styles.end}`} />
                <div className={`${styles.face} ${styles.bottom}`} />
                <div className={`${styles.face} ${styles.top}`} />
                {/* the visible short end face → the logo */}
                <div className={`${styles.face} ${styles.endL}`}>
                  {b.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.logo} src={b.logo} alt="" />
                  ) : null}
                </div>
                {/* the long face → the name (warped by the 3D perspective) */}
                <div className={`${styles.face} ${styles.front}`}>
                  <span className={styles.name}>{b.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
