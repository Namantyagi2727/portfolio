import { BookOpen, FileText, ExternalLink } from "lucide-react";
import { publications } from "@/lib/data";

const typeConfig = {
  book: { icon: BookOpen, label: "Book", color: "#a855f7" },
  journal: { icon: FileText, label: "Journal", color: "#00d4ff" },
  conference: { icon: FileText, label: "Conference", color: "#00d4ff" },
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
            return (
              <div
                key={i}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 hover:border-[#a855f7]/30 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${color}15` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>

                  <div className="flex-1">
                    {/* Type badge + date */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                      >
                        {label}
                      </span>
                      {pub.highlight && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                          style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.25)" }}>
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#6b7280] ml-auto">{pub.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-[#ededed] group-hover:text-[#a855f7] transition-colors leading-snug mb-1">
                      {pub.title}
                    </h3>

                    {/* Publisher */}
                    <p className="text-xs font-mono text-[#6b7280] mb-3">{pub.publisher}</p>

                    {/* Description */}
                    <p className="text-xs text-[#6b7280] leading-relaxed mb-4">{pub.description}</p>

                    {/* Link */}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                        style={{ color: "#a855f7" }}
                      >
                        <ExternalLink size={12} />
                        View Publication
                      </a>
                    )}
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
