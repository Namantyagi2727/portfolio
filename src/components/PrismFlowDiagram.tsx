"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type CacheState = "hit" | "miss";

const ACCENT = "#355C8A";
const ACCENT_SECONDARY = "#A54A42";
const SURFACE = "#ECEAE4";
const BORDER_STRONG = "#C4C1B6";
const MUTED = "#6A6963";
const FOREGROUND = "#171715";

const NODE_W = 156;
const NODE_H = 36;

const NODES = {
  client: { x: 230, y: 24, label: "Client" },
  auth: { x: 230, y: 100, label: "Auth" },
  guardrail: { x: 230, y: 176, label: "Guardrail" },
  cache: { x: 230, y: 252, label: "Cache lookup" },
  router: { x: 230, y: 328, label: "Router + breaker" },
  provider: { x: 230, y: 404, label: "Provider" },
  cost: { x: 230, y: 480, label: "Cost calc + log" },
  write: { x: 230, y: 556, label: "Cache write" },
  response: { x: 230, y: 616, label: "Response" },
} as const;

const ORDER: (keyof typeof NODES)[] = [
  "client",
  "auth",
  "guardrail",
  "cache",
  "router",
  "provider",
  "cost",
  "write",
  "response",
];

// Everything from "cache" onward is the provider path. An exact cache hit
// terminates at cache lookup and takes the bypass straight to response, so
// none of this — including the edge leaving cache lookup — actually runs.
const PROVIDER_PATH_EDGE_KEYS = new Set<keyof typeof NODES>([
  "cache",
  "router",
  "provider",
  "cost",
  "write",
]);
const PROVIDER_PATH_NODE_KEYS = new Set<keyof typeof NODES>([
  "router",
  "provider",
  "cost",
  "write",
]);

export default function PrismFlowDiagram() {
  const [cacheState, setCacheState] = useState<CacheState>("miss");
  const [breakerTripped, setBreakerTripped] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const bypassActive = cacheState === "hit";

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 460 }}>
        <svg
          viewBox="0 0 460 640"
          className="w-full h-auto"
          role="img"
          aria-label={`Prism request flow — cache ${cacheState}, circuit breaker ${
            breakerTripped ? "open" : "closed"
          }`}
        >
          {ORDER.slice(0, -1).map((key, i) => {
            const from = NODES[key];
            const to = NODES[ORDER[i + 1]];
            const dimmed = bypassActive && PROVIDER_PATH_EDGE_KEYS.has(key);
            return (
              <motion.line
                key={key}
                x1={from.x}
                y1={from.y + NODE_H / 2}
                x2={to.x}
                y2={to.y - NODE_H / 2}
                stroke={dimmed ? BORDER_STRONG : ACCENT}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeOpacity={dimmed ? 0.4 : 1}
                animate={dimmed || shouldReduceMotion ? {} : { strokeDashoffset: [0, -16] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            );
          })}

          {/* Cache-hit bypass: cache lookup straight to response, cost $0 */}
          <path
            d={`M ${NODES.cache.x + NODE_W / 2} ${NODES.cache.y} C 400 ${NODES.cache.y}, 400 ${NODES.response.y}, ${
              NODES.response.x + NODE_W / 2
            } ${NODES.response.y}`}
            fill="none"
            stroke={bypassActive ? ACCENT : BORDER_STRONG}
            strokeWidth={1.5}
            strokeDasharray="3 5"
            strokeOpacity={bypassActive ? 1 : 0.35}
          />
          <text
            x={412}
            y={(NODES.cache.y + NODES.response.y) / 2}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-geist-mono)"
            fill={bypassActive ? ACCENT : MUTED}
            transform={`rotate(90 412 ${(NODES.cache.y + NODES.response.y) / 2})`}
          >
            cache hit · cost $0
          </text>

          {/* Provider failure retries the next in the chain — moot once a cache hit bypasses the provider path entirely */}
          <path
            d={`M ${NODES.provider.x - NODE_W / 2} ${NODES.provider.y - 8} C 60 ${NODES.provider.y}, 60 ${NODES.router.y}, ${
              NODES.router.x - NODE_W / 2
            } ${NODES.router.y + 8}`}
            fill="none"
            stroke={breakerTripped && !bypassActive ? ACCENT_SECONDARY : ACCENT}
            strokeWidth={1.2}
            strokeDasharray="2 4"
            strokeOpacity={bypassActive ? 0.25 : 0.6}
          />
          <text
            x={48}
            y={(NODES.provider.y + NODES.router.y) / 2}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-geist-mono)"
            fill={MUTED}
            fillOpacity={bypassActive ? 0.4 : 1}
            transform={`rotate(-90 48 ${(NODES.provider.y + NODES.router.y) / 2})`}
          >
            failure → next in chain
          </text>

          {[
            { node: NODES.auth, text: "401 / 429", providerPath: false },
            { node: NODES.guardrail, text: "400 blocked", providerPath: false },
            {
              node: NODES.provider,
              text: "503 · all failed",
              trigger: breakerTripped,
              providerPath: true,
            },
          ].map(({ node, text, trigger, providerPath }) => (
            <text
              key={text}
              x={node.x + NODE_W / 2 + 10}
              y={node.y + 3}
              fontSize={9}
              fontFamily="var(--font-geist-mono)"
              fill={trigger && !bypassActive ? ACCENT_SECONDARY : MUTED}
              fillOpacity={providerPath && bypassActive ? 0.4 : 1}
            >
              {text}
            </text>
          ))}

          {ORDER.map((key) => {
            const n = NODES[key];
            const bypassed = bypassActive && PROVIDER_PATH_NODE_KEYS.has(key);
            const errored = key === "provider" && breakerTripped && !bypassActive;
            return (
              <g key={key} transform={`translate(${n.x}, ${n.y})`} opacity={bypassed ? 0.4 : 1}>
                <rect
                  x={-NODE_W / 2}
                  y={-NODE_H / 2}
                  width={NODE_W}
                  height={NODE_H}
                  rx={6}
                  fill={SURFACE}
                  stroke={errored ? ACCENT_SECONDARY : BORDER_STRONG}
                  strokeWidth={1}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fontFamily="var(--font-geist-mono)"
                  fill={bypassed ? MUTED : FOREGROUND}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setCacheState((s) => (s === "hit" ? "miss" : "hit"))}
            aria-pressed={cacheState === "hit"}
            className="px-3 py-1.5 rounded-md border border-border text-muted hover:border-accent hover:text-accent transition-colors"
          >
            cache: {cacheState}
          </button>
          <button
            onClick={() => setBreakerTripped((b) => !b)}
            aria-pressed={breakerTripped}
            className="px-3 py-1.5 rounded-md border border-border text-muted hover:border-accent hover:text-accent transition-colors"
          >
            breaker: {breakerTripped ? "open" : "closed"}
          </button>
        </div>
      </div>
    </div>
  );
}
