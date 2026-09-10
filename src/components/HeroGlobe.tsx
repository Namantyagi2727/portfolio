"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useReducedMotion } from "framer-motion";
import { hero } from "@/lib/data";
import { ACCENT, SURFACE, BACKGROUND } from "@/lib/diagram-tokens";
import { formatCoord } from "@/lib/geo";

// Deliberate tradeoff, documented in the design spec: cobe renders landmass
// as a dot-matrix texture, not vector line borders. Tuned here as a fine
// stippled technical texture (low mapSamples, muted base, no glow) rather
// than the neon/glow/dark-globe config this codebase used before.
// glowColor is matched to the page background so the glow blends away,
// rather than rendering as a visible halo around the globe's own surface tone.

function hexToRgbNorm(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeCity, setActiveCity] = useState(0);

  const phiRef = useRef(CITIES[0].phi);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phaseRef = useRef<"rotating" | "holding">("holding");
  const spotlightIdxRef = useRef(0);
  const holdStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initialWidth = canvas.offsetWidth || 500;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: initialWidth,
      height: initialWidth,
      phi: phiRef.current,
      theta: 0.24,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 4000,
      mapBrightness: 3,
      baseColor: hexToRgbNorm(SURFACE),
      markerColor: hexToRgbNorm(ACCENT),
      glowColor: hexToRgbNorm(BACKGROUND),
      markers: CITIES.map((c) => ({ location: [c.lat, c.lng] as [number, number], size: 0.05 })),
    });

    let frameId = 0;

    // Adaptation from the brief: the installed cobe@2.0.1 removed the v1
    // `onRender` per-frame callback (confirmed against node_modules/cobe's
    // shipped index.d.ts/index.js — there's no `onRender` field on
    // COBEOptions, and createGlobe now paints once synchronously and
    // exposes an imperative `update(state)` instead of running its own
    // animation loop). This requestAnimationFrame loop replaces that
    // internal loop 1:1 — same phi-cycling / interaction / reduced-motion
    // logic as the brief, just driving `globe.update()` ourselves each tick
    // instead of mutating a `state` object cobe would have passed in.
    const renderFrame = () => {
      const width = canvas.offsetWidth || initialWidth;

      // Reduced motion: pin phi to the default city every frame. The loop
      // keeps ticking (so the canvas stays sized to its container), but
      // nothing visibly moves — that's the actual requirement, not whether
      // this function keeps executing. See spec's reduced-motion note.
      if (shouldReduceMotion) {
        globe.update({ phi: CITIES[0].phi, width, height: width });
        frameId = requestAnimationFrame(renderFrame);
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
      frameId = requestAnimationFrame(renderFrame);
    };

    frameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
    };
  }, [shouldReduceMotion]);

  const city = CITIES[activeCity];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full aspect-square"
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
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted text-center">
        {city.label} — {formatCoord(city.lat, city.lng)}
      </p>
    </div>
  );
}
