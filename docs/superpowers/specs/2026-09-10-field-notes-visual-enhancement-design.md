# Engineering Field Notes — Visual Enhancement Pass — Design Spec

**Date:** 2026-09-10
**Status:** Approved by user, pending implementation plan

## Overview

A focused visual-density and pacing pass on top of the already-shipped Engineering
Field Notes redesign (warm-light editorial system, Cycle 1 + Cycle 2, live on
`main`). This is **not** a redesign — the palette, typography, IA, and every
verified fact stay exactly as they are. The problem being fixed: the site's
visual hierarchy currently has too few peaks. Every section uses the same
composition (mono label → heading → rule → paragraph → list), so nothing reads
as a deliberate visual moment, and the Hero in particular has too much unused
space with no signature visual object.

The target rhythm is **quiet → visual → quiet → visual → quiet** — a small
number of strong, distinct visual moments (a real product screenshot, an
engineering diagram, a scientific schematic, a metrics-first structural
figure, a dimensional Hero object), not decoration applied uniformly, and not
a return to the retired dark/neon aesthetic.

## Preserve (unchanged by this pass)

- Warm-light paper palette: `#F6F5F0` background, `#171715` text, `#6A6963`
  muted, `#355C8A` primary accent, `#A54A42` annotation accent, `#D8D6CF`
  borders, `#ECEAE4` surface.
- Geist / Geist Mono typography, mono reserved for dates/labels/metadata/stack
  tags/figure numbers, never body copy.
- The `FIG. NN` figure/annotation system.
- Every verified fact, number, and framing already shipped — this pass reorders
  and re-presents existing content, it does not re-verify or re-derive it. The
  one exception is one real correction below (Faculty Ops's `ami` grouping and
  `chatbot`'s planned status), caught by re-checking the source repo, not a
  content decision.
- Current information architecture: Navbar → Hero → Selected Work (4 case
  studies + Other Projects) → Experience → Research → About → Footer. This
  pass adds exactly one new route (`/work/prism`); no existing anchor/section
  moves or is removed.
- Current accessibility and `prefers-reduced-motion` behavior — every new
  motion-bearing piece (the globe) must respect reduced-motion at least as
  strictly as the existing Hero/Prism-diagram pattern does.
- Technical honesty: no fabricated screenshots, no invented metrics, no
  claims not traceable to a verified source.
- No return to neon/glow/particle/glass/gradient decoration anywhere.

## Non-goals

- No new content sections, no IA changes beyond the one new Prism route.
- No redesign of Experience, Contact's structure, or the command palette.
- No attempt to generate a live Airspace dashboard screenshot in this pass —
  infeasible without standing up its full Kafka/Spark/InfluxDB/MongoDB/HDFS
  stack; the architecture diagram remains primary, but the section is composed
  so a real screenshot can be dropped in later without restructuring it.
- No publication cover image for Research (typography only, per explicit
  owner decision — avoids copyright/hotlinking questions around
  publisher-owned cover art).
- No generic reusable "TechnicalMotif" component. Coordinate notation, leader
  lines, and margin annotations are applied only where a specific section
  already calls for them (Hero's city panel, Contact's closing echo, the
  existing `Figure` framing) — not sprinkled site-wide.

## 1. Hero — two-column layout + restrained 3D globe

### Layout

`Hero.tsx` becomes a two-column grid at `lg:` and above:

- **Left** (unchanged content, same copy): name, three-line statement,
  supporting sentence, NYU/location metadata, GitHub / LinkedIn / Email /
  Résumé links, NOW / RECENTLY module.
- **Right** (new): `<HeroGlobe />`, roughly 440–480px.

**Height:** remove `min-h-screen` from the hero `<section>`. Content height
determines the section's height naturally, so Selected Work's heading begins
to enter the viewport at a typical 1440×900–1000 desktop load, per the success
test below.

**Responsive:** globe is not simply hidden below `lg:`. At tablet/mobile
widths it renders *after* the left column's content and CTAs in normal DOM
order, at a smaller fixed size (~240–280px) — a user never has to scroll past
a large 3D object to reach the left column's links or Selected Work. Only
fall back to hiding it at some breakpoint if implementation/testing shows no
workable layout exists there — this is a last resort, not the default.

### The globe: technical tradeoff, decided

Reuses `cobe` (~5KB WebGL globe library), the same library the site's
*original* pre-redesign Hero used (deleted in commit `7949617`, never fully
removed from history — retrievable via `git show`). **`cobe` is not currently
a dependency and must be added.**

**Explicit, deliberate compromise:** `cobe` renders landmass as a dot-matrix
texture (density controlled by `mapSamples`), not true vector line borders.
It cannot literally produce "thin cartographic line outlines." A vector-based
alternative (real GeoJSON country borders projected onto a Three.js sphere)
could achieve that literally, at real cost: a new, heavier library, a country-
border data file, a more complex scene — directly working against this spec's
own performance requirements, on a library with no track record in this
codebase. **Decision: `cobe`, tuned as a fine stippled technical texture** —
low `mapSamples`, muted stone/near-white base color, no glow layer, no flight
arcs. This is accepted as the closest safe, performant approximation of
"technical illustration / drafting model," not literal line-art. Document
this plainly in code comments so a future reader understands it's a
considered tradeoff, not an oversight.

**Config, informed by the old (deleted) implementation's structure, retuned:**

- `baseColor` near `--surface` / a muted stone tone (not nearly-black).
- `markerColor` a muted variant of `--accent` (not saturated cyan).
- No `glowColor` layer — fully suppressed (not the old purple radial glow).
- No flight-path arcs between cities (the old `JourneyMap` had arcs; this
  globe does not — markers/spotlight only).
- Markers: exactly 3 verified personal locations — Brooklyn NY
  (40.6782°N, 73.9442°W), London (51.5074°N, 0.1278°W), New Delhi
  (28.6139°N, 77.2090°E). The old implementation's 4th marker (San Francisco)
  is dropped — not one of the locations this brief names as verified.

**Motion:**

- Reuse the old file's spotlight state-machine *structure* (rotating →
  holding → next city, with pointer-interaction override), but retune it
  dramatically slower and calmer: much longer hold duration, much slower
  lerp. City changes should feel infrequent and deliberate, not a carousel.
- **Default/starting state emphasizes Brooklyn/New York** — matches the old
  file's existing default (`SPOTLIGHT_PHIS[0]` was already Brooklyn) and the
  site's real base of operations.
- No pulsing markers, no attention-grabbing animation of any kind — markers
  are static dots, only the globe's slow rotation and the spotlight state
  change.
- Pointer interaction may allow slight manual rotation (reuse the old file's
  drag-to-rotate pattern), but this is optional, not the primary interaction.
- **`prefers-reduced-motion: reduce` renders one fully static orientation** —
  no rotation loop starts at all, gated the same way `Hero.tsx`'s existing
  `useReducedMotion()` check already gates its entrance animation. This is a
  hard requirement, not a "reduce speed" — no motion runs.

**Coordinate/city annotation panel:** a small fixed text block near the globe
(not projected onto the rotating canvas — `cobe` doesn't expose 3D→2D
projection math, and attempting it is unnecessary complexity for this brief)
showing the currently-spotlighted city's name and real coordinates, e.g.
`BROOKLYN, NY — 40.6782°N 73.9442°W`, updating when the spotlight changes.
Mono type, small, matching the site's existing figure-label conventions.

**Loading:** `HeroGlobe.tsx` is a client component, lazy-loaded via
`next/dynamic(..., { ssr: false })` — the exact pattern this codebase already
used for the old `JourneyMap` (`About.tsx`, pre-Cycle-2). No SSR attempt for
the canvas itself; the left column's text content is what must be
SSR-visible (already true, and Hero's existing SSR-visibility fix from the
prior session is untouched by this work).

**Performance:** no additional textures beyond `cobe`'s built-in world-map
data. Lazy-loaded so it doesn't block the rest of the page's Lighthouse
metrics. `devicePixelRatio` capped at a reasonable value (the old file used
2; keep or reduce, not increase).

## 2. Prism — homepage preview + dedicated case-study route

### Route

New: `src/app/work/prism/page.tsx` (a real Next.js App Router page — inherits
the root layout, so Navbar/Footer/command palette all still function there).
Own `metadata` export (title/description specific to the case study, in the
site's existing metadata style).

At the top of the page, a small return-navigation element — `← Selected Work`
or `WORK / 001` — linking back to `/#work`. Not an elaborate sub-navigation
or sidebar; revisit only if the page's content later genuinely grows long
enough to need one.

### Component split

`PrismCaseStudy.tsx` splits into two components (the underlying `data.ts`
entry for Prism does not change shape — both components read the same
`caseStudies` entry):

- **`PrismPreview.tsx`** (homepage, replaces `PrismCaseStudy.tsx` inside
  `SelectedWork.tsx`): title → short description → one large real screenshot
  (`dashboard-overview.png`, via the existing `Figure`/`next/image` pipeline,
  no new image-sizing work needed) → exactly 3 `ProjectMetric`s → the new
  compact diagram (below) → `Explore case study →` link to `/work/prism`.
- **`PrismDetail.tsx`** (new, rendered only by the route): full 5-metric
  benchmark grid, the existing full interactive `PrismFlowDiagram.tsx`
  (**unchanged** — cache/breaker toggles and all), `PrismInfraDiagram.tsx`,
  all 5 screenshots, the Redis "what broke" story, stack line, links
  (GitHub, project page).

**Preview metrics, exact contexts preserved verbatim** (do not shorten past
the point of misleading):

- `245–259 req/s` — combined throughput
- `~80ms p95` — gateway overhead, explicitly at 10 concurrent users
- `0.00%` — failure rate, explicitly the simulated provider-outage test, with
  the existing full caveat (1 stray timeout in 31,488 requests) available
  immediately alongside or on the detail page — not dropped.

### The compact diagram — `PrismFlowDiagramCompact.tsx` (new)

Same 9 real pipeline stages as the existing `PrismFlowDiagram.tsx`, but:

- **Non-interactive** — no cache/breaker toggle buttons. Those are
  exploratory depth appropriate to `/work/prism`, not a homepage scan.
- **Shows only the nominal, default, cache-miss, no-failure straight-through
  path** — no cache-hit-bypass curve, no failure-retry curve, no branch
  annotations. This is a deliberate simplification, not an omission that
  could mislead: **the caption must make the scope explicit** (see figure
  numbering below), and the diagram must not visually imply that a cache hit
  still reaches the provider, or that failure handling doesn't exist
  elsewhere — it simply isn't showing those branches here.
- **Fixed height budget, single vertical column at every width.** The
  current diagram's actual problem isn't its node styling, it's that it's a
  `w-full` SVG whose rendered height scales with whatever column width
  contains it — at the homepage's real column width this produces something
  close to the reported ~1500px. The compact version gets its own
  width-capped container (e.g. `max-w-sm`, centered) so it renders short
  (roughly 500–700px worth of stages) regardless of screen size, and never
  needs horizontal scroll on mobile, because it's the same single-column
  layout at every width — no separate mobile variant needed.
- Exact node coordinates/spacing are implementation-plan detail, not spec
  detail (matching how Cycle 2's Faculty Ops/Airspace diagrams were
  specified here and nailed down precisely in that plan).

### Figure numbering (site-wide — this is the authoritative table now)

The live site currently has: Prism `FIG. 01–07`, Medical CV `FIG. 08A/08B/08C`
(the toggle, being replaced), Faculty Ops `FIG. 09`, Airspace `FIG. 10`. This
pass:

| Figure | Location | Change |
|---|---|---|
| `FIG. 01A — NOMINAL REQUEST PATH` | Homepage preview | New label; the compact diagram |
| `FIG. 01B — COMPLETE REQUEST FLOW` | `/work/prism` | Existing `PrismFlowDiagram.tsx`, unchanged, relabeled |
| `FIG. 02` | `/work/prism` | Existing infra diagram, unchanged |
| `FIG. 03–07` | `/work/prism` | Existing 5 screenshots, unchanged |
| `FIG. 08` | Medical CV | Collapses from `08A/08B/08C` (3 placeholder toggle figures) to one real schematic figure — see §3 |
| `FIG. 09` | Faculty Ops | Unchanged |
| `FIG. 10` | Airspace | Unchanged |

**Do not renumber anything downstream to match an earlier illustrative
example** (an earlier draft of this brief suggested `FIG. 04` for Medical
CV's schematic — that collides with a live Prism screenshot and is
superseded by this table, exactly as a prior spec/plan mismatch was caught
and corrected once before in this project). The live sequence stays stable;
only Medical CV's own slot changes shape.

## 3. Medical CV — compact research note, no more empty toggle

Replaces the current `RAW / DETECTION / SEGMENTATION` toggle (three
`kind: "placeholder"` figures, `useState` tab logic) entirely — it reads as
unfinished and adds no information a first-time visitor can use.

New: `MedicalPipelineSchematic.tsx`, a single hand-built SVG in the same
grammar as the site's other diagrams (`ArchitectureDiagram`-style node/edge
primitives, or a bespoke small vertical-flow component if simpler — plan-time
decision), showing the real, verified experimental setup as one vertical
flow:

```
CAMERA
  ↓
SIMULATED KIDNEY
water + model calcium stones
  ↓
VIDEO STREAM
  ↓
CV PIPELINE
  ↓
STONE DETECTION
```

Caption: **`FIG. 08 — EXPERIMENTAL PIPELINE`**. This is not fabricated
imagery — it represents the verified experimental setup, not a claimed
result.

`MedicalVisionCaseStudy.tsx` loses its toggle state entirely (no `useState`,
no tab buttons, no `VIEWS` array) — simpler component: title → research
question → the schematic → a `CURRENT FOCUS` list (continuous video
ingestion, real-time stone identification, CV pipeline development) → stack.

**No accuracy/FPS/latency/dataset-size/model-choice claims, no detection
imagery, no fabricated results** — unchanged from the existing constraint;
this pass doesn't add any of these, and none should be added until they're
genuinely available. When real imagery eventually exists, it replaces or
supplements this schematic — not scope for this pass.

`data.ts`'s `medical-cv` entry: `figures` array shrinks from 3
`kind: "placeholder"` entries to one `kind: "diagram"` entry (the schematic
is a drawn component, same convention as Prism's/Faculty Ops's/Airspace's
diagram figures, not a static image).

## 4. Faculty Ops — module map becomes a labeled functional index

Keeps `ArchitectureDiagram`/`FacultyOpsModuleMap.tsx` and the `12 / 306 / 29`
metrics grid (unchanged, still the primary visual signal, still rendered
before the diagram). The diagram itself changes from one large undivided
boundary box around 12 uniform boxes to **3 grouped boxes** (reusing
`ArchitectureDiagram`'s existing `groups` prop — just more of them, no new
primitive needed):

- **CORE PLATFORM** — `core · faculty · workflows`
- **OPERATIONS** — `approvals · workload · tenure_promotion · ami`
- **SYSTEM SERVICES** — `notifications · documents · audit · export · chatbot`

**Content-accuracy corrections made while designing this grouping** (caught
by re-reading the OFA repo's README before finalizing, the same verification
discipline the rest of this project has used throughout):

- `ami` is **Annual Merit Increase** — a compensation/HR business process,
  per the README's own feature list. It is **not** AI/ML-related and must
  not be grouped or labeled as such. It belongs with the other business-case
  apps (workload, tenure & promotion).
- `chatbot` is documented in the README with a **🚧 planned** marker (RAG
  over policy documents) — it exists as a Django app in `INSTALLED_APPS`
  (so it stays in the 12-app count and the grouping), but the portfolio must
  not visually present it as completed, shipped functionality without
  qualification. Give it a small `planned` annotation, or a distinctly
  understated text treatment (e.g. muted/dashed styling matching the site's
  existing convention for not-yet-real content — `Figure.tsx`'s
  `kind: "placeholder"` styling is the established precedent for "real but
  not yet shown," reuse that visual language rather than inventing a new
  one) — plan-time decision on exact treatment.

**Required caption, exact wording:**
`Modules grouped by function for presentation; not a dependency graph.`

No arrows or lines between groups or between apps — this remains
deliberately a structural index, not a claimed data-flow or dependency
graph, per the original Cycle 2 constraint (unchanged, still binding).

## 5. Airspace — unchanged this pass

No component work. The architecture diagram (`FIG. 10`) remains the primary
visual, per explicit owner decision (no real screenshot exists in the repo;
generating one live would require standing up the project's full
Kafka/Spark/InfluxDB/MongoDB/HDFS stack, not practical here). The existing
`475,000+ generated historical records...` framing is preserved exactly —
this pass does not shorten or rephrase it.

One soft requirement for the implementer: compose `AirspaceCaseStudy.tsx` so
that a future real dashboard/map screenshot can be added as the lead visual
later without restructuring the section (e.g., don't hard-code assumptions
that only a diagram will ever occupy that slot) — no new code needed now,
just don't paint into a corner.

## 6. Research — one publication, typography-only emphasis

Keeps the uniform bibliography format (no return to differently-styled
cards). One entry — the 2026 Wiley / *Human Behavior and Emerging
Technologies* journal article — gets slightly stronger typographic
treatment than the other three: its title renders larger/bolder than its
siblings, and its `97.15%` figure is pulled forward with **explicit source
context**, not presented as a generic metric. Required framing (exact
wording may be refined at implementation time, but the shape is fixed):

```
97.15%
reported AI-model accuracy in the study
```

— never bare `97.15% accuracy` with no qualifier, which would read as a
general project/portfolio performance claim rather than a specific reported
research result. The publication's title and venue stay more visually
prominent than the number; the number supports the citation, it does not
turn Research into a benchmark dashboard. No cover image, no publisher
asset — typography only, per explicit owner decision (avoids
copyright/hotlinking risk around publisher-owned cover art).

## 7. About — space for a real photo later, restored interest

Add `personalInfo.photo?: string` to `data.ts` — optional, currently unset.
`About.tsx`'s layout is composed so that:

- If `photo` is unset (true today): renders exactly as the current
  text-only composition — no empty container, no reserved blank space, no
  visual gap where an image "should" be.
- If `photo` is set later: renders as a modest personal photograph (a
  portrait, travel, or F1 photo per the owner's own framing) in proportion
  with the bio text — not a second hero image, not a large dominant visual.

Interests line: restore **"gaming"**, which the current live copy
(`awayFromKeyboard`) dropped when it was condensed during Cycle 2 — it was a
real fact in the pre-Cycle-2 data (the original side-quest was "Console +
Chess Strategist"), not a new invention. Target phrasing direction: `F1 /
badminton + tennis / the gym / gaming / chess / food / travel` (exact
wording is copy-polish, not a structural change) — stays one understated
line, no icons, no cards, matching the section's existing restrained
treatment.

## 8. Contact — a stronger closing line

Replace the current pitch line with a short, voice-consistent closing
statement:

**`LET'S BUILD SOMETHING USEFUL.`**

followed by the existing `Email ↗` / `LinkedIn ↗` / `GitHub ↗` row,
unchanged in structure. Add one small, subtle coordinate-style annotation
echoing the Hero's city panel — **city-level coordinates only** (the same
Brooklyn/New York pair already used by the globe: `40.6782°N 73.9442°W` or
similar rounding), never a precise personal/home address. This closes the
visual loop between Hero and Footer without introducing a new visual
language — reuses the same mono/coordinate convention, doesn't invent one.
No contact form (unchanged constraint from Cycle 2).

## 9. Section density / rhythm

The organizing principle for the whole homepage, applied by making sure each
section's *dominant* visual element genuinely differs from its neighbors —
not by forcing identical structure everywhere:

| Section | Dominant visual |
|---|---|
| Hero | Two-column + dimensional globe |
| Prism | Large real product screenshot |
| Medical CV | Scientific schematic |
| Faculty Ops | Metrics + structural functional index |
| Airspace | Architecture/stream diagram (unchanged) |
| Experience | Quiet timeline (unchanged) |
| Research | Editorial bibliography, one typographically emphasized item |
| About | Personal (photo-ready), understated |
| Contact | Strong closing statement |

This table is the target; it doesn't require new components beyond what's
specified in §1–8 above — it's the reason those specific sections were
chosen for visual work and others (Experience, the command palette, the
overall IA) were explicitly left alone.

## 10. Recurring visual motifs — guidance, not a component

No new shared "decoration" component. Coordinate notation, leader lines,
drafting-style marks, and margin annotations are used only where a specific
piece already calls for them:

- **Hero** → geographic identity (the city/coordinate panel next to the
  globe).
- **Figures throughout the site** → technical documentation (the existing
  `FIG. NN` system, unchanged, already the site's primary recurring motif).
- **Contact** → a subtle geographic echo of the Hero (§8).

That is the full extent of this pass's use of the motif — not a grid overlay,
not applied to every section, not a new global visual layer.

## New dependency

- `cobe` (~5KB) — the only new npm dependency this pass introduces. Used only
  by `HeroGlobe.tsx`.

## Risks / open questions for the implementation plan

- Exact SVG coordinates for `PrismFlowDiagramCompact.tsx`,
  `MedicalPipelineSchematic.tsx`, and the Faculty Ops 3-group layout are
  plan-time detail, not nailed down here (matching how Cycle 2 handled the
  equivalent diagrams).
- Exact visual treatment for `chatbot`'s "planned" annotation (small text tag
  vs. `Figure`'s placeholder-style dashed/muted treatment) — plan-time
  decision, both directions satisfy this spec's requirement.
- `cobe`'s TypeScript types and exact `Marker`/`onRender` API surface should
  be re-confirmed against the currently-installed version at implementation
  time (the reference implementation pulled from history predates this
  session and may target an older `cobe` API).
- Confirm at implementation time whether `/work/prism`'s metadata needs a
  dedicated OG image or can reuse the site-wide `opengraph-image.tsx` route.
