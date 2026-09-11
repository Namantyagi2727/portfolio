import { ACCENT, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

// A compact original pictorial arrangement — a checkered flag, a game
// controller, and a chess knight, resting together on one shared shelf line
// rather than three separate icon pills. References the existing verified
// interests only; no invented anecdotes, achievements, or statistics.
export default function SideQuestsIllustration() {
  return (
    <svg
      viewBox="0 0 260 100"
      className="w-full max-w-xs h-auto"
      role="img"
      aria-label="A small illustration of a checkered flag, a game controller, and a chess knight"
    >
      <line x1={10} y1={82} x2={250} y2={82} stroke={BORDER_STRONG} strokeWidth={1.2} />

      {/* Checkered flag on a pole — F1 */}
      <g transform="translate(40, 30)">
        <line x1={0} y1={-24} x2={0} y2={52} stroke={FOREGROUND} strokeWidth={2} />
        <path d="M 0 -22 L 34 -14 L 0 4 Z" fill="none" stroke={FOREGROUND} strokeWidth={1.6} />
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2].map((col) => {
            const on = (row + col) % 2 === 0;
            if (!on) return null;
            const w = 34 / 3;
            const h = 26 / 4;
            return (
              <rect
                key={`${row}-${col}`}
                x={col * w}
                y={-22 + row * h}
                width={w}
                height={h}
                fill={FOREGROUND}
                opacity={0.85}
              />
            );
          })
        )}
      </g>

      {/* Game controller */}
      <g transform="translate(130, 56)">
        <path
          d="M -34 -6 C -34 -18, -20 -20, -12 -16 L 12 -16 C 20 -20, 34 -18, 34 -6 C 34 6, 28 18, 18 18 C 12 18, 10 10, 0 10 C -10 10, -12 18, -18 18 C -28 18, -34 6, -34 -6 Z"
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.8}
        />
        <line x1={-22} y1={-6} x2={-22} y2={2} stroke={ACCENT} strokeWidth={1.6} />
        <line x1={-26} y1={-2} x2={-18} y2={-2} stroke={ACCENT} strokeWidth={1.6} />
        <circle cx={16} cy={-4} r={2.5} fill={ACCENT} />
        <circle cx={22} cy={2} r={2.5} fill={ACCENT} />
      </g>

      {/* Chess knight */}
      <g transform="translate(210, 20)">
        <path
          d="M -10 42 L -12 46 L 18 46 L 16 42 L 12 40 L 12 20 C 12 10, 4 4, -2 -2 C -8 -8, -6 -16, 2 -20 C -6 -22, -14 -16, -14 -6 C -14 0, -10 2, -8 6 L -10 10 L -6 12 L -10 16 L -4 18 L -8 22 L -8 40 Z"
          fill="none"
          stroke={FOREGROUND}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <circle cx={-4} cy={-8} r={1.4} fill={FOREGROUND} />
      </g>

      <text x={40} y={96} textAnchor="middle" fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
        F1
      </text>
      <text x={130} y={96} textAnchor="middle" fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
        GAMING
      </text>
      <text x={210} y={96} textAnchor="middle" fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
        CHESS
      </text>
    </svg>
  );
}
