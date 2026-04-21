"use client";

import { BookOpen, FileText, ExternalLink, Users, Hash, Star } from "lucide-react";
import { publications } from "@/lib/data";

const typeConfig = {
  book:       { icon: BookOpen, label: "Book Chapter",      color: "#a855f7" },
  journal:    { icon: FileText, label: "Journal",           color: "#00d4ff" },
  conference: { icon: FileText, label: "Conference Paper",  color: "#00d4ff" },
};

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">06 / Publications</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Publications</h2>
        </div>

        <div className="flex flex-col gap-6">
          {publications.map((pub, i) => {
            const { icon: Icon, label, color } = typeConfig[pub.type];
            const isBook = pub.type === "book";

            /* ── Featured card (book chapter) ── */
            if (isBook) {
              return (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden transition-all duration-200 group"
                  style={{
                    background: "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(17,17,17,1) 60%)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    boxShadow: "0 0 40px rgba(168,85,247,0.06)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)")}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{ background: "linear-gradient(180deg, #a855f7, #7c3aed)" }}
                  />

                  <div className="p-7 pl-8">
                    {/* Top row: badges + date */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {/* Featured badge */}
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                        style={{ background: "rgba(168,85,247,0.18)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.35)" }}
                      >
                        <Star size={10} fill="#a855f7" />
                        Featured
                      </span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-mono font-medium"
                        style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}
                      >
                        {label}
                      </span>
                      {pub.highlight && (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                          style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}
                        >
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#6b7280] font-mono ml-auto">{pub.date}</span>
                    </div>

                    {/* Publisher */}
                    <p className="text-xs font-mono text-[#a855f7]/70 mb-3 uppercase tracking-widest">
                      {pub.publisher}
                    </p>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#ededed] leading-snug mb-4 group-hover:text-[#c084fc] transition-colors">
                      {pub.title}
                    </h3>

                    {/* Authors */}
                    {pub.authors && (
                      <p className="text-xs text-[#9ca3af] mb-4 flex items-start gap-2">
                        <Users size={12} className="mt-0.5 flex-shrink-0 text-[#a855f7]" />
                        {pub.authors}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs text-[#6b7280] leading-relaxed mb-5">{pub.description}</p>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#a855f7]/10">
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:underline"
                          style={{ color: "#a855f7" }}
                        >
                          <ExternalLink size={12} />
                          View on Cambridge Scholars
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            /* ── Standard card (conference / journal) ── */
            return (
              <div
                key={i}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 group transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}30`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${color}15` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Badges + date */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                      >
                        {label}
                      </span>
                      {pub.highlight && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                          style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}
                        >
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#6b7280] font-mono ml-auto">{pub.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-[#ededed] leading-snug mb-1.5 group-hover:text-[#00d4ff] transition-colors">
                      {pub.title}
                    </h3>

                    {/* Publisher */}
                    <p className="text-xs font-mono text-[#6b7280] mb-3 leading-relaxed">{pub.publisher}</p>

                    {/* Authors */}
                    {pub.authors && (
                      <p className="text-xs text-[#6b7280] mb-3 flex items-start gap-1.5">
                        <Users size={11} className="mt-0.5 flex-shrink-0" style={{ color }} />
                        {pub.authors}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs text-[#6b7280] leading-relaxed mb-4">{pub.description}</p>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-4">
                      {pub.doi && (
                        <p className="text-xs font-mono text-[#6b7280]/70 flex items-center gap-1">
                          <Hash size={10} />
                          DOI: {pub.doi}
                        </p>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline"
                          style={{ color }}
                        >
                          <ExternalLink size={12} />
                          View Publication
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
