import ArchitectureDiagram, { type ArchNode } from "./ArchitectureDiagram";

const NODES: ArchNode[] = [
  { id: "core", x: 110, y: 60, w: 140, label: "core" },
  { id: "workflows", x: 270, y: 60, w: 140, label: "workflows" },
  { id: "approvals", x: 430, y: 60, w: 140, label: "approvals" },
  { id: "notifications", x: 590, y: 60, w: 140, label: "notifications" },
  { id: "documents", x: 110, y: 120, w: 140, label: "documents" },
  { id: "audit", x: 270, y: 120, w: 140, label: "audit" },
  { id: "chatbot", x: 430, y: 120, w: 140, label: "chatbot" },
  { id: "workload", x: 590, y: 120, w: 140, label: "workload" },
  { id: "export", x: 110, y: 180, w: 140, label: "export" },
  { id: "tenure_promotion", x: 270, y: 180, w: 140, label: "tenure_promotion" },
  { id: "faculty", x: 430, y: 180, w: 140, label: "faculty" },
  { id: "ami", x: 590, y: 180, w: 140, label: "ami" },
];

const GROUPS = [{ x: 30, y: 30, w: 630, h: 190, label: "12 DJANGO APPS — backend/apps/" }];

export default function FacultyOpsModuleMap() {
  return (
    <ArchitectureDiagram
      viewBox="0 0 690 250"
      minWidth={600}
      ariaLabel="Faculty Operations Platform module map — 12 Django apps, no inter-app data flow implied"
      nodes={NODES}
      groups={GROUPS}
    />
  );
}
