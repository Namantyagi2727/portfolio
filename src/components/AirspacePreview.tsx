import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import AirspaceCoverMotif from "./AirspaceCoverMotif";

const airspace = caseStudies.find((c) => c.slug === "airspace")!;

export default function AirspacePreview() {
  return (
    <article className="flex flex-col">
      <div
        className="rounded-lg overflow-hidden mb-5 p-6 flex items-center"
        style={{ background: COVERS.airspace.surface }}
      >
        <AirspaceCoverMotif />
      </div>

      <SectionLabel
        label={`Case Study / ${airspace.caseNumber}`}
        meta={`${airspace.category} · ${airspace.year}`}
      />

      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
        {airspace.title}
      </h3>

      <p className="text-base text-muted leading-relaxed mb-5 max-w-lg">{airspace.problem}</p>

      {airspace.metrics && airspace.metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 max-w-sm">
          {airspace.metrics.slice(0, 2).map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}

      <a
        href="/work/airspace"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors mt-auto"
      >
        Explore case study
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
