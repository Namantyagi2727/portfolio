import { Github } from "lucide-react";
import { projects } from "@/lib/data";

export default function OtherProjects() {
  return (
    <div className="py-12 border-t border-border">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">Other Projects</p>

      <div className="border-t border-border">
        {projects.map((project) => (
          <div
            key={project.title}
            className="py-5 border-b border-border flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-sm font-medium text-foreground">{project.title}</h3>
                {project.highlight && (
                  <span className="text-xs font-mono text-accent-secondary">{project.highlight}</span>
                )}
              </div>
              <p className="text-sm text-muted mt-1 leading-relaxed">{project.description}</p>
              <p className="text-xs font-mono text-muted mt-1.5">{project.tags.join(" / ")}</p>
            </div>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors flex-shrink-0"
              >
                <Github size={14} />
                GitHub ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
