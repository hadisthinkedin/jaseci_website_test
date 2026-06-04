"use client";

/**
 * LiquidGradient — animated WebGL background shown behind the Jac code
 * pane on hover.
 *
 * Adapted from a Three.js liquid-gradient shader (Made By Beings). Two key
 * differences from the original:
 *   1. Motion is driven by a synthetic drifting cursor (Lissajous-style
 *      sine sums) instead of the real mouse pointer.
 *   2. The shader runs in a small overlay canvas; it fades in/out via the
 *      `active` prop and stops its render loop when not visible.
 *
 * Color scheme matches Scheme 1 from the source: Jac orange (#F15A22) +
 * navy (#0a0e27), with the orange weight reduced and navy boosted so the
 * gradient reads as warm-on-navy rather than a fireball.
 */

import { useEffect, useRef } from "react";

type Props = {
  active: boolean;
  // Optional CSS clip-path value (e.g. `path("M...Z")`) applied to the
  // canvas so the gradient only fills the given shape. When omitted, the
  // gradient fills the entire parent.
  clipPath?: string;
};

export default function LiquidGradient({ active, clipPath }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Apply clipPath imperatively. React's style prop has been observed to
  // not always propagate `clip-path: path(...)` strings to the DOM here
  // (likely because the same canvas's `style.opacity` is being mutated
  // every frame by the RAF tick loop, which leaves the inline style cache
  // out of sync with React's expected value). Writing the style property
  // directly avoids the issue and stays in step with prop changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (clipPath) {
      canvas.style.clipPath = clipPath;
      canvas.style.setProperty("-webkit-clip-path", clipPath);
    } else {
      canvas.style.clipPath = "";
      canvas.style.removeProperty("-webkit-clip-path");
    }
  }, [clipPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const initialWidth = Math.max(1, parent.clientWidth);
      const initialHeight = Math.max(1, parent.clientHeight);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: false,
        premultipliedAlpha: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(initialWidth, initialHeight, false);
      renderer.setClearColor(0x0a0e27, 1);

      const camera = new THREE.PerspectiveCamera(
        45,
        initialWidth / initialHeight,
        0.1,
        10000,
      );
      camera.position.z = 50;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0e27);

      const touch = new TouchTexture(THREE);

      const uniforms: Record<string, { value: unknown }> = {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(initialWidth, initialHeight),
        },
        // Scheme 1: F15A22 orange + 0a0e27 navy, repeated.
        uColor1: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
        uColor2: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
        uColor3: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
        uColor4: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
        uColor5: { value: new THREE.Vector3(0.945, 0.353, 0.133) },
        uColor6: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
        uSpeed: { value: 1.5 },
        uIntensity: { value: 1.8 },
        uTouchTexture: { value: touch.texture },
        uGrainIntensity: { value: 0.08 },
        uDarkNavy: { value: new THREE.Vector3(0.039, 0.055, 0.153) },
        uGradientSize: { value: 0.45 },
        uGradientCount: { value: 12.0 },
        uColor1Weight: { value: 0.5 },
        uColor2Weight: { value: 1.8 },
      };

      const viewSize = getViewSize(camera);
      const geometry = new THREE.PlaneGeometry(
        viewSize.width,
        viewSize.height,
        1,
        1,
      );
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Initial paint so the canvas has content even before the first
      // RAF tick — avoids a flash of nothing on first hover.
      renderer.render(scene, camera);

      // Per-instance drift trajectory — randomized at mount so every
      // <LiquidGradient> on the page moves on its own unique Lissajous
      // path instead of all instances animating in lockstep.
      //   • fx/fy : sine frequencies (rad/s-equivalent on driftTime)
      //   • px/py : initial phase offsets
      //   • ax/ay : amplitudes (kept inside 0..1 with margin)
      // The two-sine sum (one slow base + one faster detail) gives an
      // organic, non-repeating curve since the frequencies are
      // incommensurate.
      const rand = (min: number, max: number) =>
        min + Math.random() * (max - min);
      const drift = { x: 0.5, y: 0.5 };
      const driftParams = {
        fx1: rand(0.25, 0.55),
        fx2: rand(0.65, 1.05),
        fy1: rand(0.30, 0.55),
        fy2: rand(0.60, 0.95),
        px1: rand(0, Math.PI * 2),
        px2: rand(0, Math.PI * 2),
        py1: rand(0, Math.PI * 2),
        py2: rand(0, Math.PI * 2),
        ax1: rand(0.26, 0.36),
        ax2: rand(0.08, 0.16),
        ay1: rand(0.26, 0.36),
        ay2: rand(0.08, 0.16),
        // Sign flips so some instances orbit clockwise, some counter.
        sx: Math.random() < 0.5 ? 1 : -1,
        sy: Math.random() < 0.5 ? 1 : -1,
        // Use sin OR cos for the base axis per instance — another
        // independent source of variation.
        coreX: Math.random() < 0.5 ? Math.sin : Math.cos,
        coreY: Math.random() < 0.5 ? Math.sin : Math.cos,
      };
      // Start with a random time offset so the shader's own animated
      // gradient centers (driven by uTime) also land in different phases
      // across instances on first show.
      (uniforms.uTime.value as number) = rand(0, 1000);
      let driftTime = rand(0, 100);

      const resizeObserver = new ResizeObserver(() => {
        const w = Math.max(1, parent.clientWidth);
        const h = Math.max(1, parent.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const vs = getViewSize(camera);
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(vs.width, vs.height, 1, 1);
        (uniforms.uResolution.value as InstanceType<typeof THREE.Vector2>).set(
          w,
          h,
        );
      });
      resizeObserver.observe(parent);

      let rafId = 0;
      let opacity = 0;
      let lastTime = performance.now();

      const tick = () => {
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Fade in/out toward target opacity. Frame-rate-independent
        // exponential easing: factor ≈ 1 - exp(-rate * dt).
        const target = activeRef.current ? 1 : 0;
        const fadeRate = activeRef.current ? 5 : 3.5;
        opacity += (target - opacity) * (1 - Math.exp(-fadeRate * delta));
        canvas.style.opacity = String(opacity);

        // Skip GPU work entirely when fully faded out and inactive.
        if (!activeRef.current && opacity < 0.005) {
          opacity = 0;
          canvas.style.opacity = "0";
          rafId = requestAnimationFrame(tick);
          return;
        }

        // Drift the synthetic cursor along this instance's random
        // Lissajous path. Sums of incommensurate sines never repeat.
        driftTime += delta;
        const p = driftParams;
        const tx =
          0.5 +
          p.sx * p.coreX(driftTime * p.fx1 + p.px1) * p.ax1 +
          p.coreX(driftTime * p.fx2 + p.px2) * p.ax2;
        const ty =
          0.5 +
          p.sy * p.coreY(driftTime * p.fy1 + p.py1) * p.ay1 +
          p.coreY(driftTime * p.fy2 + p.py2) * p.ay2;
        const ease = 1 - Math.exp(-6 * delta);
        drift.x += (tx - drift.x) * ease;
        drift.y += (ty - drift.y) * ease;
        touch.addTouch({ x: drift.x, y: drift.y });

        (uniforms.uTime.value as number) += delta;
        touch.update();
        renderer.render(scene, camera);

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        mesh.geometry.dispose();
        material.dispose();
        touch.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="liquid-bg"
      aria-hidden="true"
      // Start fully transparent; the RAF loop animates opacity. clipPath
      // is applied imperatively via useEffect — see note above.
      style={{ opacity: 0 }}
    />
  );
}

function getViewSize(
  camera: { fov: number; position: { z: number }; aspect: number },
) {
  const fovInRadians = (camera.fov * Math.PI) / 180;
  const height = Math.abs(
    camera.position.z * Math.tan(fovInRadians / 2) * 2,
  );
  return { width: height * camera.aspect, height };
}

// ─────────────────────────────────────────────────────────────────
// TouchTexture — paints velocity-encoded ripples into a small canvas
// that the shader samples to produce water distortion.
// ─────────────────────────────────────────────────────────────────

type ThreeModule = typeof import("three");
type Pt = { x: number; y: number; age: number; force: number; vx: number; vy: number };

class TouchTexture {
  private size = 64;
  private width = 64;
  private height = 64;
  private maxAge = 64;
  private radius = 0.25 * 64;
  private speed = 1 / 64;
  private trail: Pt[] = [];
  private last: { x: number; y: number } | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public texture: InstanceType<ThreeModule["Texture"]>;

  constructor(THREE: ThreeModule) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const f = point.force * this.speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;
    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;
      force = Math.min(dd * 20000, 2.0);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  private drawPoint(point: Pt) {
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height,
    };
    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const radius = this.radius;
    const color = `${((point.vx + 1) / 2) * 255}, ${
      ((point.vy + 1) / 2) * 255
    }, ${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose() {
    this.texture.dispose();
    this.trail.length = 0;
  }
}

// ─────────────────────────────────────────────────────────────────
// Shaders — verbatim from the source liquid-gradient effect, kept
// out of the React function body to avoid re-allocating strings.
// ─────────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    vUv = uv;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  uniform vec3 uColor6;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform sampler2D uTouchTexture;
  uniform float uGrainIntensity;
  uniform vec3 uDarkNavy;
  uniform float uGradientSize;
  uniform float uGradientCount;
  uniform float uColor1Weight;
  uniform float uColor2Weight;

  varying vec2 vUv;

  float grain(vec2 uv, float time) {
    vec2 grainUv = uv * uResolution * 0.5;
    float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
    return grainValue * 2.0 - 1.0;
  }

  vec3 getGradientColor(vec2 uv, float time) {
    float gradientRadius = uGradientSize;

    vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
    vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
    vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
    vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
    vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
    vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
    vec2 center7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
    vec2 center8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
    vec2 center9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
    vec2 center10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
    vec2 center11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
    vec2 center12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);

    float influence1 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center1));
    float influence2 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center2));
    float influence3 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center3));
    float influence4 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center4));
    float influence5 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center5));
    float influence6 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center6));
    float influence7 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center7));
    float influence8 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center8));
    float influence9 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center9));
    float influence10 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center10));
    float influence11 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center11));
    float influence12 = 1.0 - smoothstep(0.0, gradientRadius, length(uv - center12));

    vec2 rotatedUv1 = uv - 0.5;
    float angle1 = time * uSpeed * 0.15;
    rotatedUv1 = vec2(
      rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1),
      rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1)
    );
    rotatedUv1 += 0.5;

    vec2 rotatedUv2 = uv - 0.5;
    float angle2 = -time * uSpeed * 0.12;
    rotatedUv2 = vec2(
      rotatedUv2.x * cos(angle2) - rotatedUv2.y * sin(angle2),
      rotatedUv2.x * sin(angle2) + rotatedUv2.y * cos(angle2)
    );
    rotatedUv2 += 0.5;

    float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, length(rotatedUv1 - 0.5));
    float radialInfluence2 = 1.0 - smoothstep(0.0, 0.8, length(rotatedUv2 - 0.5));

    vec3 color = vec3(0.0);
    color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
    color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
    color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
    color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
    color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
    color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;

    if (uGradientCount > 6.0) {
      color += uColor1 * influence7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
      color += uColor2 * influence8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
      color += uColor3 * influence9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
      color += uColor4 * influence10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
    }
    if (uGradientCount > 10.0) {
      color += uColor5 * influence11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
      color += uColor6 * influence12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
    }

    color += mix(uColor1, uColor3, radialInfluence1) * 0.45 * uColor1Weight;
    color += mix(uColor2, uColor4, radialInfluence2) * 0.4 * uColor2Weight;

    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;

    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luminance), color, 1.35);
    color = pow(color, vec3(0.92));

    float brightness1 = length(color);
    float mixFactor1 = max(brightness1 * 1.2, 0.15);
    color = mix(uDarkNavy, color, mixFactor1);

    float maxBrightness = 1.0;
    float brightness = length(color);
    if (brightness > maxBrightness) {
      color = color * (maxBrightness / brightness);
    }

    return color;
  }

  void main() {
    vec2 uv = vUv;

    vec4 touchTex = texture2D(uTouchTexture, uv);
    float vx = -(touchTex.r * 2.0 - 1.0);
    float vy = -(touchTex.g * 2.0 - 1.0);
    float intensity = touchTex.b;
    uv.x += vx * 0.8 * intensity;
    uv.y += vy * 0.8 * intensity;

    vec2 center = vec2(0.5);
    float dist = length(uv - center);
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * intensity;
    float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * intensity;
    uv += vec2(ripple + wave);

    vec3 color = getGradientColor(uv, uTime);

    float grainValue = grain(uv, uTime);
    color += grainValue * uGrainIntensity;

    float timeShift = uTime * 0.5;
    color.r += sin(timeShift) * 0.02;
    color.g += cos(timeShift * 1.4) * 0.02;
    color.b += sin(timeShift * 1.2) * 0.02;

    float brightness2 = length(color);
    float mixFactor2 = max(brightness2 * 1.2, 0.15);
    color = mix(uDarkNavy, color, mixFactor2);

    color = clamp(color, vec3(0.0), vec3(1.0));

    float maxBrightness = 1.0;
    float brightness = length(color);
    if (brightness > maxBrightness) {
      color = color * (maxBrightness / brightness);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;
