import React, { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  countryCode: string;
}

const nodes: Node[] = [
  { id: "usa", x: 280, y: 220, countryCode: "us" },
  { id: "brazil", x: 430, y: 400, countryCode: "br" },
  { id: "uk", x: 580, y: 150, countryCode: "gb" },
  { id: "sl", x: 560, y: 290, countryCode: "sl" },
  { id: "uae", x: 700, y: 260, countryCode: "ae" },
  { id: "za", x: 640, y: 480, countryCode: "za" },
  { id: "india", x: 910, y: 250, countryCode: "in" },
  { id: "japan", x: 1040, y: 210, countryCode: "jp" },
  { id: "aus", x: 1020, y: 450, countryCode: "au" },
];

const connections = [
  { from: "uae", to: "india" },
  { from: "uae", to: "brazil" },
  { from: "uae", to: "japan" },
  { from: "uae", to: "sl" },
  { from: "usa", to: "uae" },
  { from: "uk", to: "uae" },
  { from: "aus", to: "uae" },
  { from: "za", to: "uae" },
];

const WorldMapNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [activeNodes, setActiveNodes] = useState<string[]>([]);

  // ================= BACKGROUND =================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground();
    };

    const mapImg = new Image();
    mapImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg";
    mapImg.crossOrigin = "Anonymous";

    const drawBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.15;
      ctx.drawImage(
        mapImg,
        canvas.width * 0.1,
        canvas.height * 0.15,
        canvas.width * 0.8,
        canvas.height * 0.7,
      );
      ctx.globalAlpha = 1;
    };

    mapImg.onload = resizeCanvas;
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // ================= SVG ANIMATION =================
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let currentIndex = 0;
    let animationFrame: number;

    const currencyMap: Record<string, string> = {
      india: "₹",
      usa: "$",
      brazil: "R$",
      uk: "£",
      uae: "د.إ",
      japan: "¥",
      aus: "A$",
      sl: "Le",
      za: "R",
    };

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const animateCurrency = (
      path: SVGPathElement,
      symbol: string,
      callback: () => void,
    ) => {
      const totalLength = path.getTotalLength();
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );

      text.textContent = symbol;
      text.setAttribute("font-size", "18");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("fill", "#00ffcc");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.style.filter = "drop-shadow(0 0 5px #00ffcc)";

      svg.appendChild(text);

      const duration = 2500;
      let startTime: number | null = null;

      const move = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = easeInOut(progress);
        const point = path.getPointAtLength(totalLength * eased);

        text.setAttribute("x", point.x.toString());
        text.setAttribute("y", point.y.toString());

        if (progress < 1) {
          animationFrame = requestAnimationFrame(move);
        } else {
          setTimeout(() => {
            if (svg.contains(text)) svg.removeChild(text);
            callback();
          }, 400);
        }
      };

      animationFrame = requestAnimationFrame(move);
    };

    const drawConnection = () => {
      if (currentIndex >= connections.length) {
        currentIndex = 0;
        setActiveNodes([]);
        drawConnection();
        return;
      }

      // Clear old paths
      const oldPaths = svg.querySelectorAll("path");
      oldPaths.forEach((p) => svg.removeChild(p));

      const { from, to } = connections[currentIndex];
      const start = nodes.find((n) => n.id === from);
      const end = nodes.find((n) => n.id === to);
      if (!start || !end) return;

      // Activate flags one by one
      setActiveNodes([from, to]);

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curveHeight = distance * 0.35;

      const d = `M ${start.x} ${start.y}
                 C ${start.x + dx * 0.25} ${start.y - curveHeight},
                   ${start.x + dx * 0.75} ${end.y - curveHeight},
                   ${end.x} ${end.y}`;

      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#ff6a00");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("opacity", "0.6");

      svg.appendChild(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      let startTime: number | null = null;

      const animateCurve = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 3000, 1);
        const eased = easeInOut(progress);

        path.style.strokeDashoffset = `${length - length * eased}`;

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animateCurve);
        } else {
          animateCurrency(path, currencyMap[to] || "$", () => {
            currentIndex++;
            drawConnection();
          });
        }
      };

      animationFrame = requestAnimationFrame(animateCurve);
    };

    drawConnection();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // ================= RENDER =================
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative aspect-1400/600 w-full">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <svg
            ref={svgRef}
            viewBox="0 0 1400 600"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {nodes
              .filter((node) => activeNodes.includes(node.id))
              .map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill="#ff6a00"
                    opacity={0.15}
                    style={{ filter: "blur(8px)" }}
                  />

                  <foreignObject
                    x={node.x - 14}
                    y={node.y - 14}
                    width="28"
                    height="28"
                    style={{
                      opacity: 1,
                      transition: "opacity 0.6s ease",
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${node.countryCode}.png`}
                      alt={node.id}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: "2px solid #ff6a00",
                        boxShadow: "0 0 10px #ff6a00",
                      }}
                    />
                  </foreignObject>
                </g>
              ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WorldMapNetwork;
