import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">03 / Experience</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Work Experience</h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#2a231c]" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-16 group">
                <div
                  className="absolute left-[18px] top-1 w-4 h-4 rounded-full border-2 border-[#14100d] transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: i === 0 ? "#d97b3f" : "#2a231c",
                    borderColor: i === 0 ? "#d97b3f" : "#2a231c",
                    boxShadow: i === 0 ? "0 0 12px rgba(217,123,63,0.6)" : "none",
                    outline: i !== 0 ? "2px solid #2a231c" : "none",
                  }}
                />

                <div className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 hover:border-[#d97b3f]/30 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#f5f0e8] group-hover:text-[#d97b3f] transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-[#8a8073] mt-0.5 flex items-center gap-1.5">
                        <Briefcase size={12} />
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-mono text-[#d97b3f]">{exp.period}</p>
                      <p className="text-xs text-[#8a8073] mt-0.5">{exp.location}</p>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-1.5 mb-4">
                    {exp.description.map((point, j) => (
                      <li key={j} className="text-sm text-[#8a8073] flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#d97b3f]/50 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-mono text-[#8a8073] bg-[#241d16] border border-[#3a3025]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
