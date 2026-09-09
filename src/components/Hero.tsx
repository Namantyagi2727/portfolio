"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { personalInfo, hero } from "@/lib/data";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center px-6 pt-32 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto w-full"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted mb-10"
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
          className="font-medium tracking-tight text-foreground mb-8 leading-[1.05]"
          style={{ fontSize: "clamp(40px, 6.5vw, 76px)" }}
        >
          {hero.statement.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        <motion.p variants={itemVariants} className="text-lg text-muted max-w-xl leading-relaxed mb-8">
          {hero.supporting}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted mb-12"
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
          className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-16"
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
          className="flex flex-wrap gap-x-16 gap-y-6 border-t border-border pt-8 max-w-lg"
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
      </motion.div>
    </section>
  );
}
