"use client";

import { motion } from "framer-motion";
import { MapPin, BookOpen } from "lucide-react";
import { personalInfo, education, certifications, publications, projects, type Certification } from "@/lib/data";
import dynamic from "next/dynamic";

const JourneyMap = dynamic(() => import("./JourneyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-2xl border border-[#2a231c] bg-[#14100d] flex items-center justify-center">
      <p className="text-xs font-mono text-[#8a8073] uppercase tracking-widest animate-pulse">Loading flight log…</p>
    </div>
  ),
});

const stats = [
  { label: "Projects Built", value: `${projects.length}+` },
  { label: "Internships", value: "6+" },
  { label: "Publications", value: String(publications.length) },
  { label: "Certifications", value: "6+" },
];

const ACCENT = "#d97b3f";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function About() {
  const groupedCerts = certifications.reduce<
    Array<{ category: string; items: Certification[] }>
  >((acc, cert) => {
    const existing = acc.find((g) => g.category === cert.category);
    if (existing) {
      existing.items.push(cert);
    } else {
      acc.push({ category: cert.category, items: [cert] });
    }
    return acc;
  }, []);

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-16" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">01 / About</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">About Me</h2>
        </motion.div>

        <motion.div className="relative mb-20" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <span
            className="absolute -top-8 -left-4 text-8xl font-serif leading-none select-none pointer-events-none"
            style={{ color: "#d97b3f", opacity: 0.15 }}
          >
            &ldquo;
          </span>
          <p className="text-2xl sm:text-3xl leading-relaxed text-[#c7bcae] font-light max-w-4xl">
            {"I’m an "}
            <span className="text-[#f5f0e8] font-semibold">AI/ML engineer</span>
            {" with an MS in Computer Science from "}
            <span style={{ color: "#d97b3f" }}>NYU Tandon</span>
            {", passionate about building intelligent systems that solve real-world problems. With hands-on experience across "}
            <span className="text-[#f5f0e8] font-semibold">LLMs, cloud infrastructure, big data pipelines</span>
            {", and full-stack development, I bring ideas from research to production. "}
            <span className="text-[#f5f0e8] font-semibold">Published author</span>
            {" with "}
            <span style={{ color: "#d97b3f" }}>Cambridge Scholars Publishing</span>
            {", "}
            <span style={{ color: "#d97b3f" }}>IEEE</span>
            {", and "}
            <span style={{ color: "#d97b3f" }}>Human Behavior and Emerging Technologies</span>
            {", with "}
            <span className="text-[#f5f0e8] font-semibold">6+ internships</span>
            {" spanning AI, cloud, and enterprise software."}
          </p>
          <div className="flex items-center gap-2 text-sm text-[#8a8073] mt-6">
            <MapPin size={14} className="text-[#d97b3f]" />
            {personalInfo.location}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap sm:flex-nowrap gap-px border border-[#2a231c] rounded-2xl overflow-hidden mb-20"
          variants={containerVariants}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="flex-1 min-w-[140px] flex flex-col items-center justify-center py-8 px-4
                         bg-[#1c1712] hover:bg-[#221b14] transition-colors
                         border-r border-[#2a231c] last:border-r-0"
            >
              <p className="text-6xl sm:text-7xl font-bold font-mono leading-none" style={{ color: "#d97b3f" }}>
                {stat.value}
              </p>
              <p className="text-xs font-mono text-[#8a8073] uppercase tracking-widest mt-3 text-center">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mb-20" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <h3 className="text-sm font-mono text-[#d97b3f] uppercase tracking-widest mb-6">Academic Journey</h3>
          <JourneyMap />
        </motion.div>

        <div className="mb-20">
          <motion.h3
            className="text-sm font-mono text-[#d97b3f] uppercase tracking-widest mb-10"
            variants={itemVariants}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true }}
          >
            Education
          </motion.h3>

          <div className="relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 rounded-full" style={{ background: "linear-gradient(180deg, #d97b3f 0%, #8a8073 100%)" }} />

            <motion.div className="flex flex-col gap-12" variants={containerVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
              {education.map((edu, i) => {
                const isCurrent = i === 0;
                const nodeColor = isCurrent ? "#d97b3f" : "#8a8073";
                const pulseColor = isCurrent ? "rgba(217,123,63,0.2)" : "rgba(138,128,115,0.2)";
                const nodeGlow = isCurrent ? "0 0 12px rgba(217,123,63,0.7)" : "none";
                const hoverBorder = isCurrent ? "#d97b3f" : "#8a8073";

                return (
                  <motion.div key={edu.school} variants={itemVariants} className="relative pl-10">
                    <div className="absolute left-0 top-1.5">
                      <motion.div
                        className="absolute inset-0 w-5 h-5 rounded-full"
                        style={{ background: pulseColor }}
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      />
                      <div className="relative w-5 h-5 rounded-full border-2 border-[#14100d]" style={{ background: nodeColor, boxShadow: nodeGlow }} />
                    </div>

                    <div
                      className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 hover:border-opacity-30 transition-all duration-200 group"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${hoverBorder}30`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2a231c"; }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <p className="text-base font-semibold text-[#f5f0e8]">{edu.degree}</p>
                          <p className="text-sm text-[#8a8073] mt-0.5">{edu.school}</p>
                          {edu.details && <p className="text-xs text-[#8a8073]/70 mt-1 italic">{edu.details}</p>}
                          {edu.gpa && <p className="text-xs font-mono mt-1" style={{ color: "#d97b3f" }}>GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-mono" style={{ color: nodeColor }}>{edu.period}</p>
                          <p className="text-xs text-[#8a8073] mt-1">{edu.location}</p>
                        </div>
                      </div>

                      {edu.courses && (
                        <div>
                          <p className="text-xs text-[#8a8073] mb-2 flex items-center gap-1.5">
                            <BookOpen size={11} />
                            Relevant Coursework
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.courses.map((course) => (
                              <span
                                key={course}
                                className="text-xs px-2 py-0.5 rounded font-mono text-[#8a8073]
                                           bg-[#241d16] border border-[#3a3025]
                                           hover:text-[#d97b3f] hover:border-[#d97b3f]/30 transition-colors"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <motion.div className="mt-8 ml-10" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true, margin: "-50px" }}>
            <div className="bg-[#1c1712] border border-[#e0b34d]/20 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs font-mono text-[#e0b34d] mb-1">Vertically Integrated Project · NYU FAMS Lab</p>
                  <p className="text-sm font-semibold text-[#f5f0e8]">TAJ Dataset — Endoscopic Laser Ablation Analysis</p>
                </div>
                <p className="text-xs font-mono text-[#d97b3f] flex-shrink-0">Fall 2025 – Present</p>
              </div>
              <p className="text-xs text-[#8a8073] leading-relaxed mb-3">
                Built a computer vision pipeline using YOLOv5 and U-Net to detect surgical regions and segment laser-affected tissue in endoscopic imagery. Generated tissue damage heatmaps to visualize ablation intensity and spatial spread, integrated with 3D Slicer for surgical decision support.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["YOLOv5", "U-Net", "PyTorch", "Computer Vision", "OpenCV", "3D Slicer", "Medical Imaging"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(224,179,77,0.1)", color: "#e0b34d", border: "1px solid rgba(224,179,77,0.2)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <motion.h3 className="text-sm font-mono text-[#d97b3f] uppercase tracking-widest mb-8" variants={itemVariants}>
            Certifications
          </motion.h3>

          <div className="flex flex-col gap-8">
            {groupedCerts.map(({ category, items }) => (
              <motion.div key={category} variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                  <p className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: ACCENT }}>{category}</p>
                  <div className="flex-1 h-px" style={{ background: `${ACCENT}20` }} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map((cert) => (
                    <div
                      key={cert.name}
                      className="px-3 py-2 rounded-lg border transition-all duration-200 cursor-default"
                      style={{ background: `${ACCENT}08`, borderColor: `${ACCENT}20` }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = `${ACCENT}18`;
                        el.style.borderColor = `${ACCENT}50`;
                        el.style.boxShadow = `0 0 12px ${ACCENT}25`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = `${ACCENT}08`;
                        el.style.borderColor = `${ACCENT}20`;
                        el.style.boxShadow = "none";
                      }}
                    >
                      <p className="text-xs font-semibold text-[#f5f0e8]">{cert.name}</p>
                      <p className="text-xs font-mono text-[#8a8073] mt-0.5">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
