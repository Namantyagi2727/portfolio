import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import AirspaceCoverMotif from "./AirspaceCoverMotif";

const airspace = caseStudies.find((c) => c.slug === "airspace")!;

export default function AirspacePreview() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${airspace.caseNumber}`}
        meta={`${airspace.category} · ${airspace.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {airspace.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-8 max-w-2xl">{airspace.problem}</p>

      <div className="mb-8">
        <AirspaceCoverMotif />
        <p className="font-mono text-[11px] text-muted text-center mt-2">
          Illustrative — not a live map or observed flight paths
        </p>
      </div>

      {airspace.metrics && airspace.metrics.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 max-w-md">
          {airspace.metrics.slice(0, 1).map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}

      <a
        href="/work/airspace"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
      >
        Explore case study
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
