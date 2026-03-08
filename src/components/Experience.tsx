import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">03 / Experience</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Work Experience</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#1e1e1e]" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-16 group">
                {/* Timeline dot */}
                <div
                  className="absolute left-[18px] top-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: i === 0 ? "#00d4ff" : "#1e1e1e",
                    borderColor: i === 0 ? "#00d4ff" : "#1e1e1e",
                    boxShadow: i === 0 ? "0 0 12px rgba(0,212,255,0.6)" : "none",
                    outline: i !== 0 ? "2px solid #1e1e1e" : "none",
                  }}
                />

                {/* Card */}
                <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 hover:border-[#00d4ff]/30 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#ededed] group-hover:text-[#00d4ff] transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-[#6b7280] mt-0.5 flex items-center gap-1.5">
                        <Briefcase size={12} />
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-mono text-[#00d4ff]">{exp.period}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">{exp.location}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {exp.description.map((point, j) => (
                      <li key={j} className="text-sm text-[#6b7280] flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#00d4ff]/50 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full font-mono text-[#6b7280] bg-[#1a1a1a] border border-[#2a2a2a]"
                      >
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
