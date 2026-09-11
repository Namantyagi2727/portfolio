import { BORDER_STRONG, MUTED } from "@/lib/diagram-tokens";
import { AIRSPACE_ACCENT } from "@/lib/illustration-tokens";

// Deliberately abstract, not a map: this project has no real dashboard
// screenshot and no GeoJSON/mapping library in this codebase (removed in an
// earlier cycle) to draw an accurate coastline from. Rather than invent
// geography the brief explicitly forbids, this uses a radar/instrument-panel
// motif — concentric range rings, a sweep, and a few tracked blips with
// motion trails — which represents "streaming risk monitoring" honestly
// without claiming to be a real map of anything.

const BLIPS = [
  { x: 130, y: 45, flagged: false },
  { x: 190, y: 80, flagged: true },
  { x: 100, y: 95, flagged: false },
  { x: 210, y: 40, flagged: false },
];

export default function AirspaceCoverMotif() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 320 140"
        className="w-full h-auto"
        role="img"
        aria-label="Illustrative radar-style display: tracked points with motion trails over concentric range rings, one flagged as a risk."
      >
        <g transform="translate(160, 70)">
          {[26, 46, 64].map((r) => (
            <circle key={r} cx={0} cy={0} r={r} fill="none" stroke={BORDER_STRONG} strokeWidth={1} />
          ))}
          <line x1={-64} y1={0} x2={64} y2={0} stroke={BORDER_STRONG} strokeWidth={0.8} />
          <line x1={0} y1={-64} x2={0} y2={64} stroke={BORDER_STRONG} strokeWidth={0.8} />
        </g>

        {BLIPS.map((b, i) => (
          <g key={i}>
            <line
              x1={b.x - 14}
              y1={b.y + 10}
              x2={b.x}
              y2={b.y}
              stroke={b.flagged ? AIRSPACE_ACCENT : MUTED}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <circle cx={b.x} cy={b.y} r={b.flagged ? 4.5 : 3} fill={b.flagged ? AIRSPACE_ACCENT : MUTED} />
            {b.flagged && (
              <circle cx={b.x} cy={b.y} r={8} fill="none" stroke={AIRSPACE_ACCENT} strokeWidth={1} strokeDasharray="2 2" />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
