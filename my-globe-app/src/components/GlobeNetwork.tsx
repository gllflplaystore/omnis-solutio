import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBE DOT SHADERS  (from the best working globe version)
// ─────────────────────────────────────────────────────────────────────────────

const vertexShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  attribute vec3  a_center;
  attribute float a_timeOffset;

  uniform float u_time;
  uniform float u_maxExtrusion;

  varying float v_timeOffset;

  void main() {
    vec3 newPosition;

    if (u_maxExtrusion > 1.0) {
      newPosition = a_center * u_maxExtrusion + sin(u_time + a_timeOffset);
    } else {
      newPosition = a_center * u_maxExtrusion;
    }

    vec3 localOffset = position - a_center;
    newPosition += localOffset;

    v_timeOffset = a_timeOffset;
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;
  varying float v_timeOffset;

  vec3 colorA = vec3(0.882, 0.400, 0.078);
  vec3 colorB = vec3(0.294, 0.118, 0.000);
  //vec3 colorA = vec3(0.882, 0.400, 0.078);
  //vec3 colorB = vec3(0.400, 0.200, 0.933);

  void main() {
    float pct   = abs(sin(u_time + v_timeOffset));
    vec3  color = mix(colorA, colorB, pct);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ARC LINE SHADERS
// u_drawHead  = 0→1 : the drawing tip advancing from A to B
// u_eraseHead = 0→1 : the erase tip chasing from A to B
// Only the band between eraseHead and drawHead is visible
// ─────────────────────────────────────────────────────────────────────────────

const arcVertexShader = `
  attribute float a_t;
  varying   float v_t;
  void main() {
    v_t         = a_t;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const arcFragmentShader = `
  precision mediump float;
  uniform float u_drawHead;
  uniform float u_eraseHead;
  uniform float u_opacity;
  uniform vec3  u_color;
  varying float v_t;
  void main() {
    if (v_t > u_drawHead  + 0.001) discard;
    if (v_t < u_eraseHead - 0.001) discard;
    // subtle brightness boost at the draw tip
    float nearTip = 1.0 - smoothstep(0.0, 0.06, u_drawHead - v_t);
    float alpha   = mix(0.6, 1.0, nearTip) * u_opacity;
    gl_FragColor  = vec4(u_color, alpha);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT DOT SHADERS  (Stripe style: filled disc + outer ring)
// Flat geometry placed on the sphere surface, fades in/out via u_opacity
// ─────────────────────────────────────────────────────────────────────────────

const endDotVertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const endDotFragmentShader = `
  precision mediump float;
  uniform vec3  u_color;
  uniform float u_opacity;
  void main() {
    gl_FragColor = vec4(u_color, u_opacity);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ARC ANIMATION TIMING  (seconds)
// ─────────────────────────────────────────────────────────────────────────────

const T_DOT_IN = 0.8; // endpoint dots fade in
const T_DRAW = 5.0; // arc draws from A → B
const T_HOLD = 1.5; // full arc holds
const T_ERASE = 3.5; // tail chases head, arc disappears A → B
const T_DOT_OUT = 0.8; // endpoint dots fade out
const T_GAP = 2.5; // silent pause before repeat  ← wider gap = clearer separation
const CYCLE = T_DOT_IN + T_DRAW + T_HOLD + T_ERASE + T_DOT_OUT + T_GAP;

// ─────────────────────────────────────────────────────────────────────────────
// ARC ROUTES  — edit these to connect any cities you like
// ─────────────────────────────────────────────────────────────────────────────

interface Route {
  from: [number, number];
  to: [number, number];
  color: number;
  delay: number;
  currency?: string; // source country — drives flag
  badgeCurrency?: string; // override display currency (defaults to BADGE_CURRENCY = "AED")
}

// Default badge currency — change this to any key in CURRENCY_META to switch
const BADGE_CURRENCY = "AED";

// Forward routes only — reverse arcs are auto-generated below
const BASE_ROUTES: Route[] = [
  {
    from: [40.71, -74.01],
    to: [25.2, 55.27],
    color: 0xe040fb,
    delay: 0.0,
    currency: "USD",
  }, // New York → Dubai
  {
    from: [51.51, -0.13],
    to: [25.2, 55.27],
    color: 0xffd54f,
    delay: 5.0,
    currency: "GBP",
  }, // London → Dubai
  {
    from: [35.68, 139.69],
    to: [25.2, 55.27],
    color: 0x40c4ff,
    delay: 10.0,
    currency: "JPY",
  }, // Tokyo → Dubai
  {
    from: [19.08, 72.88],
    to: [25.2, 55.27],
    color: 0x00e5ff,
    delay: 15.0,
    currency: "INR",
  }, // Mumbai → Dubai
  {
    from: [-33.87, 151.21],
    to: [25.2, 55.27],
    color: 0x69f0ae,
    delay: 20.0,
    currency: "AUD",
  }, // Sydney → Dubai
  {
    from: [48.85, 2.35],
    to: [25.2, 55.27],
    color: 0xf06292,
    delay: 25.0,
    currency: "EUR",
  }, // Paris → Dubai
  {
    from: [52.52, 13.4],
    to: [25.2, 55.27],
    color: 0x64ffda,
    delay: 30.0,
    currency: "EUR",
  }, // Berlin → Dubai
  {
    from: [55.75, 37.62],
    to: [25.2, 55.27],
    color: 0x82b1ff,
    delay: 35.0,
    currency: "RUB",
  }, // Moscow → Dubai
  {
    from: [-23.55, -46.63],
    to: [25.2, 55.27],
    color: 0xff4081,
    delay: 40.0,
    currency: "BRL",
  }, // São Paulo → Dubai
  {
    from: [1.35, 103.82],
    to: [25.2, 55.27],
    color: 0xa7ffeb,
    delay: 45.0,
    currency: "SGD",
  }, // Singapore → Dubai
  {
    from: [30.04, 31.24],
    to: [25.2, 55.27],
    color: 0xccff90,
    delay: 50.0,
    currency: "EGP",
  }, // Cairo → Dubai
  {
    from: [43.65, -79.38],
    to: [25.2, 55.27],
    color: 0xb388ff,
    delay: 55.0,
    currency: "CAD",
  }, // Toronto → Dubai
];

// Build full route list: forward arcs + reverse arcs (Dubai → World)
// Reverse arcs are offset by half a cycle so they interleave with forward arcs
const ROUTES: Route[] = [
  ...BASE_ROUTES,
  ...BASE_ROUTES.map((r) => ({
    from: r.to,
    to: r.from,
    color: r.color,
    delay: r.delay + CYCLE / 2,
    currency: BADGE_CURRENCY, // source is Dubai → UAE flag
  })),
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const SPHERE_R = 20;
const SEGMENTS = 120; // bezier sample count — higher = smoother arc

function latLonToVec3(
  lat: number,
  lon: number,
  r: number = SPHERE_R,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

// Great-circle spherical linear interpolation (replaces d3.geoInterpolate)
function gcSlerp(
  fromLL: [number, number],
  toLL: [number, number],
  t: number,
  r: number = SPHERE_R,
): THREE.Vector3 {
  const a = latLonToVec3(fromLL[0], fromLL[1], 1);
  const b = latLonToVec3(toLL[0], toLL[1], 1);
  const dot = Math.min(1, Math.max(-1, a.dot(b)));
  const om = Math.acos(dot);
  if (Math.abs(om) < 1e-5) return a.multiplyScalar(r);
  const s = Math.sin(om);
  return new THREE.Vector3(
    (a.x * Math.sin((1 - t) * om) + b.x * Math.sin(t * om)) / s,
    (a.y * Math.sin((1 - t) * om) + b.y * Math.sin(t * om)) / s,
    (a.z * Math.sin((1 - t) * om) + b.z * Math.sin(t * om)) / s,
  ).multiplyScalar(r);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD ENDPOINT DOT  (Stripe-style: solid inner disc + outer ring)
// Both shapes are flat geometry oriented outward from the sphere surface.
// ─────────────────────────────────────────────────────────────────────────────

interface EndpointDot {
  group: THREE.Group;
  mat: THREE.ShaderMaterial;
}

function makeEndpointDot(position: THREE.Vector3, color: number): EndpointDot {
  // Quaternion to rotate flat circle so it faces outward from sphere center
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    position.clone().normalize(),
  );
  const rot = new THREE.Matrix4().makeRotationFromQuaternion(quat);

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      u_color: { value: new THREE.Color(color) },
      u_opacity: { value: 0.0 },
    },
    vertexShader: endDotVertexShader,
    fragmentShader: endDotFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const group = new THREE.Group();

  // Inner filled disc
  const innerGeo = new THREE.CircleGeometry(0.14, 32);
  innerGeo.applyMatrix4(rot);
  innerGeo.translate(position.x, position.y, position.z);
  group.add(new THREE.Mesh(innerGeo, mat));

  // Outer ring
  const ringGeo = new THREE.RingGeometry(0.32, 0.4, 48);
  ringGeo.applyMatrix4(rot);
  ringGeo.translate(position.x, position.y, position.z);
  group.add(new THREE.Mesh(ringGeo, mat));

  return { group, mat };
}

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY BADGE  (HTML overlay — projected from the 3-D arc tip each frame)
// ─────────────────────────────────────────────────────────────────────────────

const CURRENCY_META: Record<
  string,
  { symbol: string; name: string; flag: string }
> = {
  USD: { symbol: "$", name: "US Dollar", flag: "/flags/us.svg" },
  GBP: { symbol: "\u00A3", name: "British Pound", flag: "/flags/uk.svg" },
  JPY: { symbol: "\u00A5", name: "Japanese Yen", flag: "/flags/japan.svg" },
  INR: { symbol: "\u20B9", name: "Indian Rupee", flag: "/flags/india.svg" },
  AUD: { symbol: "A$", name: "Aus Dollar", flag: "/flags/australia.svg" },
  AED: { symbol: "\u062F.\u0625", name: "UAE Dirham", flag: "/flags/ae.svg" },
  EUR: { symbol: "\u20AC", name: "Euro", flag: "/flags/france.svg" },
  RUB: { symbol: "\u20BD", name: "Russian Ruble", flag: "/flags/russia.svg" },
  BRL: { symbol: "R$", name: "Brazilian Real", flag: "/flags/brazil.svg" },
  SGD: { symbol: "S$", name: "Singapore Dollar", flag: "/flags/singapore.svg" },
  EGP: { symbol: "E\u00A3", name: "Egyptian Pound", flag: "/flags/egypt.svg" },
  CAD: { symbol: "CA$", name: "Canadian Dollar", flag: "/flags/canada.svg" },
};

function makeCurrencyBadge(
  flagCurrency: string, // source country code → determines flag
  displayCurrency: string, // which currency symbol to show (default: AED)
  color: number,
): HTMLDivElement {
  const flagMeta = CURRENCY_META[flagCurrency] ?? CURRENCY_META[BADGE_CURRENCY];
  const displayMeta =
    CURRENCY_META[displayCurrency] ?? CURRENCY_META[BADGE_CURRENCY];
  const hex = "#" + color.toString(16).padStart(6, "0");

  const el = document.createElement("div");
  el.style.cssText = [
    "position:absolute",
    "display:none",
    "pointer-events:none",
    "transform:translate(-50%,calc(-100% - 16px))",
    "width:88px",
    "overflow:visible",
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    "z-index:10",
  ].join(";");

  // <span style="font-size:9px;font-weight:800;color:rgba(255,255,255,0.8);letter-spacing:0.15em;position:relative;">${BADGE_CURRENCY}</span>

  el.innerHTML = `
    <div style="position:relative;width:50px;height:50px;">
      <!-- Outer glow ring -->
      <div style="position:absolute;inset:-4px;border-radius:50%;background:transparent;border:2px solid ${hex}44;box-shadow:0 0 20px ${hex}44;"></div>
      <!-- Main circle -->
      <div style="width:50px;height:50px;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(30,32,48,0.98),rgba(8,10,18,0.97));border:2px solid ${hex};box-shadow:0 0 30px ${hex}66,inset 0 0 24px ${hex}14;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden;">
        <!-- Shimmer arc inside circle -->
        <div style="position:absolute;top:0;left:0;right:0;height:44px;background:linear-gradient(180deg,${hex}18 0%,transparent 100%);border-radius:50% 50% 0 0 / 50% 50% 0 0;pointer-events:none;"></div>
        
        <span style="font-size:16px;font-weight:900;color:${hex};line-height:1;text-shadow:0 0 14px ${hex}bb;position:relative;">${displayMeta.symbol}</span>
        <span style="font-size:9px;font-weight:800;color:rgba(255,255,255,0.8);letter-spacing:0.15em;position:relative;">${displayCurrency}</span>
      </div>
      <!-- Source country flag badge top-right -->
      <div style="position:absolute;top:-4px;right:-6px;width:28px;height:19px;border-radius:4px;overflow:hidden;border:2px solid rgba(8,10,18,0.95);box-shadow:0 2px 8px rgba(0,0,0,0.7);">
        <img src="${flagMeta.flag}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <!-- Colored arrow pointer -->
      <div style="position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:9px solid ${hex};filter:drop-shadow(0 3px 6px ${hex}88);"></div>
    </div>
  `;
  return el;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD ARC
// ─────────────────────────────────────────────────────────────────────────────

interface ArcObject {
  line: THREE.Line;
  geo: THREE.BufferGeometry;
  mat: THREE.ShaderMaterial;
  dotA: EndpointDot;
  dotB: EndpointDot;
  curve: THREE.CubicBezierCurve3;
  badge?: HTMLDivElement;
}

function buildArc(route: Route): ArcObject {
  const sv = latLonToVec3(route.from[0], route.from[1]);
  const ev = latLonToVec3(route.to[0], route.to[1]);

  // Arc height proportional to distance — tall arcs like in the reference
  const lift = sv.distanceTo(ev) * 0.55 + SPHERE_R;
  const c1 = gcSlerp(route.from, route.to, 0.25)
    .normalize()
    .multiplyScalar(lift);
  const c2 = gcSlerp(route.from, route.to, 0.75)
    .normalize()
    .multiplyScalar(lift);

  // Store the curve so we can sample it during animation
  const curve = new THREE.CubicBezierCurve3(sv, c1, c2, ev);

  // Sample the cubic bezier into SEGMENTS points
  const pts = curve.getPoints(SEGMENTS);

  // BufferGeometry: position + a_t (0→1 along arc length)
  const posArr = new Float32Array(pts.length * 3);
  const tArr = new Float32Array(pts.length);
  pts.forEach((p, i) => {
    posArr[i * 3] = p.x;
    posArr[i * 3 + 1] = p.y;
    posArr[i * 3 + 2] = p.z;
    tArr[i] = i / (pts.length - 1);
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
  geo.setAttribute("a_t", new THREE.BufferAttribute(tArr, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      u_drawHead: { value: 0.0 },
      u_eraseHead: { value: 0.0 },
      u_opacity: { value: 0.0 },
      u_color: { value: new THREE.Color(route.color) },
    },
    vertexShader: arcVertexShader,
    fragmentShader: arcFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const line = new THREE.Line(geo, mat);
  const dotA = makeEndpointDot(sv, route.color);
  const dotB = makeEndpointDot(ev, route.color);

  // HTML badge — always created; falls back to AED flag+symbol when no currency set
  const badge = makeCurrencyBadge(
    route.currency ?? BADGE_CURRENCY,
    route.badgeCurrency ?? BADGE_CURRENCY,
    route.color,
  );

  return { line, geo, mat, dotA, dotB, curve, badge };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface GlobeNetworkProps {
  className?: string;
}

export default function GlobeNetwork({ className = "" }: GlobeNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId: number;
    let isIntersecting = false;
    let minMouseDownFlag = false;
    let mouseDown = false;
    let grabbing = false;

    // ── Scene ──────────────────────────────────────────────────────────────
    const sizes = {
      width: container.offsetWidth,
      height: container.offsetHeight,
    };
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(
      30,
      sizes.width / sizes.height,
      1,
      1000,
    );
    camera.position.z = window.innerWidth > 700 ? 100 : 140;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    // ── Lights ─────────────────────────────────────────────────────────────
    const pointLight = new THREE.PointLight(0x081b26, 17, 200);
    pointLight.position.set(-50, 0, 60);
    scene.add(pointLight);
    scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1.5));

    // ── Controls ───────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2 - 0.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.5;

    // ── Base sphere — raycasting target ────────────────────────────────────
    const baseSphere = new THREE.SphereGeometry(20, 35, 35);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x171717,
      transparent: true,
      opacity: 0.8,
    });
    const baseMesh = new THREE.Mesh(baseSphere, baseMaterial);
    scene.add(baseMesh);

    // ── Raycaster ──────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // ── Globe dot shader material ──────────────────────────────────────────
    const sharedMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        u_time: { value: 0.0 },
        u_maxExtrusion: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    });

    // ── Globe builder ──────────────────────────────────────────────────────
    const DOT_SPHERE_RADIUS = 20;
    const DOT_DENSITY = 3.5;

    const buildGlobe = (
      imageData: Uint8ClampedArray,
      imgWidth: number,
      imgHeight: number,
    ) => {
      // 1. Read land pixels → lat/lon map
      const activeLatLon: Record<number, number[]> = {};
      const lonStep = 360 / imgWidth;
      const latStep = 180 / imgHeight;

      for (let row = 0; row < imgHeight; row++) {
        const lat = Math.round(90 - row * latStep);
        if (!activeLatLon[lat]) activeLatLon[lat] = [];
        for (let col = 0; col < imgWidth; col++) {
          const i = (row * imgWidth + col) * 4;
          if (
            imageData[i] < 80 &&
            imageData[i + 1] < 80 &&
            imageData[i + 2] < 80
          ) {
            activeLatLon[lat].push(-180 + col * lonStep);
          }
        }
      }

      const visibleAt = (lon: number, lat: number): boolean => {
        const row = activeLatLon[lat];
        if (!row?.length) return false;
        const closest = row.reduce((p, c) =>
          Math.abs(c - lon) < Math.abs(p - lon) ? c : p,
        );
        return Math.abs(lon - closest) < 0.5;
      };

      const ll2v3 = (lon: number, lat: number): THREE.Vector3 => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -(DOT_SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta)),
          DOT_SPHERE_RADIUS * Math.cos(phi),
          DOT_SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta),
        );
      };

      // 2. Build dot center list
      const centers: THREE.Vector3[] = [];
      for (let lat = 90; lat > -90; lat--) {
        const radius =
          Math.cos(Math.abs(lat) * (Math.PI / 180)) * DOT_SPHERE_RADIUS;
        const dotsForLat = Math.floor(radius * Math.PI * 2 * DOT_DENSITY);
        for (let x = 0; x < dotsForLat; x++) {
          const lon = -180 + (x * 360) / dotsForLat;
          if (visibleAt(lon, lat)) centers.push(ll2v3(lon, lat));
        }
      }

      // 3. Merge all dot circles into ONE BufferGeometry → ONE draw call
      const DOT_RADIUS = 0.1;
      const DOT_SEGMENTS = 5;
      const template = new THREE.CircleGeometry(DOT_RADIUS, DOT_SEGMENTS);

      const vCount = template.attributes.position.count;
      const iCount = template.index!.count;
      const N = centers.length;

      const posArr = new Float32Array(N * vCount * 3);
      const centerArr = new Float32Array(N * vCount * 3);
      const offsetArr = new Float32Array(N * vCount);
      const idxArr = new Uint32Array(N * iCount);

      const tmpVec = new THREE.Vector3();
      const lookQuat = new THREE.Quaternion();
      const upVec = new THREE.Vector3(0, 0, 1);
      const vSrc = template.attributes.position.array as Float32Array;
      const iSrc = template.index!.array as Uint16Array;

      centers.forEach((center, pi) => {
        lookQuat.setFromUnitVectors(upVec, center.clone().normalize());
        const rotMat = new THREE.Matrix4().makeRotationFromQuaternion(lookQuat);
        const timeOffset = Math.random() * Math.PI * 2;

        for (let vi = 0; vi < vCount; vi++) {
          tmpVec.set(vSrc[vi * 3], vSrc[vi * 3 + 1], vSrc[vi * 3 + 2]);
          tmpVec.applyMatrix4(rotMat);
          tmpVec.add(center);

          const base = (pi * vCount + vi) * 3;
          posArr[base] = tmpVec.x;
          posArr[base + 1] = tmpVec.y;
          posArr[base + 2] = tmpVec.z;

          centerArr[base] = center.x;
          centerArr[base + 1] = center.y;
          centerArr[base + 2] = center.z;

          offsetArr[pi * vCount + vi] = timeOffset;
        }

        for (let ii = 0; ii < iCount; ii++) {
          idxArr[pi * iCount + ii] = iSrc[ii] + pi * vCount;
        }
      });

      const merged = new THREE.BufferGeometry();
      merged.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      merged.setAttribute("a_center", new THREE.BufferAttribute(centerArr, 3));
      merged.setAttribute(
        "a_timeOffset",
        new THREE.BufferAttribute(offsetArr, 1),
      );
      merged.setIndex(new THREE.BufferAttribute(idxArr, 1));
      merged.computeVertexNormals();

      scene.add(new THREE.Mesh(merged, sharedMaterial));
      template.dispose();

      // Build arcs only after globe dots are ready
      initArcs();
    };

    // ── Arc system ─────────────────────────────────────────────────────────
    const arcObjects: (ArcObject & { delay: number })[] = [];
    const overlay = overlayRef.current;

    const initArcs = () => {
      ROUTES.forEach((route) => {
        const arc = buildArc(route);
        scene.add(arc.line);
        scene.add(arc.dotA.group);
        scene.add(arc.dotB.group);
        if (arc.badge && overlay) overlay.appendChild(arc.badge);
        arcObjects.push({ ...arc, delay: route.delay });
      });
    };

    // Per-frame arc state machine:
    // Phase 1 — dots fade IN at A and B
    // Phase 2 — arc LINE draws from A → B (drawHead 0→1)
    // Phase 3 — full arc holds
    // Phase 4 — arc ERASES from A → B (eraseHead 0→1)
    // Phase 5 — dots fade OUT
    // Phase 6 — silent gap, then repeat
    const tickArcs = (elapsed: number) => {
      arcObjects.forEach(({ mat, dotA, dotB, delay, curve, badge }) => {
        const t = elapsed - delay;

        // Project arc tip to 2-D screen, then update HTML badge position
        const positionBadge = (headT: number, opacity: number) => {
          if (!badge) return;
          if (opacity <= 0) {
            badge.style.display = "none";
            return;
          }
          const clampedT = Math.max(0, Math.min(1, headT));
          const pos = curve.getPointAt(clampedT);
          const projected = pos.clone().project(camera);
          // hide when point is geometrically behind the camera
          if (projected.z > 1) {
            badge.style.display = "none";
            return;
          }
          const sx = (projected.x * 0.5 + 0.5) * sizes.width;
          const sy = (projected.y * -0.5 + 0.5) * sizes.height;
          badge.style.display = "block";
          badge.style.opacity = String(opacity);
          badge.style.left = `${sx}px`;
          badge.style.top = `${sy}px`;
        };

        // Not started yet — hide everything
        if (t < 0) {
          dotA.mat.uniforms.u_opacity.value = 0;
          dotB.mat.uniforms.u_opacity.value = 0;
          mat.uniforms.u_opacity.value = 0;
          mat.uniforms.u_drawHead.value = 0;
          mat.uniforms.u_eraseHead.value = 0;
          positionBadge(0, 0);
          return;
        }

        const phase = t % CYCLE;

        // Phase 1 — dots fade in
        if (phase < T_DOT_IN) {
          const p = phase / T_DOT_IN;
          dotA.mat.uniforms.u_opacity.value = p;
          dotB.mat.uniforms.u_opacity.value = p;
          mat.uniforms.u_opacity.value = 0;
          mat.uniforms.u_drawHead.value = 0;
          mat.uniforms.u_eraseHead.value = 0;
          positionBadge(0, 0);
          return;
        }

        // Phase 2 — arc draws A → B, badge flies at the draw tip
        const p2 = phase - T_DOT_IN;
        if (p2 < T_DRAW) {
          const drawHead = p2 / T_DRAW;
          dotA.mat.uniforms.u_opacity.value = 1;
          dotB.mat.uniforms.u_opacity.value = 1;
          mat.uniforms.u_opacity.value = 1;
          mat.uniforms.u_drawHead.value = drawHead;
          mat.uniforms.u_eraseHead.value = 0;
          positionBadge(drawHead, 1);
          return;
        }

        // Phase 3 — full arc holds, badge fades out
        const p3 = p2 - T_DRAW;
        if (p3 < T_HOLD) {
          dotA.mat.uniforms.u_opacity.value = 1;
          dotB.mat.uniforms.u_opacity.value = 1;
          mat.uniforms.u_opacity.value = 1;
          mat.uniforms.u_drawHead.value = 1;
          mat.uniforms.u_eraseHead.value = 0;
          positionBadge(1, 1 - p3 / T_HOLD);
          return;
        }

        // Phase 4 — erase: tail chases head from A side
        const p4 = p3 - T_HOLD;
        if (p4 < T_ERASE) {
          dotA.mat.uniforms.u_opacity.value = 1;
          dotB.mat.uniforms.u_opacity.value = 1;
          mat.uniforms.u_opacity.value = 1;
          mat.uniforms.u_drawHead.value = 1;
          mat.uniforms.u_eraseHead.value = p4 / T_ERASE;
          positionBadge(0, 0);
          return;
        }

        // Phase 5 — dots fade out, line fully gone
        const p5 = p4 - T_ERASE;
        if (p5 < T_DOT_OUT) {
          const op = 1 - p5 / T_DOT_OUT;
          dotA.mat.uniforms.u_opacity.value = op;
          dotB.mat.uniforms.u_opacity.value = op;
          mat.uniforms.u_opacity.value = 0;
          mat.uniforms.u_drawHead.value = 1;
          mat.uniforms.u_eraseHead.value = 1;
          positionBadge(0, 0);
          return;
        }

        // Phase 6 — gap, everything hidden
        dotA.mat.uniforms.u_opacity.value = 0;
        dotB.mat.uniforms.u_opacity.value = 0;
        mat.uniforms.u_opacity.value = 0;
        mat.uniforms.u_drawHead.value = 0;
        mat.uniforms.u_eraseHead.value = 0;
        positionBadge(0, 0);
      });
    };

    // ── Load world image ───────────────────────────────────────────────────
    // KEY FIX: store ctx in a single variable — calling getContext("2d") twice
    // on the same canvas in some browsers returns a fresh backing store on the
    // second call, making getImageData() return all-zero (black) pixel data,
    // which means no land is detected and no dots are placed.
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const off = document.createElement("canvas");
      off.width = image.width;
      off.height = image.height;
      const ctx = off.getContext("2d")!; // ← single reference, used for both
      ctx.drawImage(image, 0, 0);
      const { data } = ctx.getImageData(0, 0, image.width, image.height);
      buildGlobe(data, image.width, image.height);
    };
    image.src = "/img/world_alpha_mini.jpg";

    // ── Events ─────────────────────────────────────────────────────────────
    const getXY = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      if ("touches" in e && e.touches?.length)
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if ("changedTouches" in e && e.changedTouches?.length)
        return {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getXY(e);
      mouse.x = (x / window.innerWidth) * 2 - 1;
      mouse.y = (y / window.innerHeight) * -2 + 1;
      raycaster.setFromCamera(mouse, camera);
      isIntersecting = raycaster.intersectObject(baseMesh).length > 0;
      if (!grabbing)
        canvas.style.cursor = isIntersecting ? "pointer" : "default";
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (e.type === "touchstart") onMove(e);
      if (!isIntersecting) return;
      gsap.to(sharedMaterial.uniforms.u_maxExtrusion, {
        value: 1.07,
        duration: 0.3,
      });
      mouseDown = true;
      minMouseDownFlag = false;
      setTimeout(() => {
        minMouseDownFlag = true;
        if (!mouseDown) onUp();
      }, 500);
      canvas.style.cursor = "grabbing";
      grabbing = true;
    };

    const onUp = () => {
      mouseDown = false;
      if (!minMouseDownFlag) return;
      gsap.to(sharedMaterial.uniforms.u_maxExtrusion, {
        value: 1.0,
        duration: 0.3,
      });
      grabbing = false;
      canvas.style.cursor = isIntersecting ? "pointer" : "default";
    };

    const onResize = () => {
      sizes.width = container.offsetWidth;
      sizes.height = container.offsetHeight;
      camera.position.z = window.innerWidth > 700 ? 100 : 140;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove as EventListener);
    window.addEventListener("mousedown", onDown as EventListener);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onDown as EventListener, {
      passive: true,
    });
    window.addEventListener("touchmove", onMove as EventListener, {
      passive: true,
    });
    window.addEventListener("touchend", onUp);

    // ── Render loop ────────────────────────────────────────────────────────
    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();
      sharedMaterial.uniforms.u_time.value = elapsed * 0.6;
      tickArcs(elapsed);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove as EventListener);
      window.removeEventListener("mousedown", onDown as EventListener);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onDown as EventListener);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("touchend", onUp);

      arcObjects.forEach(({ line, geo, mat, dotA, dotB, badge }) => {
        scene.remove(line);
        scene.remove(dotA.group);
        scene.remove(dotB.group);
        if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
        geo.dispose();
        mat.dispose();
        dotA.mat.dispose();
        dotB.mat.dispose();
      });

      renderer.dispose();
      sharedMaterial.dispose();
      baseMaterial.dispose();
      baseSphere.dispose();
      controls.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        //background: "linear-gradient(to top, #000000, #000000, #000000)",
        background: "#171717",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
