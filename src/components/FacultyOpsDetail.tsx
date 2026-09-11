import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import FacultyOpsCoverMotif from "./FacultyOpsCoverMotif";
import FacultyOpsModuleMap from "./FacultyOpsModuleMap";

const facultyOps = caseStudies.find((c) => c.slug === "faculty-ops")!;
const moduleMapFigure = facultyOps.figures?.find((f) => f.kind === "diagram");

export default function FacultyOpsDetail() {
  return (
    <article className="py-12">
      <SectionLabel
        label={`Case Study / ${facultyOps.caseNumber}`}
        meta={`${facultyOps.category} · ${facultyOps.year}`}
      />

      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {facultyOps.title}
      </h1>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{facultyOps.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{facultyOps.description}</p>

      <div className="mb-12">
        <FacultyOpsCoverMotif />
      </div>

      {facultyOps.metrics && facultyOps.metrics.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Verified figures</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            {facultyOps.metrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      {moduleMapFigure && (
        <div className="mb-12">
          <Figure figure={moduleMapFigure}>
            <FacultyOpsModuleMap />
          </Figure>
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{facultyOps.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
