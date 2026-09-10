import ArchitectureDiagram, { type ArchNode, type ArchEdge } from "./ArchitectureDiagram";

const NODES: ArchNode[] = [
  { id: "opensky", x: 90, y: 55, w: 130, label: "OpenSky API" },
  { id: "replay", x: 90, y: 155, w: 130, label: "Historical replay" },
  { id: "kafka", x: 300, y: 105, w: 150, label: "Kafka (Redpanda)", sublabel: "3 topics (flight-*)" },
  { id: "spark", x: 520, y: 105, w: 190, label: "Spark Structured Streaming" },
  { id: "influx", x: 760, y: 30, w: 110, label: "InfluxDB", sublabel: "real-time" },
  { id: "mongo", x: 760, y: 105, w: 110, label: "MongoDB", sublabel: "historical" },
  { id: "hdfs", x: 760, y: 180, w: 110, label: "HDFS", sublabel: "batch archive" },
  { id: "streamlit", x: 960, y: 105, w: 150, label: "Streamlit dashboard" },
];

const EDGES: ArchEdge[] = [
  { from: "opensky", to: "kafka" },
  { from: "replay", to: "kafka", dashed: true },
  { from: "kafka", to: "spark" },
  { from: "spark", to: "influx" },
  { from: "spark", to: "mongo" },
  { from: "spark", to: "hdfs" },
  { from: "influx", to: "streamlit" },
  { from: "mongo", to: "streamlit" },
  { from: "hdfs", to: "streamlit", dashed: true },
];

export default function AirspaceStreamDiagram() {
  return (
    <ArchitectureDiagram
      viewBox="0 0 1060 210"
      minWidth={880}
      ariaLabel="Airspace stream processing architecture — OpenSky ingestion through Kafka and Spark to InfluxDB, MongoDB, HDFS, and a Streamlit dashboard"
      nodes={NODES}
      edges={EDGES}
    />
  );
}
