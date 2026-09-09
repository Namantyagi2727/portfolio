const ACCENT = "#355C8A";
const SURFACE = "#ECEAE4";
const BORDER_STRONG = "#C4C1B6";
const MUTED = "#6A6963";
const FOREGROUND = "#171715";

const NODE_W = 120;
const NODE_H = 32;

const HOST = { x: 90, y: 60, label: "Ollama" };

const COMPOSE_NODES = {
  app: { x: 260, y: 70, label: "App" },
  postgres: { x: 520, y: 40, label: "Postgres · pgvector" },
  redis: { x: 520, y: 100, label: "Redis" },
  jaeger: { x: 520, y: 160, label: "Jaeger" },
  prometheus: { x: 260, y: 160, label: "Prometheus" },
  grafana: { x: 260, y: 220, label: "Grafana" },
} as const;

export default function PrismInfraDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 620 }}>
        <svg viewBox="0 0 640 260" className="w-full h-auto" role="img" aria-label="Prism infrastructure topology">
          <rect x={20} y={20} width={140} height={80} rx={4} fill="none" stroke={BORDER_STRONG} strokeDasharray="3 3" />
          <text x={26} y={16} fontSize={9} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            HOST MACHINE
          </text>

          <rect x={200} y={10} width={420} height={250} rx={4} fill="none" stroke={BORDER_STRONG} strokeDasharray="3 3" />
          <text x={206} y={6} fontSize={9} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            DOCKER COMPOSE
          </text>

          <line
            x1={COMPOSE_NODES.app.x + NODE_W / 2}
            y1={COMPOSE_NODES.app.y}
            x2={COMPOSE_NODES.postgres.x - NODE_W / 2}
            y2={COMPOSE_NODES.postgres.y}
            stroke={ACCENT}
            strokeWidth={1.2}
          />
          <line
            x1={COMPOSE_NODES.app.x + NODE_W / 2}
            y1={COMPOSE_NODES.app.y + 12}
            x2={COMPOSE_NODES.redis.x - NODE_W / 2}
            y2={COMPOSE_NODES.redis.y}
            stroke={ACCENT}
            strokeWidth={1.2}
          />
          <line
            x1={COMPOSE_NODES.app.x + NODE_W / 2}
            y1={COMPOSE_NODES.app.y + 24}
            x2={COMPOSE_NODES.jaeger.x - NODE_W / 2}
            y2={COMPOSE_NODES.jaeger.y}
            stroke={ACCENT}
            strokeWidth={1.2}
          />
          <line
            x1={HOST.x + 40}
            y1={HOST.y}
            x2={COMPOSE_NODES.app.x - NODE_W / 2}
            y2={COMPOSE_NODES.app.y}
            stroke={ACCENT}
            strokeWidth={1.2}
            strokeDasharray="4 4"
          />
          <line
            x1={COMPOSE_NODES.prometheus.x}
            y1={COMPOSE_NODES.prometheus.y - NODE_H / 2}
            x2={COMPOSE_NODES.app.x}
            y2={COMPOSE_NODES.app.y + NODE_H / 2}
            stroke={ACCENT}
            strokeWidth={1.2}
          />
          <line
            x1={COMPOSE_NODES.grafana.x}
            y1={COMPOSE_NODES.grafana.y - NODE_H / 2}
            x2={COMPOSE_NODES.prometheus.x}
            y2={COMPOSE_NODES.prometheus.y + NODE_H / 2}
            stroke={ACCENT}
            strokeWidth={1.2}
          />

          <text x={372} y={28} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            SQL · asyncpg
          </text>
          <text x={365} y={92} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            cache + rate limit
          </text>
          <text x={352} y={148} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            OTLP spans
          </text>
          <text x={163} y={54} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            chat + embeddings · HTTP
          </text>
          <text x={264} y={116} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            scrape /metrics/ · 15s
          </text>
          <text x={264} y={193} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            query
          </text>

          <g transform={`translate(${HOST.x}, ${HOST.y})`}>
            <rect x={-40} y={-16} width={80} height={32} rx={6} fill={SURFACE} stroke={BORDER_STRONG} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
              {HOST.label}
            </text>
          </g>
          {Object.values(COMPOSE_NODES).map((n) => (
            <g key={n.label} transform={`translate(${n.x}, ${n.y})`}>
              <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={6} fill={SURFACE} stroke={BORDER_STRONG} />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9.5}
                fontFamily="var(--font-geist-mono)"
                fill={FOREGROUND}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
