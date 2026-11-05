"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { journeyRoutes, journeyStops, roadTrip, type JourneyStopId } from "@/lib/data";
import {
  ACCENT,
  ACCENT_SECONDARY,
  BACKGROUND,
  FOREGROUND,
  MUTED,
  SURFACE,
} from "@/lib/diagram-tokens";

export type JourneySelectSource = "user" | "tour";

type Props = {
  activeId: JourneyStopId;
  flat: boolean;
  zoomed: boolean;
  paused: boolean;
  tourEnabled: boolean;
  onSelect: (id: JourneyStopId, source: JourneySelectSource) => void;
};

type LandDots = { globe: number[]; northAmerica: number[] };
type GeoPoint = { lat: number; lng: number; alt: number };
type Layout = { gx: number; gy: number; radius: number; scale: number; mapY: number };

const RAD = Math.PI / 180;
const LAND_DOT = "#B4B0A2";
const TOUR_HOLD_MS = 5000;
const TOUR_RESUME_MS = 9000;
const US_CENTER = { lat: 39, lng: -96 };
const US_ZOOM = 2.7;
const MAP_CENTER_LAT = 11;
const MAP_LAT_STRETCH = 1.14;
// Headroom so high flight arcs don't clip against the top of the canvas.
export const MAP_TOP_PADDING = 28;
export const MAP_HEIGHT_RATIO = (138 * MAP_LAT_STRETCH) / 352;

const PLANE = "M10 0 L2 1.3 L-2 6.5 L-4.2 6.5 L-2.4 1.3 L-6 1 L-7.6 3 L-9 3 L-8 0 L-9 -3 L-7.6 -3 L-6 -1 L-2.4 -1.3 L-4.2 -6.5 L-2 -6.5 L2 -1.3 Z";
const CAR = "M6 -2.7 Q7.4 -2.7 7.4 -1 L7.4 1 Q7.4 2.7 6 2.7 L-5.6 2.7 Q-7.2 2.7 -7.2 1 L-7.2 -1 Q-7.2 -2.7 -5.6 -2.7 Z";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const damp = (rate: number, dtMs: number) => 1 - Math.pow(1 - rate, dtMs / 16.67);

const stopById = (id: JourneyStopId) => journeyStops.find((s) => s.id === id)!;

function toVector(lat: number, lng: number): [number, number, number] {
  const a = lat * RAD;
  const o = lng * RAD;
  return [Math.cos(a) * Math.cos(o), Math.sin(a), Math.cos(a) * Math.sin(o)];
}

function greatCircle(a: { lat: number; lng: number }, b: { lat: number; lng: number }, lift: number): GeoPoint[] {
  const A = toVector(a.lat, a.lng);
  const B = toVector(b.lat, b.lng);
  const angle = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const samples = 72;
  const points: GeoPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const s1 = Math.sin((1 - u) * angle) / Math.sin(angle);
    const s2 = Math.sin(u * angle) / Math.sin(angle);
    const v = [A[0] * s1 + B[0] * s2, A[1] * s1 + B[1] * s2, A[2] * s1 + B[2] * s2];
    points.push({
      lat: Math.asin(v[1]) / RAD,
      lng: Math.atan2(v[2], v[0]) / RAD,
      alt: lift * Math.sin(Math.PI * u),
    });
  }
  return points;
}

const ROUTES = journeyRoutes.map((r) => ({
  ...r,
  points: greatCircle(stopById(r.from), stopById(r.to), r.lift ?? (r.remote ? 0.05 : 0.13)),
}));

const FLIGHTS = ROUTES.filter((r) => !r.remote).map((r) => ({ route: r, ms: r.points.length * 80, pause: 1200 }));
const FLIGHT_CYCLE = FLIGHTS.reduce((sum, f) => sum + f.ms + f.pause, 0);

// Small sideways wobble so the drive reads as roads, not straight flight lines.
const ROAD_LEGS = roadTrip.map((a, i) => {
  const b = roadTrip[(i + 1) % roadTrip.length];
  const dLat = b.lat - a.lat;
  const dLng = b.lng - a.lng;
  const dist = Math.hypot(dLat, dLng);
  const samples = 26;
  const points: GeoPoint[] = [];
  for (let k = 0; k <= samples; k++) {
    const u = k / samples;
    const wobble = Math.sin(u * Math.PI * 2) * dist * 0.035 + Math.sin(u * Math.PI * 5) * dist * 0.012;
    points.push({
      lat: a.lat + dLat * u + (dLng / dist) * wobble,
      lng: a.lng + dLng * u - (dLat / dist) * wobble,
      alt: 0,
    });
  }
  return { points, to: b.city, ms: Math.max(1500, dist * 165), pause: 850 };
});
const ROAD_POINTS = ROAD_LEGS.flatMap((l) => l.points);
const ROAD_CYCLE = ROAD_LEGS.reduce((sum, l) => sum + l.ms + l.pause, 0);
const NOT_LABELED = new Set(journeyStops.map((s) => s.city));

function carPosition(clock: number) {
  let t = clock % ROAD_CYCLE;
  for (const leg of ROAD_LEGS) {
    if (t < leg.ms) {
      const f = ease(t / leg.ms) * (leg.points.length - 1.001);
      const i = Math.floor(f);
      return { a: leg.points[i], b: leg.points[i + 1], u: f - i, parkedAt: null as string | null };
    }
    t -= leg.ms;
    if (t < leg.pause) {
      const n = leg.points.length;
      return { a: leg.points[n - 2], b: leg.points[n - 1], u: 1, parkedAt: leg.to };
    }
    t -= leg.pause;
  }
  return null;
}

export default function JourneyCanvas({ activeId, flat, zoomed, paused, tourEnabled, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = !!useReducedMotion();
  const kickRef = useRef<() => void>(() => {});
  const onSelectRef = useRef(onSelect);
  const propsRef = useRef({ activeId, reducedMotion, paused, tourEnabled });
  const initial = stopById(activeId);
  const engineRef = useRef({
    flatness: flat ? 1 : 0,
    flatTarget: flat ? 1 : 0,
    zoom: 0,
    zoomTarget: 0,
    phi: -initial.lng * RAD,
    phiTarget: -initial.lng * RAD,
    theta: initial.lat * RAD * 0.45,
    thetaTarget: initial.lat * RAD * 0.45,
    lastUserInput: -Infinity,
    lastTourStep: 0,
    hovering: false,
  });

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    propsRef.current = { activeId, reducedMotion, paused, tourEnabled };
    const e = engineRef.current;
    const stop = stopById(activeId);
    e.flatTarget = flat ? 1 : 0;
    e.zoomTarget = zoomed ? 1 : 0;
    e.phiTarget = -stop.lng * RAD;
    e.thetaTarget = stop.lat * RAD * 0.45;
    if (reducedMotion) {
      e.flatness = e.flatTarget;
      e.zoom = e.zoomTarget;
      e.phi = e.phiTarget;
      e.theta = e.thetaTarget;
    }
    kickRef.current();
  }, [activeId, flat, zoomed, paused, tourEnabled, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const e = engineRef.current;
    const planePath = new Path2D(PLANE);
    const carPath = new Path2D(CAR);
    const monoFont =
      getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";

    let dots: LandDots | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let running = false;
    let disposed = false;
    let lastFrame = 0;
    let clock = 0;
    let drag: { x: number; y: number; phi: number; theta: number } | null = null;
    let pressed = false;
    let moved = 0;

    const measure = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };

    const layout = (): Layout => {
      const wide = width >= 900;
      const scale = Math.min(width / 352, height / (138 * MAP_LAT_STRETCH));
      return {
        gx: width * (wide ? 0.76 : 0.5),
        gy: height * 0.5,
        radius: wide ? Math.min(height * 0.44, width * 0.22) : Math.min(height * 0.46, width * 0.44),
        scale,
        mapY: wide ? (138 * MAP_LAT_STRETCH * scale) / 2 + MAP_TOP_PADDING : height / 2,
      };
    };

    const project = (lat: number, lng: number, alt: number, g: Layout) => {
      const lambda = lng * RAD + e.phi;
      const cosLat = Math.cos(lat * RAD);
      const x3 = cosLat * Math.sin(lambda);
      const y3 = Math.sin(lat * RAD);
      const z3 = cosLat * Math.cos(lambda);
      const cosT = Math.cos(e.theta);
      const sinT = Math.sin(e.theta);
      const y = y3 * cosT - z3 * sinT;
      const z = y3 * sinT + z3 * cosT;
      const r = g.radius * (1 + alt);

      const zt = ease(e.zoom);
      const z2 = 1 + (US_ZOOM - 1) * zt;
      const focusX = lerp(width / 2, width / 2 + US_CENTER.lng * g.scale, zt);
      const focusY = lerp(g.mapY, g.mapY - (US_CENTER.lat - MAP_CENTER_LAT) * g.scale * MAP_LAT_STRETCH, zt);
      const mapX = width / 2 + (width / 2 + lng * g.scale - focusX) * z2;
      const mapY =
        g.mapY +
        (g.mapY - (lat - MAP_CENTER_LAT) * g.scale * MAP_LAT_STRETCH - alt * g.scale * 62 - focusY) * z2;

      const f = ease(e.flatness);
      return { x: lerp(g.gx + r * x3, mapX, f), y: lerp(g.gy - r * y, mapY, f), front: z >= -0.02 };
    };

    const label = (text: string, x: number, y: number, color: string, font: string) => {
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      ctx.strokeStyle = BACKGROUND;
      ctx.fillStyle = color;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    };

    const tracePath = (points: GeoPoint[], g: Layout, f: number) => {
      ctx.beginPath();
      let open = false;
      for (const q of points) {
        const p = project(q.lat, q.lng, q.alt, g);
        if (!p.front && f < 0.5) {
          open = false;
          continue;
        }
        if (open) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
        open = true;
      }
      ctx.stroke();
    };

    const drawDots = (set: number[], radius: number, g: Layout, side: "front" | "back" | "any") => {
      ctx.beginPath();
      for (let i = 0; i < set.length; i += 2) {
        const p = project(set[i], set[i + 1], 0, g);
        if (side === "front" && !p.front) continue;
        if (side === "back" && p.front) continue;
        if (p.x < -4 || p.x > width + 4 || p.y < -4 || p.y > height + 4) continue;
        ctx.moveTo(p.x + radius, p.y);
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const draw = () => {
      const { activeId: active, reducedMotion: hideMovers } = propsRef.current;
      const g = layout();
      const f = ease(e.flatness);
      const zt = ease(e.zoom);
      const compact = width < 640;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (f < 0.98) {
        ctx.globalAlpha = 1 - f;
        ctx.beginPath();
        ctx.arc(g.gx, g.gy, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = SURFACE;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(g.gx, g.gy, g.radius + 9, 0, Math.PI * 2);
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = MUTED;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      if (dots) {
        ctx.fillStyle = LAND_DOT;
        const dotRadius = lerp(1.45, 1.25, f) * (compact ? 0.72 : 1);
        drawDots(dots.globe, dotRadius, g, "front");
        if (f > 0.01) {
          ctx.globalAlpha = f;
          drawDots(dots.globe, dotRadius, g, "back");
          ctx.globalAlpha = 1;
        }
        if (zt > 0.01) {
          ctx.globalAlpha = zt;
          drawDots(dots.northAmerica, compact ? 0.9 : 1.5, g, "any");
          ctx.globalAlpha = 1;
        }
      }

      ctx.lineCap = "round";
      for (const route of ROUTES) {
        const highlighted = route.from === active || route.to === active;
        ctx.strokeStyle = route.remote ? MUTED : ACCENT_SECONDARY;
        ctx.lineWidth = route.remote ? 1.2 : highlighted ? 2.2 : 1.5;
        ctx.setLineDash(route.remote ? [2, 4] : []);
        tracePath(route.points, g, f);
        ctx.setLineDash([]);
      }

      const car = hideMovers ? null : carPosition(clock);
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = lerp(0.9, 1.5, zt);
      ctx.setLineDash([3, 4]);
      ctx.globalAlpha = 0.7;
      tracePath(ROAD_POINTS, g, f);
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      for (const city of roadTrip) {
        if (NOT_LABELED.has(city.city)) continue;
        const p = project(city.lat, city.lng, 0, g);
        if (!p.front && f < 0.5) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, lerp(1.9, 3.2, zt), 0, Math.PI * 2);
        ctx.fillStyle = ACCENT;
        ctx.fill();
        ctx.strokeStyle = BACKGROUND;
        ctx.lineWidth = 1;
        ctx.stroke();
        const here = car?.parkedAt === city.city;
        if ((zt > 0.4 && !compact) || (f > 0.5 && here)) {
          label(
            city.city,
            p.x,
            p.y - 8,
            here ? ACCENT : MUTED,
            `${here ? "600 " : ""}9.5px ${monoFont}, monospace`,
          );
        }
      }

      if (car) {
        const a = project(car.a.lat, car.a.lng, 0, g);
        const b = project(car.b.lat, car.b.lng, 0, g);
        if (a.front || f > 0.5) {
          const k = lerp(lerp(0.8, 0.95, f), 1.45, zt);
          ctx.save();
          ctx.translate(lerp(a.x, b.x, car.u), lerp(a.y, b.y, car.u));
          ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
          ctx.scale(k, k);
          ctx.strokeStyle = BACKGROUND;
          ctx.lineWidth = 2;
          ctx.stroke(carPath);
          ctx.fillStyle = FOREGROUND;
          ctx.fill(carPath);
          ctx.fillStyle = BACKGROUND;
          ctx.fillRect(1.8, -2, 1.5, 4);
          ctx.fillRect(-4.6, -1.8, 1, 3.6);
          ctx.restore();
        }
      }

      if (!hideMovers) {
        let t = clock % FLIGHT_CYCLE;
        for (const flight of FLIGHTS) {
          if (t < flight.ms) {
            const pts = flight.route.points;
            const n = ease(t / flight.ms) * (pts.length - 1.001);
            const i = Math.floor(n);
            const a = project(pts[i].lat, pts[i].lng, pts[i].alt, g);
            const b = project(pts[i + 1].lat, pts[i + 1].lng, pts[i + 1].alt, g);
            if (a.front || f > 0.5) {
              const u = n - i;
              ctx.save();
              ctx.translate(lerp(a.x, b.x, u), lerp(a.y, b.y, u));
              ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x));
              ctx.strokeStyle = BACKGROUND;
              ctx.lineWidth = 1.4;
              ctx.stroke(planePath);
              ctx.fillStyle = FOREGROUND;
              ctx.fill(planePath);
              ctx.restore();
            }
            break;
          }
          t -= flight.ms;
          if (t < flight.pause) break;
          t -= flight.pause;
        }
      }

      for (const stop of journeyStops) {
        const p = project(stop.lat, stop.lng, 0, g);
        if (!p.front && f < 0.5) continue;
        const isActive = stop.id === active;
        if (isActive && !hideMovers) {
          const k = (clock % 2200) / 2200;
          ctx.globalAlpha = (1 - k) * 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6 + k * 17, 0, Math.PI * 2);
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, isActive ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = stop.remote ? BACKGROUND : isActive ? ACCENT : ACCENT_SECONDARY;
        ctx.fill();
        if (stop.remote) {
          ctx.strokeStyle = isActive ? ACCENT : MUTED;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        label(
          stop.city.toUpperCase(),
          p.x,
          stop.remote ? p.y + 17 : p.y - 11,
          isActive ? ACCENT : FOREGROUND,
          `600 ${compact ? 9 : 10}px ${monoFont}, monospace`,
        );
      }
    };

    const step = (now: number) => {
      if (disposed) return;
      if (!visible) {
        running = false;
        return;
      }
      const { activeId: active, reducedMotion: reduced, paused: isPaused, tourEnabled: touring } = propsRef.current;
      const still = reduced || isPaused;
      const dt = Math.min(64, now - (lastFrame || now));
      lastFrame = now;
      if (!still) clock += dt;

      e.flatness += (e.flatTarget - e.flatness) * damp(0.055, dt);
      if (Math.abs(e.flatTarget - e.flatness) < 0.001) e.flatness = e.flatTarget;
      e.zoom += (e.zoomTarget - e.zoom) * damp(0.05, dt);
      if (Math.abs(e.zoomTarget - e.zoom) < 0.001) e.zoom = e.zoomTarget;

      let phiDelta = 0;
      if (!drag) {
        phiDelta = e.phiTarget - e.phi;
        while (phiDelta > Math.PI) phiDelta -= Math.PI * 2;
        while (phiDelta < -Math.PI) phiDelta += Math.PI * 2;
        e.phi += phiDelta * damp(0.035, dt);
        e.theta += (e.thetaTarget - e.theta) * damp(0.035, dt);

        const tourIdle =
          now - e.lastUserInput > TOUR_RESUME_MS && now - e.lastTourStep > TOUR_HOLD_MS;
        if (touring && !still && !e.hovering && e.flatTarget === 0 && tourIdle) {
          const i = journeyStops.findIndex((s) => s.id === active);
          e.lastTourStep = now;
          onSelectRef.current(journeyStops[(i + 1) % journeyStops.length].id, "tour");
        }
      }

      draw();

      const settled =
        !drag &&
        e.flatness === e.flatTarget &&
        e.zoom === e.zoomTarget &&
        Math.abs(phiDelta) < 0.002 &&
        Math.abs(e.thetaTarget - e.theta) < 0.002;
      if (still && settled) {
        running = false;
        lastFrame = 0;
        return;
      }
      requestAnimationFrame(step);
    };

    const kick = () => {
      if (!running && visible && !disposed) {
        running = true;
        lastFrame = 0;
        requestAnimationFrame(step);
      }
    };
    kickRef.current = kick;

    const nearestStop = (clientX: number, clientY: number) => {
      const box = canvas.getBoundingClientRect();
      const g = layout();
      const f = ease(e.flatness);
      let best: (typeof journeyStops)[number] | null = null;
      let bestDistance = 24;
      for (const stop of journeyStops) {
        const p = project(stop.lat, stop.lng, 0, g);
        if (!p.front && f < 0.5) continue;
        const d = Math.hypot(p.x - (clientX - box.left), p.y - (clientY - box.top));
        if (d < bestDistance) {
          bestDistance = d;
          best = stop;
        }
      }
      return best;
    };

    const onPointerDown = (ev: PointerEvent) => {
      pressed = true;
      moved = 0;
      if (e.flatTarget === 0) {
        drag = { x: ev.clientX, y: ev.clientY, phi: e.phi, theta: e.theta };
        canvas.setPointerCapture(ev.pointerId);
      }
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (drag) {
        const dx = ev.clientX - drag.x;
        const dy = ev.clientY - drag.y;
        moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
        e.phi = drag.phi + dx * 0.006;
        e.theta = Math.max(-0.9, Math.min(0.9, drag.theta + dy * 0.004));
        e.phiTarget = e.phi;
        e.thetaTarget = e.theta;
        e.lastUserInput = performance.now();
        canvas.style.cursor = "grabbing";
        kick();
        return;
      }
      const overStop = nearestStop(ev.clientX, ev.clientY);
      canvas.style.cursor = overStop ? "pointer" : e.flatTarget === 0 ? "grab" : "default";
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      drag = null;
      if (moved >= 6) return;
      const stop = nearestStop(ev.clientX, ev.clientY);
      if (stop) {
        e.lastUserInput = performance.now();
        e.phiTarget = -stop.lng * RAD;
        e.thetaTarget = stop.lat * RAD * 0.45;
        onSelectRef.current(stop.id, "user");
        kick();
      }
    };

    const onPointerCancel = () => {
      pressed = false;
      drag = null;
    };
    const onPointerEnter = () => {
      e.hovering = true;
    };
    const onPointerLeave = () => {
      e.hovering = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      measure();
      kick();
    });
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    visibilityObserver.observe(canvas);

    measure();
    e.lastTourStep = performance.now();
    kick();

    import("@/lib/land-dots.json").then((module) => {
      dots = module.default;
      kick();
    });

    return () => {
      disposed = true;
      kickRef.current = () => {};
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Map of Naman's path from Noida through London to New York, with remote work in Singapore. The same stops are listed as boarding passes on this page."
      className="block w-full h-full"
      style={{ touchAction: "pan-y" }}
    />
  );
}
