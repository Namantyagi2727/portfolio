# Systems Notebook Redesign — Design Spec

**Date:** 2026-09-08
**Status:** Approved by user, pending implementation plan

## Overview

Full visual-system redesign of the portfolio (dark+cyan/purple → warm dark
editorial "systems notebook") plus a companion rewrite of the GitHub profile
README. Replaces the previous "Mission Control Dashboard" direction, which
the user explicitly rejected (navy/amber, monospace "operative" terminology,
fixed sidebar — see `CLAUDE.md`).

## Why

The current dark+cyan/purple theme reads as generic ("basic and generic and
same like everyone else" — user's words). The user wants something that
feels personal and specific to their actual work (LLM infrastructure, RAG,
streaming data systems) rather than a template AI-portfolio look, without
repeating the previously-rejected direction.

## Goals

- A distinct warm-dark visual identity: one accent color, serif/mono/sans
  type pairing, minimal chrome.
- Replace the Globe hero with a memorable element grounded in real
  engineering work (a live diagram of the Prism request flow).
- Restructure project presentation to lead with real metrics, reordered
  around the strongest actual projects (Prism, Airspace Congestion, RAGBase,
  ChainGuard).
- A small, genuinely functional Cmd+K command palette — the one deliberate,
  bounded nod to "engineer tooling" / CLI culture, explicitly scoped small
  per the user's earlier rejection of a full terminal-hero motif.
- A rewritten GitHub profile README anchored on real repos, no fabricated
  projects, no badge walls.

## Non-goals

- No light/dark theme toggle — site stays dark-only, as today.
- No change to the Web3Forms contact integration, deployment process, or
  Vercel Analytics/OG image setup.
- No structural change to Skills, Experience, Publications, or Contact
  information architecture — these are re-skinned only.
- No WebGL requirement for the new hero element (COBE globe is retired
  entirely — also a bundle-size win).
- Command palette is a secondary shortcut, not a replacement for the
  existing horizontal Navbar.

## Visual system

- **Background:** `#14100d` (warm near-black / espresso), elevated
  surfaces `#1c1712`, dividers `#2a231c`.
- **Text:** primary `#f5f0e8` (warm bone), muted `#a89f92`.
- **Accent (single):** burnt ochre `#d97b3f`, hover/active tint `#e8a06c`.
  Replaces the cyan `#00d4ff` / purple `#a855f7` pair entirely — one accent,
  used sparingly (links, active states, the flow-diagram pulse, highlight
  metrics).
- **Type pairing:**
  - Display/headings — a warm serif (e.g. Fraunces) for name, section
    titles, and the featured-publication treatment. Gives the "notebook"
    voice.
  - Body copy — a humanist sans (Geist Sans or Inter, whichever is already
    loaded) for bios, descriptions, nav.
  - Metadata (stack tags, dates, stats, highlight lines) — a mono face
    (Geist Mono or JetBrains Mono) to read as technical readouts.
- **Motion:** scroll fades/slides only, no parallax. The one "alive"
  element is the hero's Prism flow diagram (subtle animated pulse along
  the data-flow lines); everything else stays still until interacted with.

## Section-by-section

### Hero (replaces `GlobeCanvas.tsx`)

- Large serif "Naman Tyagi" + one-line positioning grounded in the real
  bio (LLM infra / RAG / data systems — not the fabricated CV-project
  framing from the inspiration doc).
- Centerpiece: a small, contained, non-WebGL diagram of **Prism's** actual
  request flow — App → Gateway → Provider (OpenAI/Anthropic/Ollama), with
  clickable/hoverable states for cache hit vs. miss and a circuit-breaker
  trip. Built with SVG/CSS + Framer Motion, not COBE — lighter and more
  truthful to the work than a generic spinning globe.
- A quiet `⌘K` hint near the nav opens the command palette (see below).
  This is the full extent of the CLI/terminal nod — no shell-prompt
  hero copy, no `whoami`-style simulation.

### Command palette (new: `CommandPalette.tsx`)

- Global `⌘K` / `Ctrl+K` listener, minimal modal, filterable list.
- Entries: jump to each section, open a project's GitHub link, copy email,
  open resume PDF, open LinkedIn/Scholar.
- Suggest building on the `cmdk` library (small, accessible, headless) —
  notably authored by Paco Coursey, one of the reference sites that
  inspired this direction; a deliberate callback, not required.

### About

- **Keep `JourneyMap.tsx`** — re-skin only: markers/flight-path lines to
  the accent color and its tints, map fill/background to the new warm
  dark palette. No structural change to the 3-route/4-city content.
- Bio, scoreboard strip, education timeline, certifications: same
  structure, re-skinned to the new type/color system.

### Projects (`src/lib/data.ts` + project card/modal components)

- Lead each card/modal with the existing `highlight` field as a prominent
  mono-styled metrics line, above the prose description (currently it's
  present in data but not visually foregrounded).
- Add a `highlight` to **ChainGuard** (currently missing), e.g.
  `"85%+ accuracy · 100+ test contracts"`.
- Reorder `projects` array so the lead group is: **Prism → Airspace
  Congestion Monitoring → RAGBase → ChainGuard**, followed by the
  take-home assessments (Immune Cell Population Analysis, ConTicx) and
  the remaining projects in current relative order.
- Keep the existing click-to-expand modal mechanism; only the internal
  layout and type treatment change.

### Side Quests

- Keep all existing quest content and `funStats`.
- Drop the `ACTIVE` / `IN PROGRESS` / `PASSIVE` status-badge component —
  its game-HUD chrome reads too close to the rejected "operative"
  vocabulary. Replace with a plain short mono note per quest (e.g. an
  italic aside) instead of a colored pill.

### Skills, Experience, Publications, Contact, Footer

- No structural changes. Re-skin only: colors, type, spacing to match the
  new system. Filter tabs, timeline, and the featured Cambridge Scholars
  card keep their current behavior.

## GitHub profile README

Final copy (delivered as markdown; this lives in a separate
`Namantyagi2727/Namantyagi2727` profile repo, not this codebase, so it's a
manual/out-of-band step rather than part of this repo's implementation
plan):

```markdown
I build LLM infrastructure and data systems that hold up in production.
Currently building Prism — a self-hosted LLM gateway.

prism                          — LLM gateway/control plane · circuit breaker, semantic cache, full observability
airspace-congestion-monitoring — real-time streaming analytics · Kafka/Spark · 475K+ records
ragbase                        — offline document RAG · FAISS · sub-2s retrieval
blockguard                     — LLM-based smart contract auditor · 85%+ accuracy

Python · PyTorch · FastAPI · Kafka/Spark · AWS/Azure · Docker

Brooklyn, NY · LinkedIn · Portfolio
```

No fabricated projects, no badge walls, no "passionate about" framing.

## Components touched (portfolio repo)

- `src/components/GlobeCanvas.tsx` — removed, replaced by a new
  `PrismFlowDiagram.tsx` in the Hero.
- New: `src/components/CommandPalette.tsx`.
- `src/components/JourneyMap.tsx` — re-skin only (color props/constants).
- `src/components/` project card + modal — restructure internal layout
  to foreground `highlight`; re-skin.
- `src/components/` Side Quests section — remove status-badge sub-
  component, replace with plain note styling.
- `src/lib/data.ts` — reorder `projects`, add `highlight` to ChainGuard.
- `src/app/globals.css` — replace color variables and font declarations
  with the new palette/type system.
- Font loading (`layout.tsx` or wherever fonts are currently declared) —
  add serif + mono faces alongside the existing sans.

## Risks / open questions for the implementation plan

- Confirm exact font choices are available via `next/font/google` (or the
  `geist` package) without licensing/self-hosting friction.
- COBE globe removal drops a WebGL dependency — verify nothing else in
  the codebase imports `cobe` before deleting it from `package.json`.
- `cmdk` is a new dependency — confirm the user is fine adding it, or plan
  falls back to a hand-rolled minimal palette.
