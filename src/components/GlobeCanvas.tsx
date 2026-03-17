"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0.4);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 600,
      height: 600,
      phi: 0.35,
      theta: 0.22,
      dark: 1,
      diffuse: 1.3,
      mapSamples: 16000,
      mapBrightness: 6.5,
      baseColor: [0.02, 0.02, 0.05],
      markerColor: [0, 0.831, 1],
      glowColor: [0.35, 0.18, 0.65],
      markers: [
        { location: [40.6782, -73.9442],  size: 0.07 }, // Brooklyn, NY
        { location: [51.5074, -0.1278],   size: 0.05 }, // London
        { location: [28.6139, 77.209],    size: 0.05 }, // New Delhi
        { location: [37.7749, -122.4194], size: 0.04 }, // San Francisco
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = canvas.offsetWidth * 2;
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
