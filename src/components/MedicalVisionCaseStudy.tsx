"use client";

import { useState } from "react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import Figure from "./Figure";

const medicalCv = caseStudies.find((c) => c.slug === "medical-cv")!;

const VIEWS = ["Raw", "Detection", "Segmentation"] as const;

export default function MedicalVisionCaseStudy() {
  const [active, setActive] = useState<(typeof VIEWS)[number]>("Raw");
  const activeFigure = medicalCv.figures?.[VIEWS.indexOf(active)];

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

      {activeFigure && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4 font-mono text-xs">
            {VIEWS.map((view) => (
              <button
                key={view}
                onClick={() => setActive(view)}
                aria-pressed={active === view}
                className={`px-3 py-1.5 rounded-md border transition-colors ${
                  active === view
                    ? "border-accent text-accent bg-accent/10"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <Figure figure={activeFigure} />
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{medicalCv.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
