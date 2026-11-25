import { journeyStops, offDutyStamps } from "@/lib/data";

const TILTS = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6"];

export default function PassportStamps() {
  return (
    <div className="grid max-w-3xl grid-cols-1 overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-2">
      <div className="p-5 sm:p-6 border-b-2 border-dashed border-border-strong sm:border-b-0 sm:border-r-2">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Passport · Entries</p>
        <ul className="grid grid-cols-2 gap-4">
          {journeyStops.map((stop, i) => (
            <li
              key={stop.id}
              className={`flex aspect-square flex-col items-center justify-center rounded-full border-[3px] border-double p-2 text-center opacity-90 ${
                TILTS[i % TILTS.length]
              } ${stop.remote ? "border-muted text-muted" : i % 2 ? "border-accent text-accent" : "border-accent-secondary text-accent-secondary"}`}
            >
              <span className="font-mono text-lg font-semibold leading-none">{stop.code}</span>
              <span className="mt-1 text-[11px] font-medium leading-tight">{stop.city}</span>
              <span className="mt-0.5 font-mono text-[9px] leading-tight">{stop.remote ? "REMOTE" : stop.when}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 sm:p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Passport · Off duty</p>
        <ul className="grid grid-cols-2 gap-4">
          {offDutyStamps.map((stamp, i) => (
            <li
              key={stamp}
              className={`flex aspect-[4/3] items-center justify-center rounded-md border-2 p-2 text-center font-mono text-xs font-semibold uppercase tracking-wide opacity-90 ${
                TILTS[(i + 1) % TILTS.length]
              } ${i % 2 ? "border-accent-secondary text-accent-secondary" : "border-accent text-accent"}`}
            >
              {stamp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
