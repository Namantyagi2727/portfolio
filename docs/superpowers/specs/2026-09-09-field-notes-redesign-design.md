# Engineering Field Notes Redesign — Design Spec

**Date:** 2026-09-09
**Status:** Approved by user, pending implementation plans

## Overview

Full visual-system and information-architecture redesign of the portfolio,
superseding the "Systems Notebook" redesign that merged into `main` one day
prior (`5e6d9ec`, warm-dark + Fraunces serif + ochre accent). This redesign
replaces that visual language entirely — warm-dark editorial → **warm-light
editorial / research-document / field-notes** — while reusing whatever
factual content, working functionality, and reusable components from it
still fit.

Target feel: "an engineer's field notes made public." Recruiter-credible,
technically specific, restrained. Not a generic AI-portfolio template.

## Why

The Systems Notebook redesign fixed the *generic dark AI-portfolio* problem
but the user wants to go further: a distinct **light** editorial system —
Paco Coursey-style typographic restraint + scientific-paper presentation +
real engineering case studies — that leads with Prism, NYU/engineering
background, computer vision research, and published research, and proves
"builds real systems, not notebooks or demos."

## Goals

- Warm-light editorial visual identity: `#F6F5F0` background, near-black
  text, one dominant accent (muted blue `#355C8A`), one reserved secondary
  annotation color (muted red `#A54A42`) used only for figure labels/small
  research metadata.
- Sans (Geist) for prose/headings, mono (Geist Mono) only for dates,
  figure labels, metadata, stack tags — never for body copy.
- Four flagship "case studies" (Prism, Medical CV, Faculty Ops, Airspace),
  each visually distinct in composition, sharing a common typographic/
  figure/metric grammar rather than one repeated card template.
- A consistent `FIG. NN` figure/annotation system as the site's visual
  motif, used only where it communicates real material.
- Every number on the site traceable to a real, verified source (repo
  READMEs, local codebases) — no invented metrics, ever. Two real
  inaccuracies caught during this spec's research are corrected as part of
  the work (see **Content accuracy corrections** below).
- Technology appears contextually inside case studies, not as a skills
  wall.

## Non-goals

- No light/dark toggle in this pass. Light only. Dark mode (if ever) is a
  future, separate piece of work using this spec's own dark tokens — never
  the ochre/serif system being retired.
- No Kubernetes/cloud-deployment claims, no fabricated screenshots, no
  fabricated Faculty Ops inter-app data flow (see below).
- No 3D/WebGL, particles, glow, gradients, glassmorphism, typewriter
  effects, skill badge walls, gamified personality cards.
- Cycle 1 (this first implementation plan) does not touch Medical CV,
  Faculty Ops, or Airspace case studies, Experience, Research, About, Other
  Projects, or Contact/Footer — see **Phasing**.

## Visual system

- **Background:** `#F6F5F0`. **Primary text:** `#171715`. **Secondary
  text:** `#6A6963`. **Borders:** `#D8D6CF`. **Subtle surface:** `#ECEAE4`.
- **Primary accent:** `#355C8A` (links, active states, primary CTAs, figure
  pulse/hover states).
- **Secondary annotation accent:** `#A54A42` — reserved for figure labels
  (`FIG. 01`) and small research metadata only. Never used at the same
  visual weight as the primary accent.
- **Type:** `Geist` (sans, already loaded via `next/font/google` in
  `layout.tsx`) for headings/body/nav. `Geist Mono` (already loaded) for
  dates, figure labels, stack tags, metrics. Drop the `Fraunces` import and
  all serif usage. Tighter tracking on large headings.
- **Motion:** Framer Motion, 150–450ms, opacity/vertical-reveal and
  figure-reveal only. No continuous/ambient animation. Full
  `prefers-reduced-motion` support — site must hold up with all motion
  disabled.

## Information architecture

1. Hero
2. Selected Work (four case studies + Other Projects index)
3. Experience
4. Research / Publications
5. About (+ Away From the Keyboard)
6. Contact / Footer

No standalone Skills section. No standalone Certifications wall
(certifications become minor metadata under About). Cmd+K command palette
retained as the one OS-inspired interaction, entries updated to the new IA.

## Data architecture (`src/lib/data.ts`)

Restructure from the current flat `projects: Project[]` into explicit
divisions. New types (exact field lists to be finalized during planning,
shape below is the contract):

```ts
export type Metric = { value: string; label: string };

export type Figure = {
  id: string;            // "FIG. 01"
  caption: string;
  kind: "screenshot" | "diagram" | "placeholder";
  src?: string;           // present for screenshot; diagrams are components
};

export type CaseStudy = {
  slug: string;
  caseNumber: string;     // "001"
  category: string;       // "AI Infrastructure"
  year: string;
  title: string;
  problem: string;        // one-sentence problem statement
  description: string;
  metrics: Metric[];
  stack: string[];
  figures?: Figure[];      // factual figure metadata/assets; components may render differently
  links: { label: string; href: string; external?: boolean }[];
};
```

`personal`, `experience`, `publications`, `education`, `certifications`
keep their current shapes (content edits happen per-cycle, no structural
change to those types in Cycle 1). `skills` and `sideQuests`/`funStats` are
retired as separate concerns — `sideQuests` content migrates to a single
`awayFromKeyboard` string/short list (Cycle 2), `skills` content is
absorbed into each `CaseStudy.stack` plus the existing per-project tags on
non-flagship work (Cycle 2 for full migration; the type is defined now).

Cycle 1 populates only the Prism `CaseStudy` entry. The other three case
studies get their entries in Cycle 2, once their respective components
exist — no half-filled data left dangling in between.

## Component architecture

**Reused / re-skinned (not rebuilt):**
- `CommandPalette.tsx` / `CommandPaletteContent.tsx` — re-skin to new
  tokens; entries updated to new IA (full entry list finalized in Cycle 2
  since most targets don't exist until then; Cycle 1 adds Prism + Hero
  anchors only).
- `PrismFlowDiagram.tsx` — existing hand-built SVG/Framer diagram of
  Prism's real request flow. Redrawn to new palette/typography as FIG. 01,
  not rebuilt from scratch.

**New (Cycle 1):** `SectionLabel.tsx`, `Figure.tsx`, `ProjectMetric.tsx`,
`PrismCaseStudy.tsx`. Hero and Navbar rebuilt in place.

**New (Cycle 2):** `ArchitectureDiagram.tsx` (shared primitive for the
Faculty Ops module map and Airspace streaming diagram — Prism keeps its
own `PrismFlowDiagram`, not forced through this), `MedicalVisionCaseStudy.tsx`,
`FacultyOpsCaseStudy.tsx`, `AirspaceCaseStudy.tsx`, `OtherProjects.tsx`,
`Research.tsx` (replaces `Publications.tsx`), `Footer.tsx` contact rewrite.

**Removed:**
- `Skills.tsx` — deleted, no replacement component (contextual only).
- `JourneyMap.tsx` and its `d3-geo`/`d3-selection`/`d3-zoom`/
  `react-simple-maps`/`topojson-client` dependencies — deleted (Cycle 2,
  since About isn't touched until then; confirm nothing else imports these
  before removing from `package.json`).
- `Contact.tsx`'s Web3Forms form + the `NEXT_PUBLIC_WEB3FORMS...`
  config/access-key references — deleted (Cycle 2), replaced by a direct
  `mailto:` link section. Confirm no other component references the
  Web3Forms key before removing it from wherever it's stored.
- `SideQuests.tsx` — deleted (Cycle 2), replaced by a single "Away From the
  Keyboard" line under About, not a component of its own necessarily (folded
  into `About.tsx` unless it earns separate treatment during implementation).

## Section design

### Hero (Cycle 1)

Per spec section 6: small metadata line, name, three-line statement ("I
build AI systems that operate on real-world data." or equivalent, tone
matched not copied verbatim), supporting sentence, secondary metadata (MS
CS · NYU Tandon, New York), links (`Selected work ↓`, `GitHub ↗`,
`LinkedIn ↗`, `Résumé ↗`), and a small `NOW` / `RECENTLY` module:

- `NOW` — Computer Vision Research, NYU FAMS Lab (verified: Sep 2026–present).
- `RECENTLY` — Built Prism, LLM Gateway & Control Plane.

No globe, no typewriter, no particle field. Substantial whitespace is the
point.

### Selected Work — Prism (Cycle 1)

`CASE STUDY / 001 · AI INFRASTRUCTURE · 2026`. Verified facts, exact
figures from `docs/architecture.md` and `README.md` in the local `LLM
Gateway` repo (source of truth if anything ever conflicts):

**Verified benchmark results** (each metric labeled by its actual test
context, not presented as one universal number):
- `245–259 req/s` combined throughput, `0%` unintended error rate — main
  combined load test
- `p50 ~25ms / p95 ~80ms` gateway overhead — isolated from provider
  latency, at 10 concurrent users
- `p50 ~130ms / p95 ~250ms / p99 ~340ms` gateway overhead — at 50
  concurrent users; preserved honestly as the point where the <50ms p95
  target is exceeded under load, not hidden
- `0.00%` failure on fast-model requests (1 stray timeout / 31,488
  requests) — fallback chain during a simulated total Ollama outage
- ~20% cache hit rate; ~9.9% guardrail block rate — matches the load
  test's intentional 10% PII-triggering traffic mix

**What broke:** the rate limiter and exact cache each opened a new Redis
connection per request; at ~300 req/s this produced a 77% error rate under
connection churn. Fixed with one shared module-level Redis client — 0%
after. This is presented as a first-class part of the case study (per spec
section 9), not a footnote.

**FIG. 01 — Request flow** and **FIG. 02 — Infrastructure topology**:
redrawn from the real mermaid diagrams in `docs/architecture.md` (Auth →
Guardrail → Cache → Router/circuit-breaker → Provider → Cost log → Cache
write; and the docker-compose topology: app/Postgres+pgvector/Redis/
Jaeger/Prometheus/Grafana, Ollama on host).

**Screenshots:** real assets from `LLM Gateway/docs/screenshots/` —
`dashboard-overview.png`, `dashboard-cost.png`, `dashboard-performance.png`,
`dashboard-safety.png`, `grafana.png`. Copied into this repo's `public/`
(new subdirectory, e.g. `public/case-studies/prism/`).

**Stack line:** `FastAPI / PostgreSQL / Redis / Prometheus / Grafana /
Jaeger / Ollama / Docker Compose`.

Cycle 1's definition of done: this section alone should look shippable —
figures, metrics, stack line, screenshots, "what broke" narrative, links
(GitHub and any genuinely available demo/documentation links — no public
demo required or invented) all in place and responsive at
375/430/768/1024/1440px.

### Selected Work — remaining three (Cycle 2, not built in Cycle 1)

- **002 Medical CV** — applied-research composition. RAW/DETECTION/
  SEGMENTATION toggle scaffolded but populated only with reserved figure
  slots (`FIG. 04A/B/C`) since no lab imagery exists yet — never fabricated.
  Research question + "my work" bullet list, scoped to verified facts only
  (continuous camera feed, simulated renal environment with water and
  calcium model stones, real-time detection pipeline, contributor role).
  Explicitly excludes accuracy/FPS/latency/dataset-size/model-choice claims
  per the user's explicit "do not currently claim" list.
- **003 Faculty Ops** — software-structure composition. Headline metrics
  `12 apps / 306 automated tests / 29 test files` (all three figures
  independently verified against the local `OFA/office-affairs-workflow-
  portal` repo during this spec's research — exact match). Visual is a
  **module/system map** listing the 12 apps (core, workflows, approvals,
  notifications, documents, audit, chatbot, workload, export,
  tenure_promotion, faculty, ami) as a structural diagram — explicitly
  *not* a request/data-flow diagram, since inter-app interactions haven't
  been verified and inventing arrows between them would fabricate
  architecture. No screenshots (none exist / none safe to expose — NYU
  internal system).
- **004 Airspace** — streaming/data-systems composition. **FIG. 07 —
  Stream Processing Architecture** redrawn (not reused as-is — the real
  `Architecture.png` in the repo is a busy auto-generated diagram that
  doesn't fit the visual system) from the verified real structure: OpenSky
  API / historical replay → Kafka (Redpanda) topics (`flight-stream`,
  `flight-metrics`, `flight-aggregates`) → Spark Structured Streaming (risk
  scoring, anomaly detection, spatial grid aggregation, 30s tumbling / 10s
  sliding windows) → InfluxDB (real-time) + MongoDB (historical) + HDFS
  (batch archive) → Streamlit dashboard.

  **Content accuracy corrections (verified against the real repo, both
  confirmed by user):**
  - The `475,000+` figure is a **generated historical dataset**
    (`augment_historical_data.py`, explicitly documented as synthetic,
    "realistic flight patterns" for testing) — not captured OpenSky
    history. Copy must say so plainly, e.g. *"475,000+ records — a
    generated historical dataset modeling realistic OpenSky-shaped traffic,
    used for testing at volume; live ingestion pulls the real OpenSky API."*
    Never imply raw captured history.
  - No `<5s latency` or `~10K msg/s throughput` target exists anywhere in
    the repo or code (grepped, not found) — **omit both**. Use the one
    real documented parameter instead: 30-second tumbling windows with
    10-second sliding intervals.

### Other Projects, Experience, Research, About (Cycle 2)

- **Other Projects** — compact text index (RAGBase, ChainGuard/BlockGuard,
  ConTicx, DiningBot, Photo Search, Sign Language Recognition, etc.), no
  Todo App / beginner coursework.
- **Experience** — minimal timeline. New top entry: **NYU FAMS Lab —
  Computer Vision Research**, display title "Computer Vision Research"
  (not a formal title not yet confirmed), Sep 2026–Present, 2–3 concise
  points scoped to the verified facts above. Existing Faculty Operations
  Platform entry (Jan–Aug 2026) stays as-is, condensed to 2–3 points.
  Mast-Jägermeister, Ciena, Essex, Ulavi condensed similarly from existing
  `data.ts` bullets — no new claims invented.
- **Research** (renamed from Publications) — bibliography-style list, all
  four entries at equal visual weight (drops the current Cambridge
  Scholars gold/featured-card treatment in favor of the uniform bibliography
  format the user's spec specifies). Google Scholar link retained. No
  invented citation counts.
- **About** — short human bio per the tone direction given (not verbatim
  copy), MS CS / NYU Tandon + B.Tech Amity as compact metadata (not a full
  timeline component), certifications folded in as minor metadata, no
  photo yet (reserved, optional slot). Away From the Keyboard as one
  understated line: F1, badminton/tennis, gym, chess, food, travel — never
  as seven cards/icons.
- **Contact/Footer** — `LET'S TALK` + one-line pitch + `Email ↗` (`mailto:`)
  / `LinkedIn ↗` / `GitHub ↗`. No form.

## Figure system

`FIG. NN` labels, uppercase mono, secondary accent color (`#A54A42`),
used only for real figures (Prism's two diagrams + five screenshots in
Cycle 1; Airspace's one diagram, Faculty Ops's module map, Medical CV's
reserved slots in Cycle 2). Not decorative, not applied to every image.

## Phasing

**Cycle 1** (this spec's first implementation plan): design tokens,
typography, spacing/layout foundation, IA skeleton, Navbar, Hero, shared
`SectionLabel`/`Figure`/`ProjectMetric` primitives, the Prism case study in
full (figures, real screenshots, metrics, "what broke" narrative, stack),
responsive behavior for everything introduced. Definition of done: Hero +
Prism section is shippable on its own, not a rough draft waiting on Cycle
2.

**Cycle 2** (separate plan, written after Cycle 1 ships): Medical CV,
Faculty Ops, and Airspace case studies (three distinct compositions, not
copies of Prism's layout), Other Projects, Experience, Research, About,
Away From the Keyboard, Contact/Footer, command-palette IA updates for the
full site, removal of superseded components/dependencies
(`JourneyMap`/`d3-geo`/`react-simple-maps`/etc., Web3Forms, `SideQuests`,
`Skills`), final responsive/accessibility/performance pass.

## Risks / open questions for the Cycle 1 implementation plan

- Confirm the exact hero copy (the three-line statement) with the user
  before finalizing — spec gives a suggested version, not mandated exact
  text.
- Confirm where copied Prism screenshots live in `public/` and whether
  `next/image` optimization needs any special handling for the 5 PNGs.
- Verify no other component references `d3-geo`/`react-simple-maps`/etc.
  before removal (deferred to Cycle 2, flagged here so it isn't missed).
- Verify no other component references the Web3Forms access key before
  removal (deferred to Cycle 2, flagged here so it isn't missed).
