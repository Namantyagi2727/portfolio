import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import PrismFlowDiagram from "./PrismFlowDiagram";
import PrismInfraDiagram from "./PrismInfraDiagram";

const prism = caseStudies.find((c) => c.slug === "prism")!;
const [flowFigure, infraFigure, ...screenshotFigures] = prism.figures ?? [];

export default function PrismCaseStudy() {
  return (
    <article className="py-12">
      <SectionLabel
        label={`Case Study / ${prism.caseNumber}`}
        meta={`${prism.category} · ${prism.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {prism.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{prism.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{prism.description}</p>

      {flowFigure && (
        <div className="mb-12">
          <Figure figure={flowFigure}>
            <PrismFlowDiagram />
          </Figure>
        </div>
      )}

      {infraFigure && (
        <div className="mb-12">
          <Figure figure={infraFigure}>
            <PrismInfraDiagram />
          </Figure>
        </div>
      )}

      <div className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
          Verified benchmark results
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
          {prism.metrics.map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      </div>

      <div className="mb-12 max-w-2xl border-l-2 border-accent-secondary pl-5">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-2">
          What broke
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Load testing found a real bug: the rate limiter and exact cache each opened a new Redis
          connection per request instead of reusing a pool. At roughly 300 req/s that meant
          hundreds of new connections a second — Redis started closing them under the churn, and
          the error rate hit 77%. Fixed with one shared module-level Redis client; the failure
          rate dropped to 0% in the same test afterward.
        </p>
      </div>

      {screenshotFigures.length > 0 && (
        <div className="mb-12 grid sm:grid-cols-2 gap-8">
          {screenshotFigures.map((fig) => (
            <Figure key={fig.id} figure={fig} />
          ))}
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{prism.stack.join(" / ")}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        {prism.links.map((link) => (
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
