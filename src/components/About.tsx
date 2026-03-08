import { GraduationCap, MapPin, Award, BookOpen } from "lucide-react";
import { personalInfo, education, certifications } from "@/lib/data";

const stats = [
  { label: "Projects Built", value: "10+" },
  { label: "Internships", value: "6+" },
  { label: "Publications", value: "2" },
  { label: "Certifications", value: "6+" },
];

const certCategoryColors: Record<string, string> = {
  Security: "#00d4ff",
  Cloud: "#a855f7",
  Platform: "#f59e0b",
};

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
          {/* Left: Bio + stats + certifications */}
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
            <div className="flex items-center gap-2 text-sm text-[#6b7280] mb-8">
              <MapPin size={14} className="text-[#00d4ff]" />
              {personalInfo.location}
            </div>

            {/* Certifications */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h4 className="text-sm font-semibold text-[#ededed] mb-4 flex items-center gap-2">
                <Award size={15} className="text-[#a855f7]" />
                Certifications
              </h4>
              <ul className="flex flex-col gap-2">
                {certifications.map((cert) => {
                  const color = certCategoryColors[cert.category] ?? "#6b7280";
                  return (
                    <li key={cert.name} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <div>
                        <p className="text-xs text-[#ededed]">{cert.name}</p>
                        <p className="text-xs text-[#6b7280]">{cert.issuer}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right: Education */}
          <div>
            <h3 className="text-lg font-semibold text-[#ededed] mb-6 flex items-center gap-2">
              <GraduationCap size={20} className="text-[#00d4ff]" />
              Education
            </h3>

            <div className="flex flex-col gap-5">
              {education.map((edu) => (
                <div
                  key={edu.school}
                  className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#00d4ff]/30 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#ededed] group-hover:text-[#00d4ff] transition-colors">
                        {edu.degree}
                      </p>
                      <p className="text-sm text-[#6b7280] mt-0.5">{edu.school}</p>
                      {edu.details && (
                        <p className="text-xs text-[#6b7280]/70 mt-1 italic">{edu.details}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-mono text-[#00d4ff]">{edu.period}</p>
                      <p className="text-xs text-[#6b7280] mt-1">{edu.location}</p>
                    </div>
                  </div>

                  {/* Courses */}
                  {edu.courses && (
                    <div>
                      <p className="text-xs text-[#6b7280] mb-2 flex items-center gap-1.5">
                        <BookOpen size={11} />
                        Relevant Coursework
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.courses.map((course) => (
                          <span
                            key={course}
                            className="text-xs px-2 py-0.5 rounded font-mono text-[#6b7280] bg-[#1a1a1a] border border-[#2a2a2a]"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* VIP Project callout */}
              <div className="bg-[#111111] border border-[#a855f7]/20 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs font-mono text-[#a855f7] mb-1">Vertically Integrated Project · NYU FAMS Lab</p>
                    <p className="text-sm font-semibold text-[#ededed]">TAJ Dataset — Endoscopic Laser Ablation Analysis</p>
                  </div>
                  <p className="text-xs font-mono text-[#00d4ff] flex-shrink-0">Fall 2025 – Present</p>
                </div>
                <p className="text-xs text-[#6b7280] leading-relaxed mb-3">
                  Built a computer vision pipeline using YOLOv5 and U-Net to detect surgical regions and segment laser-affected tissue in endoscopic imagery. Generated tissue damage heatmaps to visualize ablation intensity and spatial spread, integrated with 3D Slicer for surgical decision support.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["YOLOv5", "U-Net", "PyTorch", "Computer Vision", "OpenCV", "3D Slicer", "Medical Imaging"].map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
