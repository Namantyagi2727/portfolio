import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import FacultyOpsCoverMotif from "./FacultyOpsCoverMotif";

const facultyOps = caseStudies.find((c) => c.slug === "faculty-ops")!;
const previewMetrics = facultyOps.metrics?.filter((m) => m.value === "12" || m.value === "306") ?? [];

export default function FacultyOpsPreview() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${facultyOps.caseNumber}`}
        meta={`${facultyOps.category} · ${facultyOps.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {facultyOps.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-8 max-w-2xl">{facultyOps.problem}</p>

      <div className="mb-8">
        <FacultyOpsCoverMotif />
      </div>

      {previewMetrics.length > 0 && (
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6 max-w-md">
          {previewMetrics.map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}

      <a
        href="/work/faculty-ops"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
      >
        Explore case study
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
