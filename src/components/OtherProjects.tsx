"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";

// Projects with something public to open (repo, demo, or case study) are
// always shown; older ones without any public link stay collapsed.
const linked = projects.filter((p) => p.github || p.demo || p.caseStudy);
const unlinked = projects.filter((p) => !(p.github || p.demo || p.caseStudy));

export default function OtherProjects() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? [...linked, ...unlinked] : linked;
  const remaining = unlinked.length;

  return (
    <div className="mt-12 py-12 border-t border-border">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">Other Projects</p>

      <div className="border-t border-border">
        {visible.map((project) => (
          <div
            key={project.title}
            className="py-4 border-b border-border flex items-baseline justify-between gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-sm font-medium text-foreground">
                  {project.caseStudy ? (
                    <Link href={project.caseStudy} className="hover:text-accent transition-colors">
                      {project.title}
                    </Link>
                  ) : (
                    project.title
                  )}
                </h3>
                {project.highlight && (
                  <span className="text-xs font-mono text-accent-secondary flex-shrink-0">
                    {project.highlight}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted mt-0.5 line-clamp-1">{project.description}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {project.caseStudy && (
                <Link
                  href={project.caseStudy}
                  aria-label={`${project.title} case study`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors"
                >
                  <ArrowUpRight size={14} />
                  <span className="hidden sm:inline">Case study</span>
                </Link>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} demo`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Demo</span>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors"
                >
                  <Github size={14} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-6 text-sm font-medium text-accent hover:text-foreground transition-colors"
        >
          {expanded ? "Show fewer" : `Show ${remaining} more`}
        </button>
      )}
    </div>
  );
}
