import { Github, ExternalLink, Star } from "lucide-react";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">04 / Projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">Featured Projects</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 flex flex-col group hover:border-[#00d4ff]/30 transition-all duration-200 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center text-lg font-bold font-mono text-[#00d4ff]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-[#6b7280] hover:text-[#ededed] transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-[#6b7280] hover:text-[#ededed] transition-colors"
                      aria-label="Live demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Title + highlight */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-[#ededed] group-hover:text-[#00d4ff] transition-colors leading-snug mb-1">
                  {project.title}
                </h3>
                {project.highlight && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
                    <Star size={10} />
                    {project.highlight}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#6b7280] leading-relaxed flex-1 mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded font-mono text-[#6b7280] bg-[#1a1a1a] border border-[#2a2a2a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/Namantyagi2727"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#00d4ff] transition-colors font-medium"
          >
            <Github size={16} />
            See more on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
