"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useReducedMotion } from "framer-motion";
import { hero } from "@/lib/data";
import { ACCENT_SECONDARY } from "@/lib/diagram-tokens";
import { formatCoord } from "@/lib/geo";

// cobe's public API has one real limitation worth documenting: `baseColor`
// is the sphere's *only* surface hue — land is rendered as a brightness
// variation of that same color (via its built-in dot-matrix world-map
// texture), not a second, independently-colored texture. True two-hue
// "blue ocean + green land" isn't reachable through the public API (traced
// through cobe's own fragment shader: the land/ocean split multiplies one
// `baseColor` by a per-pixel brightness factor, it never blends a second
// color in). BASE_COLOR below is tuned as an ocean blue; land reads as a
// brighter variation of that same blue, not a genuinely different hue —
// the closest honest approximation available in this library.
const BASE_COLOR: [number, number, number] = [0.11, 0.36, 0.55]; // ocean blue
const GLOW_COLOR: [number, number, number] = [0.25, 0.55, 0.75]; // restrained atmospheric edge

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

// Illustrative connections from home base — not live flights or a claimed
// itinerary, just a visual thread between the same three verified cities
// the globe already marks. Brooklyn is CITIES[0].
const ROUTES = [
  { from: 0, to: 1 }, // Brooklyn <-> London
  { from: 0, to: 2 }, // Brooklyn <-> New Delhi
];

const HOLD_MS = 9000; // long, calm hold — infrequent city changes, not a carousel
const LERP = 0.01; // slow glide between cities
const ARRIVAL = 0.01;
const TRAVEL_MS = 7000; // one point's travel time along its route, end to end

// Great-circle interpolation (slerp) between two [lat,lng] points, at
// progress t in [0,1] — this is what makes the traveling point track the
// same curved path cobe's own arc rendering draws, not a straight
// lat/lng lerp (which would visibly cut across the globe).
function latLngToVec3(lat: number, lng: number): [number, number, number] {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  return [Math.cos(latRad) * Math.cos(lngRad), Math.cos(latRad) * Math.sin(lngRad), Math.sin(latRad)];
}

function vec3ToLatLng([x, y, z]: [number, number, number]): [number, number] {
  const lat = (Math.asin(z) * 180) / Math.PI;
  const lng = (Math.atan2(y, x) * 180) / Math.PI;
  return [lat, lng];
}

function slerp(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const theta = Math.acos(dot) * t;
  const relX = b[0] - a[0] * dot;
  const relY = b[1] - a[1] * dot;
  const relZ = b[2] - a[2] * dot;
  const relLen = Math.sqrt(relX * relX + relY * relY + relZ * relZ) || 1;
  const rel: [number, number, number] = [relX / relLen, relY / relLen, relZ / relLen];
  return [
    a[0] * Math.cos(theta) + rel[0] * Math.sin(theta),
    a[1] * Math.cos(theta) + rel[1] * Math.sin(theta),
    a[2] * Math.cos(theta) + rel[2] * Math.sin(theta),
  ];
}

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

    const cityMarkers = CITIES.map((c) => ({ location: [c.lat, c.lng] as [number, number], size: 0.06 }));

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: initialWidth,
      height: initialWidth,
      phi: phiRef.current,
      theta: 0.24,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 12,
      baseColor: BASE_COLOR,
      markerColor: hexToRgbNorm(ACCENT_SECONDARY),
      glowColor: GLOW_COLOR,
      markers: cityMarkers,
      arcs: shouldReduceMotion
        ? []
        : ROUTES.map((r) => ({
            from: [CITIES[r.from].lat, CITIES[r.from].lng] as [number, number],
            to: [CITIES[r.to].lat, CITIES[r.to].lng] as [number, number],
          })),
      arcColor: [0.96, 0.82, 0.55],
      arcWidth: 1.4,
      arcHeight: 0.22,
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

      // A small traveling point per route, tracing the same great-circle
      // path cobe's arc rendering draws (not a straight lat/lng lerp) —
      // "tiny travelling points," calm and sparse, each route offset so
      // they don't move in lockstep.
      const now = Date.now();
      const travelers = ROUTES.map((r, i) => {
        const from = latLngToVec3(CITIES[r.from].lat, CITIES[r.from].lng);
        const to = latLngToVec3(CITIES[r.to].lat, CITIES[r.to].lng);
        const phase = (now / TRAVEL_MS + i / ROUTES.length) % 1;
        // Ping-pong 0->1->0 so the point travels back and forth along the
        // route rather than snapping back to the start each loop.
        const t = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
        const [lat, lng] = vec3ToLatLng(slerp(from, to, t));
        return { location: [lat, lng] as [number, number], size: 0.045, color: [1, 1, 1] as [number, number, number] };
      });

      globe.update({ phi, width, height: width, markers: [...cityMarkers, ...travelers] });
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
            below sm: to keep the mobile globe's footprint controlled. The
            "illustrative" disclosure stays visible at every width, though —
            it's not decorative, it's what keeps the flight paths honest. */}
        <p className="hidden sm:block font-mono text-[11px] text-muted text-center">
          {formatCoord(city.lat, city.lng)}
        </p>
        <p className="font-mono text-[10px] text-muted/70 text-center">
          Illustrative connections — not live flights
        </p>
      </div>
    </div>
  );
}
