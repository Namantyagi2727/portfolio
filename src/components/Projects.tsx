"use client";

import { useState, useEffect } from "react";
import { Github, ExternalLink, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/data";

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <section id="projects" className="py-24 px-6 bg-[#171310]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">04 / Projects</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Featured Projects</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div
                key={project.title}
                onClick={() => setSelected(project)}
                className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 flex flex-col group hover:border-[#d97b3f]/30 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#d97b3f]/10 flex items-center justify-center text-lg font-bold font-mono text-[#d97b3f]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-[#8a8073] hover:text-[#f5f0e8] transition-colors" aria-label="GitHub">
                        <Github size={16} />
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-[#8a8073] hover:text-[#f5f0e8] transition-colors" aria-label="Live demo">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-[#f5f0e8] group-hover:text-[#d97b3f] transition-colors leading-snug mb-1.5">
                    {project.title}
                  </h3>
                  {project.highlight && (
                    <p className="text-xs font-mono font-semibold text-[#d97b3f] tracking-wide">
                      {project.highlight}
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#8a8073] leading-relaxed flex-1 mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded font-mono text-[#8a8073] bg-[#241d16] border border-[#3a3025]">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded font-mono text-[#8a8073]/50 bg-[#241d16] border border-[#3a3025]">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-[#8a8073]/40 group-hover:text-[#d97b3f]/60 transition-colors mt-auto">
                  <ArrowUpRight size={11} />
                  click to expand
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://github.com/Namantyagi2727"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#8a8073] hover:text-[#d97b3f] transition-colors font-medium"
            >
              <Github size={16} />
              See more on GitHub →
            </a>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="relative w-full max-w-xl pointer-events-auto rounded-2xl overflow-hidden"
                style={{
                  background: "#1c1712",
                  border: "1px solid rgba(217,123,63,0.2)",
                  boxShadow: "0 0 60px rgba(217,123,63,0.08), 0 24px 80px rgba(0,0,0,0.6)",
                }}
              >
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d97b3f, transparent)" }} />
                <div className="p-7">
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-5 right-5 p-1.5 rounded-lg text-[#8a8073] hover:text-[#f5f0e8] hover:bg-[#2a231c] transition-all"
                  >
                    <X size={17} />
                  </button>

                  {selected.highlight && (
                    <p className="text-sm font-mono font-semibold text-[#d97b3f] tracking-wide mb-2">
                      {selected.highlight}
                    </p>
                  )}

                  <h2 className="text-xl font-serif font-bold text-[#f5f0e8] leading-snug mb-4 pr-8">{selected.title}</h2>
                  <p className="text-sm text-[#c7bcae] leading-relaxed mb-6">{selected.description}</p>

                  <div className="mb-6">
                    <p className="text-xs font-mono text-[#8a8073]/60 uppercase tracking-widest mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-md font-mono"
                          style={{ background: "rgba(217,123,63,0.08)", color: "#d97b3f", border: "1px solid rgba(217,123,63,0.2)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#2a231c]">
                    {selected.github ? (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                        style={{ background: "#d97b3f", color: "#14100d" }}
                      >
                        <Github size={15} />
                        View on GitHub
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#8a8073] border border-[#3a3025] cursor-not-allowed">
                        <Github size={15} />
                        Private Repo
                      </span>
                    )}
                    {selected.demo && (
                      <a
                        href={selected.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#3a3025] text-[#f5f0e8] hover:border-[#d97b3f]/40 transition-all"
                      >
                        <ExternalLink size={15} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
