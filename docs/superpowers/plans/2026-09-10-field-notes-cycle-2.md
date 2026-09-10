# Field Notes Redesign — Cycle 2 (Remaining Sections + Cleanup) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the warm-light editorial redesign started in Cycle 1 — ship the three remaining flagship case studies (Medical CV, Faculty Ops, Airspace), the compact Other Projects index, and re-skinned Experience/Research/About/Contact sections — then retire every component, dependency, and data field the old dark "Systems Notebook" design left behind, so the live site is one coherent system end to end.

**Architecture:** Same Next.js App Router site, no backend. Three new bespoke case-study components (`MedicalVisionCaseStudy`, `FacultyOpsCaseStudy`, `AirspaceCaseStudy`) extend `SelectedWork` alongside Cycle 1's `PrismCaseStudy`, each visually distinct per the spec rather than instances of one template. A new shared `ArchitectureDiagram` primitive backs Faculty Ops's module map and Airspace's streaming diagram (Prism keeps its own hand-built diagrams, untouched). `Experience`, `About`, and a new `Research` component (replacing `Publications`) are rewritten in place on the new token system; `Footer` absorbs `Contact`'s job as a `mailto:`-only section. `Skills`, `SideQuests`, `JourneyMap`, `Projects`, `Publications`, and `Contact` are deleted, along with the mapping/geo dependencies and the Web3Forms integration they leave orphaned.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind CSS v4 / Framer Motion / `next/font/google` (Geist, Geist Mono). No test framework is installed (`package.json` has only `dev`/`build`/`start`) — verification follows Cycle 1's pattern: `npx tsc --noEmit`, a described manual check via `npm run dev`, and a final `npm run build`.

**Spec:** `docs/superpowers/specs/2026-09-09-field-notes-redesign-design.md` (see **Phasing**, **Section design**, and the four case-study write-ups for the authoritative content this plan implements)

## Global Constraints

- Palette (exact, unchanged from Cycle 1): background `#F6F5F0`, primary text `#171715`, secondary text `#6A6963`, borders `#D8D6CF`, subtle surface `#ECEAE4`, primary accent `#355C8A`, secondary/annotation accent `#A54A42`. Sans (`Geist`) for headings/body, mono (`Geist Mono`) only for dates/labels/metadata/stack tags/metrics.
- **Every file this plan creates or rewrites uses the Tailwind token utilities** (`bg-background`, `text-foreground`, `text-muted`, `bg-surface`, `border-border`, `border-border-strong`, `text-accent`, `text-accent-secondary`) — never hardcoded hex classes or inline `style` colors. This is how the Cycle 1 code-review finding about `About.tsx`/`Experience.tsx`/`Publications.tsx`/`Contact.tsx` still referencing the retired `--body`/`--accent-gold`/`--accent-rose`/`--font-serif` tokens gets resolved: those components are rewritten from scratch in this plan (Tasks 8–11), not re-mounted as-is, so the stale references are deleted along with the rest of the old file, not patched around.
- **Every number in a `caseStudies` entry must trace to a verified source**, exactly as Cycle 1 required for Prism:
  - Faculty Ops's `12` apps / `306` tests / `29` test files were re-verified directly against `/Users/naman/Developer/OFA/office-affairs-workflow-portal` during this plan's own research (`find backend/apps -maxdepth 1 -mindepth 1 -type d | wc -l` → 12; `grep -rh "def test_" backend/apps/*/tests/*.py | wc -l` → 306; `find . -path "*/tests/*.py"` → 29, including each app's `tests/__init__.py`). Re-run these commands in Task 5 before writing the numbers into `data.ts` in case the repo has changed since.
  - Airspace's `475,000+` dataset figure and its "generated historical dataset" correction, and the `30s tumbling / 10s sliding` window figure, are transcribed verbatim from the spec's **Content accuracy corrections** (already verified against the real repo and confirmed by the user during spec research) — do not soften or drop the "generated dataset, not captured history" framing, and do not add a latency/throughput number (the spec confirms none exists in the repo).
  - Medical CV has **no quantitative metrics** — do not add accuracy/FPS/latency/dataset-size/model-choice figures. `CaseStudy.metrics` becomes optional in Task 1 specifically because this entry has none to report yet.
- **Figure numbering deviates from the spec's literal text and continues sequentially from Prism's shipped figures, not from the spec's draft numbers.** The spec's Cycle 2 write-up mentions "FIG. 04A/B/C" for Medical CV and "FIG. 07" for Airspace — but Prism (built in Cycle 1) already ships `FIG. 04` (`dashboard-cost.png`) and `FIG. 07` (`grafana.png`). Those spec numbers were written before Prism's final 7-figure count was locked in and would collide if used literally. This plan assigns Medical CV `FIG. 08A/08B/08C`, Faculty Ops `FIG. 09`, Airspace `FIG. 10` — the next free numbers after Prism's `FIG. 07` — preserving the spec's intent (one global sequential figure system) while fixing the collision. Do not use the spec's literal "04A/B/C" or "07".
- No light/dark toggle, no gradients/glassmorphism/glow/particles/typewriter/bouncing motion. Framer Motion only for opacity/vertical-reveal, 150–450ms, respecting `prefers-reduced-motion`.
- **Reduced motion:** Task 2 adds `MotionConfig reducedMotion="user"` around the app root as defense-in-depth (per the Cycle 1 whole-branch review's suggestion), but this does **not** replace the explicit `useReducedMotion()` checks already proven correct in `Hero.tsx` and `PrismFlowDiagram.tsx`. `MotionConfig`'s automatic handling is well-documented for `transform`/`opacity`-driven `animate` props; it is not verified here to cover custom non-transform SVG attribute keyframes (e.g. `strokeDashoffset`). Every new motion usage in this plan keeps the explicit `shouldReduceMotion` check pattern — do not remove it from existing components in reliance on `MotionConfig` alone.
- **Do not run `git push`.** Commit locally after each task; this branch should not reach `origin/main` until the user has reviewed it.
- Cycle 1 already gated the old dark sections out of `page.tsx` (they're unmounted, not deleted) — this plan un-gates the *rewritten* versions, it does not re-enable the old dark ones. `About.tsx`, `Experience.tsx`, `Projects.tsx`, `Publications.tsx`, `SideQuests.tsx`, `Contact.tsx`, `Skills.tsx`, `JourneyMap.tsx` in their current (pre-Cycle-2) form are treated as fully disposable — read for content/fact extraction where noted, then replaced or deleted, never patched.

---

### Task 1: Data model — new case studies, Away From the Keyboard, legacy cleanup

**Files:**
- Modify: `src/lib/data.ts`
- Modify: `src/components/PrismCaseStudy.tsx:10` (positional figure destructure → kind-based lookup)

**Interfaces:**
- Consumes: existing `CaseStudy`/`Figure`/`Metric` types (`src/lib/data.ts:513-537`), existing `experiences`/`projects` arrays.
- Produces: `caseStudies` array grown to 4 entries (`prism`, `medical-cv`, `faculty-ops`, `airspace`), `export const awayFromKeyboard: string`, `experiences` array with a new first entry, `projects` array with `Prism`/`Airspace Congestion Monitoring System`/`Todo App` removed (11 entries remain) — consumed by every later task in this plan.

- [ ] **Step 1: Widen the `CaseStudy` type for entries with no metrics**

In `src/lib/data.ts`, change:

```ts
export type CaseStudy = {
  slug: string;
  caseNumber: string; // "001"
  category: string; // "AI Infrastructure"
  year: string;
  title: string;
  problem: string; // one-sentence problem statement
  description: string;
  metrics: Metric[];
  stack: string[];
  figures?: Figure[];
  links: { label: string; href: string; external?: boolean }[];
};
```

to:

```ts
export type CaseStudy = {
  slug: string;
  caseNumber: string; // "001"
  category: string; // "AI Infrastructure"
  year: string;
  title: string;
  problem: string; // one-sentence problem statement
  description: string;
  metrics?: Metric[]; // absent when nothing is verified yet (e.g. ongoing research)
  stack: string[];
  figures?: Figure[];
  links: { label: string; href: string; external?: boolean }[];
};
```

- [ ] **Step 2: Retrofit `PrismCaseStudy.tsx`'s figure lookup from positional to kind-based**

This was flagged in the Cycle 1 whole-branch review: destructuring `figures` by array position silently breaks if the data's figure order ever changes. Every case study built in this plan needs the same lookup, so fix the pattern now, on the one component that already ships it.

In `src/components/PrismCaseStudy.tsx`, replace:

```ts
const prism = caseStudies.find((c) => c.slug === "prism")!;
const [flowFigure, infraFigure, ...screenshotFigures] = prism.figures ?? [];
```

with:

```ts
const prism = caseStudies.find((c) => c.slug === "prism")!;
const diagramFigures = prism.figures?.filter((f) => f.kind === "diagram") ?? [];
const [flowFigure, infraFigure] = diagramFigures;
const screenshotFigures = prism.figures?.filter((f) => f.kind === "screenshot") ?? [];
```

**Also in this same file:** Step 1 widens `CaseStudy.metrics` to optional (`Metric[] | undefined`). `PrismCaseStudy.tsx` renders it unconditionally today:

```tsx
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
```

Once `metrics` is optional, `prism.metrics.map(...)` is a `tsc` error (`Object is possibly 'undefined'`) even though Prism's entry is always populated at runtime — the type no longer guarantees it. Wrap this block the same way Tasks 5 and 6 guard their own `metrics` reads, so the pattern is consistent across every case study:

```tsx
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
```

No other change to this file — the rest of the component already consumes `flowFigure`/`infraFigure`/`screenshotFigures` by name, and Prism's actual figure order (2 diagrams, then 5 screenshots) still resolves to the exact same two figures, so this is a pure refactor.

- [ ] **Step 3: Add the `awayFromKeyboard` export**

Add near `personalInfo` (top of file), after the `personalInfo` object closes:

```ts
export const awayFromKeyboard =
  "F1 on race weekends, badminton and tennis, the gym, chess, and always planning the next trip.";
```

This is the spec's mandated one-line content (`docs/superpowers/specs/2026-09-09-field-notes-redesign-design.md:297`: "F1, badminton/tennis, gym, chess, food, travel"), reworded as one readable sentence per the spec's "never as seven cards/icons" instruction. It drops "food" from the spec's literal list — there's no existing verified fact backing a food-related side interest anywhere in `data.ts` (the current `sideQuests` array has no food entry), and this plan does not invent one. Flag this to the user before Task 10 renders it, in case they want a specific food-related line added.

- [ ] **Step 4: Re-verify the Faculty Ops figures, then add the three new `caseStudies` entries**

Run these from `/Users/naman/Developer/OFA/office-affairs-workflow-portal` and confirm the counts still match before writing `data.ts`:

```bash
find backend/apps -maxdepth 1 -mindepth 1 -type d | wc -l   # expect 12
grep -rh "def test_" backend/apps/*/tests/*.py | wc -l       # expect 306
find . -path "*/tests/*.py" -not -path "*__pycache__*" | wc -l  # expect 29
```

If any number differs from what's below, use the freshly-measured number and note the discrepancy in the commit message — do not silently keep a stale figure.

Add to `caseStudies`, after the existing `prism` entry (array now has 4 entries):

```ts
  {
    slug: "medical-cv",
    caseNumber: "002",
    category: "Applied Research",
    year: "2026",
    title: "Endoscopic Stone Detection",
    problem:
      "Endoscopic procedures produce a continuous camera feed with no automated way to flag stone material in real time — detection still depends entirely on the surgeon's eye.",
    description:
      "Ongoing computer vision research at NYU's FAMS Lab, contributing to a real-time detection pipeline over a continuous endoscopic camera feed inside a simulated renal environment — water and calcium-based model kidney stones standing in for real tissue and stone material during development, as part of the lab's Vertically Integrated Project.",
    stack: ["YOLOv5", "U-Net", "PyTorch", "OpenCV", "Computer Vision"],
    figures: [
      { id: "FIG. 08A", caption: "Raw endoscopic feed", kind: "placeholder" },
      { id: "FIG. 08B", caption: "Detection overlay", kind: "placeholder" },
      { id: "FIG. 08C", caption: "Segmentation mask", kind: "placeholder" },
    ],
    links: [],
  },
  {
    slug: "faculty-ops",
    caseNumber: "003",
    category: "Software Systems",
    year: "2026",
    title: "Faculty Operations Platform",
    problem:
      "500+ NYU faculty ran records management, workflow routing, and approvals through manual, form-based processes with no shared system of record.",
    description:
      "A cloud-integrated Django platform replacing manual faculty-affairs paperwork with structured workflows, approval-chain tracking, and an AI-powered FAQ chatbot — compatible with NYU Box, AWS S3, and Azure Blob Storage. Twelve Django apps split by domain, covering the core platform, workflow engine, approvals, notifications, document storage, audit trail, chatbot, workload tracking, data export, tenure and promotion, faculty records, and access management.",
    metrics: [
      { value: "12", label: "Django apps, split by domain — see module map" },
      { value: "306", label: "automated tests" },
      { value: "29", label: "test files" },
    ],
    stack: ["Django", "PostgreSQL", "AWS S3", "Azure Blob Storage", "Azure Logic Apps"],
    figures: [
      { id: "FIG. 09", caption: "Module map — the 12 Django apps that make up the platform", kind: "diagram" },
    ],
    links: [],
  },
  {
    slug: "airspace",
    caseNumber: "004",
    category: "Data Systems",
    year: "2026",
    title: "Airspace Congestion Monitoring",
    problem:
      "Airspace congestion has to be understood while it's happening, not after the fact — which means ingesting live flight telemetry and scoring risk in-stream, not in a nightly batch job.",
    description:
      "A streaming pipeline that ingests flight telemetry from the OpenSky API (plus historical replay) into three Kafka topics — flight-stream, flight-metrics, flight-aggregates — processes it in Spark Structured Streaming for risk scoring, anomaly detection, and spatial grid aggregation over 30-second tumbling / 10-second sliding windows, and fans results out to InfluxDB for real-time queries, MongoDB for historical lookups, and HDFS for batch archival, visualized in a live Streamlit dashboard.",
    metrics: [
      {
        value: "475,000+ records",
        label:
          "generated historical dataset modeling realistic OpenSky-shaped traffic, used for testing at volume — live ingestion pulls the real OpenSky API",
      },
      {
        value: "30s / 10s",
        label: "tumbling window / sliding interval — Spark Structured Streaming risk scoring and anomaly detection",
      },
    ],
    stack: ["Apache Spark", "Kafka", "InfluxDB", "MongoDB", "HDFS", "Streamlit", "Python"],
    figures: [
      { id: "FIG. 10", caption: "Stream processing architecture — OpenSky ingestion to Streamlit", kind: "diagram" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Namantyagi2727/airspace-congestion-monitoring", external: true },
    ],
  },
```

- [ ] **Step 5: Add the NYU FAMS Lab entry to `experiences`, condense the rest**

Insert as the new first element of `experiences` (before "Software Engineer — Faculty Operations Platform"):

```ts
  {
    title: "Computer Vision Research",
    company: "NYU FAMS Lab",
    period: "Sep 2026 – Present",
    location: "Brooklyn, NY",
    description: [
      "Contributing to a real-time detection pipeline over a continuous endoscopic camera feed, as part of a Vertically Integrated Project.",
      "Developing and validating detection in a simulated renal environment — water and calcium-based model kidney stones — before any real-tissue application.",
    ],
    tags: ["Computer Vision", "YOLOv5", "U-Net", "PyTorch", "OpenCV"],
  },
```

Then condense each existing entry's `description` array to 2–3 bullets (keep the most substantive, quantified points; drop redundant ones; change no facts or numbers):

- "Software Engineer — Faculty Operations Platform": keep the first two bullets (system design + workflow automation), drop the third (cloud storage strategies) and fourth (IT coordination) — they're the least specific of the four.
- "AI & Power BI Intern" (Mast-Jägermeister): keep all 3 (already at the target length).
- "AI Research Intern" (Essex): keep all 3 (already at the target length).
- "Global Technical Support Engineer" (Ciena): keep both (already at 2).
- "Salesforce Developer & Administrator": keep both (already at 2) — the spec's Experience section names only Mast-Jägermeister/Ciena/Essex/Ulavi for explicit condensing and doesn't mention Salesforce; since it wasn't named for removal either, this plan keeps it rather than guessing. Flag this to the user in Task 8's review if they'd rather drop it.
- "Frontend Developer" (Ulavi): keep both (already at 2).

- [ ] **Step 6: Remove the three entries from `projects` that now have their own home**

Delete the `Prism` object (`src/lib/data.ts:214-222` in the current file) — it's fully represented by `caseStudies[0]` now, and this removal is what makes Task 7's `OtherProjects` component safe to render `projects` directly with no title-string filter (the Cycle 1 review flagged `Projects.tsx`'s `.filter((p) => p.title !== "Prism")` as fragile; deleting the source entry removes the need for the filter entirely, in either the old or new component).

Also delete the `Airspace Congestion Monitoring System` object — it's now `caseStudies[3]`, and leaving it in `projects` would reintroduce the exact duplicate-listing problem Cycle 1 fixed for Prism.

Also delete the `Todo App` object — the spec's Other Projects section explicitly excludes it ("no Todo App / beginner coursework").

`projects` now has 11 entries: RAGBase, ChainGuard, Immune Cell Population Analysis, ConTicx, Sign Language Recognition, MindMend, Photo Search & Recognition, SmartScholar, Smart Door Lock System, DecentraStore, DiningBot on AWS, Student Performance Visualization — wait, that's 11 only if none else is dropped; count them after editing to confirm. The spec doesn't name any of these 11 individually for exclusion beyond Todo App — if the user wants further trimming (e.g. Student Performance Visualization also reads as coursework-adjacent), that's a call for them to make explicitly, not an inference this plan makes on its own.

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit` from the repo root.
Expected: no errors. This catches any `metrics` access elsewhere in the codebase that assumed the field was always present (there is none today outside `PrismCaseStudy.tsx`, which already only reads `prism.metrics`, itself always populated) — if `tsc` does flag something, it means another file reads `.metrics` without a guard; add an `?? []`/optional check there rather than reverting the type change.

- [ ] **Step 8: Commit**

```bash
git add src/lib/data.ts src/components/PrismCaseStudy.tsx
git commit -m "$(cat <<'EOF'
feat: add Medical CV, Faculty Ops, and Airspace case study data

Extends caseStudies with the three remaining Cycle 2 case studies,
adds the NYU FAMS Lab entry to experiences, condenses the existing
five entries to 2-3 bullets each, and removes Prism/Airspace/Todo App
from the legacy projects array now that the first two have their own
case-study entries and the third is explicitly out of scope for Other
Projects. Faculty Ops's 12/306/29 figures re-verified directly against
the local OFA repo. Retrofits PrismCaseStudy's figure lookup from
positional destructuring to kind-based filtering (Cycle 1 review
finding) so every case study in this plan uses the safer pattern.
EOF
)"
```

---

### Task 2: Shared diagram tokens + root `MotionConfig`

**Files:**
- Create: `src/lib/diagram-tokens.ts`
- Modify: `src/components/PrismFlowDiagram.tsx:8-13`
- Modify: `src/components/PrismInfraDiagram.tsx:1-5`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `ACCENT`, `ACCENT_SECONDARY`, `SURFACE`, `BORDER_STRONG`, `MUTED`, `FOREGROUND` string constants exported from `src/lib/diagram-tokens.ts`, consumed by `PrismFlowDiagram.tsx`, `PrismInfraDiagram.tsx`, and Task 3's `ArchitectureDiagram.tsx`.

- [ ] **Step 1: Create `src/lib/diagram-tokens.ts`**

```ts
// SVG presentation attributes (fill/stroke) can't read CSS custom properties,
// so raw hex diagrams keep their own copy of the palette. This is the single
// place that copy lives — keep it in sync with the :root tokens in
// src/app/globals.css by hand if the palette ever changes.
export const ACCENT = "#355C8A";
export const ACCENT_SECONDARY = "#A54A42";
export const SURFACE = "#ECEAE4";
export const BORDER_STRONG = "#C4C1B6";
export const MUTED = "#6A6963";
export const FOREGROUND = "#171715";
```

- [ ] **Step 2: Point `PrismFlowDiagram.tsx` at the shared constants**

Replace lines 8–13:

```ts
const ACCENT = "#355C8A";
const ACCENT_SECONDARY = "#A54A42";
const SURFACE = "#ECEAE4";
const BORDER_STRONG = "#C4C1B6";
const MUTED = "#6A6963";
const FOREGROUND = "#171715";
```

with:

```ts
import { ACCENT, ACCENT_SECONDARY, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";
```

(Move this import to sit with the file's other imports at the top, below the existing `"use client"` / `framer-motion` imports — not inline where the constants used to be.)

- [ ] **Step 3: Point `PrismInfraDiagram.tsx` at the shared constants**

Replace lines 1–5:

```ts
const ACCENT = "#355C8A";
const SURFACE = "#ECEAE4";
const BORDER_STRONG = "#C4C1B6";
const MUTED = "#6A6963";
const FOREGROUND = "#171715";
```

with:

```ts
import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";
```

(`PrismInfraDiagram` never used `ACCENT_SECONDARY` — don't import it unused.)

- [ ] **Step 4: Add `MotionConfig` around the app**

In `src/app/layout.tsx`, add the import and wrap the existing body children:

```tsx
import { MotionConfig } from "framer-motion";
```

Change:

```tsx
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <CommandPalette />
        <Analytics />
      </body>
```

to:

```tsx
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <MotionConfig reducedMotion="user">
          {children}
          <CommandPalette />
        </MotionConfig>
        <Analytics />
      </body>
```

(`Analytics` stays outside `MotionConfig` — it's not a motion component and doesn't need to be inside the provider.)

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll to the Prism case study.
Expected: FIG.01 and FIG.02 render identically to before this change (same colors, same marching-ants animation on cache:miss) — this task only changed *where* the hex values live, not their values or any visual behavior. Toggle the OS/browser "reduce motion" setting and confirm the Hero stagger-in and FIG.01's dashed lines both still stay static, exactly as Cycle 1 verified.

- [ ] **Step 6: Commit**

```bash
git add src/lib/diagram-tokens.ts src/components/PrismFlowDiagram.tsx src/components/PrismInfraDiagram.tsx src/app/layout.tsx
git commit -m "$(cat <<'EOF'
refactor: centralize diagram hex constants, add root MotionConfig

PrismFlowDiagram and PrismInfraDiagram each hand-copied the same six
palette values (Cycle 1 review finding) — pull them into one shared
src/lib/diagram-tokens.ts module instead, so a future palette change
has one place to update. Also wraps the app in MotionConfig
reducedMotion="user" as defense-in-depth; existing components keep
their explicit useReducedMotion() checks, which are what's actually
verified to cover the non-transform SVG animations in this codebase.
EOF
)"
```

---

### Task 3: `ArchitectureDiagram` shared primitive

**Files:**
- Create: `src/components/ArchitectureDiagram.tsx`

**Interfaces:**
- Consumes: `ACCENT`, `SURFACE`, `BORDER_STRONG`, `MUTED`, `FOREGROUND` from `src/lib/diagram-tokens.ts` (Task 2).
- Produces: `ArchitectureDiagram` default export with props `{ viewBox: string; minWidth: number; ariaLabel: string; nodes: ArchNode[]; edges?: ArchEdge[]; groups?: ArchGroup[] }`, and the exported types `ArchNode` (`{ id, x, y, w?, h?, label, sublabel? }`) and `ArchEdge` (`{ from, to, dashed? }`) — consumed by Task 5 (`FacultyOpsCaseStudy`) and Task 6 (`AirspaceCaseStudy`).

- [ ] **Step 1: Write `src/components/ArchitectureDiagram.tsx`**

```tsx
import { ACCENT, SURFACE, BORDER_STRONG, MUTED, FOREGROUND } from "@/lib/diagram-tokens";

export type ArchNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sublabel?: string;
};

export type ArchEdge = {
  from: string;
  to: string;
  dashed?: boolean;
};

export type ArchGroup = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

type ArchitectureDiagramProps = {
  viewBox: string;
  minWidth: number;
  ariaLabel: string;
  nodes: ArchNode[];
  edges?: ArchEdge[];
  groups?: ArchGroup[];
};

const DEFAULT_NODE_W = 140;
const DEFAULT_NODE_H = 34;

export default function ArchitectureDiagram({
  viewBox,
  minWidth,
  ariaLabel,
  nodes,
  edges = [],
  groups = [],
}: ArchitectureDiagramProps) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth }}>
        <svg viewBox={viewBox} className="w-full h-auto" role="img" aria-label={ariaLabel}>
          {groups.map((g) => (
            <g key={g.label}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={4} fill="none" stroke={BORDER_STRONG} strokeDasharray="3 3" />
              <text x={g.x + 6} y={g.y - 4} fontSize={9} fontFamily="var(--font-geist-mono)" fill={MUTED}>
                {g.label}
              </text>
            </g>
          ))}

          {edges.map((e, i) => {
            const from = byId[e.from];
            const to = byId[e.to];
            if (!from || !to) return null;
            const fromW = from.w ?? DEFAULT_NODE_W;
            const toW = to.w ?? DEFAULT_NODE_W;
            const goingRight = to.x >= from.x;
            return (
              <line
                key={`${e.from}-${e.to}-${i}`}
                x1={goingRight ? from.x + fromW / 2 : from.x - fromW / 2}
                y1={from.y}
                x2={goingRight ? to.x - toW / 2 : to.x + toW / 2}
                y2={to.y}
                stroke={ACCENT}
                strokeWidth={1.2}
                strokeDasharray={e.dashed ? "4 4" : undefined}
              />
            );
          })}

          {nodes.map((n) => {
            const w = n.w ?? DEFAULT_NODE_W;
            const h = n.h ?? DEFAULT_NODE_H;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={SURFACE} stroke={BORDER_STRONG} strokeWidth={1} />
                <text
                  textAnchor="middle"
                  dominantBaseline={n.sublabel ? undefined : "middle"}
                  y={n.sublabel ? -3 : 0}
                  fontSize={9.5}
                  fontFamily="var(--font-geist-mono)"
                  fill={FOREGROUND}
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
        </svg>
      </div>
    </div>
  );
}
```

(`goingRight` exists because Airspace's edges all flow left-to-right, but a future user of this primitive might not — the line still needs to start/end at the correct side of each box either way.)

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors. There's no page wiring this into yet, so no manual browser check for this task — Tasks 5 and 6 verify it visually once real data flows through it.

- [ ] **Step 3: Commit**

```bash
git add src/components/ArchitectureDiagram.tsx
git commit -m "$(cat <<'EOF'
feat: add ArchitectureDiagram shared primitive

Generic node/edge/group SVG renderer generalizing the group-box +
line + node-box pattern already hand-built in PrismInfraDiagram, so
Faculty Ops's module map and Airspace's streaming diagram (Tasks 5-6)
don't each reimplement it. Prism keeps its own dedicated diagrams —
this isn't retrofitted onto them.
EOF
)"
```

---

### Task 4: `MedicalVisionCaseStudy.tsx`

**Files:**
- Create: `src/components/MedicalVisionCaseStudy.tsx`
- Modify: `src/components/SelectedWork.tsx`

**Interfaces:**
- Consumes: `caseStudies` (Task 1's `medical-cv` entry), `Figure`/`SectionLabel` (existing, unchanged).
- Produces: `MedicalVisionCaseStudy` default export, wired into `SelectedWork` after `PrismCaseStudy`.

- [ ] **Step 1: Confirm the narrative before writing copy**

`src/components/About.tsx` (current, pre-Cycle-2 version, still on disk though unmounted) describes the "TAJ Dataset — Endoscopic Laser Ablation Analysis" VIP project as: *"a computer vision pipeline using YOLOv5 and U-Net to detect surgical regions and segment laser-affected tissue in endoscopic imagery... tissue damage heatmaps to visualize ablation intensity and spatial spread, integrated with 3D Slicer."* The spec's Medical CV facts for this task are: *"continuous camera feed, simulated renal environment with water and calcium model stones, real-time detection pipeline, contributor role"* — a kidney-stone-detection framing, not a laser-ablation-tissue framing. These may describe the same NYU FAMS Lab project at different points in its life, or two different projects. **Do not blend unverified details from one into the other.** Before writing Step 2's copy, confirm with the user which framing is current; this plan defaults to the spec's facts only (Step 2 below), since those are the ones explicitly marked verified for Cycle 2, and drops "3D Slicer" / "laser ablation" / "tissue heatmaps" as unconfirmed for this framing.

- [ ] **Step 2: Write `src/components/MedicalVisionCaseStudy.tsx`**

```tsx
"use client";

import { useState } from "react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import Figure from "./Figure";

const medicalCv = caseStudies.find((c) => c.slug === "medical-cv")!;

const VIEWS = ["Raw", "Detection", "Segmentation"] as const;

export default function MedicalVisionCaseStudy() {
  const [active, setActive] = useState<(typeof VIEWS)[number]>("Raw");
  const activeFigure = medicalCv.figures?.[VIEWS.indexOf(active)];

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

      {activeFigure && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4 font-mono text-xs">
            {VIEWS.map((view) => (
              <button
                key={view}
                onClick={() => setActive(view)}
                aria-pressed={active === view}
                className={`px-3 py-1.5 rounded-md border transition-colors ${
                  active === view
                    ? "border-accent text-accent bg-accent/10"
                    : "border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <Figure figure={activeFigure} />
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{medicalCv.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Wire it into `SelectedWork.tsx`**

In `src/components/SelectedWork.tsx`, add the import and render call after `<PrismCaseStudy />`:

```tsx
import SectionLabel from "./SectionLabel";
import PrismCaseStudy from "./PrismCaseStudy";
import MedicalVisionCaseStudy from "./MedicalVisionCaseStudy";
```

```tsx
        <PrismCaseStudy />
        <MedicalVisionCaseStudy />
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, open `http://localhost:3000`, scroll past Prism.
Expected: a second case study block appears — `CASE STUDY / 002 · APPLIED RESEARCH · 2026`, "Endoscopic Stone Detection", the problem/description prose, a Raw/Detection/Segmentation tab row, and a placeholder box reading "Raw endoscopic feed — asset pending" (or the Detection/Segmentation variants when those tabs are clicked). No metrics grid renders (there's nothing in `medicalCv.metrics` — confirm no broken/empty grid appears). Check 375/430/768/1024/1440px — the tab row should wrap cleanly, never overflow horizontally.

- [ ] **Step 5: Commit**

```bash
git add src/components/MedicalVisionCaseStudy.tsx src/components/SelectedWork.tsx
git commit -m "feat: add Medical CV case study with reserved figure slots"
```

---

### Task 5: `FacultyOpsCaseStudy.tsx` + module map

**Files:**
- Create: `src/components/FacultyOpsModuleMap.tsx`
- Create: `src/components/FacultyOpsCaseStudy.tsx`
- Modify: `src/components/SelectedWork.tsx`

**Interfaces:**
- Consumes: `ArchitectureDiagram`/`ArchNode`/`ArchGroup` (Task 3), `caseStudies` (Task 1's `faculty-ops` entry), `SectionLabel`/`Figure`/`ProjectMetric` (existing).
- Produces: `FacultyOpsCaseStudy` default export, wired into `SelectedWork` after `MedicalVisionCaseStudy`.

- [ ] **Step 1: Write `src/components/FacultyOpsModuleMap.tsx`**

12 apps in a 4×3 grid, deliberately with **no edges between them** — the spec is explicit that inter-app data flow hasn't been verified and drawing arrows would fabricate architecture that doesn't exist in the documented system. This is a structural map, not a flow diagram.

```tsx
import ArchitectureDiagram, { type ArchNode } from "./ArchitectureDiagram";

const NODES: ArchNode[] = [
  { id: "core", x: 110, y: 60, w: 140, label: "core" },
  { id: "workflows", x: 270, y: 60, w: 140, label: "workflows" },
  { id: "approvals", x: 430, y: 60, w: 140, label: "approvals" },
  { id: "notifications", x: 590, y: 60, w: 140, label: "notifications" },
  { id: "documents", x: 110, y: 120, w: 140, label: "documents" },
  { id: "audit", x: 270, y: 120, w: 140, label: "audit" },
  { id: "chatbot", x: 430, y: 120, w: 140, label: "chatbot" },
  { id: "workload", x: 590, y: 120, w: 140, label: "workload" },
  { id: "export", x: 110, y: 180, w: 140, label: "export" },
  { id: "tenure_promotion", x: 270, y: 180, w: 140, label: "tenure_promotion" },
  { id: "faculty", x: 430, y: 180, w: 140, label: "faculty" },
  { id: "ami", x: 590, y: 180, w: 140, label: "ami" },
];

const GROUPS = [{ x: 30, y: 30, w: 630, h: 190, label: "12 DJANGO APPS — backend/apps/" }];

export default function FacultyOpsModuleMap() {
  return (
    <ArchitectureDiagram
      viewBox="0 0 690 250"
      minWidth={600}
      ariaLabel="Faculty Operations Platform module map — 12 Django apps, no inter-app data flow implied"
      nodes={NODES}
      groups={GROUPS}
    />
  );
}
```

- [ ] **Step 2: Write `src/components/FacultyOpsCaseStudy.tsx`**

```tsx
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import FacultyOpsModuleMap from "./FacultyOpsModuleMap";

const facultyOps = caseStudies.find((c) => c.slug === "faculty-ops")!;
const moduleMapFigure = facultyOps.figures?.find((f) => f.kind === "diagram");

export default function FacultyOpsCaseStudy() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${facultyOps.caseNumber}`}
        meta={`${facultyOps.category} · ${facultyOps.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {facultyOps.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{facultyOps.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{facultyOps.description}</p>

      {facultyOps.metrics && facultyOps.metrics.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Verified figures</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">
            {facultyOps.metrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      {moduleMapFigure && (
        <div className="mb-12">
          <Figure figure={moduleMapFigure}>
            <FacultyOpsModuleMap />
          </Figure>
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{facultyOps.stack.join(" / ")}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Wire it into `SelectedWork.tsx`**

```tsx
import FacultyOpsCaseStudy from "./FacultyOpsCaseStudy";
```

```tsx
        <MedicalVisionCaseStudy />
        <FacultyOpsCaseStudy />
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, scroll to case study 003.
Expected: `12 / 306 / 29` metrics render, then the module map — 12 labeled boxes in a 4×3 grid inside one dashed "12 DJANGO APPS" boundary, no lines connecting them. Confirm every label is readable at 100% zoom (check `tenure_promotion` and `notifications` specifically — the longest labels) and that the diagram's horizontal scroll container (`overflow-x-auto`) kicks in below ~600px viewport width rather than squashing the boxes.

- [ ] **Step 5: Commit**

```bash
git add src/components/FacultyOpsModuleMap.tsx src/components/FacultyOpsCaseStudy.tsx src/components/SelectedWork.tsx
git commit -m "feat: add Faculty Ops case study with 12-app module map"
```

---

### Task 6: `AirspaceCaseStudy.tsx` + streaming diagram

**Files:**
- Create: `src/components/AirspaceStreamDiagram.tsx`
- Create: `src/components/AirspaceCaseStudy.tsx`
- Modify: `src/components/SelectedWork.tsx`

**Interfaces:**
- Consumes: `ArchitectureDiagram`/`ArchNode`/`ArchEdge` (Task 3), `caseStudies` (Task 1's `airspace` entry).
- Produces: `AirspaceCaseStudy` default export, wired into `SelectedWork` after `FacultyOpsCaseStudy` — the fourth and last of the flagship case studies.

- [ ] **Step 1: Write `src/components/AirspaceStreamDiagram.tsx`**

```tsx
import ArchitectureDiagram, { type ArchNode, type ArchEdge } from "./ArchitectureDiagram";

const NODES: ArchNode[] = [
  { id: "opensky", x: 90, y: 55, w: 130, label: "OpenSky API" },
  { id: "replay", x: 90, y: 155, w: 130, label: "Historical replay" },
  { id: "kafka", x: 300, y: 105, w: 150, label: "Kafka (Redpanda)", sublabel: "3 topics (flight-*)" },
  { id: "spark", x: 520, y: 105, w: 190, label: "Spark Structured Streaming" },
  { id: "influx", x: 760, y: 30, w: 110, label: "InfluxDB", sublabel: "real-time" },
  { id: "mongo", x: 760, y: 105, w: 110, label: "MongoDB", sublabel: "historical" },
  { id: "hdfs", x: 760, y: 180, w: 110, label: "HDFS", sublabel: "batch archive" },
  { id: "streamlit", x: 960, y: 105, w: 150, label: "Streamlit dashboard" },
];

const EDGES: ArchEdge[] = [
  { from: "opensky", to: "kafka" },
  { from: "replay", to: "kafka", dashed: true },
  { from: "kafka", to: "spark" },
  { from: "spark", to: "influx" },
  { from: "spark", to: "mongo" },
  { from: "spark", to: "hdfs" },
  { from: "influx", to: "streamlit" },
  { from: "mongo", to: "streamlit" },
  { from: "hdfs", to: "streamlit", dashed: true },
];

export default function AirspaceStreamDiagram() {
  return (
    <ArchitectureDiagram
      viewBox="0 0 1060 210"
      minWidth={880}
      ariaLabel="Airspace stream processing architecture — OpenSky ingestion through Kafka and Spark to InfluxDB, MongoDB, HDFS, and a Streamlit dashboard"
      nodes={NODES}
      edges={EDGES}
    />
  );
}
```

- [ ] **Step 2: Write `src/components/AirspaceCaseStudy.tsx`**

```tsx
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import ProjectMetric from "./ProjectMetric";
import Figure from "./Figure";
import AirspaceStreamDiagram from "./AirspaceStreamDiagram";

const airspace = caseStudies.find((c) => c.slug === "airspace")!;
const streamFigure = airspace.figures?.find((f) => f.kind === "diagram");

export default function AirspaceCaseStudy() {
  return (
    <article className="py-12 border-t border-border">
      <SectionLabel
        label={`Case Study / ${airspace.caseNumber}`}
        meta={`${airspace.category} · ${airspace.year}`}
      />

      <h3 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
        {airspace.title}
      </h3>

      <p className="text-lg text-foreground leading-snug mb-4 max-w-2xl">{airspace.problem}</p>
      <p className="text-base text-muted leading-relaxed mb-12 max-w-2xl">{airspace.description}</p>

      {airspace.metrics && airspace.metrics.length > 0 && (
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Verified figures</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {airspace.metrics.map((m) => (
              <ProjectMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </div>
      )}

      {streamFigure && (
        <div className="mb-12">
          <Figure figure={streamFigure}>
            <AirspaceStreamDiagram />
          </Figure>
        </div>
      )}

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Stack</p>
        <p className="font-mono text-sm text-foreground leading-relaxed">{airspace.stack.join(" / ")}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        {airspace.links.map((link) => (
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

- [ ] **Step 3: Wire it into `SelectedWork.tsx`**

```tsx
import AirspaceCaseStudy from "./AirspaceCaseStudy";
```

```tsx
        <FacultyOpsCaseStudy />
        <AirspaceCaseStudy />
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, scroll to case study 004.
Expected: the two metrics (`475,000+ records` with its "generated historical dataset... not captured OpenSky history" label fully visible, and `30s / 10s`), then the stream diagram — two source boxes on the left, converging into Kafka, then Spark, fanning out to three sinks, converging into Streamlit on the right. Confirm the diagram scrolls horizontally rather than compressing below ~880px viewport width, and that "Spark Structured Streaming" doesn't visually clip inside its box at any width. Confirm the GitHub link at the bottom points to `airspace-congestion-monitoring`.

- [ ] **Step 5: Commit**

```bash
git add src/components/AirspaceStreamDiagram.tsx src/components/AirspaceCaseStudy.tsx src/components/SelectedWork.tsx
git commit -m "feat: add Airspace case study with corrected dataset framing"
```

---

### Task 7: `OtherProjects.tsx`

**Files:**
- Create: `src/components/OtherProjects.tsx`
- Modify: `src/components/SelectedWork.tsx`

**Interfaces:**
- Consumes: `projects` (Task 1's cleaned-up 11-entry array).
- Produces: `OtherProjects` default export, rendered after `AirspaceCaseStudy` inside `SelectedWork`, closing out the Selected Work section.

- [ ] **Step 1: Write `src/components/OtherProjects.tsx`**

A compact text index, not the card grid `Projects.tsx` used — no click-to-expand modal, no per-card chrome. `projects` no longer contains Prism/Airspace/Todo App (Task 1), so this renders the array directly with no filter.

```tsx
import { Github } from "lucide-react";
import { projects } from "@/lib/data";

export default function OtherProjects() {
  return (
    <div className="py-12 border-t border-border">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">Other Projects</p>

      <div className="border-t border-border">
        {projects.map((project) => (
          <div
            key={project.title}
            className="py-5 border-b border-border flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 sm:gap-6"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-sm font-medium text-foreground">{project.title}</h3>
                {project.highlight && (
                  <span className="text-xs font-mono text-accent-secondary">{project.highlight}</span>
                )}
              </div>
              <p className="text-sm text-muted mt-1 leading-relaxed">{project.description}</p>
              <p className="text-xs font-mono text-muted mt-1.5">{project.tags.join(" / ")}</p>
            </div>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-accent transition-colors flex-shrink-0"
              >
                <Github size={14} />
                GitHub ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into `SelectedWork.tsx`**

```tsx
import OtherProjects from "./OtherProjects";
```

```tsx
        <AirspaceCaseStudy />
        <OtherProjects />
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, scroll to the end of Selected Work.
Expected: 11 rows, each with title/highlight/description/tags and a GitHub link where one exists (2 of the 11 — SmartScholar, MindMend, DecentraStore, Smart Door Lock System have no `github` field in the current data — confirm those rows simply omit the link rather than rendering a broken one). No Prism, Airspace, or Todo App rows. At 375px, confirm the GitHub link wraps below the title/description rather than overlapping it.

- [ ] **Step 4: Commit**

```bash
git add src/components/OtherProjects.tsx src/components/SelectedWork.tsx
git commit -m "feat: add compact Other Projects index, closing out Selected Work"
```

---

### Task 8: `Experience.tsx` rewrite

**Files:**
- Modify: `src/components/Experience.tsx` (full rewrite)

**Interfaces:**
- Consumes: `experiences` (Task 1's 7-entry array, NYU FAMS Lab first), `SectionLabel`.

- [ ] **Step 1: Rewrite `src/components/Experience.tsx` in full**

Minimal timeline on the new tokens — no glowing pulse dots, no gradient rail, no hardcoded hex.

```tsx
import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Experience" />

        <div className="mt-10 flex flex-col gap-8">
          {experiences.map((exp, i) => (
            <div key={i} className="border-t border-border pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-medium text-foreground">{exp.title}</h3>
                  <p className="text-sm text-muted mt-0.5 flex items-center gap-1.5">
                    <Briefcase size={12} />
                    {exp.company}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono text-accent-secondary">{exp.period}</p>
                  <p className="text-xs text-muted mt-0.5">{exp.location}</p>
                </div>
              </div>

              <ul className="flex flex-col gap-1.5 mb-4 max-w-2xl">
                {exp.description.map((point, j) => (
                  <li key={j} className="text-sm text-muted flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-border-strong flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-full font-mono text-muted bg-surface border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors. `Experience` isn't wired into `page.tsx` until Task 12 — for a visual check now, temporarily add `<Experience />` to `src/app/page.tsx` under `<SelectedWork />`, check it at 375/430/768/1024/1440px (7 entries, NYU FAMS Lab first, tags wrap cleanly, no `#2a231c`/`#d97b3f`-style hardcoded colors visible against the light background), then remove the temporary addition — Task 12 wires it in for real alongside every other section at once.

- [ ] **Step 3: Commit**

```bash
git add src/components/Experience.tsx
git commit -m "feat: re-skin Experience to warm-light tokens, minimal timeline"
```

---

### Task 9: `Research.tsx` (replaces `Publications.tsx`)

**Files:**
- Create: `src/components/Research.tsx`
- Delete: `src/components/Publications.tsx`

**Interfaces:**
- Consumes: `publications`, `personalInfo.scholar` (unchanged), `SectionLabel`.

- [ ] **Step 1: Write `src/components/Research.tsx`**

Uniform bibliography format — all four entries at equal visual weight, no Cambridge-Scholars gold/featured treatment (the spec explicitly retires that in favor of this).

```tsx
import { ExternalLink } from "lucide-react";
import { publications, personalInfo } from "@/lib/data";
import SectionLabel from "./SectionLabel";

const typeLabel: Record<(typeof publications)[number]["type"], string> = {
  book: "Book Chapter",
  journal: "Journal",
  conference: "Conference Paper",
};

export default function Research() {
  return (
    <section id="research" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Research" meta={`${publications.length} publications`} />

        <div className="mt-10 flex flex-col gap-8">
          {publications.map((pub, i) => (
            <div key={i} className="border-t border-border pt-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-mono text-accent border border-accent/30 bg-accent/5">
                  {typeLabel[pub.type]}
                </span>
                <span className="text-xs text-muted font-mono ml-auto">{pub.date}</span>
              </div>

              <h3 className="text-base font-medium text-foreground leading-snug mb-1">{pub.title}</h3>
              <p className="text-xs font-mono text-muted mb-3">{pub.publisher}</p>

              {pub.authors && <p className="text-xs text-muted mb-3 leading-relaxed">{pub.authors}</p>}

              <p className="text-sm text-muted leading-relaxed mb-3 max-w-2xl">{pub.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                {pub.highlight && (
                  <span className="text-xs font-mono text-accent-secondary">{pub.highlight}</span>
                )}
                {pub.doi && <p className="text-xs font-mono text-muted">DOI: {pub.doi}</p>}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-foreground transition-colors"
                  >
                    <ExternalLink size={12} />
                    View publication
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <a
          href={personalInfo.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-foreground transition-colors mt-10"
        >
          Google Scholar
          <ExternalLink size={14} />
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete `src/components/Publications.tsx`**

```bash
git rm src/components/Publications.tsx
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors. `page.tsx` does not currently import `Publications` at all — Cycle 1 already gated it out of the homepage (it was never re-added) — so this is expected to be a clean no-op removal, not a rewire. If `tsc` reports a missing-module error from anywhere unexpected, find that import and point it at `Research` instead before proceeding.

For a visual check now, temporarily add `<Research />` to `page.tsx`, verify all four entries render at equal visual weight (no gold card for Cambridge Scholars), the Scholar link works, then remove the temporary addition.

- [ ] **Step 4: Commit**

```bash
git add src/components/Research.tsx
git commit -m "feat: replace Publications with uniform-weight Research section"
```

---

### Task 10: `About.tsx` rewrite

**Files:**
- Modify: `src/components/About.tsx` (full rewrite)
- Delete: `src/components/JourneyMap.tsx`
- Modify: `package.json` (remove now-orphaned mapping dependencies)

**Interfaces:**
- Consumes: `personalInfo`, `education`, `certifications`, `awayFromKeyboard` (Task 1), `SectionLabel`.

- [ ] **Step 1: Confirm `JourneyMap` has no other consumers before deleting**

```bash
grep -rln "JourneyMap" src
```

Expected: only `src/components/About.tsx` (about to be rewritten to drop the import) and `src/components/JourneyMap.tsx` itself. If anything else appears, stop and investigate before deleting.

- [ ] **Step 2: Rewrite `src/components/About.tsx` in full**

Short bio, compact education/certification metadata (not the pulsing-node timeline), Away From the Keyboard as one line, no `JourneyMap`, no photo slot (deferred — not scaffolded until there's an actual photo to show).

```tsx
import { MapPin } from "lucide-react";
import { personalInfo, education, certifications, awayFromKeyboard } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="About" />

        <p className="text-xl sm:text-2xl leading-relaxed text-foreground max-w-2xl mt-10 mb-4">
          {personalInfo.bio}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted mb-12">
          <MapPin size={14} />
          {personalInfo.location}
        </div>

        <div className="border-t border-border pt-8 mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Education</p>
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div key={edu.school} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <p className="text-sm font-medium text-foreground">{edu.degree}</p>
                  <p className="text-sm text-muted">{edu.school}</p>
                </div>
                <p className="text-xs font-mono text-muted flex-shrink-0">{edu.period}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-8 mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Certifications</p>
          <p className="text-sm text-muted leading-relaxed">
            {certifications.map((c) => c.name).join(" · ")}
          </p>
        </div>

        <div className="border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Away from the keyboard</p>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">{awayFromKeyboard}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Delete `src/components/JourneyMap.tsx`**

```bash
git rm src/components/JourneyMap.tsx
```

- [ ] **Step 4: Remove the now-orphaned mapping dependencies**

Confirm nothing else references them first:

```bash
grep -rln "d3-geo\|d3-selection\|d3-zoom\|react-simple-maps\|topojson-client" src
```

Expected: no matches (the only importer, `JourneyMap.tsx`, is now deleted). Separately, `package.json` also lists `prop-types` as a direct dependency with zero references anywhere in `src` and no declared consumer among the other dependencies — confirmed by checking `node_modules/react-simple-maps/package.json`'s own `dependencies` block, which lists `d3-geo`/`d3-selection`/`d3-zoom`/`topojson-client` but not `prop-types`. It appears to be unrelated dead weight, not something `react-simple-maps` needed — remove it in the same pass:

```bash
npm uninstall d3-geo d3-selection d3-zoom react-simple-maps topojson-client @types/d3-geo @types/react-simple-maps prop-types
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run build`.
Expected: succeeds — this is the first task in the plan that removes dependencies, so a full build (not just `tsc`) confirms nothing else in the build graph still resolves them.

For a visual check, temporarily add `<About />` to `page.tsx`, verify the bio/education/certifications/away-from-keyboard blocks render cleanly with no map, no pulsing nodes, no hardcoded dark colors, then remove the temporary addition.

- [ ] **Step 6: Commit**

```bash
git add src/components/About.tsx package.json package-lock.json
git rm src/components/JourneyMap.tsx
git commit -m "$(cat <<'EOF'
feat: re-skin About to compact metadata, remove JourneyMap + map deps

Drops the animated flight-path map and pulsing education timeline for
compact metadata lines matching the rest of the new IA, folds
certifications into one line instead of a hover-glow chip wall, and
adds the one-line Away From the Keyboard per spec. Removes d3-geo,
d3-selection, d3-zoom, react-simple-maps, and topojson-client — the
only component that used them.
EOF
)"
```

---

### Task 11: `Footer.tsx` contact rewrite, delete `Contact.tsx`

**Files:**
- Modify: `src/components/Footer.tsx` (full rewrite)
- Delete: `src/components/Contact.tsx`

**Interfaces:**
- Consumes: `personalInfo` (unchanged).
- Produces: `Footer` default export with `id="contact"`, replacing the Cycle 1 minimal footer and the deleted `Contact.tsx`'s job — `mailto:`/LinkedIn/GitHub only, no form.

- [ ] **Step 1: Confirm nothing else references the Web3Forms key before deleting `Contact.tsx`**

```bash
grep -rln "476f9eaf\|WEB3FORMS\|web3forms" src
```

Expected: only `src/components/Contact.tsx`. If a `.env` file or anywhere else also holds this key, remove it there too — there's no other consumer once `Contact.tsx` is gone.

- [ ] **Step 2: Rewrite `src/components/Footer.tsx` in full**

```tsx
import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-secondary mb-4">
          Let&apos;s talk
        </p>
        <p className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground max-w-xl mb-8">
          Open to full-time roles, research collaborations, and interesting problems in AI
          infrastructure and computer vision.
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-16">
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            Email ↗
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            GitHub ↗
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted font-mono">
            <span className="text-accent-secondary">&lt;</span>
            {personalInfo.name}
            <span className="text-accent-secondary">/&gt;</span>
          </p>
          <p className="text-xs text-muted">
            Built with Next.js &amp; Tailwind CSS · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Delete `src/components/Contact.tsx`**

```bash
git rm src/components/Contact.tsx
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run dev`, scroll to the footer.
Expected: "Let's talk" + pitch + Email/LinkedIn/GitHub row (same visual pattern as Hero's link row from Cycle 1), then the existing name-mark + built-with bar. No form. Confirm the Email link's `href` is `mailto:namantyagi2727@gmail.com` and the section has `id="contact"` (inspect the DOM, or run `document.getElementById("contact")` in the console).

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx
git rm src/components/Contact.tsx
git commit -m "$(cat <<'EOF'
feat: fold Contact into Footer as a mailto-only section, delete the form

Replaces the Web3Forms contact form with a direct Email/LinkedIn/GitHub
row under a "Let's talk" header, matching the spec's Contact/Footer
design exactly. Footer now carries id="contact" so Navbar/command
palette can deep-link to it (Task 12).
EOF
)"
```

---

### Task 12: Full site wiring — `page.tsx`, `Navbar.tsx`, `CommandPaletteContent.tsx`, delete `Skills`/`SideQuests`/`Projects`, data cleanup

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)
- Modify: `src/components/Navbar.tsx:6-11`
- Modify: `src/components/CommandPaletteContent.tsx:7-16`
- Delete: `src/components/Skills.tsx`
- Delete: `src/components/SideQuests.tsx`
- Delete: `src/components/Projects.tsx`
- Modify: `src/lib/data.ts` (remove `skills`/`sideQuests`/`funStats` exports and their types)

**Interfaces:**
- Consumes: every component built in Tasks 4–11, plus Cycle 1's `Navbar`/`Hero`/`SelectedWork`.
- Produces: the complete Cycle 2 page — `Navbar`, `Hero`, `SelectedWork` (4 case studies + Other Projects), `Experience`, `Research`, `About`, `Footer`.

- [ ] **Step 1: Confirm `skills`/`sideQuests`/`funStats` have no consumers left**

```bash
grep -rln "sideQuests\|funStats\|from \"@/lib/data\".*\bskills\b" src --include="*.tsx" --include="*.ts" | grep -v "src/lib/data.ts"
```

Expected: no matches once `Skills.tsx` and `SideQuests.tsx` are deleted in Step 3 below — run this again after that step, not before, since right now both files still import them.

- [ ] **Step 2: Rewrite `src/app/page.tsx` in full**

```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import Experience from "@/components/Experience";
import Research from "@/components/Research";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SelectedWork />
        <Experience />
        <Research />
        <About />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Delete `Skills.tsx`, `SideQuests.tsx`, `Projects.tsx`**

```bash
git rm src/components/Skills.tsx src/components/SideQuests.tsx src/components/Projects.tsx
```

- [ ] **Step 4: Remove the now-dead `skills`/`sideQuests`/`funStats` exports from `data.ts`**

Re-run Step 1's grep first to confirm it's now clean, then delete from `src/lib/data.ts`:
- The `Skill` type and `skills: Skill[]` export (currently lines 19–120 in the pre-Task-1 file — re-find the exact range after Task 1's edits, since that task also changed this file).
- The `SideQuest` type, `sideQuests: SideQuest[]` export, and `funStats` export (currently lines 443–496 in the pre-Task-1 file — same caveat).

Leave everything else in `data.ts` untouched.

- [ ] **Step 5: Update `Navbar.tsx`'s link list to the full IA**

Replace the Cycle-1-gated single-link array:

```ts
// Cycle 1 only renders the Work section — the rest resolve once Cycle 2
// brings the remaining sections onto the new palette.
const navLinks = [{ label: "Work", href: "#work" }];
```

with:

```ts
const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
```

- [ ] **Step 6: Update `CommandPaletteContent.tsx`'s `SECTIONS` to match**

Replace:

```ts
// Cycle 1 only renders the Work section — the rest resolve once Cycle 2
// brings the remaining sections onto the new palette.
const SECTIONS = [{ label: "Work", href: "#work" }];
```

with:

```ts
const SECTIONS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
```

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit`.
Expected: no errors.

Run: `npm run build`.
Expected: succeeds. Check the build output's route summary — no warnings about unresolved imports.

Run: `npm run dev`, load `http://localhost:3000` fresh.
Expected: the complete page renders top to bottom — Navbar (5 links + GitHub + ⌘K hint), Hero, all 4 case studies + Other Projects, Experience (7 entries), Research (4 publications, equal weight), About (bio/education/certs/away-from-keyboard), Footer (Let's talk + Email/LinkedIn/GitHub). Click every Navbar link and confirm it scrolls to the matching section (no dead links — this was the exact regression the Cycle 1 whole-branch review caught when sections were gated but nav wasn't). Open the command palette (⌘K or Ctrl+K) and confirm all 5 sections + Actions still work.

- [ ] **Step 8: Commit**

```bash
git add src/app/page.tsx src/components/Navbar.tsx src/components/CommandPaletteContent.tsx src/lib/data.ts
git rm src/components/Skills.tsx src/components/SideQuests.tsx src/components/Projects.tsx
git commit -m "$(cat <<'EOF'
feat: wire full Cycle 2 IA, delete Skills/SideQuests/Projects

page.tsx now renders the complete new site: Hero, Selected Work (4
case studies + Other Projects), Experience, Research, About, Footer.
Navbar and the command palette are restored to the full 5-link IA
(Work/Experience/Research/About/Contact) instead of Cycle 1's
single-link gate. Skills.tsx and SideQuests.tsx are deleted with no
replacement (contextual-only per spec); Projects.tsx is deleted,
superseded by OtherProjects.tsx (Task 7). Their now-dead skills/
sideQuests/funStats exports are removed from data.ts.
EOF
)"
```

---

### Task 13: Final responsive/accessibility/performance pass + whole-branch review

**Files:** none (verification only)

**Interfaces:** none — this task consumes the entire Cycle 2 diff.

- [ ] **Step 1: Full build**

Run: `npm run build`.
Expected: succeeds with no warnings beyond the pre-existing Turbopack workspace-root notice (unrelated to this plan).

- [ ] **Step 2: Bundle sanity check**

Compare the `npm run build` route-size output against a `git stash` of this branch back to the Cycle 1 tip (or `git log` the previous build's output if recorded) — confirm the homepage bundle shrank or held flat despite adding 3 case studies + 4 sections, which is the expected effect of Task 10 removing `d3-geo`/`d3-selection`/`d3-zoom`/`react-simple-maps`/`topojson-client`. If it grew unexpectedly, check for an accidentally-still-imported dead dependency before proceeding.

- [ ] **Step 3: Responsive pass**

Using the same headless-browser-screenshot approach Cycle 1's final review used, check every section (Hero, all 4 case studies, Other Projects, Experience, Research, About, Footer) at 375/430/768/1024/1440px:
- No horizontal overflow (`document.documentElement.scrollWidth - document.documentElement.clientWidth === 0`) at any width.
- `FacultyOpsModuleMap` and `AirspaceStreamDiagram` scroll horizontally rather than compressing below their `minWidth`.
- `OtherProjects` rows wrap the GitHub link below the text at narrow widths without overlapping.
- `MedicalVisionCaseStudy`'s Raw/Detection/Segmentation tabs wrap cleanly at 375px.

- [ ] **Step 4: Reduced-motion pass**

With `prefers-reduced-motion: reduce` emulated, confirm: Hero's stagger-in stays static (already verified in Cycle 1, re-check it wasn't affected by Task 2's `MotionConfig` addition), `PrismFlowDiagram`'s marching ants stay static, and any new motion usage introduced in Tasks 4–11 (none of this plan's new components use Framer Motion — confirm that's still true by grepping `grep -rl "framer-motion" src/components/MedicalVisionCaseStudy.tsx src/components/FacultyOpsCaseStudy.tsx src/components/AirspaceCaseStudy.tsx src/components/OtherProjects.tsx src/components/Experience.tsx src/components/Research.tsx src/components/About.tsx src/components/Footer.tsx` — expect no matches; if any of these ended up using `motion.*` during implementation, verify its reduced-motion behavior explicitly before this task passes).

- [ ] **Step 5: Accessibility spot-check**

- Every new interactive element (Medical CV's tab buttons, all `mailto:`/external links) is keyboard-reachable via Tab and has visible focus.
- `ArchitectureDiagram`'s `role="img"` + `aria-label` describes each diagram's real content (already written into Tasks 5–6's `ariaLabel` props — confirm they're accurate to what's rendered).
- Heading hierarchy is sane top-to-bottom (`SectionLabel` + `h3` pattern, consistent with Prism's existing structure).

- [ ] **Step 6: Whole-branch review**

Run the `code-review` skill at `high` effort against the full branch diff from Cycle 1's approved tip through this task's final commit (`git log` for the exact SHA to diff from — it's the commit this plan's Task 1 branched from). Triage every finding per `superpowers:receiving-code-review` before acting on any of it — verify against the codebase, don't implement blind, distinguish real blockers from deferrable polish, exactly as Cycle 1's final review was handled.

- [ ] **Step 7: Report to the user**

Summarize: build status, responsive/reduced-motion/accessibility results, and the whole-branch review's findings with your triage of each. Do not merge to `main` — that decision is the user's, after they've seen this summary.

---

## Self-Review

**Spec coverage:** Hero/Prism (Cycle 1, done). Medical CV → Task 4. Faculty Ops → Task 5. Airspace → Task 6. Other Projects → Task 7. Experience → Task 8. Research (renamed from Publications) → Task 9. About + Away From the Keyboard → Task 10. Contact/Footer → Task 11. Command-palette IA update → Task 12. Removal of `JourneyMap`/`d3-geo`/`react-simple-maps`/etc. → Task 10. Removal of Web3Forms → Task 11. Removal of `SideQuests`/`Skills` → Task 12. Final responsive/accessibility/performance pass → Task 13. No spec section is unaccounted for.

**Placeholder scan:** every task's code blocks are complete, real files — no `TODO`/`TBD`/"add appropriate X" anywhere. The one deliberately incomplete content in this plan is Medical CV's three `kind: "placeholder"` figures (Task 1, Step 4) and the `metrics: undefined` on that same entry — both are the spec's own explicit instruction ("no lab imagery exists yet — never fabricated"), not a plan-writing shortcut, and `Figure.tsx` already has real, shipped handling for the `"placeholder"` kind (Cycle 1).

**Type consistency:** `CaseStudy.metrics` becomes optional in Task 1 and every later task that reads it (Tasks 5, 6) guards with `facultyOps.metrics && facultyOps.metrics.length > 0` / same for `airspace.metrics` before rendering — `MedicalVisionCaseStudy` (Task 4) doesn't reference `.metrics` at all, consistent with it having none. `ArchitectureDiagram`'s exported `ArchNode`/`ArchEdge` types (Task 3) are imported by name and used with matching field names in Tasks 5 and 6 (`id`/`x`/`y`/`w`/`label`/`sublabel` for nodes, `from`/`to`/`dashed` for edges) — no mismatch. `awayFromKeyboard` is a plain `string` (Task 1) and Task 10's `About.tsx` renders it directly as text content, no shape mismatch.

## Open questions carried into execution (flagged inline above, repeated here for visibility)

1. **Medical CV narrative** (Task 4, Step 1): confirm with the user whether the old `About.tsx` VIP blurb (laser ablation / endoscopic imagery / 3D Slicer) and the spec's Medical CV facts (simulated renal environment, calcium model stones) describe the same project or two different ones, before finalizing copy.
2. **Salesforce entry** (Task 1, Step 5): the spec names 4 of the 6 pre-existing `experiences` entries for explicit condensing and doesn't mention the Salesforce internship — this plan keeps it rather than inferring removal; confirm with the user if they'd rather drop it.
3. **`awayFromKeyboard` "food"** (Task 1, Step 3): the spec's literal content list includes "food" but nothing in the current `sideQuests` data backs a food-related fact — this plan omits it; confirm with the user if they want a specific line added.
4. **Other Projects trimming beyond Todo App** (Task 1, Step 6): the spec names only Todo App as an explicit exclusion example ("no Todo App / beginner coursework") — this plan doesn't infer any further removals from the 11 remaining `projects` entries; confirm with the user if any others (e.g. Student Performance Visualization) should also drop.
