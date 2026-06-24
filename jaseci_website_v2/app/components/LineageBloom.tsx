"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./LineageBloom.module.css";

/* ───────────────────────────────────────────────
   Lineage constellation (full-bleed).
   Jac (far left) slowly connects to Jaseci — a thin line creeps across (now a
   short chain of sub-cap segments rather than one long line). The instant it
   lands, Jaseci EXPLODES outward into a dense, wide + tall mesh of MANY points
   joined by SHORT lines (none longer than ~350px), triangulating into geometric
   shapes that spill past both edges of the screen.

   Then it lives: every mesh point samples one shared, large-wavelength flow
   field (plus a slow radial breathing pulse), so neighbours move together and
   the whole web undulates organically — the triangles hold their form while the
   net drifts and breathes.

   Geometry is built from a fixed-seed PRNG so server and client render
   identically (coords rounded → no Math.cos/sin hydration mismatch). The
   per-frame drift runs only on the client, after mount.
   ─────────────────────────────────────────────── */

const VW = 1600;
const VH = 620; // taller than before — uses the vertical space
const CX = 740; // hub x (left-of-centre, so the web leans right)
const CY = VH / 2;
const HUB = { x: CX, y: CY };
const JAC = { x: 64, y: CY };
const TAU = Math.PI * 2;

// Every line is capped at this many viewBox units. The SVG is 100vw wide over a
// 1600-unit viewBox, so 1 unit ≈ 1px at a 1600px-wide viewport — this keeps lines
// ≲350px on typical desktops (≤~1728px wide). Base edges sit a little under the
// cap so the drift never stretches one past ~350px.
const MAX_EDGE = 290;

// scatter region — wider than the viewBox (mesh runs off both screen edges) and
// tall (uses the vertical room).
const X_MIN = -150;
const X_MAX = 1780;
const Y_MIN = 70;
const Y_MAX = VH - 70;
const COLS = 27;
const ROWS = 7;
const CELL_W = (X_MAX - X_MIN) / COLS;
const CELL_H = (Y_MAX - Y_MIN) / ROWS;
const NEAR = 116; // connect neighbours within this → a triangulating mesh

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = makeRng(0x9e21b7); // geometry + depth (anything rendered/SSR)
const mrng = makeRng(0x51f3a9); // motion params only (client-side, not rendered)

type Node = {
  x: number; // base position (rounded — see r2)
  y: number;
  r: number; // radius (depth)
  fo: number; // fill-opacity (depth)
  delay: number; // reveal stagger
  depth: number; // 0 (far) … 1 (near)
  fixed: boolean; // hub / jac / approach waypoints don't drift
  kind: "mesh" | "hub" | "jac" | "approach";
  // a whisper of unique per-point motion, so the web isn't perfectly rigid
  ma: number;
  mw: number;
  mp: number;
  mcx: number;
  mcy: number;
};
type Edge = {
  a: number; // NODES index
  b: number;
  w: number; // stroke-width (depth → some thin, some bold)
  o: number; // stroke-opacity (depth)
  delay: number;
  main?: boolean; // the slow Jac→Jaseci chain
  dur?: number; // draw duration (main segments)
};

const NODES: Node[] = [];
const EDGES: Edge[] = [];

// Round rendered geometry to 2dp: Math.cos/sin can differ by ~1 ULP between the
// server's V8 and the browser's, which would trip a hydration mismatch on the raw
// coords. 2dp is sub-pixel and makes server + client markup byte-identical.
const r2 = (v: number) => Math.round(v * 100) / 100;
const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.hypot(ax - bx, ay - by);

function micro() {
  const md = mrng() * TAU;
  return {
    ma: 3 + mrng() * 4, // 3…7 units — small, so shapes stay legible
    mw: 0.22 + mrng() * 0.45,
    mp: mrng() * TAU,
    mcx: Math.cos(md),
    mcy: Math.sin(md) * 0.6, // shallow vertical
  };
}
function pushNode(
  x: number,
  y: number,
  depth: number,
  delay: number,
  kind: Node["kind"],
  fixed: boolean
) {
  NODES.push({
    x: r2(x),
    y: r2(y),
    r: +(1.4 + depth * 2.4).toFixed(2),
    fo: +(0.38 + depth * 0.6).toFixed(2),
    delay,
    depth,
    fixed,
    kind,
    ...micro(),
  });
  return NODES.length - 1;
}
function pushEdge(
  a: number,
  b: number,
  depth: number,
  delay: number,
  extra?: Partial<Edge>
) {
  EDGES.push({
    a,
    b,
    w: +(0.45 + depth * 1.7 + rng() * 0.3).toFixed(2), // ~0.45 (far) … ~2.45 (near)
    o: +(0.3 + depth * 0.6).toFixed(2),
    delay,
    ...extra,
  });
}

// ── scatter the mesh: one jittered point per grid cell (even coverage, organic
// irregularity), skipping the corridor down the centre-left where the Jac→Jaseci
// thread runs. ───────────────────────────────────────────────────────────────
const meshIdx: number[] = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const gx = X_MIN + (col + 0.5) * CELL_W + (rng() * 2 - 1) * CELL_W * 0.42;
    const gy = Y_MIN + (row + 0.5) * CELL_H + (rng() * 2 - 1) * CELL_H * 0.42;
    if (gx < CX - 30 && Math.abs(gy - CY) < 80) continue; // approach corridor
    meshIdx.push(pushNode(gx, gy, rng(), 0, "mesh", false));
  }
}

// hub joins the mesh (it's the explosion origin and a connection point)
const hubIdx = pushNode(CX, CY, 1, 0.3, "hub", true);
const connectable = [...meshIdx, hubIdx];

// reveal staggered by distance from the hub → explodes outward from Jaseci
let maxD = 1;
for (const i of meshIdx) maxD = Math.max(maxD, dist(NODES[i].x, NODES[i].y, CX, CY));
for (const i of meshIdx)
  NODES[i].delay = 1.5 + (dist(NODES[i].x, NODES[i].y, CX, CY) / maxD) * 0.5 + 0.05;

// ── connect into a triangulating mesh of SHORT edges, plus a few longer struts
// (still ≤ MAX_EDGE) for variety. Each edge links near neighbours, so the web
// is full of triangles. ──────────────────────────────────────────────────────
const seen = new Set<number>();
const key = (a: number, b: number) => (a < b ? a * 100000 + b : b * 100000 + a);
function connect(a: number, b: number) {
  const k = key(a, b);
  if (seen.has(k)) return;
  seen.add(k);
  const depth = Math.max(NODES[a].depth, NODES[b].depth);
  const delay = Math.max(NODES[a].delay, NODES[b].delay);
  pushEdge(a, b, depth, delay);
}
for (let ii = 0; ii < connectable.length; ii++) {
  for (let jj = ii + 1; jj < connectable.length; jj++) {
    const A = connectable[ii];
    const B = connectable[jj];
    const dd = dist(NODES[A].x, NODES[A].y, NODES[B].x, NODES[B].y);
    if (dd <= NEAR && rng() < 0.82) connect(A, B); // most near pairs, some dropped
  }
}
// sparse longer struts: a few nodes reach to their nearest beyond-NEAR neighbour
for (const A of connectable) {
  if (rng() >= 0.16) continue;
  let best = -1;
  let bestD = Infinity;
  for (const B of connectable) {
    if (B === A) continue;
    const dd = dist(NODES[A].x, NODES[A].y, NODES[B].x, NODES[B].y);
    if (dd > NEAR && dd <= MAX_EDGE && dd < bestD) {
      bestD = dd;
      best = B;
    }
  }
  if (best >= 0) connect(A, best);
}

// ── the slow Jac → Jaseci connection, as a chain of sub-cap segments so it still
// "creeps across" left-to-right but no segment exceeds the cap. Waypoints are
// fixed + hidden, so it reads as one clean line. ─────────────────────────────
const jacIdx = pushNode(JAC.x, JAC.y, 0.9, 0.1, "jac", true);
const STEP = (CX - JAC.x) / 3;
const m1 = pushNode(JAC.x + STEP, CY, 0.85, 0, "approach", true);
const m2 = pushNode(JAC.x + STEP * 2, CY, 0.85, 0, "approach", true);
pushEdge(jacIdx, m1, 0.9, 0.0, { main: true, dur: 0.5 });
pushEdge(m1, m2, 0.9, 0.5, { main: true, dur: 0.5 });
pushEdge(m2, hubIdx, 0.9, 1.0, { main: true, dur: 0.5 });

// ── organic drift: one smooth, large-wavelength flow field shared by every
// point. Wavelengths dwarf any single triangle, so neighbours move almost in
// unison — the whole mesh undulates as one body rather than each point twitching
// alone. A slow radial breathing pulse swells it past the edges and back. ─────
type Wave = { kx: number; ky: number; w: number; p: number; a: number };
const FX: Wave[] = [
  { kx: 0.0016, ky: 0.0022, w: 0.24, p: mrng() * TAU, a: 15 },
  { kx: -0.0011, ky: 0.0039, w: 0.19, p: mrng() * TAU, a: 13 },
  { kx: 0.0028, ky: -0.0017, w: 0.33, p: mrng() * TAU, a: 10 },
];
const FY: Wave[] = [
  { kx: -0.0024, ky: 0.0019, w: 0.21, p: mrng() * TAU, a: 11 },
  { kx: 0.0013, ky: 0.0042, w: 0.3, p: mrng() * TAU, a: 9 },
  { kx: 0.0031, ky: 0.0026, w: 0.23, p: mrng() * TAU, a: 7 },
];
const BREATHE_AMP = 0.045;
const BREATHE_W = 0.12;
const BREATHE_P = mrng() * TAU;

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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-frame organic drift. Mesh points sample the shared flow field + breathing
  // pulse; fixed nodes (hub, Jac, the approach waypoints) stay put. Lines are
  // re-pointed between the moving points each frame. An eased envelope holds
  // everything still until the web has finished exploding (~2s), then breathes
  // the motion in — so the burst stays crisp, then comes alive.
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
    const N = NODES.length;
    const E = EDGES.length;
    const px = new Array<number>(N);
    const py = new Array<number>(N);
    for (let i = 0; i < N; i++) {
      px[i] = NODES[i].x; // prefill — fixed nodes keep these forever
      py[i] = NODES[i].y;
    }

    const loop = (ts: number) => {
      if (!begun) {
        start = ts;
        begun = true;
      }
      const t = (ts - start) / 1000;
      const e0 = (t - 2.0) / 1.8;
      const env = e0 <= 0 ? 0 : e0 >= 1 ? 1 : e0 * e0 * (3 - 2 * e0); // smoothstep
      const breath = 1 + env * BREATHE_AMP * Math.sin(BREATHE_W * t + BREATHE_P);

      for (let i = 0; i < N; i++) {
        const n = NODES[i];
        if (n.fixed) continue;
        const x = n.x;
        const y = n.y;
        let ox = 0;
        for (let k = 0; k < FX.length; k++) {
          const f = FX[k];
          ox += f.a * Math.sin(f.kx * x + f.ky * y + f.w * t + f.p);
        }
        let oy = 0;
        for (let k = 0; k < FY.length; k++) {
          const f = FY[k];
          oy += f.a * Math.sin(f.kx * x + f.ky * y + f.w * t + f.p);
        }
        const par = 0.85 + n.depth * 0.3; // mild parallax, shapes stay intact
        const m = n.ma * Math.sin(n.mw * t + n.mp); // this point's own whisper
        const nx = CX + (x - CX) * breath + env * (ox * par + m * n.mcx);
        const ny = CY + (y - CY) * breath + env * (oy * par + m * n.mcy);
        px[i] = nx;
        py[i] = ny;
        const c = ptEls.current[i];
        if (c) {
          c.cx.baseVal.value = nx;
          c.cy.baseVal.value = ny;
        }
      }

      for (let j = 0; j < E; j++) {
        const e = EDGES[j];
        const ln = lineEls.current[j];
        if (!ln) continue;
        ln.x1.baseVal.value = px[e.a];
        ln.y1.baseVal.value = py[e.a];
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
      aria-label="A line slowly creeping from Jac to Jaseci, which then explodes into a dense, wide and tall black mesh of short lines and triangles that spills past the edges of the screen — the whole web then drifting and breathing like a living constellation."
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {EDGES.map((e, j) => {
          const A = NODES[e.a];
          const B = NODES[e.b];
          return (
            <line
              key={`e${j}`}
              ref={(el) => {
                lineEls.current[j] = el;
              }}
              className={`${styles.line} ${e.main ? styles.main : styles.burst}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              pathLength={1}
              strokeWidth={e.w}
              strokeOpacity={e.o}
              style={
                e.main
                  ? ({ "--d": `${e.delay}s`, "--dur": `${e.dur}s` } as CSSProperties)
                  : cssVar(e.delay)
              }
            />
          );
        })}

        {NODES.map((n, i) => {
          if (n.kind === "approach") return null; // hidden waypoints
          if (n.kind === "jac")
            return (
              <circle
                key={`n${i}`}
                className={styles.rootNode}
                cx={n.x}
                cy={n.y}
                r={6}
                style={cssVar(n.delay)}
              />
            );
          if (n.kind === "hub")
            return (
              <g key={`n${i}`}>
                <circle
                  className={styles.hubRing}
                  cx={n.x}
                  cy={n.y}
                  r={13}
                  style={cssVar(1.5)}
                />
                <circle
                  className={styles.hubNode}
                  cx={n.x}
                  cy={n.y}
                  r={7}
                  style={cssVar(0.3)}
                />
              </g>
            );
          return (
            <circle
              key={`n${i}`}
              ref={(el) => {
                ptEls.current[i] = el;
              }}
              className={styles.node}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fillOpacity={n.fo}
              style={cssVar(n.delay)}
            />
          );
        })}

        <text
          className={styles.label}
          x={JAC.x}
          y={JAC.y + 30}
          textAnchor="middle"
          style={cssVar(0.25)}
        >
          Jac
        </text>
        <text
          className={styles.label}
          x={HUB.x}
          y={HUB.y + 32}
          textAnchor="middle"
          style={cssVar(0.45)}
        >
          Jaseci
        </text>
      </svg>
    </div>
  );
}
