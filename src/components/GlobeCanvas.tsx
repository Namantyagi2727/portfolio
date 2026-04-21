"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

// phi ≈ -longitude_degrees × (π/180)
const SPOTLIGHT_PHIS = [
  1.290,   // Brooklyn, NY  (lon −73.94°)
  0.0022,  // London        (lon  −0.13°)
 -1.348,   // New Delhi     (lon  +77.21°)
];

const HOLD_MS = 2800;
const LERP    = 0.042;
const ARRIVAL = 0.018;

interface GlobeCanvasProps {
  onSpotlight?: (index: number | null) => void;
  targetIndex?: number | null; // externally trigger rotation to a spotlight
}

export default function GlobeCanvas({ onSpotlight, targetIndex }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef    = useRef(SPOTLIGHT_PHIS[0]);

  const pointerInteracting        = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  // Spotlight state machine — all refs to avoid stale closures in onRender
  const phaseRef          = useRef<"rotating" | "holding">("holding");
  const spotlightIdxRef   = useRef(0);
  const holdStartRef      = useRef<number>(Date.now());
  const onSpotlightRef    = useRef(onSpotlight);
  const forcedTargetRef   = useRef<number | null>(null);

  // Keep callbacks in sync without re-running the globe effect
  useEffect(() => { onSpotlightRef.current = onSpotlight; });

  // When parent requests a specific city, push it into the render loop via ref
  useEffect(() => {
    if (targetIndex !== null && targetIndex !== undefined) {
      forcedTargetRef.current = targetIndex;
    }
  }, [targetIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width:  600,
      height: 600,
      phi:    phiRef.current,
      theta:  0.22,
      dark: 1,
      diffuse: 1.3,
      mapSamples: 16000,
      mapBrightness: 6.5,
      baseColor:   [0.02, 0.02, 0.05],
      markerColor: [0, 0.831, 1],
      glowColor:   [0.35, 0.18, 0.65],
      markers: [
        { location: [40.6782, -73.9442],  size: 0.07 }, // Brooklyn, NY
        { location: [51.5074, -0.1278],   size: 0.05 }, // London
        { location: [28.6139,  77.209],   size: 0.05 }, // New Delhi
        { location: [37.7749, -122.4194], size: 0.04 }, // San Francisco
      ],
      onRender: (state) => {
        const interacting = pointerInteracting.current !== null;

        // Handle external tab click — override state machine immediately
        if (forcedTargetRef.current !== null) {
          spotlightIdxRef.current  = forcedTargetRef.current;
          phaseRef.current         = "rotating";
          holdStartRef.current     = 0;
          forcedTargetRef.current  = null;
          onSpotlightRef.current?.(null);
        }

        if (interacting) {
          state.phi = phiRef.current + pointerInteractionMovement.current;
        } else {
          const idx    = spotlightIdxRef.current;
          const target = SPOTLIGHT_PHIS[idx];

          if (phaseRef.current === "rotating") {
            // Shortest-path lerp with wrap-around
            let delta = target - phiRef.current;
            while (delta >  Math.PI) delta -= 2 * Math.PI;
            while (delta < -Math.PI) delta += 2 * Math.PI;

            phiRef.current += delta * LERP;

            if (Math.abs(delta) < ARRIVAL) {
              phiRef.current       = target;
              phaseRef.current     = "holding";
              holdStartRef.current = Date.now();
              onSpotlightRef.current?.(idx);
            }
          } else {
            // Gentle micro-drift while holding so the globe feels alive
            phiRef.current += 0.0006;

            if (Date.now() - holdStartRef.current > HOLD_MS) {
              phaseRef.current        = "rotating";
              spotlightIdxRef.current = (idx + 1) % SPOTLIGHT_PHIS.length;
              onSpotlightRef.current?.(null);
            }
          }

          state.phi = phiRef.current;
        }

        state.width  = canvas.offsetWidth  * 2;
        state.height = canvas.offsetHeight * 2;
      },
    });

    return () => globe.destroy();
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };

  const onPointerUp = () => {
    pointerInteracting.current = null;
    phiRef.current += pointerInteractionMovement.current;
    pointerInteractionMovement.current = 0;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta * 0.005;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerMove={onPointerMove}
      style={{ width: "100%", height: "100%", cursor: "grab" }}
    />
  );
}
