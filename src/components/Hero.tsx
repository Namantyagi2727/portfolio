"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { personalInfo } from "@/lib/data";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border border-[#00d4ff]/20 animate-pulse" />
    </div>
  ),
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const globeVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const particles = [
  { top: "15%", left: "8%",  size: 3, color: "#00d4ff", delay: 0 },
  { top: "72%", left: "12%", size: 2, color: "#a855f7", delay: 0.5 },
  { top: "30%", left: "85%", size: 2, color: "#00d4ff", delay: 1.0 },
  { top: "80%", left: "78%", size: 3, color: "#a855f7", delay: 1.5 },
  { top: "55%", left: "45%", size: 2, color: "#00d4ff", delay: 2.0 },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = personalInfo.roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % personalInfo.roles.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 pb-24 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 15 : -15, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-0 items-center py-24">

        {/* LEFT: text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1e1e1e] bg-[#111111] text-xs text-[#6b7280] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
              Available for opportunities · Brooklyn, NY
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-[#ededed] mb-4"
          >
            {personalInfo.name}
          </motion.h1>

          {/* Typewriter role */}
          <motion.div variants={itemVariants} className="h-12 flex items-center justify-center lg:justify-start mb-6">
            <p
              className="text-xl sm:text-2xl font-mono font-medium"
              style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.5)" }}
            >
              {displayed}
              <span className="animate-pulse">|</span>
            </p>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="text-[#6b7280] text-base sm:text-lg max-w-xl mb-10 leading-relaxed"
          >
            MS CS @ NYU Tandon · IEEE Published Researcher · 5+ Internships<br />
            Building intelligent systems at the intersection of AI, cloud, and full-stack.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#0a0a0a] transition-all duration-200 hover:scale-105"
              style={{ background: "#00d4ff", boxShadow: "0 0 20px rgba(0,212,255,0.4)" }}
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-[#1e1e1e] text-[#ededed] hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all duration-200"
            >
              <Download size={15} />
              Resume
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#6b7280] hover:text-[#ededed] transition-colors duration-200"
            >
              Contact Me →
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-5">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-3 rounded-lg border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT: globe */}
        <motion.div
          variants={globeVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center lg:justify-end"
        >
          <div
            className="relative"
            style={{ width: "min(480px, 90vw)", height: "min(480px, 90vw)" }}
          >
            {/* Dashed orbit ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: "-16px",
                border: "1px dashed rgba(0,212,255,0.12)",
              }}
            />
            {/* Radial glow ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0,212,255,0.04) 60%, transparent 75%)",
                boxShadow: "0 0 60px rgba(0,212,255,0.08), inset 0 0 60px rgba(168,85,247,0.04)",
              }}
            />
            <GlobeCanvas />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280]">
        <span className="text-xs font-mono">scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
