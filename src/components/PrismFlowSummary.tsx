import { ACCENT, SURFACE, BORDER_STRONG, FOREGROUND } from "@/lib/diagram-tokens";

// Simplified vertical overview of PrismFlowDiagram's 9-stage sequence —
// same stages, same order, but without the interactive toggles or the
// side-mounted bypass/retry curves that make the full diagram need
// horizontal scroll below ~460px. The caption below preserves both
// qualifications in words instead of dropping them.
const STAGES = [
  "Client",
  "Auth",
  "Guardrail",
  "Cache lookup",
  "Router + breaker",
  "Provider",
  "Cost calc + log",
  "Cache write",
  "Response",
];

const NODE_W = 200;
const NODE_H = 30;
const ROW_GAP = 40;

export default function PrismFlowSummary() {
  return (
    <div>
      <div className="max-w-xs mx-auto">
        <svg
          viewBox={`0 0 240 ${20 + ROW_GAP * (STAGES.length - 1) + 20}`}
          className="w-full h-auto"
          role="img"
          aria-label="Simplified request flow overview: Client, Auth, Guardrail, Cache lookup, Router and breaker, Provider, Cost calculation and log, Cache write, Response — the default straight-through sequence"
        >
          {STAGES.slice(0, -1).map((_, i) => (
            <line
              key={i}
              x1={120}
              y1={20 + ROW_GAP * i + NODE_H / 2}
              x2={120}
              y2={20 + ROW_GAP * (i + 1) - NODE_H / 2}
              stroke={ACCENT}
              strokeWidth={1.2}
              strokeDasharray="3 3"
            />
          ))}
          {STAGES.map((label, i) => (
            <g key={label} transform={`translate(120, ${20 + ROW_GAP * i})`}>
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
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="text-xs text-muted leading-relaxed mt-4 max-w-md mx-auto text-center">
        Two branches aren&apos;t drawn above: an exact cache hit bypasses straight from{" "}
        <strong className="text-foreground font-medium">Cache lookup</strong> to{" "}
        <strong className="text-foreground font-medium">Response</strong> at $0 cost, and a
        provider failure retries the next provider in the router chain. Both are shown in the full
        diagram below.
      </p>
    </div>
  );
}
