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

const globeVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const particles = [
  { top: "18%", left: "6%",  size: 2, color: "#00d4ff", delay: 0 },
  { top: "72%", left: "9%",  size: 2, color: "#a855f7", delay: 0.8 },
  { top: "28%", left: "86%", size: 2, color: "#00d4ff", delay: 1.4 },
  { top: "78%", left: "80%", size: 2, color: "#a855f7", delay: 2.0 },
  { top: "52%", left: "48%", size: 1, color: "#00d4ff", delay: 2.6 },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = personalInfo.roles[roleIndex];
    let timeout: NodeJS.Timeout;
    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 38);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % personalInfo.roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 pb-20 overflow-hidden"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow — centred right where globe sits */}
      <div
        className="absolute top-1/2 right-[22%] -translate-y-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.055) 0%, rgba(168,85,247,0.03) 45%, transparent 70%)",
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
            y: [0, -28, 0],
            x: [0, i % 2 === 0 ? 12 : -12, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: 4.5 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-0 items-center pt-28 pb-12">

        {/* LEFT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Status */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e1e1e] bg-[#111111] text-xs text-[#6b7280] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Available for opportunities · Brooklyn, NY
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="font-black tracking-tight text-[#ededed] mb-2 leading-[0.88]"
            style={{ fontSize: "clamp(60px, 9.5vw, 112px)" }}
          >
            <span className="block">Naman</span>
            <span className="block" style={{ color: "#c8c8c8" }}>Tyagi</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            variants={itemVariants}
            className="h-10 flex items-center justify-center lg:justify-start mb-7 mt-4"
          >
            <span
              className="text-lg sm:text-xl font-mono"
              style={{ color: "#00d4ff", textShadow: "0 0 18px rgba(0,212,255,0.45)" }}
            >
              {displayed}
              <span className="animate-pulse ml-0.5">|</span>
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="text-[#6b7280] text-base sm:text-lg max-w-md mb-10 leading-relaxed"
          >
            MS CS at NYU Tandon · IEEE Published · 6+ Internships.
            <br />
            Building at the intersection of AI, cloud, and full-stack.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#0a0a0a] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "#00d4ff", boxShadow: "0 0 24px rgba(0,212,255,0.35)" }}
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-[#1e1e1e] text-[#ededed] hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-all duration-200"
            >
              <Download size={14} />
              Resume
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#6b7280] hover:text-[#ededed] transition-colors duration-200"
            >
              Contact →
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start gap-3"
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={19} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={19} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-2.5 rounded-lg border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={19} />
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — Globe */}
        <motion.div
          variants={globeVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center"
        >
          <div
            className="relative"
            style={{ width: "min(480px, 88vw)", height: "min(480px, 88vw)" }}
          >
            {/* Single clean orbit ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ inset: "-18px", border: "1px dashed rgba(0,212,255,0.13)" }}
            />
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow:
                  "0 0 70px rgba(0,212,255,0.07), inset 0 0 60px rgba(168,85,247,0.04)",
              }}
            />

            <GlobeCanvas />
          </div>

          {/* Location readout */}
          <div className="mt-5 flex flex-col items-center gap-1">
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#6b7280]/50">
              40.6782° N · 73.9442° W
            </p>
            <p className="text-[9px] font-mono tracking-[0.16em] uppercase text-[#6b7280]/30">
              Brooklyn, NY
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280]/50">
        <span className="text-[10px] font-mono tracking-widest uppercase">scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
