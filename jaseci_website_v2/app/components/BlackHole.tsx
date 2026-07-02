"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ───────────────────────────────────────────────
   Real-time black hole — a warm (yellow → orange) accretion disc, swirling
   particles, a starfield, and a gravitational-lensing composite pass. Ported
   from the original three.js "black hole" build, stripped to just the pieces
   that draw the effect (no loaders / GUI / stats / OrbitControls / compression),
   recoloured warm, and tilted so the disc reads as an ellipse.

   Pipeline each frame:
     1. render the space scene (stars + disc + particles) → spaceRT
     2. render the distortion field (a radial mask at the hole) → distortionRT
     3. a full-screen pass samples spaceRT, pulls its UVs toward the hole by the
        distortion intensity, and RGB-shifts them → the lensing look

   The canvas fills the whole card but is a hover reveal (CSS fades it in on
   :hover and back out on leave), so the render loop only runs while the card
   is hovered AND on screen. Falls back to the original gif without WebGL2.
   ─────────────────────────────────────────────── */

// Match the original build's non-managed colour pipeline: treat the hex colours
// as raw sRGB and write the additive result straight to the canvas.
THREE.ColorManagement.enabled = false;

const INNER_COLOR = "#ffd25e"; // hot inner edge — yellow-gold
const OUTER_COLOR = "#ff4d0a"; // cooler outer edge — orange

/* ── shaders (GLSL3, RawShaderMaterial) ─────────────────────────────────────── */

const NOISE_VERT = /* glsl */ `
precision highp float;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  gl_Position = vec4(position, 1.0);
  vUv = uv;
}`;

// Classic Perlin 3D (periodic) — baked once into a tiling texture for the disc.
const NOISE_FRAG = /* glsl */ `
precision highp float;
precision highp int;
in vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float perlin3dPeriodic(vec3 P, vec3 rep) {
  vec3 Pi0 = mod(floor(P), rep);
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

layout(location = 0) out vec4 pc_FragColor;
void main() {
  float uFrequency = 8.0;
  float noiseR = perlin3dPeriodic(vec3(vUv * uFrequency, 123.456), vec3(uFrequency)) * 0.5 + 0.5;
  float noiseG = perlin3dPeriodic(vec3(vUv * uFrequency, 456.789), vec3(uFrequency)) * 0.5 + 0.5;
  float noiseB = perlin3dPeriodic(vec3(vUv * uFrequency, 789.123), vec3(uFrequency)) * 0.5 + 0.5;
  pc_FragColor = vec4(noiseR, noiseG, noiseB, 1.0);
}`;

const DISC_VERT = /* glsl */ `
precision highp float;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}`;

const DISC_FRAG = /* glsl */ `
precision highp float;
precision highp int;
uniform float uTime;
uniform sampler2D uNoiseTexture;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
in vec2 vUv;
layout(location = 0) out vec4 pc_FragColor;

float inverseLerp(float v, float a, float b) { return (v - a) / (b - a); }
vec3 blendAdd(vec3 base, vec3 blend) { return min(base + blend, vec3(1.0)); }

void main() {
  vec4 color = vec4(0.0);
  color.a = 1.0;
  float iterations = 3.0;
  for (float i = 0.0; i < iterations; i++) {
    float progress = i / (iterations - 1.0);
    float intensity = 1.0 - ((vUv.y - progress) * iterations) * 0.5;
    intensity = smoothstep(0.0, 1.0, intensity);
    vec2 uv = vUv;
    uv.y *= 2.0;
    uv.x += uTime / ((i * 10.0) + 1.0);
    vec3 ringColor = mix(uInnerColor, uOuterColor, progress);
    float noiseIntensity = texture(uNoiseTexture, uv).r;
    ringColor = mix(vec3(0.0), ringColor.rgb, noiseIntensity * intensity);
    color.rgb = blendAdd(color.rgb, ringColor);
  }
  float edgesAttenuation = min(inverseLerp(vUv.y, 0.0, 0.02), inverseLerp(vUv.y, 1.0, 0.5));
  color.rgb = mix(vec3(0.0), color.rgb, edgesAttenuation);
  pc_FragColor = color;
}`;

const PARTICLES_VERT = /* glsl */ `
precision highp float;
#define PI 3.1415926538
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform float uViewHeight;
uniform float uSize;
in float position;
in float aSize;
in float aRandom;
out vec3 vColor;
void main() {
  float concentration = 0.05;
  float outerProgress = smoothstep(0.0, 1.0, position);
  outerProgress = mix(concentration, outerProgress, pow(aRandom, 1.7));
  float radius = 1.0 + outerProgress * 5.0;
  float angle = outerProgress - uTime * (1.0 - outerProgress) * 3.0;
  vec3 newPosition = vec3(sin(angle) * radius, 0.0, cos(angle) * radius);
  vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  gl_PointSize = aSize * uSize * uViewHeight;
  gl_PointSize *= (1.0 / -modelViewPosition.z);
  vColor = mix(uInnerColor, uOuterColor, outerProgress);
}`;

const PARTICLES_FRAG = /* glsl */ `
precision highp float;
precision highp int;
layout(location = 0) out vec4 pc_FragColor;
in vec3 vColor;
void main() {
  float distanceToCenter = length(gl_PointCoord - vec2(0.5));
  if (distanceToCenter > 0.5) discard;
  pc_FragColor = vec4(vColor, 0.5);
}`;

const DISTORTION_VERT = /* glsl */ `
precision highp float;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
}`;

const DISTORTION_FRAG = /* glsl */ `
precision highp float;
precision highp int;
in vec2 vUv;
layout(location = 0) out vec4 pc_FragColor;
float inverseLerp(float v, float a, float b) { return (v - a) / (b - a); }
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  return mix(outMin, outMax, inverseLerp(v, inMin, inMax));
}
void main() {
  float distanceToCenter = length(vUv - 0.5);
  float radialStrength = remap(distanceToCenter, 0.0, 0.15, 1.0, 0.0);
  radialStrength = smoothstep(0.0, 1.0, radialStrength);
  pc_FragColor = vec4(radialStrength, 1.0, 1.0, 1.0);
}`;

const FINAL_VERT = /* glsl */ `
precision highp float;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`;

const FINAL_FRAG = /* glsl */ `
precision highp float;
precision highp int;
#define PI 3.1415926538
in vec2 vUv;
uniform sampler2D uSpaceTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uBlackHolePosition;
uniform float uRGBShiftRadius;
layout(location = 0) out vec4 pc_FragColor;

vec3 getRGBShiftedColor(sampler2D tex, vec2 _uv, float _radius) {
  vec3 angle = vec3(PI * 2.0 / 3.0, PI * 4.0 / 3.0, 0.0);
  vec3 color = vec3(0.0);
  color.r = texture(tex, _uv + vec2(sin(angle.r) * _radius, cos(angle.r) * _radius)).r;
  color.g = texture(tex, _uv + vec2(sin(angle.g) * _radius, cos(angle.g) * _radius)).g;
  color.b = texture(tex, _uv + vec2(sin(angle.b) * _radius, cos(angle.b) * _radius)).b;
  return color;
}

void main() {
  float distortionIntensity = texture(uDistortionTexture, vUv).r;
  vec2 towardCenter = vUv - uBlackHolePosition;
  towardCenter *= -distortionIntensity * 2.0;
  vec2 distortedUv = vUv + towardCenter;
  vec3 outColor = getRGBShiftedColor(uSpaceTexture, distortedUv, uRGBShiftRadius);
  pc_FragColor = vec4(outColor, 1.0);
}`;

type Props = { className?: string };

export default function BlackHole({ className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // reduced-motion users just get the (already-static-ish) fallback gif
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // one-time feature detection → show the fallback gif instead
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      if (!renderer.capabilities.isWebGL2) throw new Error("WebGL2 required");
    } catch {
      setFailed(true);
      return;
    }

    const inner = new THREE.Color(INNER_COLOR);
    const outer = new THREE.Color(OUTER_COLOR);

    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 1);
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    root.appendChild(canvas);

    // ── camera: close-in with a slight downward tilt, so the disc reads as a
    // big ellipse — plus a 2× telephoto zoom straight into the event horizon ──
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 3.2, 9.0); // ~20° above the disc plane, pulled close
    camera.zoom = 2; // magnify the centre 2× (updateProjectionMatrix runs in resize)
    camera.lookAt(0, 0, 0);
    camera.rotateZ(-0.45); // roll the view ~26° so the disc cuts diagonally across the card

    // ── scenes: the "space" pass and the "distortion" pass ──────────────────
    const spaceScene = new THREE.Scene();
    const distortionScene = new THREE.Scene();

    // ── noise texture (baked once, tiling) for the accretion disc ───────────
    const noiseMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: NOISE_VERT,
      fragmentShader: NOISE_FRAG,
    });
    const noiseRT = new THREE.WebGLRenderTarget(256, 256, {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
    });
    {
      const noiseScene = new THREE.Scene();
      const noiseCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      const noisePlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), noiseMat);
      noisePlane.frustumCulled = false;
      noiseScene.add(noisePlane);
      renderer.setRenderTarget(noiseRT);
      renderer.render(noiseScene, noiseCam);
      renderer.setRenderTarget(null);
      noisePlane.geometry.dispose();
    }

    // ── starfield ───────────────────────────────────────────────────────────
    const STAR_COUNT = 1500;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const r = 60;
      starPos[i * 3 + 0] = Math.cos(a) * Math.sin(p) * r;
      starPos[i * 3 + 1] = Math.sin(a) * Math.sin(p) * r;
      starPos[i * 3 + 2] = Math.cos(p) * r;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      sizeAttenuation: false,
      color: new THREE.Color("#ffe6c0"),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    spaceScene.add(stars);

    // ── accretion disc (a flat cylinder ring in the XZ plane) ───────────────
    const discGeo = new THREE.CylinderGeometry(5, 1, 0, 64, 10, true);
    const discMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uNoiseTexture: { value: noiseRT.texture },
        uInnerColor: { value: inner },
        uOuterColor: { value: outer },
      },
      vertexShader: DISC_VERT,
      fragmentShader: DISC_FRAG,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    spaceScene.add(disc);

    // ── swirling particles ──────────────────────────────────────────────────
    const P_COUNT = 6000;
    const pPos = new Float32Array(P_COUNT);
    const pSize = new Float32Array(P_COUNT);
    const pRand = new Float32Array(P_COUNT);
    for (let i = 0; i < P_COUNT; i++) {
      pPos[i] = Math.random();
      pSize[i] = Math.random();
      pRand[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 1));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute("aRandom", new THREE.BufferAttribute(pRand, 1));
    // position is a 1-component spiral parameter (real positions are computed in
    // the vertex shader), so three's auto bounding-sphere would be NaN — set one
    // explicitly to keep the console quiet (culling is disabled anyway)
    pGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10);
    const pMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uInnerColor: { value: inner },
        uOuterColor: { value: outer },
        uViewHeight: { value: 512 },
        uSize: { value: 0.09 },
      },
      vertexShader: PARTICLES_VERT,
      fragmentShader: PARTICLES_FRAG,
    });
    const particles = new THREE.Points(pGeo, pMat);
    particles.frustumCulled = false; // position attr is a single float
    spaceScene.add(particles);

    // ── distortion field (a radial mask centred on the hole, facing camera) ─
    const distortionMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      vertexShader: DISTORTION_VERT,
      fragmentShader: DISTORTION_FRAG,
    });
    const distortionMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      distortionMat
    );
    distortionMesh.scale.set(10, 10, 10);
    distortionScene.add(distortionMesh);

    // ── final composite (full-screen lensing + RGB shift) ───────────────────
    const finalMat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSpaceTexture: { value: null as THREE.Texture | null },
        uDistortionTexture: { value: null as THREE.Texture | null },
        uBlackHolePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uRGBShiftRadius: { value: 0.006 },
      },
      vertexShader: FINAL_VERT,
      fragmentShader: FINAL_FRAG,
    });
    const finalScene = new THREE.Scene();
    const finalCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const finalPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), finalMat);
    finalPlane.frustumCulled = false;
    finalScene.add(finalPlane);

    // ── render targets, sized to the drawing buffer ─────────────────────────
    const spaceRT = new THREE.WebGLRenderTarget(2, 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
    });
    const distortionRT = new THREE.WebGLRenderTarget(2, 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      generateMipmaps: false,
    });
    finalMat.uniforms.uSpaceTexture.value = spaceRT.texture;
    finalMat.uniforms.uDistortionTexture.value = distortionRT.texture;

    const resize = () => {
      const w = Math.max(1, root.clientWidth);
      const h = Math.max(1, root.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const bw = Math.max(1, Math.floor(w * pr));
      const bh = Math.max(1, Math.floor(h * pr));
      spaceRT.setSize(bw, bh);
      distortionRT.setSize(Math.max(1, bw >> 1), Math.max(1, bh >> 1));
      pMat.uniforms.uViewHeight.value = bh;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // ── run only while hovered (the canvas is a hover reveal) and on screen ─
    const card = root.closest("a") ?? root;
    let hovered = false;
    let visible = false;
    let raf = 0;
    let start = 0;

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(root);

    const frame = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      // the disc's band scroll and the particles' orbits are both driven by
      // uTime — feed them a 10×-slower clock so the hole rotates lazily
      const rotT = t * 0.1;
      discMat.uniforms.uTime.value = rotT;
      pMat.uniforms.uTime.value = rotT + 9999.0;

      const v = new THREE.Vector3(0, 0, 0).project(camera);
      finalMat.uniforms.uBlackHolePosition.value.set(
        v.x * 0.5 + 0.5,
        v.y * 0.5 + 0.5
      );
      distortionMesh.lookAt(camera.position);

      renderer.setRenderTarget(spaceRT);
      renderer.render(spaceScene, camera);
      renderer.setRenderTarget(distortionRT);
      renderer.render(distortionScene, camera);
      renderer.setRenderTarget(null);
      renderer.render(finalScene, finalCam);

      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const shouldRun = hovered && visible;
      if (shouldRun && !raf) {
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onEnter = () => {
      hovered = true;
      sync();
    };
    const onLeave = () => {
      hovered = false;
      sync();
    };
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    // if the pointer is already resting on the card when we attach (page load /
    // hot reload under the cursor), there'll be no enter event — seed from :hover
    hovered = card.matches(":hover");
    sync();

    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      renderer.setRenderTarget(null);
      spaceRT.dispose();
      distortionRT.dispose();
      noiseRT.dispose();
      discGeo.dispose();
      discMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      distortionMesh.geometry.dispose();
      distortionMat.dispose();
      finalPlane.geometry.dispose();
      finalMat.dispose();
      noiseMat.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={rootRef} className={className} aria-hidden="true">
      {failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/blackhole.gif"
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
