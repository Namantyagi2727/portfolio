"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { personalInfo, hero, journeyStops, type JourneyStopId } from "@/lib/data";
import AskTheMap from "./AskTheMap";
import BoardingPass from "./BoardingPass";
import JourneyCanvas, { MAP_HEIGHT_RATIO, MAP_TOP_PADDING, type JourneySelectSource } from "./JourneyCanvas";

const DESKTOP_QUERY = "(min-width: 1024px)";
const SWARM_PLAYED_KEY = "swarm-played";

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<JourneyStopId>("newyork");
  const [flat, setFlat] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );

  // The stage keeps the intro's height so the globe doesn't jump, but the flat
  // map is shorter, so the controls below pull up into the leftover space.
  const stageRef = useRef<HTMLDivElement>(null);
  const [mapOverlap, setMapOverlap] = useState(0);
  useEffect(() => {
    if (!flat || !isDesktop) {
      setMapOverlap(0);
      return;
    }
    const measure = () => {
      const stage = stageRef.current;
      if (stage) setMapOverlap(Math.max(0, stage.offsetHeight - stage.offsetWidth * MAP_HEIGHT_RATIO - MAP_TOP_PADDING - 8));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [flat, isDesktop]);

  const swarmButtonRef = useRef<HTMLButtonElement>(null);
  const stopSwarmRef = useRef<(() => void) | null>(null);
  const [swarmRunning, setSwarmRunning] = useState(false);
  const heroMountedRef = useRef(false);

  const runSwarm = async (auto = false) => {
    setSwarmRunning(true);
    const { startSwarm } = await import("@/lib/swarm-rebuild");
    if (!heroMountedRef.current) return;
    stopSwarmRef.current = startSwarm(
      () => {
        stopSwarmRef.current = null;
        setSwarmRunning(false);
        if (!auto) swarmButtonRef.current?.focus({ preventScroll: true });
      },
      { auto },
    );
  };

  // Autoplays once per browser session on a cursor-sized screen, starting from
  // the top of the page, so coming back from a case study doesn't replay it.
  useEffect(() => {
    heroMountedRef.current = true;
    const canAutoplay =
      !sessionStorage.getItem(SWARM_PLAYED_KEY) &&
      !window.location.hash &&
      window.scrollY < 100 &&
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canAutoplay) {
      sessionStorage.setItem(SWARM_PLAYED_KEY, "1");
      void runSwarm(true);
    }
    return () => {
      heroMountedRef.current = false;
      stopSwarmRef.current?.();
    };
  }, []);

  const activeStop = journeyStops.find((s) => s.id === activeId)!;
  // On desktop the intro sits over the map, so it steps aside once unrolled.
  const introHidden = flat && isDesktop;

  const selectStop = (id: JourneyStopId, source: JourneySelectSource) => {
    setActiveId(id);
    if (source === "user") setZoomed(flat && id === "newyork");
  };

  const flyTo = (id: JourneyStopId) => {
    setActiveId(id);
    setZoomed(false);
  };

  const toggleFlat = () => {
    setFlat(!flat);
    setZoomed(false);
  };

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
    <section id="hero" className="px-6 pt-20 pb-10 lg:pt-24 lg:pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto w-full"
      >
        <div ref={stageRef} className="relative flex flex-col gap-6 lg:block">
          <div
            className={`order-2 w-full lg:absolute lg:inset-0 lg:h-full ${
              flat ? "h-[210px] sm:h-[320px]" : "h-[320px] sm:h-[420px]"
            }`}
          >
            <JourneyCanvas
              activeId={activeId}
              flat={flat}
              zoomed={zoomed}
              paused={paused}
              tourEnabled={!askOpen && !swarmRunning}
              onSelect={selectStop}
            />
          </div>

          <div
            inert={introHidden}
            className={`order-1 relative z-10 lg:w-[50%] transition-[opacity,transform] duration-400 ${
              introHidden ? "opacity-0 -translate-y-2.5 pointer-events-none" : ""
            }`}
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted mb-4 lg:mb-6"
            >
              {hero.meta.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < hero.meta.length - 1 && <span className="mx-2 text-border-strong">·</span>}
                </span>
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
              className="font-medium tracking-tight text-foreground mb-6 leading-[1.05]"
              style={{ fontSize: "clamp(32px, 9vw, 52px)" }}
            >
              {hero.statement.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </motion.h2>

            <motion.p variants={itemVariants} className="text-lg text-muted max-w-xl leading-relaxed mb-6">
              {hero.supporting}
            </motion.p>

            {/* One clear primary action, one quieter secondary, everything else
                (social/contact) stays plain text — per the design spec's
                link/button system. */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-4 gap-y-3">
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

          <div
            data-swarm-atomic
            aria-hidden={flat}
            className={`order-3 relative z-10 lg:w-[50%] lg:max-w-[460px] lg:mt-7 transition-[opacity,transform] duration-400 ${
              flat ? "hidden lg:block lg:opacity-0 lg:-translate-y-2.5 lg:pointer-events-none" : ""
            }`}
          >
            <div key={activeStop.id} className="pass-in">
              <BoardingPass stop={activeStop} />
            </div>
          </div>
        </div>

        <div
          className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 mt-6"
          style={mapOverlap ? { marginTop: 24 - mapOverlap } : undefined}
        >
          <button
            type="button"
            onClick={toggleFlat}
            className="inline-flex items-center justify-center rounded-full border border-border-strong px-6 py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            {flat ? "Back to the globe" : "Unroll the map"}
          </button>
          {!shouldReduceMotion && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              className="font-mono text-xs text-muted hover:text-accent transition-colors"
            >
              {paused ? "Resume motion" : "Pause motion"}
            </button>
          )}
          {!shouldReduceMotion && (
            <button
              ref={swarmButtonRef}
              type="button"
              onClick={() => {
                if (!swarmRunning) void runSwarm();
              }}
              className="hidden md:inline font-mono text-xs text-muted hover:text-accent transition-colors underline decoration-border-strong underline-offset-4"
            >
              Replay the agents
            </button>
          )}
          {flat && (
            <p className="font-mono text-xs text-muted">
              {zoomed ? "Click another city to zoom out" : "Click New York to follow the road trip"}
            </p>
          )}
          <AskTheMap onFly={flyTo} onActiveChange={setAskOpen} />
        </div>

        {flat && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
              {journeyStops.map((stop, i) => (
                <motion.button
                  key={stop.id}
                  type="button"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: [0.2, 0.8, 0.3, 1] }}
                  onClick={() => selectStop(stop.id, "user")}
                  aria-pressed={stop.id === activeId}
                  className={`block min-w-0 rounded-[10px] text-left outline-offset-0 ${
                    stop.id === activeId ? "outline-[1.5px] outline-solid outline-accent" : "hover:outline hover:outline-border-strong"
                  }`}
                >
                  <BoardingPass stop={stop} compact />
                </motion.button>
              ))}
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <h3 className="text-[15px] font-semibold text-foreground mb-3">
                {activeStop.city}
                <span className="ml-2 font-mono text-[11px] font-normal text-muted">
                  {activeStop.region} · {activeStop.when}
                </span>
              </h3>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeStop.entries.map((entry) => (
                  <div key={`${entry.org}-${entry.title}`} className="text-[13px] leading-snug">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-accent-secondary mb-0.5">
                      {entry.kind}
                    </span>
                    <span className="block font-medium text-foreground">{entry.title}</span>
                    <span className="block text-muted">{entry.org}</span>
                    <span className="block text-muted">{entry.period}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Compact current-work strip — one line per item, full width. */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-2 border-t border-border pt-5 mt-8 lg:pt-8"
        >
          <p className="text-sm text-foreground">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-secondary mr-2">
              {hero.now.label}
            </span>
            {hero.now.title}
            <span className="text-muted"> · {hero.now.detail}</span>
          </p>
          <p className="text-sm text-foreground">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-secondary mr-2">
              {hero.recently.label}
            </span>
            {hero.recently.title}
            <span className="text-muted"> · {hero.recently.detail}</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
