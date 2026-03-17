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

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ── Coordinates ───────────────────────────────────────────────────────────────
const INDIA:     [number, number] = [77.391,   28.535];
const LONDON:    [number, number] = [-0.1278,  51.5074];
const SINGAPORE: [number, number] = [103.8198,  1.3521];
const NEW_YORK:  [number, number] = [-73.9442, 40.7128];

// ── Node data ─────────────────────────────────────────────────────────────────
type Category = "Education" | "Work" | "Research";

interface Entry {
  name:     string;
  role:     string;
  period:   string;
  category: Category;
  detail:   string;
  color:    string;
}

interface MapNode {
  id:      string;
  city:    string;
  country: string;
  coords:  [number, number];
  color:   string;
  entries: Entry[];
}

const NODES: MapNode[] = [
  {
    id: "india", city: "Noida", country: "India",
    coords: INDIA, color: "#a855f7",
    entries: [
      {
        name: "Amity University", role: "B.Tech — CS & Engineering (Hons. AI & ML)",
        period: "Jul 2020 – Jun 2024", category: "Education",
        detail: "First Division with Distinction · Exchange programs in London & New York",
        color: "#a855f7",
      },
      {
        name: "Ciena", role: "Global Technical Support Engineer",
        period: "Jan 2024 – Jun 2024", category: "Work",
        detail: "Data-driven diagnostics on optical network systems · global telecom clients",
        color: "#f59e0b",
      },
    ],
  },
  {
    id: "london", city: "London", country: "United Kingdom",
    coords: LONDON, color: "#00d4ff",
    entries: [
      {
        name: "Birkbeck, University of London", role: "Exchange Program",
        period: "During B.Tech", category: "Education",
        detail: "International undergraduate exchange · academic collaboration",
        color: "#00d4ff",
      },
      {
        name: "University of Essex", role: "AI Research Intern",
        period: "Sep 2023 – Aug 2024", category: "Research",
        detail: "NLP & sentiment analysis for early BDD detection · IEEE Xplore published 2024",
        color: "#a855f7",
      },
    ],
  },
  {
    id: "singapore", city: "Singapore", country: "Singapore",
    coords: SINGAPORE, color: "#f59e0b",
    entries: [
      {
        name: "Ulavi Technologies PTE. Ltd", role: "Frontend Developer",
        period: "Jan 2023 – Apr 2023", category: "Work",
        detail: "Responsive travel platform frontends · 15% performance uplift · Agile",
        color: "#f59e0b",
      },
    ],
  },
  {
    id: "newyork", city: "New York", country: "United States",
    coords: NEW_YORK, color: "#a855f7",
    entries: [
      {
        name: "Adelphi University", role: "Exchange Program",
        period: "During B.Tech", category: "Education",
        detail: "International undergraduate exchange · academic collaboration",
        color: "#00d4ff",
      },
      {
        name: "NYU Tandon School of Engineering", role: "MS — Computer Science",
        period: "Aug 2024 – Present", category: "Education",
        detail: "Machine Learning · Big Data · Cloud · Blockchain · Application Security",
        color: "#a855f7",
      },
      {
        name: "Mast-Jägermeister US, Inc.", role: "AI & Power BI Intern",
        period: "Jun 2025 – Aug 2025", category: "Work",
        detail: "Fully offline RAG chatbot · NLP-enhanced Power BI Q&A · semantic search pipelines",
        color: "#f59e0b",
      },
      {
        name: "NYU — Office of Faculty Affairs", role: "Lead Software Developer",
        period: "Jan 2026 – Present", category: "Work",
        detail: "Records management & dashboarding systems · full-stack · faculty administration",
        color: "#22c55e",
      },
    ],
  },
];

// ── Route configs ─────────────────────────────────────────────────────────────
interface RouteConfig {
  id:        string;
  label:     string;
  subtitle:  string;
  color:     string;
  dashArray: string;
  opacity:   number;
  legs:      [[number, number], [number, number]][];
}

const ROUTE_CONFIGS: RouteConfig[] = [
  {
    id: "academic", label: "ACADEMIC", subtitle: "DEL → LHR → JFK",
    color: "#00d4ff", dashArray: "7 4", opacity: 0.55,
    legs: [[INDIA, LONDON], [LONDON, NEW_YORK]],
  },
  {
    id: "professional", label: "PROFESSIONAL", subtitle: "SIN → JFK",
    color: "#f59e0b", dashArray: "7 4", opacity: 0.52,
    legs: [[SINGAPORE, NEW_YORK]],
  },
  {
    id: "research", label: "RESEARCH", subtitle: "DEL ↔ LHR",
    color: "#a855f7", dashArray: "3 7", opacity: 0.38,
    legs: [[INDIA, LONDON], [LONDON, INDIA]],
  },
];

// ── Waypoint math ─────────────────────────────────────────────────────────────
function buildWaypoints(
  legs: [[number, number], [number, number]][],
  steps = 80,
  pause = 30,
): [number, number][] {
  const pts: [number, number][] = [];
  for (const [from, to] of legs) {
    const interp = geoInterpolate(from, to);
    for (let i = 0; i <= steps; i++) pts.push(interp(i / steps) as [number, number]);
    for (let p = 0; p < pause; p++) pts.push(to);
  }
  return pts;
}

const ALL_WAYPOINTS = ROUTE_CONFIGS.map((r) => buildWaypoints(r.legs));

function bearing(
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number],
): number {
  const R = Math.PI / 180;
  const dLon = (lon2 - lon1) * R;
  const y = Math.sin(dLon) * Math.cos(lat2 * R);
  const x = Math.cos(lat1 * R) * Math.sin(lat2 * R)
          - Math.sin(lat1 * R) * Math.cos(lat2 * R) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

// ── Label ─────────────────────────────────────────────────────────────────────
const CAT_LABEL: Record<Category, string> = {
  Education: "EDUCATION",
  Work:      "WORK",
  Research:  "RESEARCH",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function JourneyMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // One mutable index per plane, staggered starts
  const planeIdx = useRef<number[]>(
    ALL_WAYPOINTS.map((wp, i) => Math.floor((wp.length * i) / ROUTE_CONFIGS.length))
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      for (let i = 0; i < ALL_WAYPOINTS.length; i++) {
        planeIdx.current[i] = (planeIdx.current[i] + 1) % ALL_WAYPOINTS[i].length;
      }
      setTick((t) => t + 1);
    }, 40);
    return () => clearInterval(id);
  }, []);

  const activeNodeData = NODES.find((n) => n.id === activeNode);

  return (
    <div className="w-full">
      {/* ── Map container ── */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-[#1e1e1e] bg-[#080810]"
        style={{ boxShadow: "0 0 80px rgba(0,212,255,0.04), inset 0 0 120px rgba(0,0,0,0.7)" }}
      >
        {/* Scanlines */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.2) 2px, rgba(0,212,255,0.2) 3px)",
          }}
        />

        {/* Corner brackets */}
        {[
          "top-3 left-3 border-t border-l",
          "top-3 right-3 border-t border-r",
          "bottom-3 left-3 border-b border-l",
          "bottom-3 right-3 border-b border-r",
        ].map((cls) => (
          <div key={cls} className={`absolute w-5 h-5 border-[#00d4ff]/28 ${cls}`} />
        ))}

        {/* HUD header */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[#00d4ff]/60 animate-pulse" />
          <span className="text-[10px] font-mono text-[#00d4ff]/50 uppercase tracking-[0.28em]">
            GLOBAL JOURNEY LOG
          </span>
          <div className="w-1 h-1 rounded-full bg-[#00d4ff]/60 animate-pulse" />
        </div>

        {/* ── Map ── */}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [20, 30] }}
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
                  fill="#0d0f1c"
                  stroke="#181a2d"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover:   { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Route arcs — layered glow + dashed line */}
          {ROUTE_CONFIGS.map((route) =>
            route.legs.map(([from, to], li) => (
              <g key={`${route.id}-${li}`}>
                {/* Wide atmospheric glow */}
                <Line from={from} to={to} stroke={route.color} strokeWidth={6}  strokeOpacity={0.045} />
                {/* Medium glow */}
                <Line from={from} to={to} stroke={route.color} strokeWidth={2.5} strokeOpacity={0.10}  />
                {/* Sharp dashed line */}
                <Line
                  from={from} to={to}
                  stroke={route.color}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeDasharray={route.dashArray}
                  strokeOpacity={route.opacity}
                />
              </g>
            ))
          )}

          {/* Animated planes */}
          {ROUTE_CONFIGS.map((route, ri) => {
            const idx  = planeIdx.current[ri];
            const wp   = ALL_WAYPOINTS[ri];
            const pos  = wp[idx];
            const next = wp[(idx + 3) % wp.length];
            const b    = bearing(pos, next);
            return (
              <Marker key={route.id} coordinates={pos}>
                <g transform={`rotate(${b - 90})`} style={{ transformOrigin: "0px 0px" }}>
                  {/* Engine glow */}
                  <circle r={8} fill={route.color} opacity={0.12} />
                  <circle r={4} fill={route.color} opacity={0.18} />
                  {/* Plane icon */}
                  <text
                    fontSize={11}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      userSelect: "none",
                      filter: `drop-shadow(0 0 4px ${route.color}) drop-shadow(0 0 2px ${route.color})`,
                    }}
                  >
                    ✈
                  </text>
                </g>
              </Marker>
            );
          })}

          {/* Node markers */}
          {NODES.map((node, i) => {
            const isActive = activeNode === node.id;
            return (
              <Marker
                key={node.id}
                coordinates={node.coords}
                onClick={() => setActiveNode(isActive ? null : node.id)}
              >
                <g style={{ cursor: "pointer" }}>
                  {/* Outer pulse ring */}
                  <circle r={14} fill="none" stroke={node.color} strokeWidth={1} opacity={0}>
                    <animate
                      attributeName="r"
                      values={`${isActive ? 14 : 10};${isActive ? 28 : 22};${isActive ? 14 : 10}`}
                      dur="2.6s" repeatCount="indefinite" begin={`${i * 0.45}s`}
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0;0.5"
                      dur="2.6s" repeatCount="indefinite" begin={`${i * 0.45}s`}
                    />
                  </circle>

                  {/* Inner ring */}
                  <circle
                    r={isActive ? 13 : 9}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={1}
                    opacity={isActive ? 0.55 : 0.28}
                    style={{ transition: "all 0.3s ease" }}
                  />

                  {/* Core dot */}
                  <circle
                    r={isActive ? 6 : 4.5}
                    fill={node.color}
                    style={{
                      filter: `drop-shadow(0 0 ${isActive ? 8 : 5}px ${node.color})`,
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* City label */}
                  <text
                    y={-17}
                    fontSize={7.5}
                    fontFamily="monospace"
                    fill={node.color}
                    textAnchor="middle"
                    fontWeight="700"
                    letterSpacing="0.1em"
                    opacity={0.85}
                    style={{ userSelect: "none" }}
                  >
                    {node.city.toUpperCase()}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        {/* ── Active routes HUD — bottom left ── */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
          {ROUTE_CONFIGS.map((route) => (
            <div key={route.id} className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55"
                  style={{ background: route.color }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: route.color }}
                />
              </span>
              <span
                className="text-[9px] font-mono uppercase tracking-widest leading-none"
                style={{ color: route.color }}
              >
                {route.label}
              </span>
              <span className="text-[8px] font-mono text-[#6b7280]/55 leading-none">
                {route.subtitle}
              </span>
            </div>
          ))}
        </div>

        {/* ── Legend — bottom right ── */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          {[
            { color: "#a855f7", label: "Education" },
            { color: "#f59e0b", label: "Work" },
            { color: "#a855f7", label: "Research" },
            { color: "#22c55e", label: "Current" },
          ].filter((item, idx, arr) => arr.findIndex((x) => x.label === item.label) === idx)
           .map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: color, boxShadow: `0 0 4px ${color}` }}
              />
              <span className="text-[8.5px] font-mono text-[#6b7280] uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Click hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
          <span className="text-[8.5px] font-mono text-[#6b7280]/40 uppercase tracking-widest">
            tap a pin · details expand below
          </span>
        </div>
      </div>

      {/* ── Expanded detail card ── */}
      <AnimatePresence>
        {activeNodeData && (
          <motion.div
            key={activeNodeData.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-[#0a0a10] border border-[#1e1e1e] rounded-2xl p-5">
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ background: "linear-gradient(180deg, #00d4ff, #a855f7)" }}
                  />
                  <div>
                    <p className="text-[10px] font-mono text-[#6b7280] uppercase tracking-widest">
                      {activeNodeData.country}
                    </p>
                    <p className="text-lg font-bold text-[#ededed]">{activeNodeData.city}</p>
                  </div>
                  {/* Entry count badge */}
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      color: "#6b7280",
                      borderColor: "#1e1e1e",
                      background: "#111",
                    }}
                  >
                    {activeNodeData.entries.length} {activeNodeData.entries.length === 1 ? "stop" : "stops"}
                  </span>
                </div>
                <button
                  onClick={() => setActiveNode(null)}
                  className="text-[#6b7280] hover:text-[#ededed] transition-colors text-xs font-mono px-2 py-1 rounded border border-[#1e1e1e] hover:border-[#333]"
                >
                  [×]
                </button>
              </div>

              {/* Entry grid */}
              <div
                className={`grid gap-3 ${
                  activeNodeData.entries.length >= 3
                    ? "sm:grid-cols-2"
                    : activeNodeData.entries.length === 2
                    ? "sm:grid-cols-2"
                    : ""
                }`}
              >
                {activeNodeData.entries.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="rounded-xl p-4 border"
                    style={{
                      background:   `${entry.color}07`,
                      borderColor:  `${entry.color}22`,
                    }}
                  >
                    {/* Type badge + period */}
                    <div className="flex items-start justify-between mb-2.5 gap-2">
                      <span
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-widest shrink-0"
                        style={{
                          color:       entry.color,
                          background:  `${entry.color}18`,
                          border:      `1px solid ${entry.color}30`,
                        }}
                      >
                        {CAT_LABEL[entry.category]}
                      </span>
                      <span
                        className="text-[9.5px] font-mono text-right leading-tight"
                        style={{ color: entry.color }}
                      >
                        {entry.period}
                      </span>
                    </div>

                    <p className="text-[13px] font-semibold text-[#ededed] mb-0.5 leading-snug">
                      {entry.name}
                    </p>
                    <p className="text-xs text-[#9ca3af] leading-relaxed mb-2">
                      {entry.role}
                    </p>
                    <p className="text-[10.5px] font-mono text-[#6b7280]/65 italic leading-relaxed">
                      {entry.detail}
                    </p>
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
