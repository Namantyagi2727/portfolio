"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Playfair_Display } from "next/font/google";
import { personalInfo } from "@/lib/data";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["900"],
  style: ["italic"],
  display: "swap",
});

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border border-[#f59e0b]/20 animate-pulse" />
    </div>
  ),
});

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
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

const INTERESTS = [
  { icon: "🏎️", label: "F1 FAN",    color: "#ef4444" },
  { icon: "⚽",  label: "SPORTS",   color: "#22c55e" },
  { icon: "✈️",  label: "EXPLORER", color: "#f59e0b" },
  { icon: "</>", label: "BUILDER",  color: "#00d4ff" },
];

const COMPASS = [
  { label: "N", style: { top: "-34px",   left: "50%", transform: "translateX(-50%)" } },
  { label: "S", style: { bottom: "-34px", left: "50%", transform: "translateX(-50%)" } },
  { label: "E", style: { right: "-34px",  top: "50%", transform: "translateY(-50%)" } },
  { label: "W", style: { left: "-34px",   top: "50%", transform: "translateY(-50%)" } },
];

const particles = [
  { top: "12%", left: "5%",  size: 2, color: "#f59e0b", delay: 0 },
  { top: "75%", left: "10%", size: 3, color: "#a855f7", delay: 0.7 },
  { top: "25%", left: "88%", size: 2, color: "#00d4ff", delay: 1.2 },
  { top: "82%", left: "82%", size: 2, color: "#f59e0b", delay: 1.8 },
  { top: "50%", left: "50%", size: 1, color: "#00d4ff", delay: 2.5 },
  { top: "40%", left: "2%",  size: 2, color: "#22c55e", delay: 3.0 },
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
      {/* Coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Topographic rings centred on globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-radial-gradient(circle at 74% 50%, transparent 0px, transparent 58px, rgba(245,158,11,0.02) 59px, transparent 60px),
            repeating-radial-gradient(circle at 74% 50%, transparent 0px, transparent 118px, rgba(0,212,255,0.013) 119px, transparent 120px)
          `,
        }}
      />

      {/* Ambient warm glow */}
      <div
        className="absolute top-1/2 right-[26%] -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.045) 0%, rgba(0,212,255,0.025) 40%, transparent 68%)",
        }}
      />

      {/* Top dispatch bar */}
      <div className="absolute top-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <div className="flex items-center gap-3 px-5 py-1.5 rounded-full border border-[#1e1e1e]/60 bg-[#0a0a0a]/70 backdrop-blur-sm">
          <span className="text-[9px] font-mono text-[#f59e0b]/55 uppercase tracking-[0.28em]">
            DISPATCH #001
          </span>
          <span className="text-[#2a2a2a]">│</span>
          <span className="text-[9px] font-mono text-[#6b7280]/45 tracking-[0.14em]">
            40.6782° N · 73.9442° W
          </span>
          <span className="text-[#2a2a2a]">│</span>
          <span className="text-[9px] font-mono text-[#6b7280]/45 uppercase tracking-[0.14em]">
            Brooklyn, NY
          </span>
        </div>
      </div>

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
            x: [0, i % 2 === 0 ? 14 : -14, 0],
            opacity: [0.12, 0.38, 0.12],
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

        {/* LEFT: text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants} className="mb-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1e1e1e] bg-[#111111] text-[10px] text-[#6b7280] font-mono tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Available · Open to Opportunities
            </div>
          </motion.div>

          {/* Name — Playfair Display italic */}
          <motion.h1
            variants={itemVariants}
            className={`${playfair.className} leading-[0.92] text-[#ededed] mb-6 tracking-tight`}
            style={{ fontSize: "clamp(64px, 10vw, 104px)" }}
          >
            {personalInfo.name}
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            variants={itemVariants}
            className="h-10 flex items-center justify-center lg:justify-start mb-5"
          >
            <p
              className="text-lg sm:text-xl font-mono font-medium"
              style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.5)" }}
            >
              ∷ {displayed}
              <span className="animate-pulse">_</span>
            </p>
          </motion.div>

          {/* Interest chips */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center lg:justify-start gap-2 mb-7"
          >
            {INTERESTS.map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono font-bold select-none"
                style={{
                  color: chip.color,
                  background: `${chip.color}12`,
                  border: `1px solid ${chip.color}35`,
                  letterSpacing: "0.11em",
                }}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="text-[#6b7280] text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
          >
            MS CS @ NYU Tandon · IEEE Published Researcher · 6+ Internships
            <br />
            Building intelligent systems across AI, cloud, and full-stack.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded font-bold text-sm text-[#0a0a0a] transition-all duration-200 hover:scale-105 tracking-wide"
              style={{ background: "#00d4ff", boxShadow: "0 0 20px rgba(0,212,255,0.4)" }}
            >
              VIEW WORK ↗
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-sm border border-[#1e1e1e] text-[#ededed] hover:border-[#f59e0b]/50 hover:text-[#f59e0b] transition-all duration-200 tracking-wide"
            >
              <Download size={14} />
              RESUME
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded font-bold text-sm text-[#6b7280] hover:text-[#ededed] transition-colors duration-200 tracking-wide"
            >
              CONTACT →
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start gap-4"
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-3 rounded border border-[#1e1e1e] text-[#6b7280] hover:text-[#00d4ff] hover:border-[#00d4ff]/40 transition-all duration-200"
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
          className="flex flex-col items-center justify-center"
        >
          <div
            className="relative"
            style={{ width: "min(480px, 90vw)", height: "min(480px, 90vw)" }}
          >
            {/* Outer amber orbit */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ inset: "-22px", border: "1px dashed rgba(245,158,11,0.22)" }}
            />
            {/* Inner cyan orbit */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{ inset: "-6px", border: "1px dashed rgba(0,212,255,0.08)" }}
            />
            {/* Glow aura */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow:
                  "0 0 80px rgba(245,158,11,0.07), 0 0 40px rgba(0,212,255,0.06), inset 0 0 60px rgba(168,85,247,0.04)",
              }}
            />
            {/* Compass marks */}
            {COMPASS.map(({ label, style }) => (
              <span
                key={label}
                className="absolute text-[9px] font-mono font-bold"
                style={{ ...style, color: "rgba(245,158,11,0.3)" }}
              >
                {label}
              </span>
            ))}

            <GlobeCanvas />
          </div>

          {/* Coordinate readout */}
          <div className="mt-6 text-center space-y-1">
            <p
              className="text-[10px] font-mono tracking-[0.28em] uppercase"
              style={{ color: "rgba(245,158,11,0.45)" }}
            >
              40.6782° N · 73.9442° W
            </p>
            <p className="text-[9px] font-mono text-[#6b7280]/35 tracking-[0.18em] uppercase">
              BROOKLYN, NY — BASE OF OPERATIONS
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280]">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
