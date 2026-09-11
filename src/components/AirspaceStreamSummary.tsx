import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

// Simplified vertical overview of AirspaceStreamDiagram's branching
// pipeline — same 8 nodes and the live/historical distinction, stacked in
// one column instead of the full diagram's ~880px-wide horizontal layout.
//
// The three storage destinations are laid out side by side (not stacked on
// one shared vertical line) with independent diagonal fan-out/fan-in
// connectors, so the diagram doesn't visually imply InfluxDB -> MongoDB ->
// HDFS -> Streamlit is a sequential chain — each is an independent branch
// from Spark, and each independently feeds Streamlit.
const NODE_W = 220;
const SMALL_W = 78;
const NODE_H = 30;
const SMALL_H = 34;

const SOURCES = [
  { label: "OpenSky API", sub: "live", y: 20, dashed: false },
  { label: "Historical replay", sub: "test data", y: 66, dashed: true },
];

const SINKS = [
  { label: "InfluxDB", sub: "real-time", x: 46, dashed: false },
  { label: "MongoDB", sub: "historical", x: 130, dashed: false },
  { label: "HDFS", sub: "batch archive", x: 214, dashed: true },
];

const KAFKA_Y = 112;
const SPARK_Y = 172;
const SINK_Y = 250;
const STREAMLIT_Y = 340;

export default function AirspaceStreamSummary() {
  return (
    <div className="max-w-xs mx-auto">
      <svg
        viewBox="0 0 260 380"
        className="w-full h-auto"
        role="img"
        aria-label="Simplified stream pipeline overview: OpenSky API (live) and historical replay independently feed Kafka, then Spark Structured Streaming, which independently branches to InfluxDB, MongoDB, and HDFS, each of which independently feeds a Streamlit dashboard"
      >
        {SOURCES.map((n) => (
          <g key={n.label}>
            <line
              x1={130}
              y1={n.y + NODE_H / 2}
              x2={130}
              y2={KAFKA_Y - NODE_H / 2}
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

        <g transform={`translate(130, ${KAFKA_Y})`}>
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" y={-3} fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Kafka (Redpanda)
          </text>
          <text textAnchor="middle" y={9} fontSize={7} fontFamily="var(--font-geist-mono)" fill={MUTED}>
            3 topics (flight-*)
          </text>
        </g>

        <line x1={130} y1={KAFKA_Y + NODE_H / 2} x2={130} y2={SPARK_Y - NODE_H / 2} stroke={ACCENT} strokeWidth={1.2} />
        <g transform={`translate(130, ${SPARK_Y})`}>
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Spark Structured Streaming
          </text>
        </g>

        {/* Independent fan-out: each sink gets its own diagonal line straight
            from Spark's edge — none pass through or behind another box. */}
        {SINKS.map((n) => (
          <line
            key={`in-${n.label}`}
            x1={130}
            y1={SPARK_Y + NODE_H / 2}
            x2={n.x}
            y2={SINK_Y - SMALL_H / 2}
            stroke={ACCENT}
            strokeWidth={1.2}
            strokeDasharray={n.dashed ? "2 3" : undefined}
          />
        ))}
        {SINKS.map((n) => (
          <g key={n.label} transform={`translate(${n.x}, ${SINK_Y})`}>
            <rect x={-SMALL_W / 2} y={-SMALL_H / 2} width={SMALL_W} height={SMALL_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
            <text textAnchor="middle" dominantBaseline="middle" y={-5} fontSize={8.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
              {n.label}
            </text>
            <text textAnchor="middle" y={8} fontSize={6} fontFamily="var(--font-geist-mono)" fill={MUTED}>
              {n.sub}
            </text>
          </g>
        ))}
        {/* Independent fan-in: each sink's own line to Streamlit, not routed
            through the other two sinks. */}
        {SINKS.map((n) => (
          <line
            key={`out-${n.label}`}
            x1={n.x}
            y1={SINK_Y + SMALL_H / 2}
            x2={130}
            y2={STREAMLIT_Y - NODE_H / 2}
            stroke={ACCENT}
            strokeWidth={1.2}
            strokeDasharray={n.dashed ? "2 3" : undefined}
          />
        ))}

        <g transform={`translate(130, ${STREAMLIT_Y})`}>
          <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={5} fill={SURFACE} stroke={BORDER_STRONG} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontFamily="var(--font-geist-mono)" fill={FOREGROUND}>
            Streamlit dashboard
          </text>
        </g>
      </svg>
      <p className="text-xs text-muted leading-relaxed mt-2 max-w-md mx-auto text-center">
        Dashed lines mark the historical/test-data paths (replay, HDFS archive) — everything else
        is the live path. Each storage destination is an independent branch from Spark, not a
        chain. Full diagram below has the same relationships plus exact edge labels.
      </p>
    </div>
  );
}
