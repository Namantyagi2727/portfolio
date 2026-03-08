"use client";

import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ArrowDown, Download } from "lucide-react";
import { personalInfo } from "@/lib/data";

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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1e1e1e] bg-[#111111] text-xs text-[#6b7280] mb-8 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
          Available for opportunities · Brooklyn, NY
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#ededed] mb-4">
          {personalInfo.name}
        </h1>

        {/* Typewriter role */}
        <div className="h-12 flex items-center justify-center mb-6">
          <p className="text-xl sm:text-2xl font-mono font-medium" style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.5)" }}>
            {displayed}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Bio */}
        <p className="text-[#6b7280] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          MS CS @ NYU Tandon · IEEE Published Researcher · 5+ Internships<br />
          Building intelligent systems at the intersection of AI, cloud, and full-stack.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
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
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-5">
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
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#6b7280]">
        <span className="text-xs font-mono">scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}
