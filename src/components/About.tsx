import Image from "next/image";
import { MapPin } from "lucide-react";
import { personalInfo, education, certifications, hero, awayFromKeyboard } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function About() {
  return (
    <section id="about" className="px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <SectionLabel label="About" as="h2" index="04" />

        {personalInfo.photo && (
          <div className="mt-10 mb-6">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={160}
              height={160}
              className="rounded-sm object-cover border border-border"
            />
          </div>
        )}

        <p className="text-xl sm:text-2xl leading-relaxed text-foreground max-w-2xl mb-4">
          {personalInfo.shortBio}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <MapPin size={14} />
          {personalInfo.location}
        </div>

        {/* A small geographic thread, not a claimed itinerary — the same
            three verified locations used in the Footer coordinate line. */}
        <p className="font-mono text-xs text-muted mb-10">
          {hero.globeCities.map((c) => c.label).join(" · ")}
        </p>

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
          {/* Certificate programs and individual courses are listed apart; neither
              is presented as a professional cloud certification. */}
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Certificates &amp; training</p>
          <div className="flex flex-col gap-2 max-w-3xl">
            {[
              { label: "Certificate", kind: "certificate" as const },
              { label: "Courses", kind: "course" as const },
            ].map(({ label, kind }) => {
              const items = certifications.filter((c) => c.kind === kind);
              if (items.length === 0) return null;
              return (
                <p key={kind} className="text-sm text-muted leading-relaxed">
                  <span className="text-foreground">{label}:</span>{" "}
                  {items.map((c) => (c.name.includes(c.issuer) ? c.name : `${c.name} (${c.issuer})`)).join(" · ")}
                </p>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Away from the keyboard</p>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">{awayFromKeyboard}</p>
        </div>
      </div>
    </section>
  );
}
