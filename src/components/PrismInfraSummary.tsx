import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

// Simplified vertical overview of PrismInfraDiagram's host/compose topology
// — same six services and the same host-vs-container distinction, laid out
// as one column instead of the full diagram's two-dimensional boundary
// boxes, which is what forces it below ~620px wide.
const NODE_W = 210;
const NODE_H = 28;

export default function PrismInfraSummary() {
  return (
    <div className="max-w-xs mx-auto">
      <svg
        viewBox="0 0 250 450"
        className="w-full h-auto"
        role="img"
        aria-label="Simplified infrastructure overview: Ollama runs on the host machine, separate from the Docker Compose services — App connects to Postgres with pgvector, Redis, and Jaeger; Prometheus scrapes App and feeds Grafana"
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

        <g transform="translate(125, 124)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            App
          </text>
        </g>

        {["Postgres · pgvector", "Redis", "Jaeger"].map((label, i) => {
          const y = 178 + i * 46;
          return (
            <g key={label}>
              <line x1={125} y1={138} x2={125} y2={y - NODE_H / 2} stroke={ACCENT} strokeWidth={1.2} />
              <g transform={`translate(125, ${y})`}>
                <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
                <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
                  {label}
                </text>
              </g>
            </g>
          );
        })}

        <line x1={125} y1={316} x2={125} y2={340} stroke={ACCENT} strokeWidth={1.2} />
        <g transform="translate(125, 354)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Prometheus
          </text>
        </g>
        <text x={132} y={334} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          scrapes App
        </text>

        <line x1={125} y1={368} x2={125} y2={392} stroke={ACCENT} strokeWidth={1.2} />
        <text x={132} y={386} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
          query
        </text>
        <g transform="translate(125, 406)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Grafana
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted leading-relaxed mt-2 max-w-md mx-auto text-center">
        Full topology, including exact connection labels (SQL, cache + rate limit, OTLP spans), is
        in the diagram below.
      </p>
    </div>
  );
}
