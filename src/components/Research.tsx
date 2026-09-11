import { ExternalLink } from "lucide-react";
import { publications, personalInfo } from "@/lib/data";
import SectionLabel from "./SectionLabel";

const typeLabel: Record<(typeof publications)[number]["type"], string> = {
  book: "Book Chapter",
  journal: "Journal",
  conference: "Conference Paper",
};

export default function Research() {
  return (
    <section id="research" className="px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <SectionLabel
          label="Research"
          meta={`${publications.length} publications`}
          as="h2"
          index="03"
        />

        <div className="mt-10 flex flex-col gap-8">
          {publications.map((pub, i) => (
            <div key={i} className="border-t border-border pt-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-mono text-accent border border-accent/30 bg-accent/5">
                  {typeLabel[pub.type]}
                </span>
                <span className="text-xs text-muted font-mono ml-auto">{pub.date}</span>
              </div>

              <h3
                className={
                  pub.highlighted
                    ? "text-lg font-semibold text-foreground leading-snug mb-1"
                    : "text-base font-medium text-foreground leading-snug mb-1"
                }
              >
                {pub.title}
              </h3>
              <p className="text-xs font-mono text-muted mb-3">{pub.publisher}</p>

              {pub.authors && <p className="text-xs text-muted mb-3 leading-relaxed">{pub.authors}</p>}

              <p className="text-sm text-muted leading-relaxed mb-3 max-w-2xl">{pub.description}</p>

              {pub.highlighted && (
                <div className="mb-3">
                  <p className="text-2xl font-semibold text-accent leading-none">97.15%</p>
                  <p className="text-xs text-muted mt-1">
                    AI model accuracy interpreting user input on held-out test data
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {pub.highlight && !pub.highlighted && (
                  <span className="text-xs font-mono text-accent-secondary">{pub.highlight}</span>
                )}
                {pub.doi && <p className="text-xs font-mono text-muted">DOI: {pub.doi}</p>}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={12} />
                    View publication
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <a
          href={personalInfo.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors mt-10"
        >
          Google Scholar
          <ExternalLink size={14} />
        </a>
      </div>
    </section>
  );
}
