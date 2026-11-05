"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { deskScene, type DeskState } from "@/lib/data";

const IDS = deskScene.map((s) => s.id);

export default function DeskScene() {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<DeskState["id"]>("at-work");
  const [loaded, setLoaded] = useState<Set<DeskState["id"]>>(() => new Set(["at-work"]));
  const tabRefs = useRef<Partial<Record<DeskState["id"], HTMLButtonElement | null>>>({});

  const activate = useCallback((id: DeskState["id"]) => {
    setActiveId(id);
    setLoaded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % IDS.length;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + IDS.length) % IDS.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = IDS.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const nextId = IDS[nextIndex];
      activate(nextId);
      tabRefs.current[nextId]?.focus();
    }
  };

  const active = deskScene.find((s) => s.id === activeId)!;
  const transitionDuration = shouldReduceMotion ? 0 : 0.45;

  return (
    <div className="w-full">
      <div
        id="desk-scene-panel"
        role="tabpanel"
        aria-labelledby={`desk-tab-${active.id}`}
        className="relative w-full aspect-[17/10] rounded-lg overflow-hidden border border-border bg-surface"
      >
        {deskScene
          .filter((s) => loaded.has(s.id))
          .map((s) => {
            const isActive = s.id === activeId;
            return (
              <motion.div
                key={s.id}
                aria-hidden={!isActive}
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 1.015,
                }}
                transition={{ duration: transitionDuration, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ pointerEvents: isActive ? "auto" : "none" }}
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  priority={s.id === "at-work"}
                  sizes="(min-width: 1024px) 440px, (min-width: 640px) 60vw, 80vw"
                  className={`object-cover ${s.mobileImage ? "hidden sm:block" : ""}`}
                />
                {s.mobileImage && (
                  <Image
                    src={s.mobileImage}
                    alt={s.alt}
                    fill
                    priority={s.id === "at-work"}
                    sizes="80vw"
                    className="object-cover sm:hidden"
                  />
                )}
              </motion.div>
            );
          })}
      </div>

      <div
        role="tablist"
        aria-label="Desk scene mode"
        className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3"
      >
        {deskScene.map((s, i) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[s.id] = el;
              }}
              type="button"
              role="tab"
              id={`desk-tab-${s.id}`}
              aria-selected={isActive}
              aria-controls="desk-scene-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => activate(s.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`px-2.5 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs rounded-full font-medium tracking-wide border transition-colors ${
                isActive
                  ? "bg-accent border-accent text-background"
                  : "border-border text-muted hover:text-foreground hover:border-border-strong"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p
        id="desk-scene-caption"
        role="status"
        aria-live="polite"
        aria-labelledby={`desk-tab-${active.id}`}
        className="mt-2 text-xs sm:text-sm text-muted text-center max-w-[15rem] sm:max-w-xs mx-auto min-h-[1.75rem]"
      >
        {active.caption}
      </p>
    </div>
  );
}
