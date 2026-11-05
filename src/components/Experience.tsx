"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experiences, journeyStops, type Experience as Role, type JourneyStopId } from "@/lib/data";
import JourneyCanvas from "./JourneyCanvas";
import SectionLabel from "./SectionLabel";

// Recent/relevant roles get full detail; the 2023 roles compress to a dense row.
const FEATURED_COUNT = 5;

function Stamp({ role, active, onFly }: { role: Role; active: boolean; onFly: (id: JourneyStopId) => void }) {
  const stop = journeyStops.find((s) => s.id === role.stopId);
  const remote = role.location.includes("Remote");
  const color = active ? "text-accent border-accent" : "text-accent-secondary border-accent-secondary/70";
  if (!stop) {
    return (
      <span className="inline-block -rotate-3 rounded-[3px] border-[1.5px] border-border-strong px-1.5 py-0.5 font-mono text-[11px] font-semibold text-muted">
        REM
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onFly(stop.id)}
      aria-label={`Show ${stop.city} on the globe`}
      className={`inline-flex -rotate-3 flex-col items-center rounded-[3px] border-[1.5px] px-1.5 py-0.5 font-mono text-[11px] font-semibold transition-colors ${color}`}
    >
      {stop.code}
      {remote && <span className="text-[7px] font-medium tracking-[0.12em]">REMOTE</span>}
    </button>
  );
}

export default function Experience() {
  const featured = experiences.slice(0, FEATURED_COUNT);
  const compact = experiences.slice(FEATURED_COUNT);
  const [activeId, setActiveId] = useState<JourneyStopId>("newyork");
  const [activeRole, setActiveRole] = useState(experiences[0].company);
  const logRef = useRef<HTMLDivElement>(null);

  // The globe follows whichever role is in the middle of the screen.
  useEffect(() => {
    const entries = logRef.current?.querySelectorAll<HTMLElement>("[data-role]");
    if (!entries) return;
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (!entry.isIntersecting) continue;
          const role = experiences.find((r) => r.company === (entry.target as HTMLElement).dataset.role);
          if (!role) continue;
          setActiveRole(role.company);
          if (role.stopId) setActiveId(role.stopId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <SectionLabel label="Experience" as="h2" index="02" />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-x-12">
          <div ref={logRef}>
            {featured.map((role, i) => {
              const [lead, ...rest] = role.description;
              const isActive = activeRole === role.company;
              return (
                <article
                  key={role.company}
                  data-role={role.company}
                  className={`grid grid-cols-[64px_1fr] gap-x-4 border-t py-6 transition-colors ${
                    isActive ? "border-accent" : "border-border"
                  }`}
                >
                  <div className="pt-0.5">
                    <Stamp role={role} active={isActive} onFly={setActiveId} />
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                      Entry {String(experiences.length - i).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-x-4 gap-y-1 mb-3">
                      <div>
                        <h3 className="text-base font-medium text-foreground">{role.title}</h3>
                        <p className="text-sm text-muted mt-0.5">{role.company}</p>
                      </div>
                      <div className="sm:text-right flex-shrink-0">
                        <p className="text-xs font-mono text-accent-secondary">{role.period}</p>
                        <p className="text-xs text-muted mt-0.5">{role.location}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted leading-relaxed">{lead}</p>

                    {rest.length > 0 && (
                      <details className="group mt-2">
                        <summary className="cursor-pointer list-none text-xs font-medium text-accent hover:text-foreground transition-colors">
                          <span className="group-open:hidden">More from this role</span>
                          <span className="hidden group-open:inline">Show less</span>
                        </summary>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {rest.map((point) => (
                            <li key={point} className="text-sm text-muted leading-relaxed">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}

                    <p className="mt-3 font-mono text-[11px] text-muted leading-relaxed">{role.tags.join(" · ")}</p>

                    {role.caseStudy && (
                      <Link
                        href={role.caseStudy.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors mt-3"
                      >
                        {role.caseStudy.label}
                        <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}

            {compact.length > 0 && (
              <div className="border-t border-border pt-6">
                <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Earlier</p>
                {compact.map((role) => (
                  <div
                    key={role.company}
                    data-role={role.company}
                    className="grid grid-cols-[64px_1fr] gap-x-4 py-2"
                  >
                    <div>
                      <Stamp role={role} active={activeRole === role.company} onFly={setActiveId} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{role.title}</span>
                        <span className="text-muted"> · {role.company}</span>
                      </p>
                      <p className="text-xs font-mono text-muted flex-shrink-0">{role.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="h-[320px]">
                <JourneyCanvas
                  activeId={activeId}
                  flat={false}
                  zoomed={false}
                  paused={false}
                  tourEnabled={false}
                  onSelect={(id) => setActiveId(id)}
                />
              </div>
              <p className="mt-2 text-center font-mono text-[11px] text-muted">
                {journeyStops.find((s) => s.id === activeId)?.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
