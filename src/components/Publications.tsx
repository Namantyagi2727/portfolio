"use client";

import { BookOpen, FileText, ExternalLink, Users, Hash, Star } from "lucide-react";
import { publications } from "@/lib/data";

const typeConfig = {
  book: { icon: BookOpen, label: "Book Chapter", color: "#e0b34d" },
  journal: { icon: FileText, label: "Journal", color: "#d97b3f" },
  conference: { icon: FileText, label: "Conference Paper", color: "#d97b3f" },
};

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-6 bg-[#171310]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">06 / Publications</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Publications</h2>
        </div>

        <div className="flex flex-col gap-6">
          {publications.map((pub, i) => {
            const { icon: Icon, label, color } = typeConfig[pub.type];
            const isBook = pub.type === "book";

            if (isBook) {
              return (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden transition-all duration-200 group"
                  style={{
                    background: "linear-gradient(135deg, rgba(224,179,77,0.08) 0%, rgba(28,23,18,1) 60%)",
                    border: "1px solid rgba(224,179,77,0.3)",
                    boxShadow: "0 0 40px rgba(224,179,77,0.06)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(224,179,77,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(224,179,77,0.3)")}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: "linear-gradient(180deg, #e0b34d, #d97b3f)" }} />

                  <div className="p-7 pl-8">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                        style={{ background: "rgba(224,179,77,0.18)", color: "#e0b34d", border: "1px solid rgba(224,179,77,0.35)" }}
                      >
                        <Star size={10} fill="#e0b34d" />
                        Featured
                      </span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-mono font-medium"
                        style={{ background: "rgba(224,179,77,0.1)", color: "#e0b34d", border: "1px solid rgba(224,179,77,0.2)" }}
                      >
                        {label}
                      </span>
                      {pub.highlight && (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                          style={{ background: "rgba(224,179,77,0.12)", color: "#e8c37a", border: "1px solid rgba(224,179,77,0.2)" }}
                        >
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#8a8073] font-mono ml-auto">{pub.date}</span>
                    </div>

                    <p className="text-xs font-mono text-[#e0b34d]/70 mb-3 uppercase tracking-widest">{pub.publisher}</p>
                    <h3 className="text-base font-bold text-[#f5f0e8] leading-snug mb-4 group-hover:text-[#e8c37a] transition-colors">
                      {pub.title}
                    </h3>

                    {pub.authors && (
                      <p className="text-xs text-[#c7bcae] mb-4 flex items-start gap-2">
                        <Users size={12} className="mt-0.5 flex-shrink-0 text-[#e0b34d]" />
                        {pub.authors}
                      </p>
                    )}

                    <p className="text-xs text-[#8a8073] leading-relaxed mb-5">{pub.description}</p>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#e0b34d]/10">
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:underline"
                          style={{ color: "#e0b34d" }}
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

            return (
              <div
                key={i}
                className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 group transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}30`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a231c")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15` }}>
                    <Icon size={18} style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
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
                          style={{ background: "rgba(217,123,63,0.1)", color: "#d97b3f", border: "1px solid rgba(217,123,63,0.2)" }}
                        >
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#8a8073] font-mono ml-auto">{pub.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#f5f0e8] leading-snug mb-1.5 group-hover:text-[#d97b3f] transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-xs font-mono text-[#8a8073] mb-3 leading-relaxed">{pub.publisher}</p>

                    {pub.authors && (
                      <p className="text-xs text-[#8a8073] mb-3 flex items-start gap-1.5">
                        <Users size={11} className="mt-0.5 flex-shrink-0" style={{ color }} />
                        {pub.authors}
                      </p>
                    )}

                    <p className="text-xs text-[#8a8073] leading-relaxed mb-4">{pub.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      {pub.doi && (
                        <p className="text-xs font-mono text-[#8a8073]/70 flex items-center gap-1">
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
