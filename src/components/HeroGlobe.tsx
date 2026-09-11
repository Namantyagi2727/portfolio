"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useReducedMotion } from "framer-motion";
import { hero } from "@/lib/data";
import { ACCENT, BORDER_STRONG } from "@/lib/diagram-tokens";
import { formatCoord } from "@/lib/geo";

// cobe renders landmass as a dot-matrix texture, not vector line borders —
// tuned here as a fine stippled technical texture, not a flat pale blob.
// baseColor is deliberately darker than the page background (BORDER_STRONG,
// not SURFACE) for real contrast; glowColor is a *dimmed* version of the
// same tone rather than matched to the light page background — cobe's glow
// is additive, so a light glowColor still reads as a bright halo regardless
// of hue-matching. Dimming its magnitude is what actually suppresses it.

function hexToRgbNorm(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function dim([r, g, b]: [number, number, number], factor: number): [number, number, number] {
  return [r * factor, g * factor, b * factor];
}

// phi ≈ -longitude_degrees × (π/180). Index 0 (Brooklyn) is the default,
// most-emphasized city, matching hero.globeCities' declared order.
const CITIES = hero.globeCities.map((c) => ({
  ...c,
  phi: -c.lng * (Math.PI / 180),
}));

const HOLD_MS = 9000; // long, calm hold — infrequent city changes, not a carousel
const LERP = 0.01; // slow glide between cities
const ARRIVAL = 0.01;

export default function HeroGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeCity, setActiveCity] = useState(0);

  const phiRef = useRef(CITIES[0].phi);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phaseRef = useRef<"rotating" | "holding">("holding");
  const spotlightIdxRef = useRef(0);
  const holdStartRef = useRef<number>(Date.now());
  const isVisibleRef = useRef(true);
  const frameIdRef = useRef(0);

  // Jump the spotlight to a city directly — used by the city-select tabs.
  // Reuses the existing rotating/holding state machine (just retargets it),
  // so the render loop's own lerp carries the transition smoothly and the
  // regular auto-cycle resumes from the clicked city afterward.
  const selectCity = (idx: number) => {
    spotlightIdxRef.current = idx;
    phaseRef.current = "rotating";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const initialWidth = canvas.offsetWidth || 500;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: initialWidth,
      height: initialWidth,
      phi: phiRef.current,
      theta: 0.24,
      dark: 0.15,
      diffuse: 1.3,
      mapSamples: 6000,
      mapBrightness: 2.2,
      baseColor: hexToRgbNorm(BORDER_STRONG),
      markerColor: hexToRgbNorm(ACCENT),
      glowColor: dim(hexToRgbNorm(BORDER_STRONG), 0.35),
      markers: CITIES.map((c) => ({ location: [c.lat, c.lng] as [number, number], size: 0.06 })),
    });

    // Adaptation from the brief: the installed cobe@2.0.1 removed the v1
    // `onRender` per-frame callback (confirmed against node_modules/cobe's
    // shipped index.d.ts/index.js). This requestAnimationFrame loop drives
    // `globe.update()` ourselves each tick instead.
    const renderFrame = () => {
      const width = canvas.offsetWidth || initialWidth;

      // Stop the expensive per-frame update while the globe is scrolled
      // offscreen — the observer below restarts this loop when it returns.
      if (!isVisibleRef.current) return;

      if (shouldReduceMotion) {
        globe.update({ phi: CITIES[0].phi, width, height: width });
        frameIdRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const interacting = pointerInteracting.current !== null;
      let phi: number;

      if (interacting) {
        phi = phiRef.current + pointerInteractionMovement.current;
      } else {
        const idx = spotlightIdxRef.current;
        const target = CITIES[idx].phi;

        if (phaseRef.current === "rotating") {
          let delta = target - phiRef.current;
          while (delta > Math.PI) delta -= 2 * Math.PI;
          while (delta < -Math.PI) delta += 2 * Math.PI;
          phiRef.current += delta * LERP;

          if (Math.abs(delta) < ARRIVAL) {
            phiRef.current = target;
            phaseRef.current = "holding";
            holdStartRef.current = Date.now();
            setActiveCity(idx);
          }
        } else if (Date.now() - holdStartRef.current > HOLD_MS) {
          phaseRef.current = "rotating";
          spotlightIdxRef.current = (idx + 1) % CITIES.length;
        }

        phi = phiRef.current;
      }

      globe.update({ phi, width, height: width });
      frameIdRef.current = requestAnimationFrame(renderFrame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !wasVisible) {
          cancelAnimationFrame(frameIdRef.current);
          frameIdRef.current = requestAnimationFrame(renderFrame);
        }
      },
      { threshold: 0 }
    );
    observer.observe(wrapper);

    frameIdRef.current = requestAnimationFrame(renderFrame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameIdRef.current);
      globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  const city = CITIES[activeCity];

  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-5">
      <div className="relative w-full aspect-square">
        {/* Drafting-style orbital ring — decorative, independent of the WebGL
            canvas, reinforces the "spatial instrument" identity and gives the
            globe a defined edge against the page. */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-[-2.5%] pointer-events-none"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="0.4"
            strokeDasharray="1.5 2.5"
          />
        </svg>

        <div
          className="w-full h-full"
          style={{ cursor: shouldReduceMotion ? "default" : "grab" }}
          onPointerDown={(e) => {
            if (shouldReduceMotion) return;
            pointerInteracting.current = e.clientX;
            pointerInteractionMovement.current = 0;
            e.currentTarget.style.cursor = "grabbing";
          }}
          onPointerUp={(e) => {
            if (pointerInteracting.current !== null) {
              phiRef.current += pointerInteractionMovement.current;
            }
            pointerInteracting.current = null;
            pointerInteractionMovement.current = 0;
            e.currentTarget.style.cursor = "grab";
          }}
          onPointerOut={(e) => {
            if (pointerInteracting.current !== null) {
              phiRef.current += pointerInteractionMovement.current;
            }
            pointerInteracting.current = null;
            pointerInteractionMovement.current = 0;
            e.currentTarget.style.cursor = "grab";
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              pointerInteractionMovement.current = (e.clientX - pointerInteracting.current) * 0.005;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              pointerInteractionMovement.current = (e.touches[0].clientX - pointerInteracting.current) * 0.005;
            }
          }}
        >
          <canvas
            ref={canvasRef}
            // touch-action: none (not e.preventDefault() in onTouchMove) suppresses
            // native scroll during drag — React attaches touch listeners passively,
            // so preventDefault() there would silently no-op.
            style={{ width: "100%", height: "100%", contain: "layout paint size", touchAction: "none" }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wide sm:tracking-widest">
          {CITIES.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => selectCity(i)}
              className={
                i === activeCity
                  ? "text-accent transition-colors"
                  : "text-muted hover:text-foreground transition-colors"
              }
            >
              {c.label}
            </button>
          ))}
        </div>
        {/* Precise coordinate is a supporting flourish, not essential — hidden
            below sm: to keep the mobile globe's footprint controlled. */}
        <p className="hidden sm:block font-mono text-[11px] text-muted text-center">
          {formatCoord(city.lat, city.lng)}
        </p>
      </div>
    </div>
  );
}
