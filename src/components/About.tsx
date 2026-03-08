import { GraduationCap, MapPin, BookOpen, Award } from "lucide-react";
import { personalInfo, education } from "@/lib/data";

const stats = [
  { label: "Years Experience", value: "3+" },
  { label: "Projects Built", value: "10+" },
  { label: "Internships", value: "5+" },
  { label: "IEEE Published", value: "1" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest mb-2">01 / About</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#ededed]">About Me</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Bio + stats */}
          <div>
            <p className="text-[#6b7280] leading-relaxed text-base mb-8">
              {personalInfo.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-4 text-center hover:border-[#00d4ff]/30 transition-colors"
                >
                  <p className="text-2xl font-bold" style={{ color: "#00d4ff" }}>{stat.value}</p>
                  <p className="text-xs text-[#6b7280] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <MapPin size={14} className="text-[#00d4ff]" />
              {personalInfo.location}
            </div>
          </div>

          {/* Right: Education */}
          <div>
            <h3 className="text-lg font-semibold text-[#ededed] mb-6 flex items-center gap-2">
              <GraduationCap size={20} className="text-[#00d4ff]" />
              Education
            </h3>

            <div className="flex flex-col gap-4">
              {education.map((edu) => (
                <div
                  key={edu.school}
                  className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#00d4ff]/30 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#ededed] group-hover:text-[#00d4ff] transition-colors">
                        {edu.degree}
                      </p>
                      <p className="text-sm text-[#6b7280] mt-1">{edu.school}</p>
                      {edu.details && (
                        <p className="text-xs text-[#6b7280]/70 mt-1 italic">{edu.details}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-mono text-[#00d4ff]">{edu.period}</p>
                      <p className="text-xs text-[#6b7280] mt-1">{edu.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications blurb */}
            <div className="mt-6 bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h4 className="text-sm font-semibold text-[#ededed] mb-3 flex items-center gap-2">
                <Award size={15} className="text-[#a855f7]" />
                Certifications
              </h4>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Google Cybersecurity Certificate",
                  "Google Cloud: Big Data & Machine Learning",
                  "AWS, GCP & Azure Cloud Credentials",
                  "Salesforce Administrator & Developer",
                ].map((cert) => (
                  <li key={cert} className="text-xs text-[#6b7280] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#a855f7] flex-shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
