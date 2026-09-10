import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

export type ArchNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sublabel?: string;
};

export type ArchEdge = {
  from: string;
  to: string;
  dashed?: boolean;
};

export type ArchGroup = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

type ArchitectureDiagramProps = {
  viewBox: string;
  minWidth: number;
  ariaLabel: string;
  nodes: ArchNode[];
  edges?: ArchEdge[];
  groups?: ArchGroup[];
};

const DEFAULT_NODE_W = 140;
const DEFAULT_NODE_H = 34;

export default function ArchitectureDiagram({
  viewBox,
  minWidth,
  ariaLabel,
  nodes,
  edges = [],
  groups = [],
}: ArchitectureDiagramProps) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth }}>
        <svg viewBox={viewBox} className="w-full h-auto" role="img" aria-label={ariaLabel}>
          {groups.map((g) => (
            <g key={g.label}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={4} fill="none" stroke={BORDER_STRONG} strokeDasharray="3 3" />
              <text x={g.x + 6} y={g.y - 4} fontSize={9} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                {g.label}
              </text>
            </g>
          ))}

          {edges.map((e, i) => {
            const from = byId[e.from];
            const to = byId[e.to];
            if (!from || !to) return null;
            const fromW = from.w ?? DEFAULT_NODE_W;
            const toW = to.w ?? DEFAULT_NODE_W;
            const goingRight = to.x >= from.x;
            return (
              <line
                key={`${e.from}-${e.to}-${i}`}
                x1={goingRight ? from.x + fromW / 2 : from.x - fromW / 2}
                y1={from.y}
                x2={goingRight ? to.x - toW / 2 : to.x + toW / 2}
                y2={to.y}
                stroke={ACCENT}
                strokeWidth={1.2}
                strokeDasharray={e.dashed ? "4 4" : undefined}
              />
            );
          })}

          {nodes.map((n) => {
            const w = n.w ?? DEFAULT_NODE_W;
            const h = n.h ?? DEFAULT_NODE_H;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={SURFACE} stroke={BORDER_STRONG} strokeWidth={1} />
                <text
                  textAnchor="middle"
                  dominantBaseline={n.sublabel ? undefined : "middle"}
                  y={n.sublabel ? -3 : 0}
                  fontSize={9.5}
                  fontFamily="var(--font-geist-mono)"
                  fill={FOREGROUND}
                >
                  {n.label}
                </text>
                {n.sublabel && (
                  <text textAnchor="middle" y={10} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                    {n.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
