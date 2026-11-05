"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { publications, personalInfo, type Publication } from "@/lib/data";
import SectionLabel from "./SectionLabel";

const typeLabel: Record<Publication["type"], string> = {
  book: "Book Chapter",
  journal: "Journal Article",
  conference: "Conference Paper",
};

// Papers and book chapters are listed separately so the record reads as
// what it is — a journal article, a conference paper, and two chapters —
// rather than as interchangeable "papers".
const GROUPS: { label: string; types: Publication["type"][] }[] = [
  { label: "Journal & conference papers", types: ["journal", "conference"] },
  { label: "Book chapters", types: ["book"] },
];

const countOf = (type: Publication["type"], singular: string) => {
  const n = publications.filter((p) => p.type === type).length;
  return `${n} ${singular}${n === 1 ? "" : "s"}`;
};

const summaryMeta = [
  countOf("journal", "journal article"),
  countOf("conference", "conference paper"),
  countOf("book", "book chapter"),
].join(" · ");

export default function Research() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (title: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <section id="research" className="px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <SectionLabel label="Research" meta={summaryMeta} as="h2" index="03" />

        {GROUPS.map((group) => (
          <div key={group.label} className="mt-10">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">{group.label}</p>

            <div className="flex flex-col gap-8">
              {publications
                .filter((pub) => group.types.includes(pub.type))
                .map((pub) => {
                  const isOpen = expanded.has(pub.title);
                  return (
                    <div key={pub.title} className="border-t border-border pt-6">
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

                      {/* Featured publication's summary always shows in full;
                          the compact list's summaries collapse to one line with
                          an explicit expand toggle, per the design brief. */}
                      <p
                        className={`text-sm text-muted leading-relaxed mb-1 max-w-2xl ${
                          !pub.highlighted && !isOpen ? "line-clamp-1" : ""
                        }`}
                      >
                        {pub.description}
                      </p>
                      {!pub.highlighted && (
                        <button
                          type="button"
                          onClick={() => toggle(pub.title)}
                          aria-expanded={isOpen}
                          className="text-xs font-medium text-accent hover:text-foreground transition-colors mb-3"
                        >
                          {isOpen ? "Show less" : "Read more"}
                        </button>
                      )}
                      {pub.highlighted && <div className="mb-3" />}

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
                  );
                })}
            </div>
          </div>
        ))}

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
