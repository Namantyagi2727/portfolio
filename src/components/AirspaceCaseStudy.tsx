import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import AirspaceStreamDiagram from "./AirspaceStreamDiagram";

const airspace = caseStudies.find((c) => c.slug === "airspace")!;
const streamFigure = airspace.figures?.find((f) => f.kind === "diagram");

export default function AirspaceCaseStudy() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${airspace.caseNumber}`}
        meta={`${airspace.category} · ${airspace.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {airspace.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{airspace.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{airspace.description}</p>

      {airspace.metrics && airspace.metrics.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Verified figures</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {airspace.metrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      {streamFigure && (
        <div className="mb-12">
          <Figure figure={streamFigure}>
            <AirspaceStreamDiagram />
          </Figure>
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{airspace.stack.join(" / ")}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        {airspace.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
          >
            {link.label}
            <ArrowUpRight size={14} />
          </a>
        ))}
      </div>
    </article>
  );
}
