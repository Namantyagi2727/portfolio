import { COVERS } from "@/lib/illustration-tokens";

// A substantial pictorial scene, not a small centered icon strip — camera,
// simulated renal environment, video/CV processing, detection task — each
// a distinct, recognizable silhouette, arranged in a 2x2 grid so each icon
// can render large within the pale-sage cover rather than a thin row of
// small icons surrounded by empty space. Represents the verified
// experimental setup; not a claimed result.

const { on, onMuted, line } = COVERS.medical;
const ACCENT = "#4A6B48"; // deeper sage — the focal accent against the pale-sage surface

const CELL = 160;
const POS = [
  { x: CELL, y: CELL },
  { x: CELL * 3, y: CELL },
  { x: CELL, y: CELL * 3 },
  { x: CELL * 3, y: CELL * 3 },
];

export default function MedicalPipelineSchematic() {
  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${CELL * 4} ${CELL * 4}`}
        className="w-full h-auto"
        role="img"
        aria-label="Experimental pipeline: a camera feeds a simulated kidney environment containing water and model calcium stones, into video and CV processing, then a stone-detection task."
      >
        {/* flow arrows: camera -> kidney -> video/CV -> detection (snake) */}
        <path
          d={`M ${POS[0].x + 60} ${POS[0].y} L ${POS[1].x - 60} ${POS[1].y}`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 6"
          fill="none"
        />
        <path
          d={`M ${POS[1].x} ${POS[1].y + 60} L ${POS[3].x} ${POS[3].y - 60}`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 6"
          fill="none"
        />
        <path
          d={`M ${POS[3].x - 60} ${POS[3].y} L ${POS[2].x + 60} ${POS[2].y}`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 6"
          fill="none"
        />

        {/* 1. Camera */}
        <g transform={`translate(${POS[0].x}, ${POS[0].y})`}>
          <rect x={-42} y={-30} width={84} height={60} rx={10} fill="none" stroke={on} strokeWidth={2.5} />
          <circle cx={0} cy={2} r={20} fill="none" stroke={on} strokeWidth={2.5} />
          <circle cx={0} cy={2} r={9} fill={ACCENT} />
          <rect x={-16} y={-42} width={26} height={14} rx={3} fill="none" stroke={on} strokeWidth={2.5} />
          <text textAnchor="middle" y={56} fontSize={13} fontFamily="var(--font-geist-mono)" fill={onMuted}>
            CAMERA
          </text>
        </g>

        {/* 2. Simulated kidney — organic silhouette, water fill, model stones */}
        <g transform={`translate(${POS[1].x}, ${POS[1].y})`}>
          <path
            d="M -38 -28 C -54 -38, -48 12, -32 28 C -10 48, 22 44, 36 22 C 50 0, 32 -32, 6 -38 C -10 -42, -26 -36, -38 -28 Z"
            fill={ACCENT}
            fillOpacity={0.16}
            stroke={ACCENT}
            strokeWidth={2.5}
          />
          <circle cx={-8} cy={-4} r={5} fill={ACCENT} />
          <circle cx={10} cy={12} r={3.5} fill={ACCENT} />
          <circle cx={2} cy={-16} r={3} fill={ACCENT} />
          <path d="M -30 32 Q -20 38, -10 32 T 10 32 T 30 32" stroke={ACCENT} strokeWidth={1.5} fill="none" opacity={0.5} />
          <text textAnchor="middle" y={62} fontSize={13} fontFamily="var(--font-geist-mono)" fill={onMuted}>
            SIMULATED KIDNEY
          </text>
          <text textAnchor="middle" y={78} fontSize={10} fontFamily="var(--font-geist-mono)" fill={onMuted} opacity={0.8}>
            water + model calcium stones
          </text>
        </g>

        {/* 3. Video / CV processing — frame with scanline + nodes */}
        <g transform={`translate(${POS[2].x}, ${POS[2].y})`}>
          <rect x={-48} y={-34} width={96} height={68} rx={8} fill="none" stroke={on} strokeWidth={2.5} />
          <line x1={-48} y1={-6} x2={48} y2={-6} stroke={onMuted} strokeWidth={1.5} />
          <circle cx={-22} cy={16} r={6} fill={on} />
          <circle cx={4} cy={16} r={6} fill={on} />
          <circle cx={30} cy={16} r={6} fill={on} />
          <line x1={-22} y1={16} x2={4} y2={16} stroke={on} strokeWidth={1.5} />
          <line x1={4} y1={16} x2={30} y2={16} stroke={on} strokeWidth={1.5} />
          <text textAnchor="middle" y={54} fontSize={13} fontFamily="var(--font-geist-mono)" fill={onMuted}>
            VIDEO / CV
          </text>
        </g>

        {/* 4. Detection task — bounding box around a flagged point */}
        <g transform={`translate(${POS[3].x}, ${POS[3].y})`}>
          <rect
            x={-44}
            y={-36}
            width={88}
            height={72}
            rx={6}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeDasharray="7 5"
          />
          <circle cx={0} cy={0} r={7} fill={ACCENT} />
          <line x1={-44} y1={-36} x2={-30} y2={-36} stroke={ACCENT} strokeWidth={4} />
          <line x1={-44} y1={-36} x2={-44} y2={-22} stroke={ACCENT} strokeWidth={4} />
          <line x1={44} y1={36} x2={30} y2={36} stroke={ACCENT} strokeWidth={4} />
          <line x1={44} y1={36} x2={44} y2={22} stroke={ACCENT} strokeWidth={4} />
          <text textAnchor="middle" y={58} fontSize={13} fontFamily="var(--font-geist-mono)" fill={onMuted}>
            DETECTION
          </text>
        </g>
      </svg>
    </div>
  );
}
