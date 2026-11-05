import { COVERS } from "@/lib/illustration-tokens";

// A conceptual computer-vision pipeline — video stream, preprocessing,
// detection model, localized output on the live stream — arranged as a 2x2
// snake so each stage renders large within the pale-sage cover. Deliberately
// generic: it does not depict the lab's experimental setup, hardware, or
// data, and it says so on the figure itself.

const { on, onMuted, line } = COVERS.medical;
const ACCENT = "#4A6B48"; // deeper sage — the focal accent against the pale-sage surface

const CELL = 160;
const POS = [
  { x: CELL, y: CELL }, // 1. video stream
  { x: CELL * 3, y: CELL }, // 2. preprocess
  { x: CELL, y: CELL * 3 }, // 4. localized output
  { x: CELL * 3, y: CELL * 3 }, // 3. detection model
];

const MONO = "var(--font-geist-mono)";

function StageLabel({ title, detail, y }: { title: string; detail: string; y: number }) {
  return (
    <>
      <text textAnchor="middle" y={y} fontSize={13} fontFamily={MONO} fill={onMuted}>
        {title}
      </text>
      <text textAnchor="middle" y={y + 16} fontSize={10} fontFamily={MONO} fill={onMuted} opacity={0.85}>
        {detail}
      </text>
    </>
  );
}

export default function MedicalPipelineSchematic() {
  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${CELL * 4} ${CELL * 4}`}
        className="w-full h-auto"
        role="img"
        aria-label="Illustrative, conceptual computer vision pipeline: a video stream is preprocessed frame by frame, passed to a detection model, and the localized detections are shown on the live stream. Not a depiction of the lab's experimental setup."
      >
        <defs>
          <marker id="cv-pipeline-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={line} />
          </marker>
        </defs>

        {/* flow: stream -> preprocess -> model -> output (snake) */}
        <path
          d={`M ${POS[0].x + 64} ${POS[0].y} L ${POS[1].x - 64} ${POS[1].y}`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 6"
          fill="none"
          markerEnd="url(#cv-pipeline-arrow)"
        />
        <path
          d={`M ${POS[1].x} ${POS[1].y + 88} L ${POS[3].x} ${POS[3].y - 56}`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 6"
          fill="none"
          markerEnd="url(#cv-pipeline-arrow)"
        />
        <path
          d={`M ${POS[3].x - 64} ${POS[3].y} L ${POS[2].x + 64} ${POS[2].y}`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 6"
          fill="none"
          markerEnd="url(#cv-pipeline-arrow)"
        />

        {/* 1. Video stream */}
        <g transform={`translate(${POS[0].x}, ${POS[0].y})`}>
          <rect x={-42} y={-30} width={84} height={60} rx={10} fill="none" stroke={on} strokeWidth={2.5} />
          <circle cx={0} cy={2} r={20} fill="none" stroke={on} strokeWidth={2.5} />
          <circle cx={0} cy={2} r={9} fill={ACCENT} />
          <rect x={-16} y={-42} width={26} height={14} rx={3} fill="none" stroke={on} strokeWidth={2.5} />
          <StageLabel title="VIDEO STREAM" detail="continuous frames" y={56} />
        </g>

        {/* 2. Preprocess — stacked frames with adjustment sliders */}
        <g transform={`translate(${POS[1].x}, ${POS[1].y})`}>
          <rect x={-34} y={-38} width={76} height={56} rx={6} fill="none" stroke={onMuted} strokeWidth={2} />
          <rect x={-42} y={-30} width={76} height={56} rx={6} fill={COVERS.medical.surface} stroke={on} strokeWidth={2.5} />
          {[-16, -2, 12].map((y, i) => (
            <g key={y}>
              <line x1={-32} y1={y} x2={24} y2={y} stroke={onMuted} strokeWidth={1.5} />
              <circle cx={[-14, 10, -2][i]} cy={y} r={4.5} fill={ACCENT} />
            </g>
          ))}
          <StageLabel title="PREPROCESS" detail="resize · normalize" y={56} />
        </g>

        {/* 3. Detection model — layered network */}
        <g transform={`translate(${POS[3].x}, ${POS[3].y})`}>
          <rect x={-48} y={-34} width={96} height={68} rx={8} fill="none" stroke={on} strokeWidth={2.5} />
          {[-22, 0, 22].map((x, col) =>
            (col === 1 ? [-14, 0, 14] : [-8, 8]).map((y) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={4.5} fill={col === 2 ? ACCENT : on} />
            ))
          )}
          {[-8, 8].flatMap((y1) =>
            [-14, 0, 14].map((y2) => (
              <line key={`a${y1}${y2}`} x1={-22} y1={y1} x2={0} y2={y2} stroke={onMuted} strokeWidth={1} />
            ))
          )}
          {[-14, 0, 14].flatMap((y1) =>
            [-8, 8].map((y2) => (
              <line key={`b${y1}${y2}`} x1={0} y1={y1} x2={22} y2={y2} stroke={onMuted} strokeWidth={1} />
            ))
          )}
          <StageLabel title="DETECTION MODEL" detail="per-frame inference" y={56} />
        </g>

        {/* 4. Localized output — bounding box on a live frame */}
        <g transform={`translate(${POS[2].x}, ${POS[2].y})`}>
          <rect x={-48} y={-34} width={96} height={68} rx={8} fill="none" stroke={on} strokeWidth={2.5} />
          <rect
            x={-20}
            y={-18}
            width={40}
            height={34}
            rx={3}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeDasharray="6 4"
          />
          <circle cx={0} cy={-1} r={6} fill={ACCENT} />
          <StageLabel title="LOCALIZED OUTPUT" detail="boxes on the live stream" y={56} />
        </g>

        <text
          x={CELL * 2}
          y={CELL * 4 - 18}
          textAnchor="middle"
          fontSize={11}
          fontFamily={MONO}
          fill={onMuted}
          letterSpacing="0.08em"
        >
          ILLUSTRATIVE — CONCEPTUAL PIPELINE, NOT THE LAB&apos;S SETUP
        </text>
      </svg>
    </div>
  );
}
