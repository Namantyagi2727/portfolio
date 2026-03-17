"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";
import { geoInterpolate } from "d3-geo";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface School {
  name: string;
  degree: string;
  period: string;
  type: "Undergraduate" | "Exchange" | "Graduate";
  detail: string;
  color: string;
}

interface Stop {
  id: string;
  city: string;
  country: string;
  coords: [number, number];
  schools: School[];
}

const STOPS: Stop[] = [
  {
    id: "noida",
    city: "Noida",
    country: "India",
    coords: [77.391, 28.535],
    schools: [
      {
        name: "Amity University",
        degree: "B.Tech — CS & Engineering (Hons. AI & ML)",
        period: "Jul 2020 – Jun 2024",
        type: "Undergraduate",
        detail: "First Division with Distinction",
        color: "#a855f7",
      },
    ],
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    coords: [-0.1278, 51.5074],
    schools: [
      {
        name: "Birkbeck, University of London",
        degree: "Exchange Program",
        period: "During B.Tech",
        type: "Exchange",
        detail: "International exchange · undergraduate studies",
        color: "#00d4ff",
      },
    ],
  },
  {
    id: "newyork",
    city: "New York",
    country: "United States",
    coords: [-73.9442, 40.7128],
    schools: [
      {
        name: "Adelphi University",
        degree: "Exchange Program",
        period: "During B.Tech",
        type: "Exchange",
        detail: "International exchange · undergraduate studies",
        color: "#00d4ff",
      },
      {
        name: "NYU Tandon School of Engineering",
        degree: "MS — Computer Science",
        period: "Aug 2024 – Present",
        type: "Graduate",
        detail: "GPA: 3.74 / 4.0",
        color: "#a855f7",
      },
    ],
  },
];

const LEGS: [[number, number], [number, number]][] = [
  [STOPS[0].coords, STOPS[1].coords],
  [STOPS[1].coords, STOPS[2].coords],
];

const TYPE_LABEL: Record<string, string> = {
  Undergraduate: "B.TECH",
  Exchange: "EXCHANGE",
  Graduate: "M.S.",
};

// Pre-compute all waypoints along the full route for the plane
function buildWaypoints(
  steps = 80,
  pauseSteps = 25
): [number, number][] {
  const pts: [number, number][] = [];
  for (const [from, to] of LEGS) {
    const interp = geoInterpolate(from, to);
    for (let i = 0; i <= steps; i++) {
      pts.push(interp(i / steps) as [number, number]);
    }
    // pause at destination
    for (let p = 0; p < pauseSteps; p++) {
      pts.push(to);
    }
  }
  return pts;
}

const WAYPOINTS = buildWaypoints();

// Compute bearing between two lon/lat points (degrees)
function bearing(
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number]
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

export default function JourneyMap() {
  const [activeStop, setActiveStop] = useState<string | null>(null);
  const [planeIdx, setPlaneIdx] = useState(0);
  const idxRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % WAYPOINTS.length;
      setPlaneIdx(idxRef.current);
    }, 40); // ~25fps — smooth but not heavy
    return () => clearInterval(id);
  }, []);

  const planeLonLat = WAYPOINTS[planeIdx];
  const nextLonLat = WAYPOINTS[(planeIdx + 2) % WAYPOINTS.length];
  const planeBearing = bearing(planeLonLat, nextLonLat);

  const activeStopData = STOPS.find((s) => s.id === activeStop);

  return (
    <div className="w-full">
      {/* Map */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[#1e1e1e] bg-[#0a0a0f]"
        style={{ boxShadow: "0 0 60px rgba(0,212,255,0.04), inset 0 0 80px rgba(0,0,0,0.6)" }}>

        {/* Scanline overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.15) 2px, rgba(0,212,255,0.15) 3px)",
          }}
        />

        {/* Corner brackets */}
        {[
          "top-3 left-3 border-t border-l",
          "top-3 right-3 border-t border-r",
          "bottom-3 left-3 border-b border-l",
          "bottom-3 right-3 border-b border-r",
        ].map((cls) => (
          <div key={cls} className={`absolute w-5 h-5 border-[#00d4ff]/30 ${cls}`} />
        ))}

        {/* HUD label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#00d4ff]/50 uppercase tracking-[0.2em]">
            ACADEMIC FLIGHT LOG
          </span>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140, center: [20, 35] }}
          width={800}
          height={380}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0f1117"
                  stroke="#1a1a2e"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Arc lines */}
          {LEGS.map(([from, to], i) => (
            <g key={i}>
              {/* Glow line */}
              <Line
                from={from}
                to={to}
                stroke="#00d4ff"
                strokeWidth={3}
                strokeLinecap="round"
                strokeOpacity={0.08}
              />
              {/* Dashed line */}
              <Line
                from={from}
                to={to}
                stroke="#00d4ff"
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
            </g>
          ))}

          {/* Animated plane */}
          <Marker coordinates={planeLonLat}>
            <g
              transform={`rotate(${planeBearing - 90})`}
              style={{ transformOrigin: "0px 0px" }}
            >
              {/* Glow behind plane */}
              <circle r={8} fill="#00d4ff" opacity={0.08} />
              {/* Plane SVG */}
              <text
                fontSize={13}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ userSelect: "none" }}
              >
                ✈
              </text>
            </g>
          </Marker>

          {/* Stop markers */}
          {STOPS.map((stop, i) => {
            const isActive = activeStop === stop.id;
            const isPrimary = stop.id === "noida" || stop.id === "newyork";
            return (
              <Marker
                key={stop.id}
                coordinates={stop.coords}
                onClick={() =>
                  setActiveStop(isActive ? null : stop.id)
                }
              >
                <g style={{ cursor: "pointer" }}>
                  {/* Outer pulse ring */}
                  <circle
                    r={isActive ? 18 : 14}
                    fill="none"
                    stroke={isPrimary ? "#a855f7" : "#00d4ff"}
                    strokeWidth={1}
                    opacity={isActive ? 0.5 : 0.25}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Animated pulse */}
                  <circle
                    r={isActive ? 22 : 18}
                    fill="none"
                    stroke={isPrimary ? "#a855f7" : "#00d4ff"}
                    strokeWidth={1}
                    opacity={0}
                  >
                    <animate
                      attributeName="r"
                      values={`${isActive ? 16 : 12};${isActive ? 28 : 22};${isActive ? 16 : 12}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                      begin={`${i * 0.5}s`}
                    />
                    <animate
                      attributeName="opacity"
                      values="0.4;0;0.4"
                      dur="2.5s"
                      repeatCount="indefinite"
                      begin={`${i * 0.5}s`}
                    />
                  </circle>
                  {/* Core dot */}
                  <circle
                    r={isActive ? 7 : 5}
                    fill={isPrimary ? "#a855f7" : "#00d4ff"}
                    style={{
                      filter: `drop-shadow(0 0 ${isActive ? 8 : 5}px ${isPrimary ? "#a855f7" : "#00d4ff"})`,
                      transition: "all 0.3s ease",
                    }}
                  />
                  {/* City label */}
                  <text
                    y={-18}
                    fontSize={8}
                    fontFamily="monospace"
                    fill={isPrimary ? "#a855f7" : "#00d4ff"}
                    textAnchor="middle"
                    fontWeight="600"
                    letterSpacing="0.1em"
                    style={{ textTransform: "uppercase", userSelect: "none" }}
                    opacity={0.8}
                  >
                    {stop.city.toUpperCase()}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 6px #a855f7" }} />
            <span className="text-[9px] font-mono text-[#6b7280] uppercase tracking-widest">Primary Campus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: "#00d4ff", boxShadow: "0 0 6px #00d4ff" }} />
            <span className="text-[9px] font-mono text-[#6b7280] uppercase tracking-widest">Exchange / Stop</span>
          </div>
        </div>

        {/* Click hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <span className="text-[9px] font-mono text-[#6b7280]/60 uppercase tracking-widest">
            click a pin to expand
          </span>
        </div>
      </div>

      {/* Expanded detail card */}
      <AnimatePresence>
        {activeStopData && (
          <motion.div
            key={activeStopData.id}
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-[#0d0d12] border border-[#1e1e1e] rounded-2xl p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full"
                    style={{ background: "linear-gradient(180deg, #00d4ff, #a855f7)" }} />
                  <div>
                    <p className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest">
                      {activeStopData.country}
                    </p>
                    <p className="text-lg font-bold text-[#ededed]">{activeStopData.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStop(null)}
                  className="text-[#6b7280] hover:text-[#ededed] transition-colors text-xs font-mono"
                >
                  [close]
                </button>
              </div>

              {/* Schools */}
              <div className={`grid gap-3 ${activeStopData.schools.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {activeStopData.schools.map((school, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    className="rounded-xl p-4 border"
                    style={{
                      background: `${school.color}06`,
                      borderColor: `${school.color}20`,
                    }}
                  >
                    {/* Type badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          color: school.color,
                          background: `${school.color}15`,
                          border: `1px solid ${school.color}30`,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {TYPE_LABEL[school.type] ?? school.type}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: school.color }}>
                        {school.period}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#ededed] mb-0.5">{school.name}</p>
                    <p className="text-xs text-[#6b7280] leading-relaxed mb-2">{school.degree}</p>
                    <p className="text-[11px] font-mono text-[#6b7280]/70 italic">{school.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
