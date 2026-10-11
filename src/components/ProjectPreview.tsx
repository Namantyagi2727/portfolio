import { ArrowUpRight } from "lucide-react";
import type { FeaturedProject } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";

// The cover is the project's real pipeline, stage by stage, straight from its
// README — rendered as HTML text rather than an SVG so the labels stay crisp
// and readable at phone widths instead of scaling down with a viewBox.
function PipelineCover({ project }: { project: FeaturedProject }) {
  const { on, onMuted, accent } = COVERS[project.slug];
  const last = project.pipeline.length - 1;

  return (
    <ol aria-label={`${project.title} pipeline`} className="w-full max-w-xs mx-auto flex flex-col items-stretch">
      {project.pipeline.map((stage, i) => {
        const isLast = i === last;
        return (
          <li key={stage} className="flex flex-col items-center">
            <span
              className="w-full rounded-md border px-3 py-1.5 text-center font-mono text-xs"
              style={{
                color: isLast ? accent : on,
                borderColor: isLast ? accent : `${onMuted}66`,
                background: isLast ? `${accent}1F` : "transparent",
              }}
            >
              {stage}
            </span>
            {!isLast && <span aria-hidden="true" className="block w-px h-3" style={{ background: onMuted }} />}
          </li>
        );
      })}
    </ol>
  );
}

// Same anatomy as PrismPreview (cover, label, title, summary, ≤2 metrics,
// links) for featured projects whose depth lives in their GitHub README
// rather than an on-site case study.
export default function ProjectPreview({ project }: { project: FeaturedProject }) {
  const meta = [project.date, project.context].filter(Boolean).join(" · ");

  return (
    <article className="flex flex-col">
      <div
        className="rounded-lg overflow-hidden mb-5 p-6 sm:p-8 flex items-center"
        style={{ background: COVERS[project.slug].surface }}
      >
        <PipelineCover project={project} />
      </div>

      <SectionLabel label={project.category} meta={meta} />

      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
        {project.title}
      </h3>

      <p className="text-base text-muted leading-relaxed mb-5 max-w-lg">{project.summary}</p>

      {project.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5 max-w-sm">
          {project.metrics.slice(0, 2).map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}

      <p className="font-mono text-xs text-muted leading-relaxed mb-6 max-w-lg">{project.stack.join(" · ")}</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-auto">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
        >
          GitHub
          <ArrowUpRight size={14} />
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
          >
            Live demo
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
