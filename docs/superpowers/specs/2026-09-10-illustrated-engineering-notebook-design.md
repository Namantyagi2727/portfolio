# Illustrated Engineering Notebook — Design Spec

**Date:** 2026-09-10
**Status:** Authorized — internal working document. The user's redesign brief
(pasted in-session) is the source of truth for requirements; this document
pins down the specific values and technical decisions the brief leaves to
implementation judgment, so all four phases share one system instead of each
improvising its own tokens.

## Scope and phases

Four consecutive phases of one authorized redesign, no approval gate between
them:

1. **Visual language + Hero.** Tokens below, Hero rebuild, globe contrast/
   interaction/motion fixes, one representative project preview (Prism, since
   it already has real assets and is contractually first in Selected Work).
2. **Selected Work.** The other three project previews with original
   illustrations, plus a compact Other Projects index.
3. **Case studies.** Extend the case-study template to Medical CV, Faculty
   Ops, Airspace at a depth proportional to their actual evidence; responsive
   diagram treatment; on-page contents nav for long pages.
4. **Remaining sections.** Experience, Research, About, Side Quests, Contact.

Nav bug (Navbar/CommandPalette breaking off the homepage) is already fixed
ahead of Phase 1 — commit `25f5586`.

GitHub README prep is out of scope for this pass; reusable choices are noted
inline below (§ Reusable identity for GitHub) as they're decided.

## Capability constraint (stated up front, not a question)

There is no image-generation or photo-illustration tool available in this
environment. "Custom technical illustrations" means hand-built inline SVG —
extending the exact drawing grammar the existing diagram system
(`ArchitectureDiagram.tsx`, `diagram-tokens.ts`) already established
(consistent stroke weight, muted surface fills, mono labels), made more
pictorial/illustrative (real silhouettes — a camera, a document, a flight
path — not just boxes and arrows), not freehand painterly artwork. This is
consistent with the brief's own instruction to develop original artwork
rather than recreate a reference's style, and it's the same medium the site
already uses successfully for its diagrams.

## Color

Keep all 10 existing CSS custom properties in `globals.css` unchanged —
they already match the brief's warm-light direction:

```
--background: #f6f5f0        --surface: #eceae4
--background-alt: #efede6    --border: #d8d6cf
--foreground: #171715        --border-strong: #c4c1b6
--muted: #6a6963
--accent: #355c8a            (main accent, muted blue)
--accent-tint: #4c74a3
--accent-secondary: #a54a42  (rust/clay, selected annotations only)
```

**New:** `src/lib/illustration-tokens.ts` — per-project illustration accents
("additional subdued colors within project imagery," never used outside
that project's own cover/illustration, never promoted to a global CSS var).
Each is desaturated to match the site's existing muted chroma level, so they
read as one family, not four unrelated brand colors:

```ts
export const PRISM_ACCENT = "#355C8A";     // reuses the main accent — Prism is the flagship, no new hue needed
export const MEDICAL_ACCENT = "#5C7A5E";   // muted sage — clinical/biological association
export const FACULTY_ACCENT = "#A67C3D";   // muted ochre — paperwork/workflow warmth
export const AIRSPACE_ACCENT = "#5B7089";  // muted slate-blue — distinct from the primary accent, reads as sky/instrumentation
```

Reuse `diagram-tokens.ts`'s existing `SURFACE`/`BORDER_STRONG`/`MUTED`/
`FOREGROUND` for every illustration's structural linework; only the single
focal accent color varies per project.

## Typography

- **Geist Sans** (headings, body) and **Geist Mono** (metadata, figure
  labels, technical values, nav eyebrows) — both already in place, both
  already meet "highly readable primary typeface." No new dependency, no
  FOUT risk, no reason to replace what already works.
- **New: one handwritten accent, Caveat**, loaded via `next/font/google`
  alongside the existing Geist fonts. Used in at most a handful of specific
  spots called out per-phase (Hero's city-panel micro-annotation, a Side
  Quests margin note, About's margin note) — never for a heading, nav item,
  button, or body paragraph. This is the brief's "occasional informal
  annotation," not a second body typeface.
- **Type scale additions** (Tailwind arbitrary-value clamps, not new CSS
  vars — consistent with how Hero's headline already does this):
  - Display (Hero headline): `clamp(40px, 6.5vw, 76px)` — unchanged, already correct.
  - **New — section heading**: `clamp(28px, 4vw, 40px)`, bold. Paired with
    the existing mono eyebrow inside a rebuilt `SectionLabel`, so "Work,"
    "Experience," "Research," "About" each render as a real heading, not
    only a small caps label — directly answers the brief's "clearly
    distinguishable while scrolling" requirement. This is the single
    highest-leverage shared-component change since every section consumes
    `SectionLabel`.

## Spacing and content width

- **Desktop content width:** standardize on `max-w-6xl` (1152px) everywhere.
  Today most sections use `max-w-5xl` (1024px) while `Navbar` alone uses
  `max-w-6xl` — an existing inconsistency, not a deliberate choice. 1152px
  sits inside the brief's 1120–1240px target range and unifies the whole
  site on one width.
- **Mobile side padding:** keep `px-6` (24px) — already at the top of the
  brief's 20–24px range, no change needed.
- **Desktop section spacing:** keep `py-20` (80px) as the default — already
  inside the brief's 72–104px range.
- **Mobile section spacing:** change the default section wrapper pattern to
  `py-12 sm:py-20` (48px mobile → 80px desktop) — currently sections don't
  vary padding by breakpoint at all, so mobile spacing is 80px, well outside
  the brief's 48–64px mobile target.

## Illustration line grammar

Formalized once, reused by every new illustration component (Medical CV,
Faculty Ops, Airspace, Prism's compact scene):

- Primary silhouette strokes: 1.5px, `FOREGROUND` or the project's accent.
- Structural/connective lines: 1px, `BORDER_STRONG`.
- Planned/inferred/not-yet-real elements: dashed (`3 3`), `MUTED` fill —
  reuses the exact convention `ArchNode.dashed` already established for
  Faculty Ops's `chatbot (planned)` node.
- Corner radius: 4–6px on any rect, matching existing diagram nodes.
- Exactly one focal fill per illustration, at 8–15% opacity of that
  project's accent color — everything else stays line art on
  `background`/`surface`. This is what gives each project a distinct
  silhouette without turning the illustrations into flat color blocks.
- Labels inside illustrations: Geist Mono, matching `Figure`'s existing
  caption typography.
- Covers (homepage preview, at-a-glance) stay simpler/more iconic than
  detailed diagrams (case-study page, explanatory) — same distinction the
  brief draws explicitly in § Illustration.

## Motion

- Existing Framer Motion entrance pattern (SSR-visible content, animate
  only the slide-up, full `useReducedMotion` gating) is already correct and
  unchanged.
- **New requirement surfaced by this brief and not yet met:** `HeroGlobe`'s
  `requestAnimationFrame` loop currently runs continuously regardless of
  scroll position. Phase 1 adds an `IntersectionObserver` gate — the loop
  only runs while the globe is actually on/near screen, satisfying "stop
  expensive animation when offscreen."
- No new illustration introduces a continuous loop; where an illustration
  has an optional demonstrative interaction (Prism's routing/failover demo,
  §6 of the brief), it runs only on explicit user interaction, never
  autoplaying.

## Links, buttons, focus

- **New: one primary CTA style** — solid `accent` background, off-white
  text, rounded-full, used for exactly one action per context (Hero's
  "Explore work," a case study's primary link where relevant). Secondary
  actions (Résumé) get an outlined variant of the same shape. Quiet actions
  (GitHub/LinkedIn/Email, nav links) stay plain text links as today — this
  matches the brief's "one clear primary action... quieter social/contact
  links."
- **New: explicit `:focus-visible` styling** in `globals.css` — an
  accent-colored outline, currently relying on unstyled browser default
  against a warm off-white background where it's easy to miss. Required by
  the brief's own accessibility acceptance criteria ("keyboard focus is
  visible").

## Figure / annotation system

Unchanged: the existing `FIG. NN` convention in `Figure.tsx` (mono
uppercase id + muted caption) already satisfies the brief's "figure numbers
and annotation styling" requirement and stays the site's primary recurring
motif, exactly as the prior Visual Enhancement Pass established. The one
addition is the sparing handwritten-annotation slot described under
Typography, used only where a specific spot calls for it — not a new
figure-numbering scheme.

## Case-study depth (answers brief §7 + user's adjustment 4)

One template, `CaseStudyLayout`-style section order (Overview → Problem →
Constraints → System → Decisions → Evidence → What broke/changed → Status →
Links), but **not every section is required** — a case study renders only
the sections it has real material for. Concretely:

- **Prism:** every section, substantial (existing Redis/connection-pooling
  story preserved verbatim, per user's explicit instruction).
- **Medical CV:** Overview, Problem, System (the pipeline schematic),
  Current status. No Constraints/Decisions/Evidence/What-broke sections —
  there's no verified material for them yet; inventing content to fill the
  template would violate § 9 of the brief. Short page, explicitly presented
  as ongoing research.
- **Faculty Ops / Airspace:** Overview, Problem, System, Evidence (real
  metrics), Status. Constraints/Decisions included only where the repo
  README actually documents a real tradeoff — not backfilled generically.

## Reusable identity for GitHub (recorded as decided, not implemented now)

- Palette: the accent blue (`#355C8A`) + warm off-white background as the
  two colors that must carry over; rust/clay as a restrained secondary.
- Typography principle: clean sans for reading, mono for technical
  metadata/labels — no display-font dependency needed on GitHub.
- Recognizable symbol: candidate is a small line-art motif derived from the
  Hero globe's coordinate/marker glyph (a single stippled dot + crosshair)
  — final choice deferred until Phase 1's globe work is visually settled.
- Tone: precise, first-person, evidence-first — states verified numbers
  with their test conditions rather than bare claims (matches this repo's
  established voice throughout `data.ts`).
- Selected-project order: Prism, Medical CV (Endoscopic Stone Detection),
  Faculty Operations Platform, Airspace Congestion Monitoring — same order
  as this redesign.

## Validation approach (per phase and at completion)

`npx tsc --noEmit` and `npm run build` after every phase, same as the prior
Visual Enhancement Pass. No headless browser is available in this
environment — responsive/visual/reduced-motion checks are done through
source review, rendered-HTML inspection, and manual reasoning about the
CSS/JS involved, not real screenshots taken by me during implementation.
Real before/after screenshots for the final report require either the user
capturing them or a tool becoming available; this limitation is called out
explicitly rather than worked around with speculative claims.
