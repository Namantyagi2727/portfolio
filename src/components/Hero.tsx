"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { personalInfo, hero } from "@/lib/data";
import DeskScene from "./DeskScene";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: shouldReduceMotion ? {} : { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  // No opacity in either state: Framer Motion embeds `initial` inline in the
  // SSR HTML, so animating from opacity:0 made the entire Hero invisible
  // until JS hydrated. Content is always fully opaque and readable pre-JS;
  // the slide-up is a pure progressive enhancement once motion resolves.
  const itemVariants = {
    hidden: shouldReduceMotion ? { y: 0 } : { y: 16 },
    visible: {
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section id="hero" className="px-6 pt-24 pb-12 lg:pt-32 lg:pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto w-full grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 lg:items-center"
      >
        <div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted mb-6 lg:mb-10"
          >
            {hero.metaTop.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="font-medium tracking-tight text-foreground mb-6 lg:mb-8 leading-[1.05] text-balance"
            style={{ fontSize: "clamp(32px, 5.2vw, 68px)" }}
          >
            {hero.statement}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base lg:text-lg text-muted max-w-xl leading-relaxed mb-6 lg:mb-8"
          >
            {hero.supporting}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted mb-8 lg:mb-12"
          >
            {hero.metaSecondary.map((line, i) => (
              <span key={line}>
                {line}
                {i < hero.metaSecondary.length - 1 && <span className="mx-2 text-border-strong">·</span>}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-10 lg:mb-16"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Selected work <ArrowDown size={13} />
            </a>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              Email ↗
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              Résumé ↗
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-x-16 gap-y-4 lg:gap-y-6 border-t border-border pt-8 max-w-lg"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent-secondary mb-1.5">
                {hero.now.label}
              </p>
              <p className="text-sm text-foreground font-medium">{hero.now.title}</p>
              <p className="text-sm text-muted">{hero.now.detail}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent-secondary mb-1.5">
                {hero.recently.label}
              </p>
              <p className="text-sm text-foreground font-medium">{hero.recently.title}</p>
              <p className="text-sm text-muted">{hero.recently.detail}</p>
            </div>
          </motion.div>
        </div>

        <div className="w-full sm:w-[420px] lg:w-[480px] mx-auto lg:mx-0">
          <DeskScene />
        </div>
      </motion.div>
    </section>
  );
}
