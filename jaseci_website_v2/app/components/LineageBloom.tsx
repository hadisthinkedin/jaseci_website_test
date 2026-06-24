"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./LineageBloom.module.css";

/* ───────────────────────────────────────────────
   Lineage constellation (full-bleed).
   Jac (far left) slowly connects to Jaseci — a thin
   line creeps across. The instant it lands, Jaseci
   EXPLODES: a black, irregular web of lines + points
   fires outward almost instantly, stretched so WIDE it
   spills past both edges of the screen.

   Then it lives: every point floats on its OWN path —
   its own direction, speed and phase — so the web breathes
   and shifts rather than drifting as one block. Lines are
   re-drawn between the moving points each frame.

   3D feel: each point carries a random "depth". Near points
   are larger, brighter, joined by bolder lines and swing
   WIDER (parallax); far points are small, thin, faint and
   barely move. The result reads as layered geometry, not a
   flat sheet.

   The web is built from a fixed-seed PRNG so server and
   client render identically (no Math.random → no hydration
   mismatch). The per-frame float runs only on the client,
   after mount, so it never affects the server markup.
   ─────────────────────────────────────────────── */

const VW = 1600;
const VH = 440;
const CENTER = { x: 740, y: 220 }; // Jaseci — left of centre, so it leans right
const JAC = { x: 64, y: 220 };
const TAU = Math.PI * 2;

// stretch the burst: very wide, fairly shallow → it runs off both screen edges
const XK = 3.4;
const YK = 0.66;

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = makeRng(0x9e21b7);
const jit = (amt: number) => (rng() * 2 - 1) * amt;

// per-point float: each point wanders on its own little Lissajous path (two
// incommensurate sinusoids per axis → no obvious repeat), with its own speeds
// and phases. Horizontal swing scales with reach + depth (near points parallax
// further, and the outermost ones swing clear off the screen); vertical swing is
// kept small + absolute so the web never overlaps the copy above it.
type Float = {
  ax: number;
  ay: number;
  wx1: number;
  wx2: number;
  px1: number;
  px2: number;
  wy1: number;
  wy2: number;
  py1: number;
  py2: number;
};
type Pt = {
  x: number; // base position
  y: number;
  r: number; // radius (depth)
  fo: number; // fill-opacity (depth)
  delay: number; // reveal stagger
  f: Float;
};
// edge endpoints: -1 = the Jaseci hub, otherwise an index into PTS
type Edge = {
  a: number;
  b: number;
  w: number; // stroke-width (depth → some thin, some bold)
  o: number; // stroke-opacity (depth)
  delay: number;
};

const PTS: Pt[] = [];
const EDGES: Edge[] = [];

// Round rendered geometry to 2dp: Math.cos/sin can differ by ~1 ULP between the
// server's V8 and the browser's, and raw full-precision coords in the SVG attrs
// would then trip a hydration mismatch. 2dp is sub-pixel (invisible) and makes
// the server + client markup byte-identical. (The float base uses these too.)
const r2 = (v: number) => Math.round(v * 100) / 100;
const place = (a: number, r: number) => ({
  x: r2(CENTER.x + Math.cos(a) * r * XK),
  y: r2(CENTER.y + Math.sin(a) * r * YK),
});
const reach = (x: number, y: number) => Math.hypot(x - CENTER.x, y - CENTER.y);

function floatFor(x: number, y: number, depth: number): Float {
  const ax =
    (10 + reach(x, y) * 0.06) * (0.6 + depth * 0.85) * (0.85 + rng() * 0.5);
  const ay = 5 + rng() * 13; // always shallow, regardless of horizontal reach
  const wx1 = 0.12 + rng() * 0.33;
  const wy1 = 0.12 + rng() * 0.33;
  return {
    ax,
    ay,
    wx1,
    wx2: wx1 * (1.6 + rng() * 0.8),
    px1: rng() * TAU,
    px2: rng() * TAU,
    wy1,
    wy2: wy1 * (1.6 + rng() * 0.8),
    py1: rng() * TAU,
    py2: rng() * TAU,
  };
}

function addPt(x: number, y: number, depth: number, delay: number) {
  PTS.push({
    x,
    y,
    r: +(1.6 + depth * 2.6).toFixed(2),
    fo: +(0.4 + depth * 0.6).toFixed(2),
    delay,
    f: floatFor(x, y, depth),
  });
  return PTS.length - 1;
}
function addEdge(a: number, b: number, depth: number, delay: number) {
  EDGES.push({
    a,
    b,
    w: +(0.5 + depth * 1.9 + rng() * 0.35).toFixed(2), // ~0.5 (far) … ~2.75 (near)
    o: +(0.32 + depth * 0.6).toFixed(2),
    delay,
  });
}

const N1 = 17;
let order = 0;
for (let i = 0; i < N1; i++) {
  const a = (i / N1) * TAU + jit(0.3); // even-ish, heavily jittered → lop-sided
  let r = 80 + rng() * 60;
  if (rng() < 0.3) r *= 1.7; // occasional long spoke → irregular, far-reaching
  const p1 = place(a, r);
  const d1 = rng(); // random depth per point → mixed 3D layering
  const i1 = addPt(p1.x, p1.y, d1, 1.5 + i * 0.004 + 0.05);
  addEdge(-1, i1, d1, 1.5 + i * 0.004);

  const branches = 1 + Math.floor(rng() * 3); // 1–3 secondary branches
  for (let k = 0; k < branches; k++) {
    const a2 = a + jit(0.5);
    const p2 = place(a2, 168 + rng() * 78);
    const d2 = rng();
    const i2 = addPt(p2.x, p2.y, d2, 1.55 + order * 0.003 + 0.05);
    addEdge(i1, i2, d2, 1.55 + order * 0.003);

    if (rng() < 0.5) {
      const a3 = a2 + jit(0.32);
      const p3 = place(a3, 246 + rng() * 76);
      const d3 = rng();
      const i3 = addPt(p3.x, p3.y, d3, 1.61 + order * 0.003 + 0.04);
      addEdge(i2, i3, d3, 1.61 + order * 0.003);
    }
    order += 1;
  }
}

const mainD = `M${JAC.x} ${JAC.y} L${CENTER.x} ${CENTER.y}`;
const cssVar = (delay: number) => ({ "--d": `${delay}s` } as CSSProperties);

export default function LineageBloom() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);
  const lineEls = useRef<(SVGLineElement | null)[]>([]);
  const ptEls = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced-motion users get the finished constellation straight from CSS.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setPlay(e.isIntersecting)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-frame independent float. Each point follows its own Lissajous path; the
  // lines are re-pointed between the moving points every frame. An eased
  // envelope holds everything still until the web has finished exploding (~2s),
  // then lets the drift breathe in — so the burst stays crisp and geometric.
  useEffect(() => {
    if (!play) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let raf = 0;
    let start = 0;
    let begun = false;
    const px = new Array<number>(PTS.length);
    const py = new Array<number>(PTS.length);

    const loop = (ts: number) => {
      if (!begun) {
        start = ts;
        begun = true;
      }
      const t = (ts - start) / 1000;
      const e0 = (t - 2.0) / 1.8;
      const env = e0 <= 0 ? 0 : e0 >= 1 ? 1 : e0 * e0 * (3 - 2 * e0); // smoothstep

      for (let i = 0; i < PTS.length; i++) {
        const { x, y, f } = PTS[i];
        const ox =
          env *
          f.ax *
          (0.65 * Math.sin(f.wx1 * t + f.px1) +
            0.35 * Math.sin(f.wx2 * t + f.px2));
        const oy =
          env *
          f.ay *
          (0.65 * Math.sin(f.wy1 * t + f.py1) +
            0.35 * Math.sin(f.wy2 * t + f.py2));
        const nx = x + ox;
        const ny = y + oy;
        px[i] = nx;
        py[i] = ny;
        const c = ptEls.current[i];
        if (c) {
          c.cx.baseVal.value = nx;
          c.cy.baseVal.value = ny;
        }
      }

      for (let j = 0; j < EDGES.length; j++) {
        const e = EDGES[j];
        const ln = lineEls.current[j];
        if (!ln) continue;
        ln.x1.baseVal.value = e.a < 0 ? CENTER.x : px[e.a];
        ln.y1.baseVal.value = e.a < 0 ? CENTER.y : py[e.a];
        ln.x2.baseVal.value = px[e.b];
        ln.y2.baseVal.value = py[e.b];
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${play ? styles.play : ""}`}
      role="img"
      aria-label="A line slowly connecting Jac to Jaseci, which then instantly explodes into a wide, irregular black web that spills past the edges of the screen — every point drifting on its own path, like a living constellation."
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* the exploded web — lines first, then points sit on top of them */}
        {EDGES.map((e, j) => {
          const ax = e.a < 0 ? CENTER.x : PTS[e.a].x;
          const ay = e.a < 0 ? CENTER.y : PTS[e.a].y;
          const b = PTS[e.b];
          return (
            <line
              key={`e${j}`}
              ref={(el) => {
                lineEls.current[j] = el;
              }}
              className={`${styles.line} ${styles.burst}`}
              x1={ax}
              y1={ay}
              x2={b.x}
              y2={b.y}
              pathLength={1}
              strokeWidth={e.w}
              strokeOpacity={e.o}
              style={cssVar(e.delay)}
            />
          );
        })}
        {PTS.map((p, i) => (
          <circle
            key={`n${i}`}
            ref={(el) => {
              ptEls.current[i] = el;
            }}
            className={styles.node}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fillOpacity={p.fo}
            style={cssVar(p.delay)}
          />
        ))}

        {/* the slow connection: Jac → Jaseci */}
        <path
          className={`${styles.line} ${styles.main}`}
          d={mainD}
          pathLength={1}
          style={cssVar(0)}
        />

        {/* Jac — the origin point */}
        <circle
          className={styles.rootNode}
          cx={JAC.x}
          cy={JAC.y}
          r={6}
          style={cssVar(0.1)}
        />
        <text
          className={styles.label}
          x={JAC.x}
          y={JAC.y + 30}
          textAnchor="middle"
          style={cssVar(0.25)}
        >
          Jac
        </text>

        {/* Jaseci — the exploding heart (anchored: the burst flies, this stays) */}
        <circle
          className={styles.hubRing}
          cx={CENTER.x}
          cy={CENTER.y}
          r={13}
          style={cssVar(1.5)}
        />
        <circle
          className={styles.hubNode}
          cx={CENTER.x}
          cy={CENTER.y}
          r={7}
          style={cssVar(0.3)}
        />
        <text
          className={styles.label}
          x={CENTER.x}
          y={CENTER.y + 32}
          textAnchor="middle"
          style={cssVar(0.45)}
        >
          Jaseci
        </text>
      </svg>
    </div>
  );
}
