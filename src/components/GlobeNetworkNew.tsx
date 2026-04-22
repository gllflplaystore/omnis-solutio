import { useEffect, useRef, useCallback, useState } from "react";
import Globe from "react-globe.gl";

/* ================================================================
   STRIPE-STYLE GLOBAL PAYMENTS GLOBE
   – Multiple simultaneous animated arcs
   – Animated currency badges with flags traveling along arcs
   – Glowing city points with pulse rings
   – Premium dark aesthetic with orange accent
   ================================================================ */

/* ----------------------- GREAT CIRCLE INTERPOLATION ----------------------- */
function interpolateGreatCircle(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  t: number,
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(start.lat),
    lon1 = toRad(start.lng);
  const lat2 = toRad(end.lat),
    lon2 = toRad(end.lng);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );
  if (d === 0) return { lat: start.lat, lng: start.lng };

  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);
  const x =
    A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y =
    A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);

  return {
    lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
    lng: toDeg(Math.atan2(y, x)),
  };
}

/* ----------------------- LOCATIONS ----------------------- */
interface CityLocation {
  name: string;
  lat: number;
  lng: number;
  currency: string;
  currencySymbol: string;
  countryCode: string;
}

const LOCATIONS: CityLocation[] = [
  {
    name: "Dubai",
    lat: 25.2048,
    lng: 55.2708,
    currency: "AED",
    currencySymbol: "د.إ",
    countryCode: "ae",
  },
  {
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    currency: "GBP",
    currencySymbol: "£",
    countryCode: "gb",
  },
  {
    name: "New York",
    lat: 40.7128,
    lng: -74.006,
    currency: "USD",
    currencySymbol: "$",
    countryCode: "us",
  },
  {
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    currency: "INR",
    currencySymbol: "₹",
    countryCode: "in",
  },
  {
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    currency: "JPY",
    currencySymbol: "¥",
    countryCode: "jp",
  },
  {
    name: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    currency: "SGD",
    currencySymbol: "S$",
    countryCode: "sg",
  },
];

/* ----------------------- ROUTES (sequential, one at a time) ----------------------- */
// Only 5 clean routes — cycles through them one by one
const ROUTES: [number, number][] = [
  [0, 2], // Dubai → New York
  [1, 3], // London → Mumbai
  [0, 4], // Dubai → Tokyo
  [2, 5], // New York → Singapore
  [0, 1], // Dubai → London
];

/* ----------------------- COLORS ----------------------- */
const ARC_COLOR = ["rgba(255, 140, 50, 0.7)", "rgba(255, 100, 0, 0.12)"];

/* ----------------------- ANIMATION CONFIG ----------------------- */
const TRAVEL_DURATION = 2800; // ms for badge to travel the arc
const PAUSE_BETWEEN = 1200; // ms pause before next route
const CYCLE = TRAVEL_DURATION + PAUSE_BETWEEN;

/* ----------------------- TYPES ----------------------- */
interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface HtmlMarker {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  isFlag?: boolean;
  isBadge?: boolean;
  countryCode?: string;
  currency?: string;
  currencySymbol?: string;
  cityName?: string;
  opacity?: number;
}

/* ================================================================
   COMPONENT
   ================================================================ */
export default function GlobeNetworkNew() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [routeIndex, setRouteIndex] = useState(0);
  const [travelProgress, setTravelProgress] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  /* ---------- RESPONSIVE SIZE ---------- */
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height, 700);
      setDimensions({ width: size, height: size });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- INITIAL CAMERA + CONTROLS ---------- */
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;
    globeRef.current.pointOfView({ lat: 20, lng: 40, altitude: 2.0 }, 0);
  }, []);

  /* ---------- SEQUENTIAL ANIMATION — one route at a time ---------- */
  useEffect(() => {
    let frameId: number;
    let startTime = 0;

    setShowBadge(true);
    setTravelProgress(0);

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (elapsed <= TRAVEL_DURATION) {
        setTravelProgress(elapsed / TRAVEL_DURATION);
        setShowBadge(true);
      } else if (elapsed <= CYCLE) {
        setTravelProgress(1);
        setShowBadge(false);
      } else {
        // Move to next route
        setRouteIndex((prev) => (prev + 1) % ROUTES.length);
        return; // new effect will fire
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [routeIndex]);

  /* ---------- CURRENT ROUTE DATA ---------- */
  const [fromIdx, toIdx] = ROUTES[routeIndex];
  const from = LOCATIONS[fromIdx];
  const to = LOCATIONS[toIdx];

  // Badge position along great circle
  const badgePos = interpolateGreatCircle(from, to, travelProgress);
  const arcHeight = 0.08 + 0.25 * Math.sin(Math.PI * travelProgress);
  const badgeOpacity =
    travelProgress < 0.06
      ? travelProgress / 0.06
      : travelProgress > 0.94
        ? (1 - travelProgress) / 0.06
        : 1;

  // Arc data — only the active arc
  const arcsData: ArcDatum[] = [
    { startLat: from.lat, startLng: from.lng, endLat: to.lat, endLng: to.lng },
  ];

  // HTML markers — 2 endpoint flags + 1 traveling badge (max 3 DOM nodes)
  const htmlMarkers: HtmlMarker[] = [
    {
      id: `flag-from-${fromIdx}`,
      lat: from.lat,
      lng: from.lng,
      alt: 0.01,
      isFlag: true,
      countryCode: from.countryCode,
      cityName: from.name,
    },
    {
      id: `flag-to-${toIdx}`,
      lat: to.lat,
      lng: to.lng,
      alt: 0.01,
      isFlag: true,
      countryCode: to.countryCode,
      cityName: to.name,
    },
  ];

  if (showBadge) {
    htmlMarkers.push({
      id: `badge-${routeIndex}`,
      lat: badgePos.lat,
      lng: badgePos.lng,
      alt: arcHeight,
      isBadge: true,
      countryCode: to.countryCode,
      currency: to.currency,
      currencySymbol: to.currencySymbol,
      cityName: to.name,
      opacity: badgeOpacity,
    });
  }

  /* ---------- CUSTOM GLOBE MATERIAL ---------- */
  const onGlobeReady = useCallback(() => {
    if (!globeRef.current) return;
    const scene = globeRef.current.scene();
    if (scene) {
      scene.traverse((obj: any) => {
        if (obj.isMesh && obj.material) {
          obj.material.opacity = 0.9;
        }
      });
    }
  }, []);

  /* ---------- CALLBACKS ---------- */
  const arcColorFn = useCallback(() => ARC_COLOR, []);
  const arcAltitudeFn = useCallback(() => 0.06, []);
  const arcStrokeFn = useCallback(() => 0.4, []);
  const arcDashLengthFn = useCallback(() => travelProgress, [travelProgress]);
  const arcDashGapFn = useCallback(() => 2, []);
  const arcDashAnimateTimeFn = useCallback(() => 0, []);

  const htmlElementFn = useCallback((d: object) => {
    const m = d as HtmlMarker;
    const el = document.createElement("div");

    if (m.isFlag) {
      el.innerHTML = `
        <img
          src="https://flagcdn.com/w40/${m.countryCode}.png"
          alt="${m.cityName}"
          style="
            width: 24px; height: 16px; border-radius: 3px;
            box-shadow: 0 0 10px rgba(255, 140, 50, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.2);
          "
        />
      `;
      return el;
    }

    if (m.isBadge) {
      const opacity = m.opacity ?? 1;
      el.style.pointerEvents = "none";
      el.innerHTML = `
        <div style="
          display: flex; align-items: center; gap: 6px;
          background: rgba(255, 255, 255, 0.95);
          color: #1a1a1a;
          padding: 5px 12px 5px 7px;
          border-radius: 20px;
          font-weight: 600; font-size: 12px;
          font-family: 'Inter', system-ui, sans-serif;
          box-shadow: 0 0 20px rgba(255, 140, 50, 0.5), 0 2px 10px rgba(0,0,0,0.3);
          white-space: nowrap;
          opacity: ${opacity};
          transform: translate(-50%, -50%);
          border: 1px solid rgba(255, 140, 50, 0.25);
        ">
          <img
            src="https://flagcdn.com/w20/${m.countryCode}.png"
            alt="${m.currency}"
            style="width: 18px; height: 12px; border-radius: 2px; flex-shrink: 0;"
          />
          <span>${m.currencySymbol} ${m.currency}</span>
        </div>
      `;
      return el;
    }

    return el;
  }, []);

  const htmlAltitudeFn = useCallback(
    (d: object) => (d as HtmlMarker).alt ?? 0.01,
    [],
  );

  /* ---------- RENDER ---------- */
  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full min-h-75"
      style={{ aspectRatio: "1 / 1" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 120, 30, 0.06) 0%, transparent 60%)",
        }}
      />

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="/world-mp-data.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="rgba(255, 140, 50, 0.12)"
        atmosphereAltitude={0.18}
        onGlobeReady={onGlobeReady}
        /* --- single arc --- */
        arcsData={arcsData}
        arcColor={arcColorFn}
        arcAltitude={arcAltitudeFn}
        arcStroke={arcStrokeFn}
        arcDashLength={arcDashLengthFn}
        arcDashGap={arcDashGapFn}
        arcDashAnimateTime={arcDashAnimateTimeFn}
        /* --- flags + badge --- */
        htmlElementsData={htmlMarkers}
        htmlElement={htmlElementFn}
        htmlAltitude={htmlAltitudeFn}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg, #000) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
