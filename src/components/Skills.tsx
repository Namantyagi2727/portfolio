"use client";

import { skills } from "@/lib/data";

const categoryColors: Record<string, string> = {
  "AI / ML": "#00d4ff",
  "Cloud": "#a855f7",
  "Big Data": "#f59e0b",
  "Languages": "#10b981",
  "Tools & Platforms": "#6b7280",
  "Blockchain": "#f97316",
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">02 / Skills</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Technical Skills</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((group) => {
            const color = categoryColors[group.category] ?? "#00d4ff";
            return (
              <div
                key={group.category}
                className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 hover:border-opacity-50 transition-all duration-200 group"
                style={{ "--hover-color": color } as React.CSSProperties}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e1e";
                }}
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <h3 className="text-sm font-semibold text-[#ededed]">{group.category}</h3>
                </div>

                {/* Skills chips */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md font-mono transition-all duration-150"
                      style={{
                        background: `${color}12`,
                        color: color,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
