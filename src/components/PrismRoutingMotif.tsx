import { COVERS } from "@/lib/illustration-tokens";

// A restrained routing detail living inside Prism's ink-blue cover card —
// recolored for that dark surface rather than the light page background,
// since it no longer stands alone (it's now part of the cover composition,
// beneath the dashboard screenshot crop). App -> Prism -> providers, one
// shown failed with a fallback arrow.

const { on, onMuted, line } = COVERS.prism;
const ACCENT = "#8FB4DE"; // light blue accent — reads clearly against the ink-blue surface

const PROVIDERS = [
  { label: "OpenAI", y: 20, failed: false },
  { label: "Anthropic", y: 70, failed: true },
  { label: "Ollama", y: 120, failed: false },
];

export default function PrismRoutingMotif() {
  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 320 140"
        className="w-full h-auto"
        role="img"
        aria-label="Illustrative diagram: an application sends a request through Prism, which routes it to one of several providers and falls back to a healthy provider when one fails."
      >
        {/* App */}
        <g transform="translate(30, 70)">
          <rect x={-28} y={-16} width={56} height={32} rx={6} fill="none" stroke={line} strokeWidth={1.2} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={on}>
            App
          </text>
        </g>

        <line x1={58} y1={70} x2={122} y2={70} stroke={line} strokeWidth={1.2} />

        {/* Prism hub */}
        <g transform="translate(160, 70)">
          <rect
            x={-36}
            y={-22}
            width={72}
            height={44}
            rx={8}
            fill={ACCENT}
            fillOpacity={0.18}
            stroke={ACCENT}
            strokeWidth={1.5}
          />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={11} fontFamily="var(--font-geist-mono)" fill={ACCENT}>
            Prism
          </text>
        </g>

        {/* Providers */}
        {PROVIDERS.map((p) => (
          <g key={p.label}>
            <line
              x1={198}
              y1={70}
              x2={252}
              y2={p.y + 8}
              stroke={p.failed ? onMuted : line}
              strokeWidth={1.2}
              strokeDasharray={p.failed ? "3 3" : undefined}
            />
            <g transform={`translate(282, ${p.y + 8})`}>
              <rect
                x={-30}
                y={-14}
                width={60}
                height={28}
                rx={6}
                fill="none"
                stroke={p.failed ? onMuted : line}
                strokeWidth={1}
                strokeDasharray={p.failed ? "3 3" : undefined}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8.5}
                fontFamily="var(--font-geist-mono)"
                fill={p.failed ? onMuted : on}
              >
                {p.label}
              </text>
            </g>
          </g>
        ))}

        {/* Fallback arrow: failed Anthropic -> healthy Ollama */}
        <path
          d="M 282 92 C 300 100, 300 110, 286 114"
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.2}
          strokeDasharray="2 3"
          markerEnd="url(#fallback-arrow)"
        />
        <defs>
          <marker id="fallback-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
