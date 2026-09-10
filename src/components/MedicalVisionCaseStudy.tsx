import { caseStudies } from "@/lib/data";
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

export default function MedicalVisionCaseStudy() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${medicalCv.caseNumber}`}
        meta={`${medicalCv.category} · ${medicalCv.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {medicalCv.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{medicalCv.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{medicalCv.description}</p>

      {schematicFigure && (
        <div className="mb-12">
          <Figure figure={schematicFigure}>
            <MedicalPipelineSchematic />
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

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{medicalCv.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
