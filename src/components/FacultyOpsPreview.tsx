import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import FacultyOpsWorkflowIllustration from "./FacultyOpsWorkflowIllustration";

const facultyOps = caseStudies.find((c) => c.slug === "faculty-ops")!;
const previewMetrics = facultyOps.metrics?.filter((m) => m.value === "12" || m.value === "306") ?? [];

export default function FacultyOpsPreview() {
  return (
    <article className="flex flex-col">
      <div
        className="rounded-lg overflow-hidden mb-5 p-6 flex items-center justify-center"
        style={{ background: COVERS.faculty.surface }}
      >
        <div className="max-w-xs">
          <FacultyOpsWorkflowIllustration />
        </div>
      </div>

      <SectionLabel
        label={`Case Study / ${facultyOps.caseNumber}`}
        meta={`${facultyOps.category} · ${facultyOps.year}`}
      />

      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
        {facultyOps.title}
      </h3>

      <p className="text-base text-muted leading-relaxed mb-5 max-w-lg">{facultyOps.problem}</p>

      {previewMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 max-w-sm">
          {previewMetrics.map((m) => (
            <ProjectMetric key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}

      <a
        href="/work/faculty-ops"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors mt-auto"
      >
        Explore case study
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
