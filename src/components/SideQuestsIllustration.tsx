// Three small colored tiles, matching the same cover treatment used for
// Selected Work (a distinct tinted surface + a substantial icon), applied
// at a compact personal scale — not three generic icon pills. References
// three existing verified interests only; no invented anecdotes,
// achievements, or statistics.

const TILES = [
  { key: "f1", label: "F1", bg: "#E8CFC5", fg: "#8A3B2A" },
  { key: "gaming", label: "Gaming", bg: "#D6E0EC", fg: "#355C8A" },
  { key: "chess", label: "Chess", bg: "#E6E2D6", fg: "#3A3A34" },
] as const;

function F1Car({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g stroke={color} strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* rear wing */}
        <path d="M 18 40 L 18 30 L 30 30" />
        {/* main body + nose */}
        <path d="M 18 40 L 24 52 L 40 56 L 60 56 L 78 50 L 86 46 L 86 42 L 74 40 L 60 38 L 40 40 Z" />
        {/* cockpit hump */}
        <path d="M 44 40 C 46 33, 56 33, 58 40" />
        {/* front wing */}
        <path d="M 86 44 L 94 44 M 86 48 L 94 48" />
        {/* halo */}
        <path d="M 46 40 L 50 30 L 56 30 L 58 40" />
      </g>
      {/* wheels */}
      <circle cx="30" cy="58" r="9" fill={color} />
      <circle cx="74" cy="58" r="9" fill={color} />
      <circle cx="30" cy="58" r="3.5" fill="#F6F5F0" />
      <circle cx="74" cy="58" r="3.5" fill="#F6F5F0" />
    </svg>
  );
}

function GamingController({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M 28 40 C 14 40, 10 58, 14 70 C 17 79, 27 79, 32 70 L 36 62 L 64 62 L 68 70 C 73 79, 83 79, 86 70 C 90 58, 86 40, 72 40 Z"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* d-pad */}
      <g stroke={color} strokeWidth="3" strokeLinecap="round">
        <line x1="30" y1="52" x2="30" y2="64" />
        <line x1="24" y1="58" x2="36" y2="58" />
      </g>
      {/* action buttons */}
      <circle cx="66" cy="52" r="3" fill={color} />
      <circle cx="74" cy="58" r="3" fill={color} />
      <circle cx="66" cy="64" r="3" fill={color} />
      <circle cx="58" cy="58" r="3" fill={color} />
    </svg>
  );
}

function ChessBoard({ color }: { color: string }) {
  const cells = 4;
  const size = 60;
  const cell = size / cells;
  const offset = (100 - size) / 2;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g transform={`translate(${offset}, ${offset + 8})`}>
        {Array.from({ length: cells }).map((_, row) =>
          Array.from({ length: cells }).map((_, col) => {
            const dark = (row + col) % 2 === 1;
            return dark ? (
              <rect
                key={`${row}-${col}`}
                x={col * cell}
                y={row * cell}
                width={cell}
                height={cell}
                fill={color}
                fillOpacity={0.85}
              />
            ) : null;
          })
        )}
        <rect x={0} y={0} width={size} height={size} fill="none" stroke={color} strokeWidth="2" />
      </g>
      {/* king piece */}
      <g transform="translate(38, 26)" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M -6 14 L 6 14 L 5 4 L -5 4 Z" />
        <line x1="0" y1="4" x2="0" y2="-6" />
        <line x1="-4" y1="-2" x2="4" y2="-2" />
      </g>
      {/* pawn piece */}
      <g transform="translate(58, 30)" fill={color}>
        <circle cx="0" cy="-4" r="4" />
        <path d="M -6 10 L 6 10 L 4 2 L -4 2 Z" />
      </g>
    </svg>
  );
}

const ICONS = { f1: F1Car, gaming: GamingController, chess: ChessBoard };

export default function SideQuestsIllustration() {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-sm" role="img" aria-label="Three tiles representing F1, gaming, and chess">
      {TILES.map((tile) => {
        const Icon = ICONS[tile.key];
        return (
          <div key={tile.key} className="flex flex-col items-center gap-2">
            <div
              className="w-full aspect-square rounded-lg flex items-center justify-center p-4"
              style={{ background: tile.bg }}
            >
              <Icon color={tile.fg} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{tile.label}</span>
          </div>
        );
      })}
    </div>
  );
}
