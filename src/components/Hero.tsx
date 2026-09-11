"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { personalInfo, hero } from "@/lib/data";

const HeroGlobe = dynamic(() => import("./HeroGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square rounded-full border border-dashed border-border-strong bg-surface/40" />
  ),
});

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
    <section id="hero" className="px-6 pt-28 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_440px] lg:grid-rows-[auto_auto] gap-x-16 gap-y-10"
      >
        {/* Intro + primary actions — left column at lg:, first in DOM order
            everywhere (mobile composition item 1+2: name/intro, then actions). */}
        <div className="lg:col-start-1 lg:row-start-1">
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
            style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}
          >
            {hero.statement.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-muted max-w-xl leading-relaxed mb-8">
            {hero.supporting}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-muted mb-10"
          >
            {hero.metaSecondary.map((line, i) => (
              <span key={line}>
                {line}
                {i < hero.metaSecondary.length - 1 && <span className="mx-2 text-border-strong">·</span>}
              </span>
            ))}
          </motion.div>

          {/* One clear primary action, one quieter secondary, everything else
              (social/contact) stays plain text — per the design spec's
              link/button system. */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8">
            <Link
              href="/#work"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background hover:bg-accent-tint transition-colors"
            >
              Explore work
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border-strong px-6 py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              Résumé
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              Email ↗
            </a>
          </motion.div>
        </div>

        {/* Spatial illustration — right column at lg:, third in mobile DOM
            order (after actions, before the now/recently strip). */}
        <div className="w-[220px] sm:w-[260px] lg:w-full mx-auto lg:mx-0 lg:col-start-2 lg:row-start-1">
          <HeroGlobe />
        </div>

        {/* Compact current-work strip — spans full width beneath both
            columns at lg:, last in mobile DOM order. */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-x-16 gap-y-6 border-t border-border pt-8 lg:col-span-2 lg:row-start-2"
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
