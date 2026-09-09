"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type CacheState = "hit" | "miss";

const NODES = {
  app: { x: 30, y: 90, label: "App" },
  prism: { x: 190, y: 90, label: "Prism" },
  cache: { x: 190, y: 24, label: "Cache" },
  provider: { x: 350, y: 90, label: "Provider" },
} as const;

export default function PrismFlowDiagram() {
  const [cacheState, setCacheState] = useState<CacheState>("miss");
  const [breakerTripped, setBreakerTripped] = useState(false);

  const providerLineColor = breakerTripped ? "#8a8073" : "#d97b3f";
  const cacheLineColor = cacheState === "hit" ? "#d97b3f" : "#3a3025";

  return (
    <div className="w-full" style={{ maxWidth: 420 }}>
      <svg
        viewBox="0 0 380 150"
        className="w-full h-auto"
        role="img"
        aria-label={`Prism request flow diagram — cache ${cacheState}, circuit breaker ${breakerTripped ? "open" : "closed"}`}
      >
        {/* App -> Prism */}
        <motion.line
          x1={NODES.app.x + 32} y1={NODES.app.y}
          x2={NODES.prism.x - 32} y2={NODES.prism.y}
          stroke="#d97b3f" strokeWidth={1.5} strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        {/* Prism -> Cache */}
        <line
          x1={NODES.prism.x} y1={NODES.prism.y - 22}
          x2={NODES.cache.x} y2={NODES.cache.y + 14}
          stroke={cacheLineColor} strokeWidth={1.5}
        />
        {/* Prism -> Provider (skipped when cache hits, dimmed when breaker trips) */}
        <motion.line
          x1={NODES.prism.x + 32} y1={NODES.prism.y}
          x2={NODES.provider.x - 32} y2={NODES.provider.y}
          stroke={providerLineColor} strokeWidth={1.5}
          strokeDasharray={cacheState === "hit" ? "2 6" : "4 4"}
          strokeOpacity={cacheState === "hit" ? 0.35 : 1}
          animate={cacheState === "hit" ? {} : { strokeDashoffset: [0, -16] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />

        {Object.entries(NODES).map(([key, n]) => (
          <g key={key} transform={`translate(${n.x}, ${n.y})`}>
            <rect x={-32} y={-16} width={64} height={32} rx={8} fill="#1c1712" stroke="#2a231c" strokeWidth={1} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill="#f5f0e8">
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
        <button
          onClick={() => setCacheState((s) => (s === "hit" ? "miss" : "hit"))}
          aria-pressed={cacheState === "hit"}
          className="px-3 py-1.5 rounded-md border border-[#2a231c] text-[#c7bcae] hover:border-[#d97b3f]/50 hover:text-[#d97b3f] transition-colors"
        >
          cache: {cacheState}
        </button>
        <button
          onClick={() => setBreakerTripped((b) => !b)}
          aria-pressed={breakerTripped}
          className="px-3 py-1.5 rounded-md border border-[#2a231c] text-[#c7bcae] hover:border-[#d97b3f]/50 hover:text-[#d97b3f] transition-colors"
        >
          breaker: {breakerTripped ? "open" : "closed"}
        </button>
      </div>

      <p className="mt-3 text-[11px] font-mono text-[#8a8073]">~250 req/s · p95 ~80ms overhead</p>
    </div>
  );
}
