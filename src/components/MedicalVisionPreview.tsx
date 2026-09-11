import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import MedicalPipelineSchematic from "./MedicalPipelineSchematic";

const medicalCv = caseStudies.find((c) => c.slug === "medical-cv")!;

export default function MedicalVisionPreview() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${medicalCv.caseNumber}`}
        meta={`${medicalCv.category} · ${medicalCv.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {medicalCv.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-8 max-w-2xl">{medicalCv.problem}</p>

      <div className="mb-8">
        <MedicalPipelineSchematic />
      </div>

      <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-6">
        Ongoing research
      </p>

      <a
        href="/work/medical-cv"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
      >
        Read more
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
