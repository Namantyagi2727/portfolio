import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

// Simplified vertical overview of PrismInfraDiagram's host/compose topology
// — same six services and the same host-vs-container distinction, laid out
// as one column instead of the full diagram's two-dimensional boundary
// boxes, which is what forces it below ~620px wide.
//
// Postgres/Redis/Jaeger sit side by side with independent diagonal lines
// from App, rather than stacked on one shared vertical line — the earlier
// version routed each connector straight through the boxes above it,
// visually implying App -> Postgres -> Redis -> Jaeger as a sequential
// chain, when all three are actually independent connections from App.
const NODE_W = 210;
const NODE_H = 28;
const SMALL_W = 76;
const SMALL_H = 34;

const APP_SERVICES = [
  { label: "Postgres", sub: "pgvector", x: 44 },
  { label: "Redis", sub: undefined, x: 125 },
  { label: "Jaeger", sub: undefined, x: 206 },
];

const APP_Y = 124;
const SERVICES_Y = 190;

export default function PrismInfraSummary() {
  return (
    <div className="max-w-xs mx-auto">
      <svg
        viewBox="0 0 250 430"
        className="w-full h-auto"
        role="img"
        aria-label="Simplified infrastructure overview: Ollama runs on the host machine, separate from the Docker Compose services — App independently connects to Postgres with pgvector, Redis, and Jaeger; Prometheus separately scrapes App and feeds Grafana"
      >
        <text x={20} y={16} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          HOST MACHINE
        </text>
        <g transform="translate(125, 40)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Ollama
          </text>
        </g>

        <line x1={125} y1={54} x2={125} y2={90} stroke={ACCENT} strokeWidth={1.2} strokeDasharray="4 4" />
        <text x={132} y={75} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          HTTP
        </text>

        <text x={20} y={100} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          DOCKER COMPOSE
        </text>

        <g transform={`translate(125, ${APP_Y})`}>
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            App
          </text>
        </g>

        {/* Independent fan-out from App — none of these three lines cross
            behind another service's box. */}
        {APP_SERVICES.map((s) => (
          <line
            key={`line-${s.label}`}
            x1={125}
            y1={APP_Y + NODE_H / 2}
            x2={s.x}
            y2={SERVICES_Y - SMALL_H / 2}
            stroke={ACCENT}
            strokeWidth={1.2}
          />
        ))}
        {APP_SERVICES.map((s) => (
          <g key={s.label} transform={`translate(${s.x}, ${SERVICES_Y})`}>
            <rect x={-SMALL_W / 2} y={-SMALL_H / 2} width={SMALL_W} height={SMALL_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
            <text textAnchor="middle" dominantBaseline="middle" y={s.sub ? -5 : 0} fontSize={9} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
              {s.label}
            </text>
            {s.sub && (
              <text textAnchor="middle" y={8} fontSize={6.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                {s.sub}
              </text>
            )}
          </g>
        ))}

        <line x1={125} y1={272} x2={125} y2={296} stroke={ACCENT} strokeWidth={1.2} />
        <g transform="translate(125, 310)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Prometheus
          </text>
        </g>
        <text x={132} y={290} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          scrapes App
        </text>

        <line x1={125} y1={324} x2={125} y2={348} stroke={ACCENT} strokeWidth={1.2} />
        <text x={132} y={342} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          query
        </text>
        <g transform="translate(125, 362)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Grafana
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted leading-relaxed mt-2 max-w-md mx-auto text-center">
        Postgres, Redis, and Jaeger are three independent connections from App, not a chain.
        Full topology, including exact connection labels (SQL, cache + rate limit, OTLP spans), is
        in the diagram below.
      </p>
    </div>
  );
}
