import { COVERS } from "@/lib/illustration-tokens";

// Deliberately abstract, not a map: this project has no real dashboard
// screenshot and no GeoJSON/mapping library in this codebase (removed in an
// earlier cycle) to draw an accurate coastline from. Rather than invent
// geography the brief explicitly forbids, this uses a radar/instrument-panel
// motif — concentric range rings, curved motion trails, and a highlighted
// congestion sector — representing "streaming risk monitoring" honestly
// without claiming to be a real map or observed flight paths. Sized to fill
// the cool blue-grey cover, not a small centered icon.

const { on, onMuted, line } = COVERS.airspace;
const ACCENT = "#D9A15C"; // warm amber flag — reads clearly against the blue-grey surface

const BLIPS = [
  { angle: -40, r: 140, flagged: false, trail: 30 },
  { angle: 15, r: 95, flagged: true, trail: 46 },
  { angle: 100, r: 160, flagged: false, trail: 26 },
  { angle: 160, r: 110, flagged: false, trail: 34 },
  { angle: -110, r: 70, flagged: false, trail: 20 },
];

function point(cx: number, cy: number, angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
}

export default function AirspaceCoverMotif() {
  const cx = 220;
  const cy = 220;

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 440 470"
        className="w-full h-auto"
        role="img"
        aria-label="Illustrative radar-style display: tracked points with curved motion trails over concentric range rings, one highlighted congestion sector, one point flagged as a risk. Not a map or observed flight data."
      >
        {[70, 120, 170, 210].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={line} strokeWidth={1} />
        ))}
        <line x1={cx - 210} y1={cy} x2={cx + 210} y2={cy} stroke={line} strokeWidth={0.75} />
        <line x1={cx} y1={cy - 210} x2={cx} y2={cy + 210} stroke={line} strokeWidth={0.75} />

        {/* Highlighted congestion sector — a shaded wedge, not a claimed observation */}
        <path
          d={`M ${cx} ${cy} L ${point(cx, cy, -10, 210)[0]} ${point(cx, cy, -10, 210)[1]} A 210 210 0 0 1 ${
            point(cx, cy, 40, 210)[0]
          } ${point(cx, cy, 40, 210)[1]} Z`}
          fill={ACCENT}
          fillOpacity={0.12}
          stroke={ACCENT}
          strokeOpacity={0.4}
          strokeWidth={1}
        />

        {BLIPS.map((b, i) => {
          const [x, y] = point(cx, cy, b.angle, b.r);
          const [tx, ty] = point(cx, cy, b.angle + 14, b.r - b.trail);
          const midR = b.r - b.trail / 2;
          const [mx, my] = point(cx, cy, b.angle + 7, midR);
          return (
            <g key={i}>
              <path
                d={`M ${tx} ${ty} Q ${mx} ${my} ${x} ${y}`}
                fill="none"
                stroke={b.flagged ? ACCENT : onMuted}
                strokeWidth={b.flagged ? 1.5 : 1}
                strokeDasharray={b.flagged ? undefined : "3 3"}
                opacity={b.flagged ? 0.8 : 0.55}
              />
              <circle cx={x} cy={y} r={b.flagged ? 6 : 4} fill={b.flagged ? ACCENT : on} />
              {b.flagged && (
                <circle cx={x} cy={y} r={12} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="2 3" />
              )}
            </g>
          );
        })}

        <text x={cx} y={cy + 232} textAnchor="middle" fontSize={11} fontFamily="var(--font-geist-mono)" fill={onMuted}>
          ILLUSTRATIVE — NOT OBSERVED FLIGHT DATA
        </text>
      </svg>
    </div>
  );
}
