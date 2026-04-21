"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/lib/data";

const categoryColors: Record<string, string> = {
  "AI / ML":           "#00d4ff",
  "Cloud":             "#a855f7",
  "Big Data":          "#f59e0b",
  "Languages":         "#10b981",
  "Tools & Platforms": "#6b7280",
  "Blockchain":        "#f97316",
  "AI Governance":     "#06b6d4",
};

export default function Skills() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? skills : skills.filter((g) => g.category === active);

  return (
    <section id="skills" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">02 / Skills</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Technical Skills</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", ...skills.map((g) => g.category)].map((cat) => {
            const isActive = active === cat;
            const color = cat === "All" ? "#00d4ff" : (categoryColors[cat] ?? "#00d4ff");
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200"
                style={{
                  background: isActive ? `${color}15` : "transparent",
                  color:      isActive ? color : "#6b7280",
                  border:     `1px solid ${isActive ? `${color}40` : "#1e1e1e"}`,
                  boxShadow:  isActive ? `0 0 12px ${color}20` : "none",
                }}
              >
                {cat !== "All" && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                    style={{ background: isActive ? color : "#6b7280" }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((group) => {
              const color = categoryColors[group.category] ?? "#00d4ff";
              return (
                <div
                  key={group.category}
                  className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 transition-all duration-200"
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
                    <span className="ml-auto text-xs font-mono text-[#6b7280]">{group.items.length}</span>
                  </div>

                  {/* Skills chips */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-md font-mono transition-all duration-150"
                        style={{
                          background: `${color}12`,
                          color,
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
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
