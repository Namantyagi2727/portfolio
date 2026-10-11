import { caseStudies } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import FacultyOpsWorkflowIllustration from "./FacultyOpsWorkflowIllustration";
import FacultyOpsModuleMap from "./FacultyOpsModuleMap";

const facultyOps = caseStudies.find((c) => c.slug === "faculty-ops")!;
const workflowFigure = facultyOps.figures?.find((f) => f.id === "FIG. 09A");
const moduleMapFigure = facultyOps.figures?.find((f) => f.id === "FIG. 09B");

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

      {workflowFigure && (
        <div className="mb-12">
          <Figure figure={workflowFigure}>
            <div className="p-6 max-w-md mx-auto" style={{ background: COVERS.faculty.surface }}>
              <FacultyOpsWorkflowIllustration />
            </div>
          </Figure>
        </div>
      )}

      {facultyOps.contributions && facultyOps.contributions.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">My contributions</p>
          <ul className="flex flex-col gap-1.5 max-w-2xl">
            {facultyOps.contributions.map((item) => (
              <li key={item} className="text-sm text-muted flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-border-strong flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {facultyOps.metrics && facultyOps.metrics.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">From my work</p>
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
