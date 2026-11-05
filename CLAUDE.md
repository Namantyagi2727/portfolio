# Portfolio Project — Claude Memory

## Project
- **Path:** `/Users/naman/Developer/portfolio`
- **Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, Framer Motion
- **Deployed:** Vercel (auto-deploys on `git push`)
- **Owner:** Naman Tyagi — AI/ML Engineer, MS CS at NYU Tandon

## Key files
| File | Purpose |
|---|---|
| `src/lib/data.ts` | Single source of truth for ALL content (projects, experience, skills, education, publications, side quests, personal info) |
| `src/app/page.tsx` | Page composition — imports all section components |
| `src/app/layout.tsx` | Root layout — includes Navbar |
| `src/app/globals.css` | Global styles + CSS variables |
| `src/components/` | One file per section |

## Current design (as of last session)
- **Theme:** Dark background (`#0a0a0a`), cyan accent (`#00d4ff`), purple accent (`#a855f7`)
- **Nav:** Top horizontal Navbar (`Navbar.tsx`) — sticky, links to each section
- **Hero:** Globe (COBE WebGL) with animated city spotlight rotation + city tab bar below
- **About:** Editorial bio quote, scoreboard strip, JourneyMap (react-simple-maps), education timeline, VIP project callout, certifications
- **Skills:** Filter tabs by category, skill chip cards per category
- **Experience:** Vertical timeline with cards
- **Projects:** Clickable cards → expand modal with full description + tags + GitHub link
- **Publications:** Cambridge Scholars = featured purple card with left accent bar; IEEE = standard card
- **Side Quests:** Quest cards with status badges + fun stats block
- **Contact:** Working form via Web3Forms (key: `476f9eaf-3a76-455f-bf27-41f1bf7d7d8f`, email: `namantyagi2727@gmail.com`)
- **Footer:** Simple one-line footer

## What was tried and rejected
- **Mission Control Dashboard** (navy `#060c18` + amber `#f59e0b`, fixed 240px sidebar, monospace "operative" terminology) — user said "looks way too much" and "not that nice". **DO NOT re-suggest this theme.**

## What the user wants next
- A new visual design theme that feels more personal and less generic
- User said the current dark+cyan feels "basic and generic and same like everyone else"
- They want to find a direction first (via reference sites / Dribbble / Awwwards), then implement
- **Directions to suggest:** clean editorial, warm dark minimal, typographic-first, soft glassmorphism

## Approved changes (already committed, do not revert)
All of these are in the last committed state (`git log` shows `a088748` as HEAD):
- Content updates in `data.ts`: RAGbase project, updated NYU/Mast/Essex/Ciena/ChainGuard bullets, 25+ new skills, AI Governance category
- Skills filter tabs
- Publications featured card (Cambridge Scholars)
- Project detail modals (click to expand)
- Working contact form (Web3Forms)
- City tab bar on Globe (replaced pill dots)
- Vercel Analytics
- Dynamic OG image (`src/app/opengraph-image.tsx`)

## Globe / GlobeCanvas notes
- `GlobeCanvas.tsx` — COBE WebGL globe, accepts `onSpotlight` + `targetIndex` props
- `targetIndex` drives external city selection (e.g. clicking city tab triggers rotation)
- Cities: Brooklyn NY, London, New Delhi (+ San Francisco marker, no spotlight)
- Colors: `markerColor: [0.961, 0.620, 0.043]` (amber), `glowColor: [0.20, 0.35, 0.55]`

## JourneyMap notes
- `react-simple-maps` + `d3-geo` for animated flight paths
- 3 concurrent animated planes on academic / professional / research routes
- City nodes: Noida (India), London, Singapore, New York — click to expand detail card

## Web3Forms
- Access key: `476f9eaf-3a76-455f-bf27-41f1bf7d7d8f`
- Submits to: `namantyagi2727@gmail.com`

## Deployment
- `git push` → Vercel auto-deploys
- Nothing from the rejected Mission Control redesign was ever deployed or committed
