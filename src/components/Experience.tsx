import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";
import SectionLabel from "./SectionLabel";

// Recent/relevant roles get full detail; older roles compress to a dense
// row — same underlying data, no invented distinction, just less visual
// weight for history that's still accessible, not hidden. Per the brief:
// this section stays quieter than Selected Work either way.
const FEATURED_COUNT = 3;

export default function Experience() {
  const featured = experiences.slice(0, FEATURED_COUNT);
  const compact = experiences.slice(FEATURED_COUNT);

  return (
    <section id="experience" className="px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <SectionLabel label="Experience" as="h2" index="02" />

        <div className="mt-10 flex flex-col gap-8">
          {featured.map((exp, i) => (
            <div key={i} className="border-t border-border pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-medium text-foreground">{exp.title}</h3>
                  <p className="text-sm text-muted mt-0.5 flex items-center gap-1.5">
                    <Briefcase size={12} />
                    {exp.company}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono text-accent-secondary">{exp.period}</p>
                  <p className="text-xs text-muted mt-0.5">{exp.location}</p>
                </div>
              </div>

              <ul className="flex flex-col gap-1.5 mb-4 max-w-2xl">
                {exp.description.map((point, j) => (
                  <li key={j} className="text-sm text-muted flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-border-strong flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-full font-mono text-muted bg-surface border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {compact.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Earlier</p>
            <div className="flex flex-col gap-3">
              {compact.map((exp, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-2"
                >
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{exp.title}</span>
                    <span className="text-muted"> · {exp.company}</span>
                  </p>
                  <p className="text-xs font-mono text-muted flex-shrink-0">{exp.period}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
