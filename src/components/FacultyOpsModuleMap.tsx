import ArchitectureDiagram, { type ArchNode } from "./ArchitectureDiagram";

const NODES: ArchNode[] = [
  // CORE PLATFORM
  { id: "core", x: 110, y: 70, w: 140, label: "core" },
  { id: "faculty", x: 110, y: 120, w: 140, label: "faculty" },
  { id: "workflows", x: 110, y: 170, w: 140, label: "workflows" },
  // OPERATIONS
  { id: "approvals", x: 310, y: 70, w: 140, label: "approvals" },
  { id: "workload", x: 310, y: 120, w: 140, label: "workload" },
  { id: "tenure_promotion", x: 310, y: 170, w: 140, label: "tenure_promotion" },
  { id: "ami", x: 310, y: 220, w: 140, label: "ami" },
  // SYSTEM SERVICES
  { id: "notifications", x: 510, y: 70, w: 140, label: "notifications" },
  { id: "documents", x: 510, y: 120, w: 140, label: "documents" },
  { id: "audit", x: 510, y: 170, w: 140, label: "audit" },
  { id: "export", x: 510, y: 220, w: 140, label: "export" },
  { id: "chatbot", x: 510, y: 270, w: 140, label: "chatbot (planned)", dashed: true },
];

const GROUPS = [
  { x: 20, y: 30, w: 180, h: 165, label: "CORE PLATFORM" },
  { x: 220, y: 30, w: 180, h: 215, label: "OPERATIONS" },
  { x: 420, y: 30, w: 180, h: 265, label: "SYSTEM SERVICES" },
];

export default function FacultyOpsModuleMap() {
  return (
    <ArchitectureDiagram
      viewBox="0 0 620 320"
      minWidth={560}
      ariaLabel="Faculty Operations Platform functional index — 12 Django apps grouped by function for presentation, not a dependency graph. Chatbot is a planned, not yet implemented, feature."
      nodes={NODES}
      groups={GROUPS}
    />
  );
}
