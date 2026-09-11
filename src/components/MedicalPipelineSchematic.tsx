import { SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";
import { MEDICAL_ACCENT } from "@/lib/illustration-tokens";

// A small technical scene, not a stack of labeled rectangles — camera,
// simulated renal environment, video/CV processing, detection task — each
// a distinct, recognizable silhouette, per the design brief's explicit
// instruction to avoid "another large stack of generic rectangles."
// Represents the verified experimental setup; not a claimed result.

const STAGE_Y = 78;
const STAGE_X = [40, 130, 220, 292];

export default function MedicalPipelineSchematic() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 320 140"
        className="w-full h-auto"
        role="img"
        aria-label="Experimental pipeline: a camera feeds a simulated kidney environment containing water and model calcium stones, into video and CV processing, then a stone-detection task."
      >
        {/* connective lines */}
        {STAGE_X.slice(0, -1).map((x, i) => (
          <line
            key={x}
            x1={x + 22}
            y1={STAGE_Y}
            x2={STAGE_X[i + 1] - 22}
            y2={STAGE_Y}
            stroke={BORDER_STRONG}
            strokeWidth={1.2}
            strokeDasharray="3 3"
          />
        ))}

        {/* 1. Camera */}
        <g transform={`translate(${STAGE_X[0]}, ${STAGE_Y})`}>
          <rect x={-16} y={-11} width={32} height={22} rx={4} fill={SURFACE} stroke={FOREGROUND} strokeWidth={1.3} />
          <circle cx={0} cy={0} r={7} fill="none" stroke={FOREGROUND} strokeWidth={1.3} />
          <circle cx={0} cy={0} r={3} fill={FOREGROUND} />
          <rect x={-6} y={-16} width={10} height={5} rx={1.5} fill={SURFACE} stroke={FOREGROUND} strokeWidth={1} />
        </g>

        {/* 2. Simulated kidney — organic silhouette, water fill, model stones */}
        <g transform={`translate(${STAGE_X[1]}, ${STAGE_Y})`}>
          <path
            d="M -14 -10 C -20 -14, -18 4, -12 10 C -4 18, 8 16, 13 8 C 18 0, 12 -12, 2 -14 C -4 -15, -10 -13, -14 -10 Z"
            fill={MEDICAL_ACCENT}
            fillOpacity={0.14}
            stroke={MEDICAL_ACCENT}
            strokeWidth={1.3}
          />
          <circle cx={-3} cy={-1} r={1.6} fill={MEDICAL_ACCENT} />
          <circle cx={3} cy={4} r={1.2} fill={MEDICAL_ACCENT} />
          <circle cx={1} cy={-5} r={1} fill={MEDICAL_ACCENT} />
        </g>

        {/* 3. Video / CV processing — frame with scanline + node */}
        <g transform={`translate(${STAGE_X[2]}, ${STAGE_Y})`}>
          <rect x={-17} y={-12} width={34} height={24} rx={3} fill={SURFACE} stroke={FOREGROUND} strokeWidth={1.3} />
          <line x1={-17} y1={-2} x2={17} y2={-2} stroke={MUTED} strokeWidth={1} />
          <circle cx={-8} cy={6} r={2} fill={FOREGROUND} />
          <circle cx={2} cy={6} r={2} fill={FOREGROUND} />
          <circle cx={12} cy={6} r={2} fill={FOREGROUND} />
          <line x1={-8} y1={6} x2={2} y2={6} stroke={FOREGROUND} strokeWidth={0.8} />
          <line x1={2} y1={6} x2={12} y2={6} stroke={FOREGROUND} strokeWidth={0.8} />
        </g>

        {/* 4. Detection task — bounding box around a flagged point */}
        <g transform={`translate(${STAGE_X[3]}, ${STAGE_Y})`}>
          <rect
            x={-16}
            y={-13}
            width={32}
            height={26}
            rx={2}
            fill="none"
            stroke={MEDICAL_ACCENT}
            strokeWidth={1.3}
            strokeDasharray="3 2"
          />
          <circle cx={0} cy={0} r={3} fill={MEDICAL_ACCENT} />
          <line x1={-16} y1={-13} x2={-11} y2={-13} stroke={MEDICAL_ACCENT} strokeWidth={2} />
          <line x1={-16} y1={-13} x2={-16} y2={-8} stroke={MEDICAL_ACCENT} strokeWidth={2} />
          <line x1={16} y1={13} x2={11} y2={13} stroke={MEDICAL_ACCENT} strokeWidth={2} />
          <line x1={16} y1={13} x2={16} y2={8} stroke={MEDICAL_ACCENT} strokeWidth={2} />
        </g>

        {/* labels */}
        {["CAMERA", "SIMULATED KIDNEY", "VIDEO / CV", "DETECTION"].map((label, i) => (
          <text
            key={label}
            x={STAGE_X[i]}
            y={STAGE_Y + 34}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-geist-mono)"
            fill={MUTED}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
