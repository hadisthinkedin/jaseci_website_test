"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/* ───────────────────────────────────────────────
   Interactive neural network — a glowing "quantum cortex" of nodes and flowing
   connections with energy pulses rippling through it, bloomed for the neon
   look. Ported from the original stand-alone build, stripped to just the
   pieces that draw the effect: no UI panels / theme selector / density slider /
   control buttons / OrbitControls / raycaster / FilmPass / CDN import-map.
   One formation (the radial cortex), one palette (warm, matching the site's
   accent), and the click-pulses are replaced by pulses that fire on their own
   every couple of seconds — this lives inside a link, so it can't be clicked.

   Same harness as BlackHole: the canvas fills the whole card as a hover
   reveal, the render loop runs only while the card is hovered AND on screen,
   and it falls back to the original gif without WebGL2.
   ─────────────────────────────────────────────── */

// warm palette (the original's palette #2) — amber → orange → deep red
const PALETTE_HEX = [0xf59e0b, 0xf97316, 0xdc2626, 0x7f1d1d, 0xfbbf24];

/* ── shaders (standard ShaderMaterial — three injects the built-ins) ────────── */

const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m*=m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,float time){
  float value=0.0;float amplitude=0.5;float frequency=1.0;
  for(int i=0;i<3;i++){
    value+=amplitude*snoise(p*frequency+time*0.2*frequency);
    amplitude*=0.5;frequency*=2.0;
  }
  return value;
}`;

const PULSE_GLSL = /* glsl */ `
float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
  if (pulseTime < 0.0) return 0.0;
  float timeSinceClick = uTime - pulseTime;
  if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;
  float pulseRadius = timeSinceClick * uPulseSpeed;
  float distToClick = distance(worldPos, pulsePos);
  float waveProximity = abs(distToClick - pulseRadius);
  return smoothstep(2.0, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
}`;

const NODE_VERT = /* glsl */ `
attribute float nodeSize;
attribute float nodeType;
attribute vec3 nodeColor;
attribute float distanceFromRoot;
uniform float uTime;
uniform vec3 uPulsePositions[3];
uniform float uPulseTimes[3];
uniform float uPulseSpeed;
uniform float uBaseNodeSize;
varying vec3 vColor;
varying float vNodeType;
varying vec3 vPosition;
varying float vPulseIntensity;
varying float vDistanceFromRoot;
${PULSE_GLSL}
void main() {
  vNodeType = nodeType;
  vColor = nodeColor;
  vDistanceFromRoot = distanceFromRoot;
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vPosition = worldPos;
  float totalPulseIntensity = 0.0;
  for (int i = 0; i < 3; i++) {
    totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
  }
  vPulseIntensity = min(totalPulseIntensity, 1.0);
  float timeScale = 0.5 + 0.5 * sin(uTime * 0.8 + distanceFromRoot * 0.2);
  float baseSize = nodeSize * (0.8 + 0.2 * timeScale);
  float pulseSize = baseSize * (1.0 + vPulseIntensity * 2.0);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = pulseSize * uBaseNodeSize * (800.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}`;

const NODE_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uPulseColors[3];
varying vec3 vColor;
varying float vNodeType;
varying vec3 vPosition;
varying float vPulseIntensity;
varying float vDistanceFromRoot;
void main() {
  vec2 center = 2.0 * gl_PointCoord - 1.0;
  float dist = length(center);
  if (dist > 1.0) discard;
  float glowStrength = pow(1.0 - smoothstep(0.0, 1.0, dist), 1.4);
  vec3 baseColor = vColor * (0.8 + 0.2 * sin(uTime * 0.5 + vDistanceFromRoot * 0.3));
  vec3 finalColor = baseColor;
  if (vPulseIntensity > 0.0) {
    vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
    finalColor = mix(baseColor, pulseColor, vPulseIntensity);
    finalColor *= (1.0 + vPulseIntensity * 0.7);
  }
  float alpha = glowStrength * (0.9 - 0.5 * dist);
  float camDistance = length(vPosition - cameraPosition);
  float distanceFade = smoothstep(80.0, 10.0, camDistance);
  if (vNodeType > 0.5) { alpha *= 0.85; } else { finalColor *= 1.2; }
  gl_FragColor = vec4(finalColor, alpha * distanceFade);
}`;

const CONNECTION_VERT = /* glsl */ `
attribute vec3 startPoint;
attribute vec3 endPoint;
attribute float connectionStrength;
attribute float pathIndex;
attribute vec3 connectionColor;
uniform float uTime;
uniform vec3 uPulsePositions[3];
uniform float uPulseTimes[3];
uniform float uPulseSpeed;
varying vec3 vColor;
varying float vConnectionStrength;
varying float vPulseIntensity;
varying float vPathPosition;
${NOISE_GLSL}
${PULSE_GLSL}
void main() {
  float t = position.x;
  vPathPosition = t;
  vec3 midPoint = mix(startPoint, endPoint, 0.5);
  float pathOffset = sin(t * 3.14159) * 0.1;
  vec3 perpendicular = normalize(cross(normalize(endPoint - startPoint), vec3(0.0, 1.0, 0.0)));
  if (length(perpendicular) < 0.1) perpendicular = vec3(1.0, 0.0, 0.0);
  midPoint += perpendicular * pathOffset;
  vec3 p0 = mix(startPoint, midPoint, t);
  vec3 p1 = mix(midPoint, endPoint, t);
  vec3 finalPos = mix(p0, p1, t);
  float noiseTime = uTime * 0.2;
  float noise = fbm(vec3(pathIndex * 0.1, t * 0.5, noiseTime), noiseTime);
  finalPos += perpendicular * noise * 0.1;
  vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;
  float totalPulseIntensity = 0.0;
  for (int i = 0; i < 3; i++) {
    totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
  }
  vPulseIntensity = min(totalPulseIntensity, 1.0);
  vColor = connectionColor;
  vConnectionStrength = connectionStrength;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}`;

const CONNECTION_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uPulseColors[3];
varying vec3 vColor;
varying float vConnectionStrength;
varying float vPulseIntensity;
varying float vPathPosition;
void main() {
  vec3 baseColor = vColor * (0.7 + 0.3 * sin(uTime * 0.5 + vPathPosition * 10.0));
  float flowPattern = sin(vPathPosition * 20.0 - uTime * 3.0) * 0.5 + 0.5;
  float flowIntensity = 0.3 * flowPattern * vConnectionStrength;
  vec3 finalColor = baseColor;
  if (vPulseIntensity > 0.0) {
    vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
    finalColor = mix(baseColor, pulseColor, vPulseIntensity);
    flowIntensity += vPulseIntensity * 0.5;
  }
  finalColor *= (0.6 + flowIntensity + vConnectionStrength * 0.4);
  float alpha = 0.8 * vConnectionStrength + 0.2 * flowPattern;
  alpha = mix(alpha, min(1.0, alpha * 2.0), vPulseIntensity);
  gl_FragColor = vec4(finalColor, alpha);
}`;

/* ── network generation (the "quantum cortex" formation only) ───────────────── */

type Connection = { node: NetNode; strength: number };

class NetNode {
  position: THREE.Vector3;
  connections: Connection[] = [];
  level: number;
  type: number;
  size: number;
  distanceFromRoot = 0;

  constructor(position: THREE.Vector3, level = 0, type = 0) {
    this.position = position;
    this.level = level;
    this.type = type;
    this.size =
      type === 0
        ? THREE.MathUtils.randFloat(0.7, 1.2)
        : THREE.MathUtils.randFloat(0.4, 0.9);
  }

  addConnection(node: NetNode, strength = 1.0) {
    if (!this.isConnectedTo(node)) {
      this.connections.push({ node, strength });
      node.connections.push({ node: this, strength });
    }
  }

  isConnectedTo(node: NetNode) {
    return this.connections.some((conn) => conn.node === node);
  }
}

function generateQuantumCortex(): NetNode[] {
  const nodes: NetNode[] = [];
  const rootNode = new NetNode(new THREE.Vector3(0, 0, 0), 0, 0);
  rootNode.size = 1.5;
  nodes.push(rootNode);

  const primaryAxes = 6;
  const nodesPerAxis = 8;
  const axisLength = 20;
  const axisEndpoints: NetNode[] = [];

  // radial axes fanning out of the root
  for (let a = 0; a < primaryAxes; a++) {
    const phi = Math.acos(-1 + (2 * a) / primaryAxes);
    const theta = Math.PI * (1 + Math.sqrt(5)) * a;
    const dirVec = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );
    let prevNode = rootNode;
    for (let i = 1; i <= nodesPerAxis; i++) {
      const t = i / nodesPerAxis;
      const distance = axisLength * Math.pow(t, 0.8);
      const pos = dirVec.clone().multiplyScalar(distance);
      const newNode = new NetNode(pos, i, i === nodesPerAxis ? 1 : 0);
      newNode.distanceFromRoot = distance;
      nodes.push(newNode);
      prevNode.addConnection(newNode, 1.0 - t * 0.3);
      prevNode = newNode;
      if (i === nodesPerAxis) axisEndpoints.push(newNode);
    }
  }

  // concentric rings woven between the axes
  const ringDistances = [5, 10, 15];
  const ringNodes: NetNode[][] = [];
  for (const ringDist of ringDistances) {
    const nodesInRing = Math.floor(ringDist * 3);
    const ringLayer: NetNode[] = [];
    for (let i = 0; i < nodesInRing; i++) {
      const ringPhi = Math.acos(2 * Math.random() - 1);
      const ringTheta = 2 * Math.PI * (i / nodesInRing);
      const pos = new THREE.Vector3(
        ringDist * Math.sin(ringPhi) * Math.cos(ringTheta),
        ringDist * Math.sin(ringPhi) * Math.sin(ringTheta),
        ringDist * Math.cos(ringPhi)
      );
      const newNode = new NetNode(
        pos,
        Math.ceil(ringDist / 5),
        Math.random() < 0.4 ? 1 : 0
      );
      newNode.distanceFromRoot = ringDist;
      nodes.push(newNode);
      ringLayer.push(newNode);
    }
    ringNodes.push(ringLayer);

    for (let i = 0; i < ringLayer.length; i++) {
      ringLayer[i].addConnection(ringLayer[(i + 1) % ringLayer.length], 0.7);
      if (i % 4 === 0 && ringLayer.length > 5) {
        const jumpIdx = (i + Math.floor(ringLayer.length / 2)) % ringLayer.length;
        ringLayer[i].addConnection(ringLayer[jumpIdx], 0.4);
      }
    }
  }

  // lace each ring node to its nearest axis node
  for (const ring of ringNodes) {
    for (const node of ring) {
      let closest: NetNode | null = null;
      let minDist = Infinity;
      for (const n of nodes) {
        if (n === rootNode || n === node || n.level === 0 || n.type !== 0) continue;
        const dist = node.position.distanceTo(n.position);
        if (dist < minDist) {
          minDist = dist;
          closest = n;
        }
      }
      if (closest && minDist < 8) {
        node.addConnection(closest, 0.5 + (1 - minDist / 8) * 0.5);
      }
    }
  }

  // sparse bridges between adjacent rings
  for (let r = 0; r < ringNodes.length - 1; r++) {
    const inner = ringNodes[r];
    const outer = ringNodes[r + 1];
    for (let i = 0; i < Math.floor(inner.length * 0.5); i++) {
      const a = inner[Math.floor(Math.random() * inner.length)];
      const b = outer[Math.floor(Math.random() * outer.length)];
      if (!a.isConnectedTo(b)) a.addConnection(b, 0.6);
    }
  }

  // long arcs between axis endpoints, via jittered intermediates
  for (let i = 0; i < axisEndpoints.length; i++) {
    const startNode = axisEndpoints[i];
    const endNode = axisEndpoints[(i + 2) % axisEndpoints.length];
    let prevNode = startNode;
    for (let j = 1; j <= 3; j++) {
      const t = j / 4;
      const pos = new THREE.Vector3().lerpVectors(
        startNode.position,
        endNode.position,
        t
      );
      pos.add(
        new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(3),
          THREE.MathUtils.randFloatSpread(3),
          THREE.MathUtils.randFloatSpread(3)
        )
      );
      const newNode = new NetNode(pos, startNode.level, 0);
      newNode.distanceFromRoot = pos.length();
      nodes.push(newNode);
      prevNode.addConnection(newNode, 0.5);
      prevNode = newNode;
    }
    prevNode.addConnection(endNode, 0.5);
  }

  return nodes;
}

type Props = { className?: string };

export default function NeuralNetwork({ className }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      if (!renderer.capabilities.isWebGL2) throw new Error("WebGL2 required");
    } catch {
      setFailed(true);
      return;
    }

    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    root.appendChild(canvas);

    const palette = PALETTE_HEX.map((h) => new THREE.Color(h));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1200);
    camera.position.set(0, 6, 23); // slight downward tilt into the cortex
    camera.lookAt(0, 0, 0);

    // ── starfield backdrop ───────────────────────────────────────────────────
    const STAR_COUNT = 2000;
    const starPos: number[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = THREE.MathUtils.randFloat(40, 120);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      starPos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPos, 3)
    );
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      sizeAttenuation: true,
      depthWrite: false,
      opacity: 0.8,
      transparent: true,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // ── shared pulse uniforms (one dict drives both materials in lockstep) ──
    const uniforms = {
      uTime: { value: 0.0 },
      uPulsePositions: {
        value: [
          new THREE.Vector3(1e3, 1e3, 1e3),
          new THREE.Vector3(1e3, 1e3, 1e3),
          new THREE.Vector3(1e3, 1e3, 1e3),
        ],
      },
      uPulseTimes: { value: [-1e3, -1e3, -1e3] },
      uPulseColors: {
        value: [
          new THREE.Color(1, 1, 1),
          new THREE.Color(1, 1, 1),
          new THREE.Color(1, 1, 1),
        ],
      },
      uPulseSpeed: { value: 15.0 },
      uBaseNodeSize: { value: 0.5 },
    };

    // ── build the network meshes ─────────────────────────────────────────────
    const netNodes = generateQuantumCortex();
    const network = new THREE.Group();
    scene.add(network);

    const jitter = (c: THREE.Color) =>
      c
        .clone()
        .offsetHSL(
          THREE.MathUtils.randFloatSpread(0.05),
          THREE.MathUtils.randFloatSpread(0.1),
          THREE.MathUtils.randFloatSpread(0.1)
        );

    const nodePositions: number[] = [];
    const nodeTypes: number[] = [];
    const nodeSizes: number[] = [];
    const nodeColors: number[] = [];
    const nodeDistances: number[] = [];
    for (const node of netNodes) {
      nodePositions.push(node.position.x, node.position.y, node.position.z);
      nodeTypes.push(node.type);
      nodeSizes.push(node.size);
      nodeDistances.push(node.distanceFromRoot);
      const c = jitter(palette[Math.min(node.level, palette.length - 1)]);
      nodeColors.push(c.r, c.g, c.b);
    }
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(nodePositions, 3)
    );
    nodesGeo.setAttribute(
      "nodeType",
      new THREE.Float32BufferAttribute(nodeTypes, 1)
    );
    nodesGeo.setAttribute(
      "nodeSize",
      new THREE.Float32BufferAttribute(nodeSizes, 1)
    );
    nodesGeo.setAttribute(
      "nodeColor",
      new THREE.Float32BufferAttribute(nodeColors, 3)
    );
    nodesGeo.setAttribute(
      "distanceFromRoot",
      new THREE.Float32BufferAttribute(nodeDistances, 1)
    );
    const nodesMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: NODE_VERT,
      fragmentShader: NODE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    network.add(nodesMesh);

    const connPositions: number[] = [];
    const connStarts: number[] = [];
    const connEnds: number[] = [];
    const connStrengths: number[] = [];
    const connColors: number[] = [];
    const connPathIndices: number[] = [];
    const processed = new Set<string>();
    let pathIndex = 0;
    const SEGMENTS = 15;
    netNodes.forEach((node, nodeIndex) => {
      for (const connection of node.connections) {
        const otherIndex = netNodes.indexOf(connection.node);
        if (otherIndex === -1) continue;
        const key = `${Math.min(nodeIndex, otherIndex)}-${Math.max(nodeIndex, otherIndex)}`;
        if (processed.has(key)) continue;
        processed.add(key);
        const s = node.position;
        const e = connection.node.position;
        const avgLevel = Math.min(
          Math.floor((node.level + connection.node.level) / 2),
          palette.length - 1
        );
        for (let i = 0; i < SEGMENTS; i++) {
          connPositions.push(i / (SEGMENTS - 1), 0, 0);
          connStarts.push(s.x, s.y, s.z);
          connEnds.push(e.x, e.y, e.z);
          connPathIndices.push(pathIndex);
          connStrengths.push(connection.strength);
          const c = jitter(palette[avgLevel]);
          connColors.push(c.r, c.g, c.b);
        }
        pathIndex++;
      }
    });
    const connGeo = new THREE.BufferGeometry();
    connGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(connPositions, 3)
    );
    connGeo.setAttribute(
      "startPoint",
      new THREE.Float32BufferAttribute(connStarts, 3)
    );
    connGeo.setAttribute(
      "endPoint",
      new THREE.Float32BufferAttribute(connEnds, 3)
    );
    connGeo.setAttribute(
      "connectionStrength",
      new THREE.Float32BufferAttribute(connStrengths, 1)
    );
    connGeo.setAttribute(
      "connectionColor",
      new THREE.Float32BufferAttribute(connColors, 3)
    );
    connGeo.setAttribute(
      "pathIndex",
      new THREE.Float32BufferAttribute(connPathIndices, 1)
    );
    // 'position' here is a path parameter (t,0,0), not real coordinates — set an
    // explicit bounding sphere so three doesn't compute a useless one
    connGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 25);
    nodesGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 25);
    const connMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: CONNECTION_VERT,
      fragmentShader: CONNECTION_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const connMesh = new THREE.LineSegments(connGeo, connMat);
    connMesh.frustumCulled = false;
    nodesMesh.frustumCulled = false;
    network.add(connMesh);

    // ── composer: render → bloom → output ───────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(pr);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(2, 2), 1.5, 0.4, 0.68);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    const resize = () => {
      const w = Math.max(1, root.clientWidth);
      const h = Math.max(1, root.clientHeight);
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // ── auto-firing pulses (this is a hover preview — no clicks available) ──
    let lastPulseIndex = 0;
    let nextPulseAt = 0.6; // first pulse shortly after reveal
    const firePulse = (t: number) => {
      lastPulseIndex = (lastPulseIndex + 1) % 3;
      const dir = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2)
      ).normalize();
      uniforms.uPulsePositions.value[lastPulseIndex]
        .copy(dir)
        .multiplyScalar(THREE.MathUtils.randFloat(2, 14));
      uniforms.uPulseTimes.value[lastPulseIndex] = t;
      uniforms.uPulseColors.value[lastPulseIndex].copy(
        palette[Math.floor(Math.random() * palette.length)]
      );
    };

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
      uniforms.uTime.value = t;

      if (t >= nextPulseAt) {
        firePulse(t);
        nextPulseAt = t + 1.4 + Math.random() * 1.2;
      }

      // slow spin + the original's gentle wobble
      network.rotation.y = t * 0.06 + Math.sin(t * 0.05) * 0.08;
      starField.rotation.y = t * 0.018;

      composer.render();
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
      composer.dispose();
      bloomPass.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      connGeo.dispose();
      connMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={rootRef} className={className} aria-hidden="true">
      {failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/network.gif"
          alt=""
          aria-hidden="true"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
