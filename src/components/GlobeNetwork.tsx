import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

/* ------------------ CONSTANTS ------------------ */
const UAE = {
  lat: 10.42,
  lng: 43.84,
  name: "UAE",
  currency: "AED",
  countryCode: "ae",
};

const destinations = [
  {
    lat: 13.1458,
    lng: 68.0882,
    name: "India", // New Delhi (visual center)
    currency: "AED",
    countryCode: "in",
    direction: "in",
  },
  {
    lat: 27.7128,
    lng: -105.006,
    name: "USA", // New York (better visual than US center)
    currency: "AED",
    countryCode: "us",
    direction: "in",
  },
  {
    lat: 45.5074,
    lng: -10.2278,
    name: "UK", // London
    currency: "AED",
    countryCode: "gb",
    direction: "in",
  },
  {
    lat: 20.6762,
    lng: 125.6503,
    name: "Japan", // Tokyo
    currency: "AED",
    countryCode: "jp",
    direction: "in",
  },
  {
    lat: 35.3769,
    lng: 0.5417,
    name: "Switzerland", // Zurich
    currency: "AED",
    countryCode: "ch",
    direction: "in",
  },

  {
    lat: 13.1458,
    lng: 68.0882,
    name: "India", // New Delhi (visual center)
    currency: "INR",
    countryCode: "in",
    direction: "out",
  },
  {
    lat: 27.7128,
    lng: -105.006,
    name: "USA", // New York (better visual than US center)
    currency: "USD",
    countryCode: "us",
    direction: "out",
  },

  {
    lat: 27.7128,
    lng: -105.006,
    name: "USA", // New York (better visual than US center)
    currency: "BTC",
    countryCode: "us",
    direction: "crypto",
  },
  {
    lat: 45.5074,
    lng: -10.2278,
    name: "UK", // London
    currency: "USDT",
    countryCode: "gb",
    direction: "crypto",
  },
  {
    lat: 35.3769,
    lng: 0.5417,
    name: "Switzerland",
    currency: "ETH",
    countryCode: "ch",
    direction: "crypto",
  },
];

const cryptoRoutes = [
  { from: "gb", to: "us", symbol: "BTC" }, // UK → USA
  { from: "ch", to: "us", symbol: "ETH" }, // Switzerland → USA
  { from: "ch", to: "gb", symbol: "ETH" }, // Switzerland → UK
];

function interpolateGreatCircle(start: any, end: any, t: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(start.lat);
  const lon1 = toRad(start.lng);
  const lat2 = toRad(end.lat);
  const lon2 = toRad(end.lng);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );

  if (d === 0) return start;

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

/* ------------------ COMPONENT ------------------ */
export default function GlobalNetwork() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeSize, setGlobeSize] = useState(700);
  const [index, setIndex] = useState(0);
  const [arcProgress, setArcProgress] = useState(0);
  const [travelProgress, setTravelProgress] = useState(0);
  const [showArc, setShowArc] = useState(false);
  const [cryptoIndex, setCryptoIndex] = useState(0);

  /* ---------- RESPONSIVE SIZE ---------- */
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setGlobeSize(Math.min(width, 700));
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  /* ---------- INITIAL CAMERA ---------- */
  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enableZoom = false;

    globeRef.current.pointOfView({ lat: 25, lng: 60, altitude: 2.2 }, 0);
  }, []);

  /* ---------- ANIMATION LOOP ---------- */

  useEffect(() => {
    let frameId: number;
    let startTime: number;

    const arcDuration = 1600;
    const travelDuration = 2600;
    const totalDuration = arcDuration + travelDuration;

    setShowArc(true);
    setArcProgress(0);
    setTravelProgress(0);

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (elapsed <= arcDuration) {
        setArcProgress(elapsed / arcDuration);
      }

      if (elapsed > arcDuration && elapsed <= totalDuration) {
        setArcProgress(1);
        setTravelProgress((elapsed - arcDuration) / travelDuration);
      }

      if (elapsed < totalDuration) {
        frameId = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          if (currentDest.direction === "crypto") {
            setCryptoIndex((prev) => (prev + 1) % cryptoRoutes.length);
          }
          setIndex((prev) => (prev + 1) % destinations.length);
        }, 1200);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [index]);

  const currentDest = destinations[index];

  const cryptoCountries = destinations.filter((d) => d.direction === "crypto");

  const currentCryptoRoute = cryptoRoutes[cryptoIndex];

  const cryptoFrom = destinations.find(
    (d) => d.countryCode === currentCryptoRoute.from,
  )!;

  const cryptoTo = destinations.find(
    (d) => d.countryCode === currentCryptoRoute.to,
  )!;

  const movingPoint =
    currentDest.direction === "in"
      ? interpolateGreatCircle(currentDest, UAE, travelProgress)
      : currentDest.direction === "out"
        ? interpolateGreatCircle(UAE, currentDest, travelProgress)
        : interpolateGreatCircle(cryptoFrom, cryptoTo, travelProgress);
  /* ---------- RENDER ---------- */
  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center w-full relative"
    >
      {/* Radial glow behind globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,106,0,0.12) 0%, transparent 60%)",
        }}
      />
      <Globe
        ref={globeRef}
        width={globeSize}
        height={globeSize}
        globeImageUrl="/map.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#ff6a00"
        atmosphereAltitude={0.15}
        /* ---------- ARC ---------- */
        arcsData={
          showArc
            ? [
                currentDest.direction === "out"
                  ? {
                      startLat: currentDest.lat,
                      startLng: currentDest.lng,
                      endLat: UAE.lat,
                      endLng: UAE.lng,
                    }
                  : currentDest.direction === "in"
                    ? {
                        startLat: UAE.lat,
                        startLng: UAE.lng,
                        endLat: currentDest.lat,
                        endLng: currentDest.lng,
                      }
                    : {
                        startLat: cryptoTo.lat,
                        startLng: cryptoTo.lng,
                        endLat: cryptoFrom.lat,
                        endLng: cryptoFrom.lng,
                      },
              ]
            : []
        }
        arcColor={() => ["#ff6a00", "#ffb347"]}
        arcAltitude={0.3}
        arcStroke={1}
        arcDashLength={arcProgress}
        arcDashGap={1}
        arcDashAnimateTime={0}
        /* ---------- MARKERS ---------- */
        htmlElementsData={[
          // UAE flag
          {
            lat: UAE.lat,
            lng: UAE.lng,
            countryCode: UAE.countryCode,
            isFlag: true,
          },

          // Normal destination flag
          ...(currentDest.direction !== "crypto"
            ? [
                {
                  lat: currentDest.lat,
                  lng: currentDest.lng,
                  countryCode: currentDest.countryCode,
                  isFlag: true,
                },
              ]
            : []),

          // ✅ CRYPTO FLAGS (USA + UK + future auto)
          ...(currentDest.direction === "crypto"
            ? cryptoCountries.map((c) => ({
                lat: c.lat,
                lng: c.lng,
                countryCode: c.countryCode,
                isFlag: true,
              }))
            : []),

          // // Destination flag
          // {
          //   lat: currentDest.lat,
          //   lng: currentDest.lng,
          //   countryCode: currentDest.countryCode,
          //   isFlag: true,
          // },

          // Moving currency + flag
          ...(showArc
            ? [
                {
                  lat: movingPoint.lat,
                  lng: movingPoint.lng,
                  symbol: currentDest.currency,
                  countryCode: currentDest.countryCode,
                  isCurrency: true,
                  alt: 0.35 * Math.sin(Math.PI * travelProgress) + 0.05,
                },
              ]
            : []),
        ]}
        htmlElement={(d: any) => {
          const el = document.createElement("div");

          // Static flag
          if (d.isFlag) {
            el.innerHTML = `
              <div style="
                position:relative;
                display:flex;
                align-items:center;
                justify-content:center;
              ">
                <div style="
                  position:absolute;
                  width:36px;
                  height:36px;
                  border-radius:50%;
                  background:rgba(255,106,0,0.25);
                  animation:flagPulse 2s ease-in-out infinite;
                "></div>
                <img 
                  src="https://flagcdn.com/w40/${d.countryCode}.png"
                  style="
                    width:28px;
                    height:20px;
                    border-radius:4px;
                    box-shadow:0 0 12px rgba(255,106,0,0.7), 0 0 4px rgba(255,179,71,0.5);
                    position:relative;
                    z-index:1;
                  "
                />
              </div>
            `;
            return el;
          }

          // Moving currency badge
          if (d.isCurrency) {
            el.innerHTML = `
              <div style="
                display:flex;
                align-items:center;
                gap:6px;
                background:linear-gradient(135deg, #ff6a00, #ee0979);
                color:#fff;
                padding:6px 16px;
                border-radius:24px;
                font-weight:700;
                box-shadow:0 0 20px rgba(255,106,0,0.6), 0 4px 12px rgba(0,0,0,0.3);
                font-size:13px;
                font-family:sans-serif;
                letter-spacing:0.5px;
                animation:badgeGlow 1.5s ease-in-out infinite alternate;
              ">
                <img
                  src="https://flagcdn.com/w20/${d.countryCode}.png"
                  style="width:18px;height:13px;border-radius:2px;opacity:0.9;"
                />
                <span>${d.symbol}</span>
              </div>
            `;
            return el;
          }

          return el;
        }}
        htmlAltitude={(d: any) => d.alt || 0.05}
      />

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes flagPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes badgeGlow {
          0% { box-shadow: 0 0 14px rgba(255,106,0,0.5), 0 4px 12px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 0 28px rgba(255,106,0,0.8), 0 4px 16px rgba(238,9,121,0.4); }
        }
      `}</style>
    </div>
  );
}
