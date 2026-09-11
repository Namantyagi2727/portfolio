import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

// Simplified vertical overview of AirspaceStreamDiagram's branching
// pipeline — same 8 nodes and the live/historical distinction, stacked in
// one column instead of the full diagram's ~880px-wide horizontal layout.
const NODE_W = 220;
const NODE_H = 30;

export default function AirspaceStreamSummary() {
  return (
    <div className="max-w-xs mx-auto">
      <svg
        viewBox="0 0 260 470"
        className="w-full h-auto"
        role="img"
        aria-label="Simplified stream pipeline overview: OpenSky API (live) and historical replay both feed Kafka, then Spark Structured Streaming, then fan out to InfluxDB, MongoDB, and HDFS, all feeding a Streamlit dashboard"
      >
        {[
          { label: "OpenSky API", sub: "live", y: 20, dashed: false },
          { label: "Historical replay", sub: "test data", y: 66, dashed: true },
        ].map((n) => (
          <g key={n.label}>
            <line
              x1={130}
              y1={n.y + NODE_H / 2}
              x2={130}
              y2={112 - NODE_H / 2}
              stroke={ACCENT}
              strokeWidth={1.2}
              strokeDasharray={n.dashed ? "2 3" : undefined}
            />
            <g transform={`translate(130, ${n.y})`}>
              <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
              <text textAnchor="middle" dominantBaseline="middle" y={-3} fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
                {n.label}
              </text>
              <text textAnchor="middle" y={9} fontSize={7} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                {n.sub}
              </text>
            </g>
          </g>
        ))}

        <g transform="translate(130, 112)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" y={-3} fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Kafka (Redpanda)
          </text>
          <text textAnchor="middle" y={9} fontSize={7} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            3 topics (flight-*)
          </text>
        </g>

        <line x1={130} y1={127} x2={130} y2={158 - NODE_H / 2} stroke={ACCENT} strokeWidth={1.2} />
        <g transform="translate(130, 172)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Spark Structured Streaming
          </text>
        </g>

        {[
          { label: "InfluxDB", sub: "real-time", y: 230, dashed: false },
          { label: "MongoDB", sub: "historical", y: 276, dashed: false },
          { label: "HDFS", sub: "batch archive", y: 322, dashed: true },
        ].map((n) => (
          <g key={n.label}>
            <line
              x1={130}
              y1={187}
              x2={130}
              y2={n.y - NODE_H / 2}
              stroke={ACCENT}
              strokeWidth={1.2}
              strokeDasharray={n.dashed ? "2 3" : undefined}
            />
            <g transform={`translate(130, ${n.y})`}>
              <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
              <text textAnchor="middle" dominantBaseline="middle" y={-3} fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
                {n.label}
              </text>
              <text textAnchor="middle" y={9} fontSize={7} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                {n.sub}
              </text>
            </g>
            <line
              x1={130}
              y1={n.y + NODE_H / 2}
              x2={130}
              y2={412 - NODE_H / 2}
              stroke={ACCENT}
              strokeWidth={1.2}
              strokeDasharray={n.dashed ? "2 3" : undefined}
            />
          </g>
        ))}

        <g transform="translate(130, 412)">
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Streamlit dashboard
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted leading-relaxed mt-2 max-w-md mx-auto text-center">
        Dashed lines mark the historical/test-data paths (replay, HDFS archive) — everything else
        is the live path. Full diagram below has the same distinction plus exact edge labels.
      </p>
    </div>
  );
}
