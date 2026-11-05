import { COVERS } from "@/lib/illustration-tokens";

// Original editorial illustration of coordinated workflow handling — generic
// stages only (intake, validation, review, decision, record completion),
// deliberately NOT derived from any specific internal flowchart, form
// field, threshold, approval-chain structure, or role name. The generic
// "structured workflows with review and approval" shape is already public
// (this repo's own README/data.ts describes the platform that way); this
// illustration adds no internal detail beyond that.
//
// Reused at cover size (homepage) and figure size (case study) — same
// abstraction in both places, per the design brief.

const { on, onMuted, line } = COVERS.faculty;
const ACCENT = "#8A5A2B"; // deeper ochre — the focal accent against the parchment surface

const CX = 130;
const STAGE_W = 200;
const STAGE_H = 44;

const STAGES = [
  { key: "intake", label: "Intake", y: 80 },
  { key: "validation", label: "Validation", sub: "grouped checks", y: 190 },
  { key: "review", label: "Review", y: 300 },
  { key: "record", label: "Record complete", y: 480 },
];

export default function FacultyOpsWorkflowIllustration() {
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 320 560"
        className="w-full h-auto"
        role="img"
        aria-label="Illustrative workflow excerpt: a document enters intake, passes grouped validation checks, goes to review, reaches a decision, and either loops back to validation for revision or completes as a record. Generic stages only — not the platform's actual internal workflow, roles, or rules."
      >
        {/* Document entering the system */}
        <g transform={`translate(${CX}, 20)`}>
          <path d="M -20 -14 L 6 -14 L 20 0 L 20 20 L -20 20 Z" fill="none" stroke={on} strokeWidth={2} />
          <path d="M 6 -14 L 6 0 L 20 0" fill="none" stroke={on} strokeWidth={1.5} />
        </g>
        <line x1={CX} y1={40} x2={CX} y2={STAGES[0].y - STAGE_H / 2} stroke={line} strokeWidth={1.5} strokeDasharray="4 4" />

        {/* Intake */}
        <g transform={`translate(${CX}, ${STAGES[0].y})`}>
          <rect x={-STAGE_W / 2} y={-STAGE_H / 2} width={STAGE_W} height={STAGE_H} rx={8} fill="none" stroke={on} strokeWidth={2} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={13} fontFamily="var(--font-geist-mono)" fill={on}>
            Intake
          </text>
        </g>
        <line
          x1={CX}
          y1={STAGES[0].y + STAGE_H / 2}
          x2={CX}
          y2={STAGES[1].y - STAGE_H / 2 - 14}
          stroke={line}
          strokeWidth={1.5}
        />

        {/* Validation — grouped checks (a small cluster of check marks) */}
        <g transform={`translate(${CX}, ${STAGES[1].y})`}>
          <rect
            x={-STAGE_W / 2}
            y={-STAGE_H / 2 - 14}
            width={STAGE_W}
            height={STAGE_H + 28}
            rx={8}
            fill={ACCENT}
            fillOpacity={0.1}
            stroke={ACCENT}
            strokeWidth={2}
          />
          <text textAnchor="middle" y={-14} fontSize={13} fontFamily="var(--font-geist-mono)" fill={on}>
            Validation
          </text>
          {[-56, 0, 56].map((dx) => (
            <g key={dx} transform={`translate(${dx}, 14)`}>
              <circle r={9} fill="none" stroke={ACCENT} strokeWidth={1.5} />
              <path d="M -3.5 0 L -1 3 L 4 -4" fill="none" stroke={ACCENT} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
        <line
          x1={CX}
          y1={STAGES[1].y + STAGE_H / 2 + 14}
          x2={CX}
          y2={STAGES[2].y - STAGE_H / 2}
          stroke={line}
          strokeWidth={1.5}
        />

        {/* Review area */}
        <g transform={`translate(${CX}, ${STAGES[2].y})`}>
          <rect x={-STAGE_W / 2} y={-STAGE_H / 2} width={STAGE_W} height={STAGE_H} rx={8} fill="none" stroke={on} strokeWidth={2} />
          <circle cx={-STAGE_W / 2 + 26} cy={0} r={9} fill="none" stroke={on} strokeWidth={1.5} />
          <line x1={-STAGE_W / 2 + 33} y1={7} x2={-STAGE_W / 2 + 40} y2={14} stroke={on} strokeWidth={1.5} />
          <text textAnchor="middle" x={16} dominantBaseline="middle" fontSize={13} fontFamily="var(--font-geist-mono)" fill={on}>
            Review
          </text>
        </g>

        {/* Decision diamond */}
        <line x1={CX} y1={STAGES[2].y + STAGE_H / 2} x2={CX} y2={378} stroke={line} strokeWidth={1.5} />
        <g transform={`translate(${CX}, 400)`}>
          <path d="M 0 -34 L 46 0 L 0 34 L -46 0 Z" fill="none" stroke={ACCENT} strokeWidth={2} />
          <text textAnchor="middle" dominantBaseline="middle" fontSize={11} fontFamily="var(--font-geist-mono)" fill={ACCENT}>
            Decision
          </text>
        </g>

        {/* Restrained revision loop — routed to the right side, around the
            Review box, not through it. Terminates at Validation's edge. */}
        <path
          d={`M ${CX + 46} 400 C 260 400, 260 190, ${CX + STAGE_W / 2} 190`}
          fill="none"
          stroke={onMuted}
          strokeWidth={1.5}
          strokeDasharray="3 4"
          markerEnd="url(#fo-revision-arrow)"
        />
        <text x={266} y={296} fontSize={10} fontFamily="var(--font-geist-mono)" fill={onMuted} textAnchor="middle" transform="rotate(90 266 296)">
          needs revision
        </text>
        <defs>
          <marker id="fo-revision-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={onMuted} />
          </marker>
        </defs>

        {/* Approved -> Record complete */}
        <line x1={CX} y1={434} x2={CX} y2={STAGES[3].y - STAGE_H / 2 - 20} stroke={ACCENT} strokeWidth={1.5} />
        <text x={CX + 10} y={456} fontSize={10} fontFamily="var(--font-geist-mono)" fill={ACCENT}>
          approved
        </text>

        <g transform={`translate(${CX}, ${STAGES[3].y - 10})`}>
          <path d="M -20 -14 L 6 -14 L 20 0 L 20 20 L -20 20 Z" fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={2} />
          <path d="M 6 -14 L 6 0 L 20 0" fill="none" stroke={ACCENT} strokeWidth={1.5} />
          <path d="M -10 4 L -3 11 L 12 -6" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text
          textAnchor="middle"
          x={CX}
          y={STAGES[3].y + 40}
          fontSize={13}
          fontFamily="var(--font-geist-mono)"
          fill={on}
        >
          Record complete
        </text>

        <text
          textAnchor="middle"
          x={CX}
          y={540}
          fontSize={10}
          fontFamily="var(--font-geist-mono)"
          fill={onMuted}
          letterSpacing={0.5}
        >
          ILLUSTRATIVE WORKFLOW EXCERPT
        </text>
      </svg>
    </div>
  );
}
