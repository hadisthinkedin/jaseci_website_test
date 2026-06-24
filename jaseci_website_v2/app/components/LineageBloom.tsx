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
const rng = makeRng(0x9e21b7); // geometry — fixed seed, server === client
const mrng = makeRng(0x51f3a9); // motion params on a separate stream, so tuning
// the drift never reshuffles the verified layout
const jit = (amt: number) => (rng() * 2 - 1) * amt;

type Pt = {
  x: number; // base position (rounded — see r2)
  y: number;
  r: number; // radius (depth)
  fo: number; // fill-opacity (depth)
  delay: number; // reveal stagger
  depth: number; // 0 (far) … 1 (near) — also a gentle motion-parallax weight
  // a whisper of unique per-point motion, so the web isn't perfectly rigid
  ma: number; // amplitude
  mw: number; // speed
  mp: number; // phase
  mcx: number; // direction x
  mcy: number; // direction y (kept shallow)
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

function addPt(x: number, y: number, depth: number, delay: number) {
  const md = mrng() * TAU; // a random direction for this point's own small drift
  PTS.push({
    x,
    y,
    r: +(1.6 + depth * 2.6).toFixed(2),
    fo: +(0.4 + depth * 0.6).toFixed(2),
    delay,
    depth,
    ma: 3 + mrng() * 4, // 3…7 units — small, so shapes stay legible
    mw: 0.22 + mrng() * 0.45,
    mp: mrng() * TAU,
    mcx: Math.cos(md),
    mcy: Math.sin(md) * 0.6, // shallow vertical
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

type Spoke = { p1: number; p2s: number[] };
const spokes: Spoke[] = [];

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

  const p2s: number[] = [];
  const branches = 1 + Math.floor(rng() * 3); // 1–3 secondary branches
  for (let k = 0; k < branches; k++) {
    const a2 = a + jit(0.5);
    const p2 = place(a2, 168 + rng() * 78);
    const d2 = rng();
    const i2 = addPt(p2.x, p2.y, d2, 1.55 + order * 0.003 + 0.05);
    addEdge(i1, i2, d2, 1.55 + order * 0.003);
    p2s.push(i2);

    if (rng() < 0.5) {
      const a3 = a2 + jit(0.32);
      const p3 = place(a3, 246 + rng() * 76);
      const d3 = rng();
      const i3 = addPt(p3.x, p3.y, d3, 1.61 + order * 0.003 + 0.04);
      addEdge(i2, i3, d3, 1.61 + order * 0.003);
    }
    order += 1;
  }
  spokes.push({ p1: i1, p2s });
}

// ── close some of the web into geometric shapes ──────────────────────────────
// Each added chord links two points that ALREADY share a neighbour, so it
// completes a closed polygon (mostly triangles) instead of dangling. Only a
// subset is drawn, so the figure stays irregular. Shape edges reveal just after
// their endpoints and sit a touch bolder, so the shapes read.
const shapeDelay = (a: number, b: number) =>
  Math.max(PTS[a].delay, PTS[b].delay) + 0.06;
function addShape(a: number, b: number) {
  addEdge(a, b, 0.5 + mrng() * 0.45, shapeDelay(a, b));
}
// fan triangles around the hub (hub + two angularly-adjacent p1s); a subset, so
// the ring stays broken and irregular
for (let i = 0; i < N1; i++) {
  if (mrng() < 0.5) addShape(spokes[i].p1, spokes[(i + 1) % N1].p1);
}
// sibling triangles: two branches off the same p1 close up
for (const s of spokes) {
  if (s.p2s.length >= 2) addShape(s.p2s[0], s.p2s[1]);
  if (s.p2s.length >= 3 && mrng() < 0.5) addShape(s.p2s[1], s.p2s[2]);
}
// a few longer chords between neighbouring spokes' nearest tips → quads/pentagons
for (let i = 0; i < N1; i++) {
  const u = spokes[i].p2s;
  const v = spokes[(i + 1) % N1].p2s;
  if (u.length && v.length && mrng() < 0.4) {
    let ba = u[0];
    let bb = v[0];
    let bd = Infinity;
    for (const p of u) {
      for (const q of v) {
        const dd = (PTS[p].x - PTS[q].x) ** 2 + (PTS[p].y - PTS[q].y) ** 2;
        if (dd < bd) {
          bd = dd;
          ba = p;
          bb = q;
        }
      }
    }
    addShape(ba, bb);
  }
}

// ── organic drift: one smooth, large-wavelength flow field shared by every
// point. The wavelengths are far larger than any single shape, so neighbours
// move almost in unison — the whole web undulates and flows like one body rather
// than each point twitching alone. A slow breathing pulse (radial, about the
// hub) makes it swell past the screen edges and settle back. ──────────────────
type Wave = { kx: number; ky: number; w: number; p: number; a: number };
const FX: Wave[] = [
  { kx: 0.0016, ky: 0.0022, w: 0.24, p: mrng() * TAU, a: 17 },
  { kx: -0.0011, ky: 0.0039, w: 0.19, p: mrng() * TAU, a: 16 },
  { kx: 0.0028, ky: -0.0017, w: 0.33, p: mrng() * TAU, a: 12 },
];
const FY: Wave[] = [
  { kx: -0.0024, ky: 0.0019, w: 0.21, p: mrng() * TAU, a: 12 },
  { kx: 0.0013, ky: 0.0042, w: 0.3, p: mrng() * TAU, a: 10 },
  { kx: 0.0031, ky: 0.0026, w: 0.23, p: mrng() * TAU, a: 9 },
];
const BREATHE_AMP = 0.06;
const BREATHE_W = 0.12;
const BREATHE_P = mrng() * TAU;

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

  // Per-frame organic drift. Every point samples one shared, large-wavelength
  // flow field (plus a radial breathing pulse and a whisper of its own motion),
  // so neighbours move together and the web undulates as one body; the lines are
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
      const breath = 1 + env * BREATHE_AMP * Math.sin(BREATHE_W * t + BREATHE_P);

      for (let i = 0; i < PTS.length; i++) {
        const p = PTS[i];
        const { x, y } = p;
        // shared flow field — coherent across neighbours (shapes drift as units)
        let ox = 0;
        for (let c = 0; c < FX.length; c++) {
          const f = FX[c];
          ox += f.a * Math.sin(f.kx * x + f.ky * y + f.w * t + f.p);
        }
        let oy = 0;
        for (let c = 0; c < FY.length; c++) {
          const f = FY[c];
          oy += f.a * Math.sin(f.kx * x + f.ky * y + f.w * t + f.p);
        }
        const par = 0.85 + p.depth * 0.3; // mild parallax, shapes stay intact
        const m = p.ma * Math.sin(p.mw * t + p.mp); // this point's own whisper
        // breathe radially about the hub, then add the coherent flow + whisper
        const nx =
          CENTER.x + (x - CENTER.x) * breath + env * (ox * par + m * p.mcx);
        const ny =
          CENTER.y + (y - CENTER.y) * breath + env * (oy * par + m * p.mcy);
        px[i] = nx;
        py[i] = ny;
        const cc = ptEls.current[i];
        if (cc) {
          cc.cx.baseVal.value = nx;
          cc.cy.baseVal.value = ny;
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
      aria-label="A line slowly connecting Jac to Jaseci, which then instantly explodes into a wide, irregular black web of lines and triangles that spills past the edges of the screen — the whole web then drifting and breathing like a living constellation."
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
