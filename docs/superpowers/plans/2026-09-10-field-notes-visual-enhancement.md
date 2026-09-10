# Field Notes — Visual Enhancement Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual density and pacing to the shipped Engineering Field Notes site — a dimensional Hero globe, a homepage/deep-dive split for Prism, a real Medical CV schematic, a regrouped Faculty Ops functional index, and typographic polish to Research/About/Contact — without touching the palette, IA, or any verified fact.

**Architecture:** Same Next.js 16 App Router site, no backend. One new route (`/work/prism`) splits Prism's existing single component into a compact homepage preview and a full deep-dive page, sharing the same `data.ts` entry. One new npm dependency (`cobe`) powers a lazy-loaded, client-only Hero globe. Three new hand-built SVG diagram components follow the exact node/group primitive conventions already established (`ArchitectureDiagram.tsx`, `diagram-tokens.ts`) — one gets a small, additive extension (dashed/muted node styling) rather than a new primitive. Every other change is a scoped edit to an existing component.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind CSS v4 / Framer Motion / `cobe` (new). No test framework — verification is `npx tsc --noEmit`, `npm run build`, and manual/live-browser checks, per this repo's established pattern.

**Spec:** `docs/superpowers/specs/2026-09-10-field-notes-visual-enhancement-design.md`

## Global Constraints

- Palette, typography, and IA are unchanged — see the spec's "Preserve" section. Every new/modified file uses the existing Tailwind token classes (`bg-background`, `text-foreground`, `text-muted`, `text-accent`, `text-accent-secondary`, `border-border`, `bg-surface`) and, inside raw SVG, the existing `src/lib/diagram-tokens.ts` hex constants — never new hardcoded hex, never `font-serif`.
- **Figure numbering is authoritative per the spec's table**: Prism `FIG. 01A` (homepage compact diagram) / `FIG. 01B` (full diagram, `/work/prism`) / `FIG. 02` (infra) / `FIG. 03–07` (5 screenshots, unchanged). Medical CV collapses to one `FIG. 08`. Faculty Ops stays `FIG. 09`. Airspace stays `FIG. 10`. **The homepage's `dashboard-overview.png` screenshot renders with no figure number at all** — it is the same asset as `FIG. 03`, shown unnumbered only in the homepage preview context so `FIG. 03` never appears on screen before `FIG. 01A`.
- **`prefers-reduced-motion` for the globe is judged by what's visually perceptible**, not by whether `cobe`'s internal render loop executes. A single unmoving frame is correct even if `onRender` keeps firing — pin `state.phi`, don't fight the library's own loop.
- **The 97.15% research callout must trace to the publication's own stored description text** ("The AI model interpreting user input reached 97.15% accuracy on held-out test data") — not an invented paraphrase.
- Every verified fact, number, and framing that already exists on the live site stays exactly as it is — this plan reorders and re-presents, it does not re-derive. The one real content correction (Faculty Ops's `ami` grouping and `chatbot`'s planned status) is already reflected in the data this plan writes; no task should second-guess it.
- **No test framework in this repo.** Each task's verification is: (a) `npx tsc --noEmit` passes, (b) `npm run dev` and a specific manual/browser check, and the final task additionally runs `npm run build`. Tasks that add or change SVG diagram coordinates should be visually spot-checked (a screenshot or DOM inspection) since exact pixel values in this plan are a reasonable starting point, not guaranteed-final — matching how this project's prior diagram work (Faculty Ops, Airspace) was handled.
- **Do not run `git push`.** Commit locally after each task; this branch (`worktree-field-notes-visual-enhancement`) should not reach `origin/main` until the user has reviewed it.
- This plan does not touch Experience, the command palette's section list, Navbar, or any already-shipped Cycle 1/Cycle 2 component not explicitly named in a task below.

---

### Task 1: Data model additions

**Files:**
- Modify: `src/lib/data.ts`

**Interfaces:**
- Produces: `hero.globeCities: { label: string; lat: number; lng: number }[]`, `personalInfo.photo: string | undefined`, updated `awayFromKeyboard` string, `Publication.highlighted?: boolean` (set `true` on exactly one entry), Prism's `figures` array split into `FIG. 01A`/`FIG. 01B` (from the single prior `FIG. 01`), Medical CV's `figures` array collapsed to one `FIG. 08` diagram entry, Faculty Ops's `FIG. 09` figure caption updated — consumed by Tasks 2–10.

- [ ] **Step 1: Add `globeCities` to the `hero` object**

In `src/lib/data.ts`, find the `hero` export (near the end of the file) and add a new field:

```ts
export const hero = {
  metaTop: ["N / 2026", "BROOKLYN, NEW YORK"],
  statement: ["I build AI systems", "that operate on", "real-world data."],
  supporting:
    "Software engineer working across AI infrastructure, computer vision, and data-intensive systems.",
  metaSecondary: ["MS Computer Science · NYU Tandon", "New York"],
  globeCities: [
    { label: "Brooklyn, NY", lat: 40.6782, lng: -73.9442 },
    { label: "London", lat: 51.5074, lng: -0.1278 },
    { label: "New Delhi", lat: 28.6139, lng: 77.209 },
  ],
  now: {
    label: "NOW",
    title: "Computer Vision Research",
    detail: "NYU FAMS Lab",
  },
  recently: {
    label: "RECENTLY",
    title: "Built Prism",
    detail: "LLM Gateway & Control Plane",
  },
};
```

(Only the `globeCities` field is new — everything else in this object is unchanged, shown here so you can see exactly where it goes.) Brooklyn is first in the array deliberately — it's the default/primary spotlight city per the spec.

- [ ] **Step 2: Add `photo` to `personalInfo`**

Find the `personalInfo` export at the top of the file. Add one new field, currently unset:

```ts
export const personalInfo = {
  name: "Naman Tyagi",
  title: "AI/ML Engineer",
  roles: [
    "AI/ML Engineer",
    "Full-Stack Developer",
    "Cloud Architect",
    "Big Data Engineer",
  ],
  email: "namantyagi2727@gmail.com",
  phone: "+1 (929) 605-9520",
  location: "Brooklyn, NY",
  github: "https://github.com/Namantyagi2727",
  linkedin: "https://www.linkedin.com/in/naman-tyagi-nt2727",
  scholar: "https://scholar.google.com/citations?hl=en&user=JNOaY9YAAAAJ",
  bio: "AI/ML engineer with an MS in Computer Science from NYU Tandon building production LLM applications, RAG pipelines, and agentic AI systems. Published researcher with IEEE (2024), Wiley (2025), Cambridge Scholars Publishing (2025), and Human Behavior and Emerging Technologies (2026). 6+ internships across AI, cloud, and enterprise software — I bring ideas from research to production.",
  photo: undefined as string | undefined,
};
```

The `as string | undefined` cast is deliberate — it makes TypeScript infer the field as optional-typed even though the runtime value is `undefined` today, so `About.tsx` (Task 9) can type-check `personalInfo.photo &&` without a "property doesn't exist" error, and a real path can be dropped in later with no type change.

- [ ] **Step 3: Restore "gaming" to `awayFromKeyboard`**

Replace:

```ts
export const awayFromKeyboard =
  "F1 on race weekends, badminton and tennis, the gym, chess, always hunting for a new restaurant, and planning the next trip.";
```

with:

```ts
export const awayFromKeyboard =
  "F1 on race weekends, badminton and tennis, the gym, gaming, chess, always hunting for a new restaurant, and planning the next trip.";
```

(Restores a real fact dropped during Cycle 2's condensing — the original pre-Cycle-2 side-quest was "Console + Chess Strategist" — not a new invention.)

- [ ] **Step 4: Add `highlighted` to the `Publication` type and set it on the Wiley entry**

Change the type:

```ts
export type Publication = {
  type: "book" | "journal" | "conference";
  title: string;
  publisher: string;
  date: string;
  description: string;
  url?: string;
  highlight?: string;
  authors?: string;
  doi?: string;
  highlighted?: boolean;
};
```

Then add `highlighted: true` to exactly the first entry in `publications` (the Wiley / *Human Behavior and Emerging Technologies* journal article — title starts "A Pilot Study of a Gamified CBT-Based..."):

```ts
  {
    type: "journal",
    title: "A Pilot Study of a Gamified CBT-Based Digital Approach for Body Image Distress and Appearance-Related Concerns",
    publisher: "Human Behavior and Emerging Technologies (Wiley/Hindawi)",
    date: "Published July 2026",
    description:
      "Co-developed a pilot-scale serious game integrating CBT techniques with AI-driven analysis to support body image distress and appearance-related concerns. The AI model interpreting user input reached 97.15% accuracy on held-out test data, outperforming a BERT-based baseline, with preliminary results pointing to gamified digital interventions as a scalable, accessible complement to traditional CBT.",
    url: "https://doi.org/10.1155/hbe2/8902875",
    highlight: "97.15% Model Accuracy",
    authors: "Anushka Singh (Amity) · Naman Tyagi (Amity) · Fahad Eqbal (Amity) · Dolly Sharma (Amity) · Aikaterini Bourazeri (Essex, Corresponding Author)",
    doi: "10.1155/hbe2/8902875",
    highlighted: true,
  },
```

Do not add `highlighted` to any of the other three entries.

- [ ] **Step 5: Split Prism's `FIG. 01` into `FIG. 01A` and `FIG. 01B`**

In the `prism` entry's `figures` array, replace:

```ts
      {
        id: "FIG. 01",
        caption: "Request flow — auth, guardrails, cache, provider routing with fallback",
        kind: "diagram",
      },
```

with two entries:

```ts
      {
        id: "FIG. 01A",
        caption:
          "Nominal request path — the default straight-through flow. Cache-hit bypass and failure-retry paths are not shown here; see the complete flow for those.",
        kind: "diagram",
      },
      {
        id: "FIG. 01B",
        caption: "Complete request flow — auth, guardrails, cache, provider routing with fallback",
        kind: "diagram",
      },
```

Leave `FIG. 02` through `FIG. 07` in that same array exactly as they are — only the old single `FIG. 01` entry changes, into these two.

- [ ] **Step 6: Collapse Medical CV's three placeholder figures into one real schematic figure**

In the `medical-cv` entry, replace:

```ts
    figures: [
      { id: "FIG. 08A", caption: "Raw endoscopic feed", kind: "placeholder" },
      { id: "FIG. 08B", caption: "Detection overlay", kind: "placeholder" },
      { id: "FIG. 08C", caption: "Segmentation mask", kind: "placeholder" },
    ],
```

with:

```ts
    figures: [
      { id: "FIG. 08", caption: "Experimental pipeline", kind: "diagram" },
    ],
```

- [ ] **Step 7: Update Faculty Ops's figure caption to "Functional index" language**

In the `faculty-ops` entry, replace:

```ts
    figures: [
      { id: "FIG. 09", caption: "Module map — the 12 Django apps that make up the platform", kind: "diagram" },
    ],
```

with:

```ts
    figures: [
      {
        id: "FIG. 09",
        caption:
          "Functional index — 12 Django apps grouped by function for presentation; not a dependency graph.",
        kind: "diagram",
      },
    ],
```

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit` from the repo root.
Expected: **errors** — this is expected and correct at this point. `PrismCaseStudy.tsx`'s existing code does `const [flowFigure, infraFigure] = diagramFigures;` where `diagramFigures = figures.filter(f => f.kind === "diagram")`, which now has 3 entries (01A, 01B, 02) instead of 2, silently picking the wrong two. `MedicalVisionCaseStudy.tsx` indexes `figures[VIEWS.indexOf(active)]` into an array that's now length 1 instead of 3. `FacultyOpsModuleMap`'s consumer is unaffected (caption text only changed). These consumers are rewritten in Tasks 5 and 6 respectively — do not try to fix them in this task; if `tsc` reports errors in exactly `PrismCaseStudy.tsx` and/or `MedicalVisionCaseStudy.tsx` and nowhere else, that confirms this task's data changes are correctly scoped and ready for the tasks that fix their consumers. If `tsc` reports an error anywhere else, stop and report it.

- [ ] **Step 9: Commit**

```bash
git add src/lib/data.ts
git commit -m "$(cat <<'EOF'
feat: add data model for Hero globe, Prism split, and content polish

Adds hero.globeCities (3 verified locations, Brooklyn first/default)
and personalInfo.photo (optional, unset) for upcoming components.
Restores "gaming" to awayFromKeyboard, dropped during Cycle 2's
condensing. Adds Publication.highlighted, set on the Wiley/HBE entry
only. Splits Prism's FIG. 01 into FIG. 01A (new compact homepage
diagram) and FIG. 01B (the existing full diagram, relabeled).
Collapses Medical CV's three placeholder figures into one real FIG. 08
schematic entry. Updates Faculty Ops's FIG. 09 caption to explicit
"Functional index... not a dependency graph" language.

This intentionally breaks PrismCaseStudy.tsx and
MedicalVisionCaseStudy.tsx's figure lookups until Tasks 5 and 6
rewrite those consumers.
EOF
)"
```

---

### Task 2: `cobe` dependency + `HeroGlobe.tsx`

**Files:**
- Modify: `package.json` (add `cobe`)
- Create: `src/components/HeroGlobe.tsx`

**Interfaces:**
- Consumes: `hero.globeCities` from `src/lib/data.ts` (Task 1).
- Produces: `HeroGlobe` default export, a self-contained client component with no props — consumed by Task 3.

- [ ] **Step 1: Install `cobe`**

```bash
npm install cobe
```

- [ ] **Step 2: Write `src/components/HeroGlobe.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useReducedMotion } from "framer-motion";
import { hero } from "@/lib/data";

// Deliberate tradeoff, documented in the design spec: cobe renders landmass
// as a dot-matrix texture, not vector line borders. Tuned here as a fine
// stippled technical texture (low mapSamples, muted base, no glow) rather
// than the neon/glow/dark-globe config this codebase used before.
const BACKGROUND = "#F6F5F0"; // page bg — glowColor is matched to this so the glow blends away, not the globe's own surface tone
const SURFACE = "#ECEAE4";
const ACCENT = "#355C8A";

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

function formatCoord(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir} ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

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

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 500,
      height: 500,
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
      onRender: (state) => {
        // Reduced motion: pin phi to the default city every frame. cobe's own
        // render loop may still fire (it needs at least one pass to paint),
        // but nothing visibly moves — that's the actual requirement, not
        // whether this callback executes. See spec's reduced-motion note.
        if (shouldReduceMotion) {
          state.phi = CITIES[0].phi;
          state.width = canvas.offsetWidth * 2;
          state.height = canvas.offsetHeight * 2;
          return;
        }

        const interacting = pointerInteracting.current !== null;

        if (interacting) {
          state.phi = phiRef.current + pointerInteractionMovement.current;
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

          state.phi = phiRef.current;
        }

        state.width = canvas.offsetWidth * 2;
        state.height = canvas.offsetHeight * 2;
      },
    });

    return () => globe.destroy();
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
          e.currentTarget.style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          pointerInteracting.current = null;
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
          style={{ width: "100%", height: "100%", contain: "layout paint size" }}
        />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted text-center">
        {city.label} — {formatCoord(city.lat, city.lng)}
      </p>
    </div>
  );
}
```

Note: pointer-drag interaction is disabled when `shouldReduceMotion` is true (the `cursor: "grab"` and drag handlers become inert via the early return in the `onPointerDown` handler and the static cursor style) — dragging would itself be motion, so it's correctly excluded from the "no motion" guarantee.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`.
Expected: no new errors from this file (the pre-existing `PrismCaseStudy.tsx`/`MedicalVisionCaseStudy.tsx` errors from Task 1 are still expected and unrelated). If `cobe`'s shipped types don't match the config shape used above (e.g. `markers`' location tuple type, or `onRender`'s `state` type), adjust to match the actually-installed version's types — don't suppress with `any`.

This component has no consumer yet (Task 3 wires it into `Hero.tsx`), so there's no visual check to run in isolation — confirm only that it compiles.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/components/HeroGlobe.tsx
git commit -m "$(cat <<'EOF'
feat: add HeroGlobe — restrained cobe-based globe component

New dependency: cobe (~5KB). Self-contained client component: muted
stone base, no glow, no flight arcs, 3 verified city markers
(Brooklyn/London/New Delhi), a slow calm spotlight cycle defaulting to
Brooklyn, optional drag-to-rotate, and a fixed coordinate/city label
panel below the canvas. prefers-reduced-motion pins the globe to one
static orientation and disables drag — judged by what's visually
perceptible, not by whether cobe's internal render loop executes.

Not yet wired into Hero.tsx — that's the next task.
EOF
)"
```

---

### Task 3: `Hero.tsx` two-column layout

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `HeroGlobe` (Task 2), lazy-loaded via `next/dynamic`.

- [ ] **Step 1: Replace `src/components/Hero.tsx` in full**

This is the complete current file with exactly three changes: the `dynamic` import + `HeroGlobe` lazy-load added, the `<section>`'s className (drops `min-h-screen`/`flex items-center`), and the top-level `motion.div` restructured into a two-column grid with all the existing content wrapped in one new plain `<div>` and `<HeroGlobe />` added as a sibling after it. Every `motion.*` block's `variants`/content/copy below is otherwise byte-for-byte identical to the current file — including the reduced-motion `itemVariants` fix from the prior session, untouched.

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
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
    <section id="hero" className="px-6 pt-32 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto w-full grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 lg:items-center"
      >
        <div>
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
              href={`mailto:${personalInfo.email}`}
              className="text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              Email ↗
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
        </div>

        <div className="w-[180px] sm:w-[240px] lg:w-[460px] mx-auto lg:mx-0">
          <HeroGlobe />
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`.
Expected: no new errors (the Task-1-introduced errors in `PrismCaseStudy.tsx`/`MedicalVisionCaseStudy.tsx` are still expected and unrelated to this file).

Run: `npm run dev`, open `http://localhost:3000`, and check:
- **1440px+:** Hero is two columns — text/links on the left, the globe (~460px) on the right. The globe slowly rotates and, after several seconds, holds and shows a coordinate label (starts on Brooklyn). Selected Work's "Selected Work" heading is visible without scrolling, or very close to the fold.
- **768–1023px (below `lg:`):** single column — all left-column content first, then the globe at ~240px, still above Selected Work in DOM order (confirm via scrolling, not by inspecting source — the visual order is what matters).
- **375–430px:** globe renders at ~180px, below the CTAs. If it looks cramped, awkward, or meaningfully hurts pacing at this specific range, apply the spec's defined escape hatch: shrink further toward ~180px (already close to the floor here — if 180px genuinely doesn't work, the next step is hiding it only at this range, e.g. via an additional `hidden min-[431px]:block` variant on the wrapping div, not below 768px generally). Record whichever choice you make and why.
- **Reduced-motion (`prefers-reduced-motion: reduce`):** globe shows one static orientation with no rotation, no city cycling, no drag response. Hero's existing text entrance behavior (already fixed in an earlier session — no `opacity: 0` in the SSR HTML) is unaffected — confirm by viewing page source or a no-JS check that the left column's content is still present and readable.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "$(cat <<'EOF'
feat: two-column Hero layout with the globe, reduced height

Wires HeroGlobe in via next/dynamic({ssr:false}) — the same lazy-load
pattern this codebase already used for the old JourneyMap. Restructures
Hero into a grid: existing left-column content unchanged, globe as a
new right column at lg: and above, rendering below the content in
normal DOM order (not hidden) at smaller sizes down to 375px. Drops
min-h-screen (and the flex-items-center that existed only to center
content within it), so the section's height now follows its content
and Selected Work begins to enter the viewport at a typical
1440x900-1000 load.
EOF
)"
```

---

### Task 4: `Figure.tsx` `showCaption` prop + `PrismFlowDiagramCompact.tsx`

**Files:**
- Modify: `src/components/Figure.tsx`
- Create: `src/components/PrismFlowDiagramCompact.tsx`

**Interfaces:**
- Produces: `Figure`'s new optional `showCaption?: boolean` prop (default `true`, fully backward-compatible with every existing call site). Produces `PrismFlowDiagramCompact` default export, no props — consumed by Task 5.

- [ ] **Step 1: Add `showCaption` to `Figure.tsx`**

Change:

```tsx
type FigureProps = {
  figure: FigureData;
  children?: React.ReactNode;
};

export default function Figure({ figure, children }: FigureProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="border border-border bg-surface rounded-sm overflow-hidden">
        {figure.kind === "screenshot" && figure.src ? (
          <Image
            src={figure.src}
            alt={figure.caption}
            width={2906}
            height={1652}
            sizes="(min-width: 1072px) 496px, (min-width: 640px) calc(50vw - 40px), calc(100vw - 48px)"
            className="w-full h-auto"
          />
        ) : figure.kind === "placeholder" ? (
          <div className="aspect-video flex items-center justify-center border border-dashed border-border-strong text-muted text-sm font-mono p-6 text-center">
            {figure.caption} — asset pending
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="flex items-baseline gap-2 text-xs font-mono">
        <span className="text-accent-secondary uppercase tracking-widest">{figure.id}</span>
        <span className="text-muted">{figure.caption}</span>
      </figcaption>
    </figure>
  );
}
```

to:

```tsx
type FigureProps = {
  figure: FigureData;
  children?: React.ReactNode;
  showCaption?: boolean;
};

export default function Figure({ figure, children, showCaption = true }: FigureProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="border border-border bg-surface rounded-sm overflow-hidden">
        {figure.kind === "screenshot" && figure.src ? (
          <Image
            src={figure.src}
            alt={figure.caption}
            width={2906}
            height={1652}
            sizes="(min-width: 1072px) 496px, (min-width: 640px) calc(50vw - 40px), calc(100vw - 48px)"
            className="w-full h-auto"
          />
        ) : figure.kind === "placeholder" ? (
          <div className="aspect-video flex items-center justify-center border border-dashed border-border-strong text-muted text-sm font-mono p-6 text-center">
            {figure.caption} — asset pending
          </div>
        ) : (
          children
        )}
      </div>
      {showCaption && (
        <figcaption className="flex items-baseline gap-2 text-xs font-mono">
          <span className="text-accent-secondary uppercase tracking-widest">{figure.id}</span>
          <span className="text-muted">{figure.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
```

Every existing call site (`PrismCaseStudy.tsx`, `MedicalVisionCaseStudy.tsx`, `FacultyOpsCaseStudy.tsx`, `AirspaceCaseStudy.tsx`, `OtherProjects.tsx` — wait, `OtherProjects.tsx` doesn't use `Figure`, ignore) continues to work unchanged since the new prop defaults to `true`.

- [ ] **Step 2: Write `src/components/PrismFlowDiagramCompact.tsx`**

Same 9 real pipeline stages as the existing `PrismFlowDiagram.tsx`, non-interactive, straight-through nominal path only (no cache-hit bypass, no failure-retry curve — those are the exact things `FIG. 01A`'s caption, written in Task 1, already tells the reader aren't shown here).

```tsx
import { ACCENT, SURFACE, BORDER_STRONG, FOREGROUND } from "@/lib/diagram-tokens";

const NODE_W = 190;
const NODE_H = 26;

const NODES = [
  { label: "Client", y: 20 },
  { label: "Auth", y: 66 },
  { label: "Guardrail", y: 112 },
  { label: "Cache lookup", y: 158 },
  { label: "Router + breaker", y: 204 },
  { label: "Provider", y: 250 },
  { label: "Cost calc + log", y: 296 },
  { label: "Cache write", y: 342 },
  { label: "Response", y: 380 },
];

export default function PrismFlowDiagramCompact() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg
        viewBox="0 0 320 400"
        className="w-full h-auto"
        role="img"
        aria-label="Prism nominal request path — Client, Auth, Guardrail, Cache lookup, Router, Provider, Cost log, Cache write, Response. This shows the default straight-through path only; it does not show the cache-hit bypass or failure-retry paths, which exist elsewhere in the system — see the complete request flow for those."
      >
        {NODES.slice(0, -1).map((n, i) => {
          const next = NODES[i + 1];
          return (
            <line
              key={n.label}
              x1={160}
              y1={n.y + NODE_H / 2}
              x2={160}
              y2={next.y - NODE_H / 2}
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          );
        })}
        {NODES.map((n) => (
          <g key={n.label} transform={`translate(160, ${n.y})`}>
            <rect
              x={-NODE_W / 2}
              y={-NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={5}
              fill={SURFACE}
              stroke={BORDER_STRONG}
              strokeWidth={1}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fontFamily="var(--font-geist-mono)"
              fill={FOREGROUND}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
```

The `max-w-sm` wrapper (not `w-full` filling the whole content column) is the actual fix for the homepage's "~1500px" problem — a `viewBox="0 0 320 400"` SVG rendered at `max-w-sm`'s ~384px width comes out around 480px tall, comfortably inside the 500–700px budget, at any screen size, with no horizontal scroll ever needed since it's one column regardless of viewport width.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`.
Expected: no new errors.

No consumer yet for `PrismFlowDiagramCompact` (Task 5 wires it in) — confirm only that both files compile. For `Figure.tsx`, since its change is purely additive/backward-compatible, a broader visual check isn't needed here either; Task 5's verification covers the new `showCaption={false}` usage.

- [ ] **Step 4: Commit**

```bash
git add src/components/Figure.tsx src/components/PrismFlowDiagramCompact.tsx
git commit -m "$(cat <<'EOF'
feat: add Figure showCaption prop and PrismFlowDiagramCompact

Figure gains an optional showCaption (default true) so a figure can
be shown without its FIG. NN caption row — needed for Task 5's
unnumbered homepage screenshot. Fully backward-compatible; every
existing call site is unaffected.

PrismFlowDiagramCompact draws the same 9 real Prism pipeline stages as
the existing interactive diagram, but non-interactive and showing only
the nominal straight-through path (no cache-hit bypass, no
failure-retry curve) in a width-capped single column, so it renders
short (~480px) at any screen width instead of scaling to the full
content column.
EOF
)"
```

---

### Task 5: Prism split — `PrismPreview.tsx`, `PrismDetail.tsx`, `/work/prism` route

**Files:**
- Delete: `src/components/PrismCaseStudy.tsx`
- Create: `src/components/PrismPreview.tsx`
- Create: `src/components/PrismDetail.tsx`
- Create: `src/app/work/prism/page.tsx`
- Modify: `src/components/SelectedWork.tsx`

**Interfaces:**
- Consumes: `Figure` (`showCaption` from Task 4), `PrismFlowDiagramCompact` (Task 4), existing `PrismFlowDiagram`/`PrismInfraDiagram`/`ProjectMetric`/`SectionLabel`, the Task-1-updated `caseStudies[0].figures` array (`FIG. 01A`/`01B`/`02`–`07`).
- Produces: `PrismPreview` default export (replaces `PrismCaseStudy` in `SelectedWork.tsx`), `PrismDetail` default export (rendered only by the new route).

- [ ] **Step 1: Delete `src/components/PrismCaseStudy.tsx`**

```bash
git rm src/components/PrismCaseStudy.tsx
```

- [ ] **Step 2: Write `src/components/PrismPreview.tsx`**

```tsx
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import PrismFlowDiagramCompact from "./PrismFlowDiagramCompact";

const prism = caseStudies.find((c) => c.slug === "prism")!;
const overviewFigure = prism.figures?.find((f) => f.id === "FIG. 03");
const nominalFlowFigure = prism.figures?.find((f) => f.id === "FIG. 01A");

// Preview shows exactly these 3 headline metrics, in this order, with their
// exact verified contexts intact — see the spec's "Preview metrics" section.
const PREVIEW_METRIC_VALUES = ["245–259 req/s", "p50 ~25ms / p95 ~80ms", "0.00%"];
const previewMetrics = PREVIEW_METRIC_VALUES.map(
  (value) => prism.metrics?.find((m) => m.value === value)
).filter((m): m is NonNullable<typeof m> => Boolean(m));

export default function PrismPreview() {
  return (
    <article className="py-12">
      <SectionLabel
        label={`Case Study / ${prism.caseNumber}`}
        meta={`${prism.category} · ${prism.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {prism.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{prism.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{prism.description}</p>

      {overviewFigure && (
        <div className="mb-12">
          <Figure figure={overviewFigure} showCaption={false} />
        </div>
      )}

      {previewMetrics.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
            {previewMetrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      {nominalFlowFigure && (
        <div className="mb-12">
          <Figure figure={nominalFlowFigure}>
            <PrismFlowDiagramCompact />
          </Figure>
        </div>
      )}

      <a
        href="/work/prism"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
      >
        Explore case study
        <ArrowUpRight size={14} />
      </a>
    </article>
  );
}
```

`previewMetrics` is looked up by exact `value` string (not array position) against `prism.metrics`, which is defensive against that array ever being reordered — the same lesson already applied elsewhere in this codebase (kind-based/id-based figure lookups instead of positional ones).

- [ ] **Step 3: Write `src/components/PrismDetail.tsx`**

This is the content the old `PrismCaseStudy.tsx` had, unchanged in substance, with the figure lookups made explicit by `id` (the old file's positional `[flowFigure, infraFigure] = diagramFigures` destructure no longer works now that there are 3 diagram-kind figures, not 2):

```tsx
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import PrismFlowDiagram from "./PrismFlowDiagram";
import PrismInfraDiagram from "./PrismInfraDiagram";

const prism = caseStudies.find((c) => c.slug === "prism")!;
const flowFigure = prism.figures?.find((f) => f.id === "FIG. 01B");
const infraFigure = prism.figures?.find((f) => f.id === "FIG. 02");
const screenshotFigures = prism.figures?.filter((f) => f.kind === "screenshot") ?? [];

export default function PrismDetail() {
  return (
    <article className="py-12">
      <SectionLabel
        label={`Case Study / ${prism.caseNumber}`}
        meta={`${prism.category} · ${prism.year}`}
      />

      <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {prism.title}
      </h1>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{prism.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{prism.description}</p>

      {flowFigure && (
        <div className="mb-12">
          <Figure figure={flowFigure}>
            <PrismFlowDiagram />
          </Figure>
        </div>
      )}

      {infraFigure && (
        <div className="mb-12">
          <Figure figure={infraFigure}>
            <PrismInfraDiagram />
          </Figure>
        </div>
      )}

      {prism.metrics && prism.metrics.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
            Verified benchmark results
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            {prism.metrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-12 max-w-2xl border-l-2 border-accent-secondary pl-5">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-2">
          What broke
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Load testing found a real bug: the rate limiter and exact cache each opened a new Redis
          connection per request instead of reusing a pool. At roughly 300 req/s that meant
          hundreds of new connections a second — Redis started closing them under the churn, and
          the error rate hit 77%. Fixed with one shared module-level Redis client; the failure
          rate dropped to 0% in the same test afterward.
        </p>
      </div>

      {screenshotFigures.length > 0 && (
        <div className="mb-12 grid sm:grid-cols-2 gap-8">
          {screenshotFigures.map((fig) => (
            <Figure key={fig.id} figure={fig} />
          ))}
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{prism.stack.join(" / ")}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        {prism.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors"
          >
            {link.label}
            <ArrowUpRight size={14} />
          </a>
        ))}
      </div>
    </article>
  );
}
```

Note the one deliberate change from the old file: the case-study title now renders as `<h1>` (this page's main heading, since it's a standalone route) instead of `<h3>` (which was correct when nested under the homepage's own `<h2>` "Selected Work").

- [ ] **Step 4: Write `src/app/work/prism/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrismDetail from "@/components/PrismDetail";

export const metadata: Metadata = {
  title: "Prism — Naman Tyagi",
  description:
    "Prism is a self-hosted LLM gateway and control plane — cost visibility, automatic failover, PII/prompt-injection guardrails, exact-match caching, and full observability.",
};

export default function PrismPage() {
  return (
    <main className="px-6 pt-32 pb-20">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Selected Work
        </Link>
        <PrismDetail />
      </div>
    </main>
  );
}
```

`Navbar`/`Footer`/`CommandPalette` are not imported here — they come from the root `src/app/layout.tsx`, which wraps every route automatically, so this page gets them for free.

- [ ] **Step 5: Wire `PrismPreview` into `SelectedWork.tsx`**

Replace:

```tsx
import SectionLabel from "./SectionLabel";
import PrismCaseStudy from "./PrismCaseStudy";
import MedicalVisionCaseStudy from "./MedicalVisionCaseStudy";
```

with:

```tsx
import SectionLabel from "./SectionLabel";
import PrismPreview from "./PrismPreview";
import MedicalVisionCaseStudy from "./MedicalVisionCaseStudy";
```

and replace:

```tsx
        <PrismCaseStudy />
```

with:

```tsx
        <PrismPreview />
```

No other line in this file changes.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit`.
Expected: the `PrismCaseStudy.tsx`-related errors from Task 1 are gone (the file no longer exists). No new errors.

Run: `npm run build`.
Expected: succeeds, and the route table now shows `/work/prism` as a new static route alongside `/`.

Run: `npm run dev`, open `http://localhost:3000`, and check:
- Homepage Prism preview: title → description → the large `dashboard-overview.png` screenshot with **no `FIG.` label visible above/below it** → exactly 3 metrics (throughput, p95@10-concurrent, 0.00%) → the compact diagram labeled `FIG. 01A` → an "Explore case study" link.
- Click "Explore case study" (or visit `http://localhost:3000/work/prism` directly): full page with `← Selected Work` at the top (returns to `/#work`), then the complete benchmark grid (5 metrics), the full interactive `FIG. 01B` diagram (cache/breaker toggles still work exactly as before), `FIG. 02` infra diagram, all 5 screenshots (`FIG. 03`–`FIG. 07`, each with its normal caption), the "What broke" story, stack, and links. Navbar/Footer/⌘K palette are all present and functional on this page too.
- At 375/430/768/1024/1440px, both the homepage preview and `/work/prism` have zero horizontal overflow.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: split Prism into a homepage preview and a /work/prism route

PrismCaseStudy.tsx is deleted, replaced by two components sharing the
same caseStudies[0] data: PrismPreview (homepage — title, description,
the FIG. 03 screenshot shown unnumbered, 3 headline metrics with exact
contexts preserved, the new compact FIG. 01A diagram, an Explore link)
and PrismDetail (the full existing experience — complete benchmarks,
the full interactive FIG. 01B diagram, infra topology, all 5
screenshots, the Redis "what broke" story, stack, links) rendered by
the new src/app/work/prism/page.tsx route with a small "Selected Work"
return link at the top. Figure lookups are now explicit by id rather
than positional, since the figures array now holds 3 diagram-kind
entries instead of 2.
EOF
)"
```

---

### Task 6: Medical CV — `MedicalPipelineSchematic.tsx` + toggle removal

**Files:**
- Create: `src/components/MedicalPipelineSchematic.tsx`
- Modify: `src/components/MedicalVisionCaseStudy.tsx`

**Interfaces:**
- Consumes: the Task-1-updated `medical-cv` entry (one `FIG. 08` diagram figure, not 3 placeholders).
- Produces: `MedicalPipelineSchematic` default export, consumed by the rewritten `MedicalVisionCaseStudy`.

- [ ] **Step 1: Write `src/components/MedicalPipelineSchematic.tsx`**

The real, verified experimental setup as one vertical flow: `CAMERA → SIMULATED KIDNEY (water + model calcium stones) → VIDEO STREAM → CV PIPELINE → STONE DETECTION`.

```tsx
import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

const NODE_W = 230;
const NODE_H = 30;

const STAGES = [
  { label: "CAMERA", y: 20 },
  { label: "SIMULATED KIDNEY", sublabel: "water + model calcium stones", y: 92, h: 44 },
  { label: "VIDEO STREAM", y: 166 },
  { label: "CV PIPELINE", y: 226 },
  { label: "STONE DETECTION", y: 286 },
];

export default function MedicalPipelineSchematic() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg
        viewBox="0 0 290 306"
        className="w-full h-auto"
        role="img"
        aria-label="Experimental pipeline — camera feed through a simulated kidney environment with water and model calcium stones, into a video stream, CV pipeline, and stone detection"
      >
        {STAGES.slice(0, -1).map((s, i) => {
          const next = STAGES[i + 1];
          const fromY = s.y + (s.h ?? NODE_H) / 2;
          const toY = next.y - (next.h ?? NODE_H) / 2;
          return (
            <line
              key={s.label}
              x1={145}
              y1={fromY}
              x2={145}
              y2={toY}
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          );
        })}
        {STAGES.map((s) => {
          const h = s.h ?? NODE_H;
          return (
            <g key={s.label} transform={`translate(145, ${s.y})`}>
              <rect
                x={-NODE_W / 2}
                y={-h / 2}
                width={NODE_W}
                height={h}
                rx={5}
                fill={SURFACE}
                stroke={BORDER_STRONG}
                strokeWidth={1}
              />
              <text
                textAnchor="middle"
                dominantBaseline={s.sublabel ? undefined : "middle"}
                y={s.sublabel ? -4 : 0}
                fontSize={11}
                fontFamily="var(--font-geist-mono)"
                fill={FOREGROUND}
              >
                {s.label}
              </text>
              {s.sublabel && (
                <text textAnchor="middle" y={12} fontSize={8} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                  {s.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/MedicalVisionCaseStudy.tsx`**

Removes the toggle state entirely, adds a `CURRENT FOCUS` list:

```tsx
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import Figure from "./Figure";
import MedicalPipelineSchematic from "./MedicalPipelineSchematic";

const medicalCv = caseStudies.find((c) => c.slug === "medical-cv")!;
const schematicFigure = medicalCv.figures?.find((f) => f.id === "FIG. 08");

const CURRENT_FOCUS = [
  "Continuous video ingestion",
  "Real-time stone identification",
  "CV pipeline development",
];

export default function MedicalVisionCaseStudy() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${medicalCv.caseNumber}`}
        meta={`${medicalCv.category} · ${medicalCv.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {medicalCv.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{medicalCv.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{medicalCv.description}</p>

      {schematicFigure && (
        <div className="mb-12">
          <Figure figure={schematicFigure}>
            <MedicalPipelineSchematic />
          </Figure>
        </div>
      )}

      <div className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Current focus</p>
        <ul className="flex flex-col gap-1.5 max-w-2xl">
          {CURRENT_FOCUS.map((item) => (
            <li key={item} className="text-sm text-muted flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-border-strong flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{medicalCv.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
```

Note this component no longer needs `"use client"` — it has no hooks or event handlers now (the toggle's `useState` is gone), so drop the `"use client"` directive from the top of the file entirely.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors — the Task-1-introduced error in this file (indexing a length-1 array with a 3-item `VIEWS` array) is now fixed by this rewrite.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Medical CV (case study 002), and confirm: no Raw/Detection/Segmentation buttons anywhere, the schematic renders as a clean 5-stage vertical flow captioned `FIG. 08 — Experimental pipeline`, followed by a "Current focus" bulleted list (3 items), then Stack. No accuracy/FPS/model-name/detection-imagery claims anywhere in this section. Check 375/430/768/1024/1440px for zero horizontal overflow.

- [ ] **Step 4: Commit**

```bash
git add src/components/MedicalPipelineSchematic.tsx src/components/MedicalVisionCaseStudy.tsx
git commit -m "$(cat <<'EOF'
feat: replace Medical CV's empty toggle with a real pipeline schematic

Removes the RAW/DETECTION/SEGMENTATION toggle (three
kind:"placeholder" figures, useState tab logic) — it read as
unfinished and conveyed no information. MedicalPipelineSchematic draws
the verified experimental setup as one vertical flow: camera, simulated
kidney (water + model calcium stones), video stream, CV pipeline,
stone detection — FIG. 08, not fabricated imagery, it documents the
real setup. Adds a compact "Current focus" list. No accuracy, FPS,
model-choice, or detection-imagery claims added.
EOF
)"
```

---

### Task 7: Faculty Ops — regrouped functional index

**Files:**
- Modify: `src/components/ArchitectureDiagram.tsx`
- Modify: `src/components/FacultyOpsModuleMap.tsx`

**Interfaces:**
- Produces: `ArchNode.dashed?: boolean` (new optional field — renders a muted, dashed-border node, for not-yet-implemented items; same naming convention as the existing `ArchEdge.dashed`).

- [ ] **Step 1: Add `dashed` support to `ArchitectureDiagram.tsx`**

Change the `ArchNode` type:

```ts
export type ArchNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sublabel?: string;
  dashed?: boolean;
};
```

Change the node-rendering block:

```tsx
          {nodes.map((n) => {
            const w = n.w ?? DEFAULT_NODE_W;
            const h = n.h ?? DEFAULT_NODE_H;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  rx={6}
                  fill={SURFACE}
                  stroke={BORDER_STRONG}
                  strokeWidth={1}
                  strokeDasharray={n.dashed ? "3 3" : undefined}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline={n.sublabel ? undefined : "middle"}
                  y={n.sublabel ? -3 : 0}
                  fontSize={9.5}
                  fontFamily="var(--font-geist-mono)"
                  fill={n.dashed ? MUTED : FOREGROUND}
                >
                  {n.label}
                </text>
                {n.sublabel && (
                  <text textAnchor="middle" y={10} fontSize={7.5} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                    {n.sublabel}
                  </text>
                )}
              </g>
            );
          })}
```

(Only the `rect`'s `strokeDasharray` and the label `text`'s `fill` changed — everything else in this block is identical to before.) `Airspace`'s existing usage of `ArchitectureDiagram` doesn't set `dashed` on any node, so it renders exactly as before — this change is purely additive.

- [ ] **Step 2: Rewrite `src/components/FacultyOpsModuleMap.tsx`**

Regroups the 12 apps into 3 functional groups (not the prior single boundary box), matches the corrected grouping (`ami` is a business-process app, not AI-related; `chatbot` is marked planned per the OFA README):

```tsx
import ArchitectureDiagram, { type ArchNode } from "./ArchitectureDiagram";

const NODES: ArchNode[] = [
  // CORE PLATFORM
  { id: "core", x: 110, y: 70, w: 140, label: "core" },
  { id: "faculty", x: 110, y: 120, w: 140, label: "faculty" },
  { id: "workflows", x: 110, y: 170, w: 140, label: "workflows" },
  // OPERATIONS
  { id: "approvals", x: 310, y: 70, w: 140, label: "approvals" },
  { id: "workload", x: 310, y: 120, w: 140, label: "workload" },
  { id: "tenure_promotion", x: 310, y: 170, w: 140, label: "tenure_promotion" },
  { id: "ami", x: 310, y: 220, w: 140, label: "ami" },
  // SYSTEM SERVICES
  { id: "notifications", x: 510, y: 70, w: 140, label: "notifications" },
  { id: "documents", x: 510, y: 120, w: 140, label: "documents" },
  { id: "audit", x: 510, y: 170, w: 140, label: "audit" },
  { id: "export", x: 510, y: 220, w: 140, label: "export" },
  { id: "chatbot", x: 510, y: 270, w: 140, label: "chatbot (planned)", dashed: true },
];

const GROUPS = [
  { x: 20, y: 30, w: 180, h: 165, label: "CORE PLATFORM" },
  { x: 220, y: 30, w: 180, h: 215, label: "OPERATIONS" },
  { x: 420, y: 30, w: 180, h: 265, label: "SYSTEM SERVICES" },
];

export default function FacultyOpsModuleMap() {
  return (
    <ArchitectureDiagram
      viewBox="0 0 620 320"
      minWidth={560}
      ariaLabel="Faculty Operations Platform functional index — 12 Django apps grouped by function for presentation, not a dependency graph. Chatbot is a planned, not yet implemented, feature."
      nodes={NODES}
      groups={GROUPS}
    />
  );
}
```

`ami` (Annual Merit Increase, a compensation/HR process per the OFA repo's README) sits in OPERATIONS alongside `workload`/`tenure_promotion` — not in any AI/intelligence-themed group. `chatbot` is the one node with `dashed: true`, rendering with a dashed border and muted text (matching `Figure.tsx`'s established "not real yet" visual language) and an explicit "(planned)" suffix in its own label — it still counts in the 12-app total and the SYSTEM SERVICES group, since the Django app genuinely exists in the repo's `INSTALLED_APPS`, it just isn't a completed feature yet.

Still zero edges between nodes or groups — this stays a structural index, not a claimed dependency graph, matching the existing constraint from Cycle 2 (unchanged).

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Faculty Ops (case study 003), and confirm: the `12 / 306 / 29` metrics still render above the diagram, unchanged. The diagram now shows 3 labeled boundary boxes (`CORE PLATFORM`, `OPERATIONS`, `SYSTEM SERVICES`) instead of one large box, with the right app counts in each (3/4/5 = 12 total). `chatbot`'s box has a visibly dashed border and muted (not near-black) label text reading "chatbot (planned)". No lines connect any nodes or groups. The figure's caption (below the diagram) reads the "Functional index... not a dependency graph" text from Task 1. Check 375/430/768/1024/1440px — confirm the diagram's horizontal-scroll container engages at narrow widths rather than squashing the 3-column layout, and that `tenure_promotion`/`notifications` (the longest labels) are still fully readable.

- [ ] **Step 4: Commit**

```bash
git add src/components/ArchitectureDiagram.tsx src/components/FacultyOpsModuleMap.tsx
git commit -m "$(cat <<'EOF'
feat: regroup Faculty Ops module map into a labeled functional index

ArchitectureDiagram gains an optional ArchNode.dashed flag (muted
text, dashed border) for not-yet-implemented items — purely additive,
Airspace's existing usage is unaffected. FacultyOpsModuleMap now draws
3 grouped boxes (CORE PLATFORM / OPERATIONS / SYSTEM SERVICES) instead
of one undivided box around 12 uniform apps, correcting two guesses
made when this diagram was first built: "ami" is Annual Merit Increase
(a business/HR process, not AI-related) and belongs with
workload/tenure_promotion, and "chatbot" is documented in the OFA
README as a planned, not-yet-built feature, now shown dashed/muted
with an explicit "(planned)" label rather than presented as completed
functionality. Still zero edges between nodes -- a structural index,
not a dependency graph, unchanged from the original constraint.
EOF
)"
```

---

### Task 8: Research — highlighted publication treatment

**Files:**
- Modify: `src/components/Research.tsx`

**Interfaces:**
- Consumes: `Publication.highlighted` (Task 1).

- [ ] **Step 1: Add the highlighted treatment**

In `src/components/Research.tsx`, change:

```tsx
              <h3 className="text-base font-medium text-foreground leading-snug mb-1">{pub.title}</h3>
              <p className="text-xs font-mono text-muted mb-3">{pub.publisher}</p>

              {pub.authors && <p className="text-xs text-muted mb-3 leading-relaxed">{pub.authors}</p>}

              <p className="text-sm text-muted leading-relaxed mb-3 max-w-2xl">{pub.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                {pub.highlight && (
                  <span className="text-xs font-mono text-accent-secondary">{pub.highlight}</span>
                )}
                {pub.doi && <p className="text-xs font-mono text-muted">DOI: {pub.doi}</p>}
```

to:

```tsx
              <h3
                className={
                  pub.highlighted
                    ? "text-lg font-semibold text-foreground leading-snug mb-1"
                    : "text-base font-medium text-foreground leading-snug mb-1"
                }
              >
                {pub.title}
              </h3>
              <p className="text-xs font-mono text-muted mb-3">{pub.publisher}</p>

              {pub.authors && <p className="text-xs text-muted mb-3 leading-relaxed">{pub.authors}</p>}

              <p className="text-sm text-muted leading-relaxed mb-3 max-w-2xl">{pub.description}</p>

              {pub.highlighted && (
                <div className="mb-3">
                  <p className="text-2xl font-semibold text-accent leading-none">97.15%</p>
                  <p className="text-xs text-muted mt-1">
                    AI model accuracy interpreting user input on held-out test data
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {pub.highlight && !pub.highlighted && (
                  <span className="text-xs font-mono text-accent-secondary">{pub.highlight}</span>
                )}
                {pub.doi && <p className="text-xs font-mono text-muted">DOI: {pub.doi}</p>}
```

Two things worth being precise about: (1) the `97.15%` block is hand-written for this one entry (not driven generically off `pub.highlight`'s text) so its subtitle can carry the exact source-grounded wording from the spec — do not try to generalize this into something that would apply to any future `highlighted` publication with a different kind of result; (2) `pub.highlight && !pub.highlighted` means the small inline badge (`"97.15% Model Accuracy"`) no longer renders for this one entry, since the new larger callout block replaces it — the other three entries still show their existing small badges exactly as before.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to Research, and confirm: the Wiley/HBE entry's title is visibly larger/bolder than the other three. Below its description, a `97.15%` block appears with the subtitle "AI model accuracy interpreting user input on held-out test data" directly beneath it — the small `"97.15% Model Accuracy"` badge does NOT also appear for this entry (no duplicate). The other three entries (Cambridge Scholars, Wiley Ethical AI chapter, IEEE conference paper) are completely unchanged — same size, same small-badge treatment where they have a `highlight` value. No cover image anywhere. Google Scholar link still works.

- [ ] **Step 3: Commit**

```bash
git add src/components/Research.tsx
git commit -m "$(cat <<'EOF'
feat: give the Wiley/HBE publication slightly stronger typography

One entry (the 2026 journal article) gets a larger title and a
97.15% callout with its exact source context ("AI model accuracy
interpreting user input on held-out test data" — drawn from the
publication's own already-verified description, not a generic
paraphrase) instead of its small inline badge. The other three
publications are unchanged; the bibliography format stays uniform,
this is typography-only, no cover image.
EOF
)"
```

---

### Task 9: About — photo-ready layout

**Files:**
- Modify: `src/components/About.tsx`

**Interfaces:**
- Consumes: `personalInfo.photo` (Task 1, currently `undefined`).

- [ ] **Step 1: Add conditional photo rendering**

In `src/components/About.tsx`, add `Image` to the imports:

```tsx
import Image from "next/image";
import { MapPin } from "lucide-react";
import { personalInfo, education, certifications, awayFromKeyboard } from "@/lib/data";
import SectionLabel from "./SectionLabel";
```

Add, immediately after the `<SectionLabel label="About" as="h2" />` line and before the bio paragraph:

```tsx
        {personalInfo.photo && (
          <div className="mt-10 mb-6">
            <Image
              src={personalInfo.photo}
              alt={personalInfo.name}
              width={160}
              height={160}
              className="rounded-sm object-cover border border-border"
            />
          </div>
        )}
```

Since `personalInfo.photo` is `undefined` today, this block renders nothing — no empty container, no reserved space, no layout shift. When a real path is added to `personalInfo.photo` later, it appears as a modest 160×160 framed photo above the bio, not a second hero image. Do not add any other change to this file — the `mt-10` currently on the bio paragraph itself needs a small adjustment so spacing stays correct whether or not the photo renders: change the bio paragraph's className from `"text-xl sm:text-2xl leading-relaxed text-foreground max-w-2xl mt-10 mb-4"` to `"text-xl sm:text-2xl leading-relaxed text-foreground max-w-2xl mb-4"` (drop `mt-10` from the paragraph itself, since the new conditional block above carries its own `mt-10` when present — when the photo is absent, `SectionLabel`'s own `mb-4` is the only spacing before the bio, matching every other section's header-to-content spacing exactly).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to About, and confirm: layout is visually identical to before this change (no gap, no empty box) — `personalInfo.photo` is still `undefined`. To confirm the photo path actually works, temporarily set `photo: "/next.svg"` (an existing file already in `public/`, just for this check — a real photo isn't available yet) in `data.ts`, refresh, confirm a small framed image appears above the bio with sensible spacing, then revert that temporary edit before committing (`git diff` should show only the `About.tsx` changes below, not a `data.ts` change).

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "$(cat <<'EOF'
feat: add a photo-ready layout to About

Renders a modest 160x160 framed photo above the bio when
personalInfo.photo is set (currently unset, so this renders nothing —
no empty container, no reserved space). Verified locally with a
placeholder path that a real photo, when added later, appears as a
personal photograph, not a second hero image.
EOF
)"
```

---

### Task 10: Contact/Footer — closing line + coordinate echo

**Files:**
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `hero.globeCities[0]` (Task 1, Brooklyn) for the coordinate echo.

- [ ] **Step 1: Update the closing statement and add the coordinate line**

In `src/components/Footer.tsx`, add `hero` to the import:

```tsx
import { personalInfo, hero } from "@/lib/data";
```

Change:

```tsx
        <p className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground max-w-xl mb-8">
          Open to full-time roles, research collaborations, and interesting problems in AI
          infrastructure and computer vision.
        </p>
```

to:

```tsx
        <p className="text-2xl sm:text-3xl font-medium tracking-tight uppercase text-foreground max-w-xl mb-8">
          Let&apos;s build something useful.
        </p>
```

Add, after the Email/LinkedIn/GitHub `<div>` and before the closing bottom bar `<div>`:

```tsx
        <p className="font-mono text-xs text-muted mb-16">
          {hero.globeCities[0].label} — {Math.abs(hero.globeCities[0].lat).toFixed(4)}°N{" "}
          {Math.abs(hero.globeCities[0].lng).toFixed(4)}°W
        </p>
```

This reuses `hero.globeCities[0]` (Brooklyn, the same data the globe uses) rather than a second hardcoded coordinate literal, so the two can't drift apart. It's a small, subtle, city-level line — not a precise personal address — matching the "very subtle... echo the Hero" requirement.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to the footer, and confirm: "LET'S BUILD SOMETHING USEFUL." renders in place of the old pitch line (uppercase via CSS, same size/weight/position as before). Below the Email/LinkedIn/GitHub row, a small muted mono line reads "Brooklyn, NY — 40.6782°N 73.9442°W" (or however it renders — confirm it matches Brooklyn's real coordinates, not a placeholder). The existing name-mark + built-with bottom bar is unchanged. No contact form anywhere (unchanged from Cycle 2).

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "$(cat <<'EOF'
feat: stronger Contact closing line + subtle Hero coordinate echo

Replaces the pitch line with "LET'S BUILD SOMETHING USEFUL." and adds
a small, subtle city-level coordinate line (Brooklyn, reused directly
from hero.globeCities[0] rather than a second hardcoded literal) below
the Email/LinkedIn/GitHub row, closing the visual loop with the Hero
globe's own coordinate panel. No precise personal location, no new
visual system, no contact form.
EOF
)"
```

---

### Task 11: Final verification + whole-branch review

**Files:** none (verification only)

**Interfaces:** none — this task consumes the entire branch diff.

- [ ] **Step 1: Full build**

Run: `npm run build`.
Expected: succeeds clean. Route table includes `/` and `/work/prism` (both static), plus the existing `/_not-found` and `/opengraph-image`.

- [ ] **Step 2: Responsive pass**

At 375/430/768/1024/1440px, full-page scroll-through on both `/` and `/work/prism`: zero horizontal overflow anywhere. Specifically re-check the Hero globe at all 5 widths (including confirming whatever escape-hatch decision Task 3 made at 375–430px actually looks right), the compact Prism diagram (`FIG. 01A`, homepage), the full Prism diagram (`FIG. 01B`, `/work/prism`), the Medical CV schematic, and the Faculty Ops 3-group diagram.

- [ ] **Step 3: Reduced-motion pass**

With `prefers-reduced-motion: reduce` emulated: Hero's globe shows one static orientation (no rotation, no city cycling — confirmed by sampling its rendered `state`/visual output twice with a delay between, same technique used for the Prism diagram's dash-offset in earlier sessions). Hero's text entrance and the Prism flow diagrams' (both `01A` and `01B`) marching-ants animations are still correctly static, unaffected by this pass's changes. Grep `src/components/` for any new component from this plan using `framer-motion` — expected: none (`HeroGlobe.tsx` uses `useReducedMotion` from `framer-motion` for the *check*, but doesn't use `motion.*` components; none of the new diagram components animate at all).

- [ ] **Step 4: Accessibility spot-check**

- `HeroGlobe`'s canvas has no `aria-label` of its own (it's decorative/supplementary to the adjacent text-based coordinate panel, which IS real, readable text) — confirm the coordinate panel `<p>` is present and legible in the DOM regardless of canvas/WebGL support.
- All 3 new/changed SVG diagrams (`PrismFlowDiagramCompact`, `MedicalPipelineSchematic`, `FacultyOpsModuleMap`) have accurate `role="img"` + `aria-label` text matching what's actually rendered.
- Heading hierarchy: confirm `/work/prism`'s `<h1>` (from `PrismDetail`) doesn't create a duplicate-`h1` conflict with anything in the shared layout (there shouldn't be another `h1` outside page content — `Navbar`'s logo/name is not a heading element).
- Medical CV's removed toggle buttons are simply gone — confirm no orphaned `aria-pressed`/button markup remains anywhere.

- [ ] **Step 5: Visual consistency pass**

Full-page screenshots of `/` at 1440px and 375px, and `/work/prism` at 1440px. Confirm against the spec's §9 rhythm table: Hero reads as a two-column composition with a genuine dimensional object, Prism's homepage preview leads with the real screenshot (not a diagram), Medical CV leads with the schematic, Faculty Ops's diagram reads as 3 distinct grouped clusters (not 12 uniform boxes), Airspace is visually unchanged, Research has one visibly emphasized entry, About's spacing is correct with no photo present, Contact's closing line reads as a deliberate strong statement. Grep `src/` for any hex color or `font-serif` outside `diagram-tokens.ts`/`opengraph-image.tsx` (the two files already established as legitimate raw-hex exceptions) — expected: none, confirming no old dark/ochre/Fraunces styling crept back in anywhere this plan touched.

- [ ] **Step 6: Whole-branch review**

Run the `code-review` skill (or the `subagent-driven-development` skill's final-review process, if executing this plan that way) at `high`-or-above effort against the full diff from this branch's base (`main` at the commit this worktree branched from) through the final commit. Triage every finding per `superpowers:receiving-code-review` — verify against the codebase, don't implement blind, distinguish real blockers from deferrable polish, exactly as this project's prior review rounds were handled.

- [ ] **Step 7: Report to the user**

Summarize build status, responsive/reduced-motion/accessibility/visual-consistency results, and the whole-branch review's findings with your triage of each. Do not merge to `main` — that decision is the user's, after they've seen this summary, per this plan's Global Constraints.

---

## Self-Review

**Spec coverage:** Hero two-column + globe + height → Tasks 2–3. Prism split + `/work/prism` + figure numbering → Tasks 4–5. Medical CV schematic → Task 6. Faculty Ops regrouping → Task 7. Research emphasis → Task 8. About photo-ready layout → Task 9. Contact closing line + coordinate echo → Task 10. Section rhythm (§9) and recurring-motif guidance (§10) aren't standalone tasks — they're the reason Tasks 2–10 target exactly the sections they do, and Task 11 Step 5 explicitly checks the resulting rhythm against the spec's table. Every spec section has a task; no gaps.

**Placeholder scan:** every task's code is complete and real — no `TODO`/`TBD`. The one deliberately-provisional content is `personalInfo.photo` starting `undefined` (Task 1) — that's the spec's own explicit requirement ("if absent, render no empty container"), not a plan-writing shortcut, and Task 9's component correctly handles both states.

**Type consistency:** `Figure`'s new `showCaption` prop (Task 4) is consumed correctly in Task 5 (`showCaption={false}` on the unnumbered screenshot) and left at its default everywhere else. `ArchNode.dashed` (Task 7) is consumed correctly by `FacultyOpsModuleMap`'s one dashed node. `Publication.highlighted` (Task 1) is consumed correctly in Task 8's conditional rendering. `PrismPreview`/`PrismDetail`'s figure lookups (Task 5) both use `find`/`filter` by `id`/`kind` against the exact `FIG. 01A`/`FIG. 01B`/`FIG. 02` ids Task 1 writes — no positional destructuring anywhere in this plan's new code.
