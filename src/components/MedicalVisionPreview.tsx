import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { COVERS } from "@/lib/illustration-tokens";
import SectionLabel from "./SectionLabel";
import MedicalPipelineSchematic from "./MedicalPipelineSchematic";

const medicalCv = caseStudies.find((c) => c.slug === "medical-cv")!;

export default function MedicalVisionPreview() {
  return (
    <article className="flex flex-col">
      <div
        className="rounded-lg overflow-hidden mb-5 p-6 flex items-center"
        style={{ background: COVERS.medical.surface }}
      >
        <MedicalPipelineSchematic />
      </div>

      <SectionLabel
        label={`Case Study / ${medicalCv.caseNumber}`}
        meta={`${medicalCv.category} · ${medicalCv.year}`}
      />

      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
        {medicalCv.title}
      </h3>

      <p className="text-base text-muted leading-relaxed mb-5 max-w-lg">{medicalCv.problem}</p>

      <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-6">
        Ongoing research
      </p>

      <a
        href="/work/medical-cv"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors mt-auto"
      >
        Read more
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
