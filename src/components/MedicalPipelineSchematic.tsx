import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

const NODE_W = 230;
const NODE_H = 30;

const STAGES = [
  { label: "CAMERA", y: 20 },
  { label: "SIMULATED KIDNEY", sublabel: "water + model calcium stones", y: 92, h: 44 },
  { label: "VIDEO STREAM", y: 166 },
  { label: "CV PIPELINE", y: 226 },
  { label: "STONE DETECTION", y: 286 },
];

export default function MedicalPipelineSchematic() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg
        viewBox="0 0 290 306"
        className="w-full h-auto"
        role="img"
        aria-label="Experimental pipeline — camera feed through a simulated kidney environment with water and model calcium stones, into a video stream, CV pipeline, and stone detection"
      >
        {STAGES.slice(0, -1).map((s, i) => {
          const next = STAGES[i + 1];
          const fromY = s.y + (s.h ?? NODE_H) / 2;
          const toY = next.y - (next.h ?? NODE_H) / 2;
          return (
            <line
              key={s.label}
              x1={145}
              y1={fromY}
              x2={145}
              y2={toY}
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          );
        })}
        {STAGES.map((s) => {
          const h = s.h ?? NODE_H;
          return (
            <g key={s.label} transform={`translate(145, ${s.y})`}>
              <rect
                x={-NODE_W / 2}
                y={-h / 2}
                width={NODE_W}
                height={h}
                rx={5}
                fill={SURFACE}
                stroke={BORDER_STRONG}
                strokeWidth={1}
              />
              <text
                textAnchor="middle"
                dominantBaseline={s.sublabel ? undefined : "middle"}
                y={s.sublabel ? -4 : 0}
                fontSize={11}
                fontFamily="var(--font-geist-mono)"
                fill={FOREGROUND}
              >
                {s.label}
              </text>
              {s.sublabel && (
                <text textAnchor="middle" y={12} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                  {s.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
