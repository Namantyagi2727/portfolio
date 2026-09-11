import { caseStudies } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import Figure from "./Figure";
import MedicalPipelineSchematic from "./MedicalPipelineSchematic";

const medicalCv = caseStudies.find((c) => c.slug === "medical-cv")!;
const schematicFigure = medicalCv.figures?.find((f) => f.id === "FIG. 08");

const CURRENT_FOCUS = [
  "Continuous video ingestion",
  "Real-time stone identification",
  "CV pipeline development",
];

// Short by design, not by omission: this is ongoing research with limited
// verified material. Constraints/Decisions/Evidence/What-broke sections are
// left out entirely rather than filled with invented content — see the
// design spec's case-study depth rules.
export default function MedicalVisionDetail() {
  return (
    <article className="py-12">
      <SectionLabel
        label={`Case Study / ${medicalCv.caseNumber}`}
        meta={`${medicalCv.category} · ${medicalCv.year}`}
      />

      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {medicalCv.title}
      </h1>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{medicalCv.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{medicalCv.description}</p>

      {schematicFigure && (
        <div className="mb-12">
          <Figure figure={schematicFigure}>
            <div className="p-6" style={{ background: COVERS.medical.surface }}>
              <MedicalPipelineSchematic />
            </div>
          </Figure>
        </div>
      )}

      <div className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Current focus</p>
        <ul className="flex flex-col gap-1.5 max-w-2xl">
          {CURRENT_FOCUS.map((item) => (
            <li key={item} className="text-sm text-muted flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-border-strong flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-12 max-w-2xl border-l-2 border-accent-secondary pl-5">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-2">
          Current status
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Ongoing research at NYU&apos;s FAMS Lab. No accuracy, FPS, latency, dataset-size, or model
          benchmarks exist yet — none are claimed here. This page will grow as real results become
          available; until then, it documents the verified experimental setup and current focus, not
          a finished capability.
        </p>
      </div>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{medicalCv.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
