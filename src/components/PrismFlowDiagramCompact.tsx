import { ACCENT, SURFACE, BORDER_STRONG, FOREGROUND } from "@/lib/diagram-tokens";

const NODE_W = 190;
const NODE_H = 26;

const NODES = [
  { label: "Client", y: 20 },
  { label: "Auth", y: 66 },
  { label: "Guardrail", y: 112 },
  { label: "Cache lookup", y: 158 },
  { label: "Router + breaker", y: 204 },
  { label: "Provider", y: 250 },
  { label: "Cost calc + log", y: 296 },
  { label: "Cache write", y: 342 },
  { label: "Response", y: 380 },
];

export default function PrismFlowDiagramCompact() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg
        viewBox="0 0 320 400"
        className="w-full h-auto"
        role="img"
        aria-label="Prism nominal request path — Client, Auth, Guardrail, Cache lookup, Router, Provider, Cost log, Cache write, Response. This shows the default straight-through path only; it does not show the cache-hit bypass or failure-retry paths, which exist elsewhere in the system — see the complete request flow for those."
      >
        {NODES.slice(0, -1).map((n, i) => {
          const next = NODES[i + 1];
          return (
            <line
              key={n.label}
              x1={160}
              y1={n.y + NODE_H / 2}
              x2={160}
              y2={next.y - NODE_H / 2}
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          );
        })}
        {NODES.map((n) => (
          <g key={n.label} transform={`translate(160, ${n.y})`}>
            <rect
              x={-NODE_W / 2}
              y={-NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={5}
              fill={SURFACE}
              stroke={BORDER_STRONG}
              strokeWidth={1}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
              fill={FOREGROUND}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
