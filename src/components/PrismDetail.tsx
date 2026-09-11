import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import PrismFlowDiagram from "./PrismFlowDiagram";
import PrismInfraDiagram from "./PrismInfraDiagram";

const prism = caseStudies.find((c) => c.slug === "prism")!;
const flowFigure = prism.figures?.find((f) => f.id === "FIG. 01");
const infraFigure = prism.figures?.find((f) => f.id === "FIG. 02");
const screenshotFigures = prism.figures?.filter((f) => f.kind === "screenshot") ?? [];

export default function PrismDetail() {
  return (
    <article className="py-12">
      <SectionLabel
        label={`Case Study / ${prism.caseNumber}`}
        meta={`${prism.category} · ${prism.year}`}
      />

      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {prism.title}
      </h1>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{prism.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-8 max-w-2xl">{prism.description}</p>

      {/* On-page contents — this is the longest case-study page on the site. */}
      <nav aria-label="On this page" className="flex flex-wrap gap-x-5 gap-y-2 mb-12 pb-6 border-b border-border">
        {[
          { href: "#request-flow", label: "Request flow" },
          { href: "#infrastructure", label: "Infrastructure" },
          { href: "#benchmarks", label: "Benchmarks" },
          { href: "#what-broke", label: "What broke" },
          { href: "#screenshots", label: "Screenshots" },
          { href: "#stack", label: "Stack & links" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {flowFigure && (
        <div id="request-flow" className="mb-12 scroll-mt-24">
          <Figure figure={flowFigure}>
            <PrismFlowDiagram />
          </Figure>
        </div>
      )}

      {infraFigure && (
        <div id="infrastructure" className="mb-12 scroll-mt-24">
          <Figure figure={infraFigure}>
            <PrismInfraDiagram />
          </Figure>
        </div>
      )}

      {prism.metrics && prism.metrics.length > 0 && (
        <div id="benchmarks" className="mb-12 scroll-mt-24">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Verified benchmark results
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            {prism.metrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      <div id="what-broke" className="mb-12 max-w-2xl border-l-2 border-accent-secondary pl-5 scroll-mt-24">
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
        <div id="screenshots" className="mb-12 grid sm:grid-cols-2 gap-8 scroll-mt-24">
          {screenshotFigures.map((fig) => (
            <Figure key={fig.id} figure={fig} />
          ))}
        </div>
      )}

      <div id="stack" className="mb-8 scroll-mt-24">
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
