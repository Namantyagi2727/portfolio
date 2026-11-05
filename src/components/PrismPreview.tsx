import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import PrismRoutingMotif from "./PrismRoutingMotif";

const prism = caseStudies.find((c) => c.slug === "prism")!;
const overviewFigure = prism.figures?.find((f) => f.id === "FIG. 03");
const githubLink = prism.links.find((l) => l.label === "GitHub");

// Homepage preview shows at most two evidence points, per the brief — the
// full 5-metric benchmark grid stays on the case-study page. These two
// carry the most weight: overall throughput and the outage-resilience
// result, each with its verified test condition intact.
const PREVIEW_METRIC_VALUES = ["245–259 req/s", "0.00%"];
const previewMetrics = PREVIEW_METRIC_VALUES.map(
  (value) => prism.metrics?.find((m) => m.value === value)
).filter((m): m is NonNullable<typeof m> => Boolean(m));

export default function PrismPreview() {
  return (
    <article className="flex flex-col">
      <div
        className="rounded-lg overflow-hidden mb-5"
        style={{ background: COVERS.prism.surface }}
      >
        {overviewFigure?.src && (
          <div className="relative aspect-[21/9]">
            <Image
              src={overviewFigure.src}
              alt="Prism admin dashboard — request volume and cost overview"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-top"
            />
          </div>
        )}
        <div className="p-5">
          <PrismRoutingMotif />
        </div>
      </div>

      <SectionLabel
        label={`Case Study / ${prism.caseNumber}`}
        meta={`${prism.category} · ${prism.year}`}
      />

      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
        {prism.title}
      </h3>

      <p className="text-base text-muted leading-relaxed mb-5 max-w-lg">{prism.problem}</p>

      {previewMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-5 max-w-sm">
          {previewMetrics.map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}

      <p className="font-mono text-xs text-muted leading-relaxed mb-6 max-w-lg">{prism.stack.join(" · ")}</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-auto">
        <a
          href="/work/prism"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
        >
          Explore case study
          <ArrowUpRight size={14} />
        </a>
        {githubLink && (
          <a
            href={githubLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
          >
            GitHub
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
