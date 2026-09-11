import { SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";
import { PRISM_ACCENT } from "@/lib/illustration-tokens";

// A compact, iconic cover illustration — not a numbered documentary figure.
// Deliberately simpler than the full request-flow diagram on the case-study
// page: app -> Prism -> providers, one shown failed with a fallback arrow.
// This is the "application passing through Prism to providers" motif the
// design brief calls for, replacing the homepage's previous 9-stage compact
// flow diagram (kept, unchanged, on the /work/prism case-study page as
// FIG. 01 — the full technical sequence still lives there).

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
          <rect x={-28} y={-16} width={56} height={32} rx={6} fill={SURFACE} stroke={BORDER_STRONG} strokeWidth={1} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            App
          </text>
        </g>

        <line x1={58} y1={70} x2={122} y2={70} stroke={BORDER_STRONG} strokeWidth={1.2} />

        {/* Prism hub */}
        <g transform="translate(160, 70)">
          <rect
            x={-36}
            y={-22}
            width={72}
            height={44}
            rx={8}
            fill={PRISM_ACCENT}
            fillOpacity={0.12}
            stroke={PRISM_ACCENT}
            strokeWidth={1.5}
          />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={11} fontFamily="var(--font-geist-mono)" fill={PRISM_ACCENT}>
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
              stroke={p.failed ? MUTED : BORDER_STRONG}
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
                fill={p.failed ? "transparent" : SURFACE}
                stroke={p.failed ? MUTED : BORDER_STRONG}
                strokeWidth={1}
                strokeDasharray={p.failed ? "3 3" : undefined}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8.5}
                fontFamily="var(--font-geist-mono)"
                fill={p.failed ? MUTED : FOREGROUND}
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
          stroke={PRISM_ACCENT}
          strokeWidth={1.2}
          strokeDasharray="2 3"
          markerEnd="url(#fallback-arrow)"
        />
        <defs>
          <marker id="fallback-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={PRISM_ACCENT} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
