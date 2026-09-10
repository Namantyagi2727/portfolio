import { MapPin } from "lucide-react";
import { personalInfo, education, certifications, awayFromKeyboard } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="About" />

        <p className="text-xl sm:text-2xl leading-relaxed text-foreground max-w-2xl mt-10 mb-4">
          {personalInfo.bio}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted mb-12">
          <MapPin size={14} />
          {personalInfo.location}
        </div>

        <div className="border-t border-border pt-8 mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Education</p>
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div key={edu.school} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                  <p className="text-sm text-muted">{edu.school}</p>
                </div>
                <p className="text-xs font-mono text-muted flex-shrink-0">{edu.period}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8 mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Certifications</p>
          <p className="text-sm text-muted leading-relaxed">
            {certifications.map((c) => c.name).join(" · ")}
          </p>
        </div>

        <div className="border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Away from the keyboard</p>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">{awayFromKeyboard}</p>
        </div>
      </div>
    </section>
  );
}
