"use client";

import { Github, Linkedin, Mail, ArrowDown, Download, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import PrismFlowDiagram from "./PrismFlowDiagram";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const diagramVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center px-6 pb-20 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(217,123,63,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217,123,63,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 right-[22%] -translate-y-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(217,123,63,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-0 items-center pt-28 pb-12">
        {/* LEFT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a231c] bg-[#1c1712] text-xs text-[#8a8073] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Available for opportunities · Brooklyn, NY
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif font-medium tracking-tight text-[#f5f0e8] mb-2 leading-[0.88]"
            style={{ fontSize: "clamp(60px, 9.5vw, 112px)" }}
          >
            <span className="block">Naman</span>
            <span className="block" style={{ color: "#c7bcae" }}>Tyagi</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl font-mono text-[#d97b3f] mb-7 mt-4">
            AI/ML Engineer · LLM Infrastructure
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-[#8a8073] text-base sm:text-lg max-w-md mb-10 leading-relaxed"
          >
            MS CS from NYU Tandon · Published Researcher · 6+ Internships.
            <br />
            Building LLM infrastructure and data systems that hold up in production.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#14100d] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "#d97b3f" }}
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-[#2a231c] text-[#f5f0e8] hover:border-[#d97b3f]/50 hover:text-[#d97b3f] transition-all duration-200"
            >
              <Download size={14} />
              Resume
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#8a8073] hover:text-[#f5f0e8] transition-colors duration-200"
            >
              Contact →
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-3">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="GitHub">
              <Github size={19} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="LinkedIn">
              <Linkedin size={19} />
            </a>
            <a href={personalInfo.scholar} target="_blank" rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="Google Scholar">
              <GraduationCap size={19} />
            </a>
            <a href={`mailto:${personalInfo.email}`}
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="Email">
              <Mail size={19} />
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — Prism flow diagram */}
        <motion.div
          variants={diagramVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center"
        >
          <p className="text-xs font-mono text-[#8a8073] uppercase tracking-widest mb-6">
            Prism — LLM gateway request flow
          </p>
          <PrismFlowDiagram />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8a8073]/50">
        <span className="text-[10px] font-mono tracking-widest uppercase">scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
