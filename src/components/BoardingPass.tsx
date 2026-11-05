import type { JourneyStop } from "@/lib/data";

const BARCODE =
  "repeating-linear-gradient(0deg, var(--foreground) 0 2px, transparent 2px 4px, var(--foreground) 4px 5px, transparent 5px 9px, var(--foreground) 9px 12px, transparent 12px 14px)";

export default function BoardingPass({ stop, compact = false }: { stop: JourneyStop; compact?: boolean }) {
  return (
    <div
      className={`relative grid h-full rounded-[10px] bg-surface text-left shadow-[0_1px_0_var(--border),0_8px_20px_-14px_rgba(0,0,0,0.45)] ${
        compact ? "grid-cols-[1fr_46px]" : "grid-cols-[1fr_62px]"
      }`}
    >
      <div className="min-w-0 px-3.5 pt-3 pb-3">
        <div className="flex justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted mb-1.5">
          <span>Boarding pass</span>
          {!compact && <span>Naman Tyagi</span>}
        </div>

        <div className={`flex items-center gap-2 font-mono font-semibold mb-2 ${compact ? "text-base" : "text-xl"}`}>
          {stop.from ? (
            <>
              <span>{stop.from}</span>
              <span
                aria-hidden="true"
                className={`relative flex-1 min-w-4 border-t-[1.5px] ${
                  stop.remote ? "border-dotted border-muted" : "border-accent-secondary"
                }`}
              >
                <svg
                  viewBox="-11 -8 22 16"
                  className="absolute left-1/2 -top-[8px] -ml-[7px] w-3.5 h-3.5 fill-accent-secondary"
                >
                  <path d="M10 0 L2 1.3 L-2 6.5 L-4.2 6.5 L-2.4 1.3 L-6 1 L-7.6 3 L-9 3 L-8 0 L-9 -3 L-7.6 -3 L-6 -1 L-2.4 -1.3 L-4.2 -6.5 L-2 -6.5 L2 -1.3 Z" />
                </svg>
              </span>
              <span>{stop.code}</span>
            </>
          ) : (
            <>
              <span>{stop.code}</span>
              <span className="font-mono text-[11px] font-medium text-muted">Where it started</span>
            </>
          )}
        </div>

        <div className={`grid gap-x-3 gap-y-1.5 text-xs leading-snug ${compact ? "" : "grid-cols-[1.2fr_1fr]"}`}>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-muted mb-px">{stop.city}</span>
            {stop.summary}
          </div>
          {!compact && (
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-muted mb-px">Class</span>
              {stop.passClass}
            </div>
          )}
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-muted mb-px">When</span>
            {stop.when}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-1.5 border-l-2 border-dotted border-border py-2.5">
        <span aria-hidden="true" className="absolute -left-2 -top-[7px] h-3.5 w-3.5 rounded-full bg-background" />
        <span aria-hidden="true" className="absolute -left-2 -bottom-[7px] h-3.5 w-3.5 rounded-full bg-background" />
        <span className="font-mono text-[11px] font-semibold tracking-[0.08em]">{stop.code}</span>
        <span
          aria-hidden="true"
          className={`flex-1 min-h-8 opacity-75 ${compact ? "w-6" : "w-8"}`}
          style={{ backgroundImage: BARCODE }}
        />
      </div>

      {stop.remote && (
        <span
          className={`absolute font-mono text-[9px] font-semibold tracking-[0.14em] text-accent-secondary border-[1.5px] border-accent-secondary rounded-[3px] px-1.5 py-0.5 -rotate-[7deg] ${
            compact ? "right-[54px] bottom-2.5" : "right-[72px] bottom-3"
          }`}
        >
          REMOTE
        </span>
      )}
    </div>
  );
}
