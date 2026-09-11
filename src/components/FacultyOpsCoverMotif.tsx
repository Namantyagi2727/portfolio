import { SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";
import { FACULTY_ACCENT } from "@/lib/illustration-tokens";

// Cover illustration built around documents, people, and workflow — the
// functional-index diagram (FacultyOpsModuleMap) stays as supporting detail
// on the case-study page; this is the at-a-glance identity, per the brief's
// note that a grid of module names shouldn't be the only visual identity.

export default function FacultyOpsCoverMotif() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 320 130"
        className="w-full h-auto"
        role="img"
        aria-label="A document moves through an automated workflow to a reviewer, who approves it."
      >
        <line x1={62} y1={65} x2={128} y2={65} stroke={BORDER_STRONG} strokeWidth={1.2} strokeDasharray="3 3" />
        <line x1={192} y1={65} x2={258} y2={65} stroke={BORDER_STRONG} strokeWidth={1.2} strokeDasharray="3 3" />

        {/* Document */}
        <g transform="translate(40, 65)">
          <path
            d="M -14 -18 L 6 -18 L 14 -10 L 14 18 L -14 18 Z"
            fill={SURFACE}
            stroke={FOREGROUND}
            strokeWidth={1.3}
          />
          <path d="M 6 -18 L 6 -10 L 14 -10" fill="none" stroke={FOREGROUND} strokeWidth={1} />
          <line x1={-8} y1={-2} x2={8} y2={-2} stroke={MUTED} strokeWidth={1} />
          <line x1={-8} y1={4} x2={8} y2={4} stroke={MUTED} strokeWidth={1} />
          <line x1={-8} y1={10} x2={2} y2={10} stroke={MUTED} strokeWidth={1} />
        </g>

        {/* Workflow — routing branch */}
        <g transform="translate(160, 65)">
          <circle cx={0} cy={0} r={20} fill={FACULTY_ACCENT} fillOpacity={0.12} stroke={FACULTY_ACCENT} strokeWidth={1.4} />
          <path
            d="M -9 4 L -9 -4 L 9 -4 M 0 -4 L 0 4 M 9 -4 L 9 4"
            fill="none"
            stroke={FACULTY_ACCENT}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </g>

        {/* Person with approval check */}
        <g transform="translate(280, 65)">
          <circle cx={0} cy={-9} r={7} fill={SURFACE} stroke={FOREGROUND} strokeWidth={1.3} />
          <path d="M -12 18 C -12 4, 12 4, 12 18 Z" fill={SURFACE} stroke={FOREGROUND} strokeWidth={1.3} />
          <circle cx={11} cy={-14} r={8} fill={FACULTY_ACCENT} />
          <path d="M 7 -14 L 10 -11 L 16 -18" fill="none" stroke={SURFACE} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {["Document", "Workflow", "Approved"].map((label, i) => (
          <text
            key={label}
            x={[40, 160, 280][i]}
            y={106}
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
