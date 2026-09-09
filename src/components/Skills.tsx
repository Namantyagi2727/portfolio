"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/lib/data";

const ACCENT = "#d97b3f";

export default function Skills() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? skills : skills.filter((g) => g.category === active);

  return (
    <section id="skills" className="py-24 px-6 bg-[#171310]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">02 / Skills</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Technical Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {["All", ...skills.map((g) => g.category)].map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200"
                style={{
                  background: isActive ? `${ACCENT}15` : "transparent",
                  color: isActive ? ACCENT : "#8a8073",
                  border: `1px solid ${isActive ? `${ACCENT}40` : "#2a231c"}`,
                }}
              >
                {cat !== "All" && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                    style={{ background: isActive ? ACCENT : "#8a8073" }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((group) => (
              <div
                key={group.category}
                className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 transition-all duration-200"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}40`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2a231c"; }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACCENT }} />
                  <h3 className="text-sm font-semibold text-[#f5f0e8]">{group.category}</h3>
                  <span className="ml-auto text-xs font-mono text-[#8a8073]">{group.items.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md font-mono transition-all duration-150"
                      style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}25` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
