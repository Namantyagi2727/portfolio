import ArchitectureDiagram, { type ArchNode } from "./ArchitectureDiagram";

// Stacked vertically (one column) rather than three side-by-side groups —
// the prior horizontal layout required scrolling past 390px to see the
// SYSTEM SERVICES group at all, including the chatbot "planned" disclosure.
// A single narrow column fits every viewport without needing overflow-x
// or shrunk labels, per the design brief's "prefer vertically rearranged
// diagrams" guidance.
const NODE_W = 220;
const NODE_H = 30;
const ROW_GAP = 38;

const NODES: ArchNode[] = [
  // CORE PLATFORM
  { id: "core", x: 150, y: 40, w: NODE_W, h: NODE_H, label: "core" },
  { id: "faculty", x: 150, y: 40 + ROW_GAP, w: NODE_W, h: NODE_H, label: "faculty" },
  { id: "workflows", x: 150, y: 40 + ROW_GAP * 2, w: NODE_W, h: NODE_H, label: "workflows" },
  // OPERATIONS
  { id: "approvals", x: 150, y: 200, w: NODE_W, h: NODE_H, label: "approvals" },
  { id: "workload", x: 150, y: 200 + ROW_GAP, w: NODE_W, h: NODE_H, label: "workload" },
  { id: "tenure_promotion", x: 150, y: 200 + ROW_GAP * 2, w: NODE_W, h: NODE_H, label: "tenure_promotion" },
  { id: "ami", x: 150, y: 200 + ROW_GAP * 3, w: NODE_W, h: NODE_H, label: "ami" },
  // SYSTEM SERVICES
  { id: "notifications", x: 150, y: 398, w: NODE_W, h: NODE_H, label: "notifications" },
  { id: "documents", x: 150, y: 398 + ROW_GAP, w: NODE_W, h: NODE_H, label: "documents" },
  { id: "audit", x: 150, y: 398 + ROW_GAP * 2, w: NODE_W, h: NODE_H, label: "audit" },
  { id: "export", x: 150, y: 398 + ROW_GAP * 3, w: NODE_W, h: NODE_H, label: "export" },
  {
    id: "chatbot",
    x: 150,
    y: 398 + ROW_GAP * 4,
    w: NODE_W,
    h: NODE_H,
    label: "chatbot (planned)",
    dashed: true,
  },
];

const GROUPS = [
  { x: 20, y: 20, w: 260, h: 145, label: "CORE PLATFORM" },
  { x: 20, y: 180, w: 260, h: 183, label: "OPERATIONS" },
  { x: 20, y: 378, w: 260, h: 221, label: "SYSTEM SERVICES" },
];

export default function FacultyOpsModuleMap() {
  return (
    <div className="max-w-xs mx-auto">
      <ArchitectureDiagram
        viewBox="0 0 300 620"
        minWidth={280}
        ariaLabel="Faculty Operations Platform functional index — 12 Django apps grouped by function for presentation, not a dependency graph. Chatbot is a planned, not yet implemented, feature."
        nodes={NODES}
        groups={GROUPS}
      />
    </div>
  );
}
