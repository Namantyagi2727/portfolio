import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import PrismFlowDiagramCompact from "./PrismFlowDiagramCompact";

const prism = caseStudies.find((c) => c.slug === "prism")!;
const overviewFigure = prism.figures?.find((f) => f.id === "FIG. 03");
const nominalFlowFigure = prism.figures?.find((f) => f.id === "FIG. 01A");

// Preview shows exactly these 3 headline metrics, in this order, with their
// exact verified contexts intact — see the spec's "Preview metrics" section.
// KNOWN CLEANUP ITEM (deferred, not a blocker): matched by exact value text
// rather than a stable id, since Metric has no id field. If a future data.ts
// edit reformats one of these three value strings, its tile silently drops
// from the preview with no build error. Fixing this properly means adding an
// id field to the shared Metric type used by every case study — out of
// scope for this pass; revisit if this array is ever touched again.
const PREVIEW_METRIC_VALUES = ["245–259 req/s", "p50 ~25ms / p95 ~80ms", "0.00%"];
const previewMetrics = PREVIEW_METRIC_VALUES.map(
  (value) => prism.metrics?.find((m) => m.value === value)
).filter((m): m is NonNullable<typeof m> => Boolean(m));

export default function PrismPreview() {
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

      {overviewFigure && (
        <div className="mb-12">
          <Figure figure={overviewFigure} showCaption={false} />
        </div>
      )}

      {previewMetrics.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
            {previewMetrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      {nominalFlowFigure && (
        <div className="mb-12">
          <Figure figure={nominalFlowFigure}>
            <PrismFlowDiagramCompact />
          </Figure>
        </div>
      )}

      <a
        href="/work/prism"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
      >
        Explore case study
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
