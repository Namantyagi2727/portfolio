# Systems Notebook Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark+cyan/purple portfolio theme with the warm-dark "Systems Notebook" visual system, retire the COBE globe hero in favor of a real Prism-flow diagram, add a small Cmd+K command palette, and restructure project presentation around real metrics.

**Architecture:** This is a visual-system migration, not a data or backend change. Work proceeds palette-first (Task 1 establishes CSS variables and fonts everything else consumes), then hero/nav (the most structurally different pieces), then a mechanical re-skin pass through every remaining section in isolation. Each section task is independently committable and independently visually verifiable.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4 (`@theme inline` tokens in `globals.css`), Framer Motion, `next/font/google`. New dependency: `cmdk` (Paco Coursey's command-menu primitive). Removed dependency: `cobe`.

**Spec:** `docs/superpowers/specs/2026-09-08-systems-notebook-redesign-design.md`

## Global Constraints

- **No test framework in this repo.** There is no Jest/Vitest/RTL/Playwright and no `test` script in `package.json`. Do not add one — out of scope. Verification per task is: `npm run build` (must succeed — this is the TypeScript/lint gate) plus a manual visual check via `npm run dev` in a browser, per the project's existing convention (see `CLAUDE.md`: "For UI or frontend changes, start the dev server and use the feature in a browser before reporting the task as complete").
- **Single source of truth for colors:** every new hex value used anywhere in this plan comes from the table below. Do not invent new colors mid-task.
- **Dark-only.** No light/dark toggle. No changes to Web3Forms, Vercel Analytics, the OG image route, or deployment.
- **Design simplification carried into this plan (not explicit in the spec, decided during planning):** the current site color-codes categories with a different neon hue per category (7 skill categories, 3 certification categories, alternating education-timeline colors). That pattern is a big part of why the site reads as "generic AI portfolio template." This plan collapses those to a single accent everywhere **except** `JourneyMap.tsx`, where three categories (Education/Work/Research) plus a "current" status are load-bearing information, not decoration — that one keeps three warm hues + the existing status green. Flag this simplification to the user at hand-off in case they'd rather keep per-category hues (just retuned).

### Color mapping (old hex → new hex)

| Role | Old | New |
|---|---|---|
| Page background | `#0a0a0a`, `#0a0a0f` | `#14100d` |
| Section alt background | `#0d0d0d` | `#171310` |
| Card surface | `#111111`, `#111`, `#141414` | `#1c1712` |
| Surface 2 (CSS var, unused in markup) | `#161616` | `#221b14` |
| Tag/chip background | `#1a1a1a` | `#241d16` |
| Border | `#1e1e1e` | `#2a231c` |
| Border strong / hover | `#2a2a2a`, `#333` | `#3a3025` |
| Primary text | `#ededed` | `#f5f0e8` |
| Body/secondary text | `#9ca3af`, `#a0a0a0`, `#c8c8c8` | `#c7bcae` |
| Muted/meta text | `#6b7280` | `#8a8073` |
| **Accent (primary)** | `#00d4ff`, `#06b6d4` | `#d97b3f` |
| Accent tint/hover | (new) | `#e8a06c` |
| **Accent — gold** (featured/secondary distinction) | `#f59e0b`, `#f97316` | `#e0b34d` |
| **Accent — rose** (JourneyMap third category only) | `#a855f7`, `#7c3aed`, `#c084fc` | `#c2664f` |
| Status green (unchanged, functional) | `#22c55e`, `#10b981` | `#22c55e` |

Not covered by this table (structural, handled per-task): `categoryColors` in `Skills.tsx`, `certCategoryColors` in `About.tsx`, `typeConfig` in `Publications.tsx`, `NODES`/`ROUTE_CONFIGS` in `JourneyMap.tsx`, `statusConfig` in `SideQuests.tsx` — these are JS objects, not literal hex in JSX, so `sed` won't reach them; each task below edits them explicitly.

### Fonts

- Keep `Geist` (sans, body) and `Geist_Mono` (mono, metadata/tags/stats) exactly as configured today.
- Add `Fraunces` (serif, via `next/font/google`) for the hero name and every section `<h2>`. Nothing else uses it.

---

### Task 1: Palette & type foundation

**Files:**
- Modify: `src/app/globals.css` (full replace)
- Modify: `src/app/layout.tsx:1-14,66` (font import + body class)

**Interfaces:**
- Produces: CSS custom properties `--background`, `--background-alt`, `--foreground`, `--body`, `--muted`, `--accent`, `--accent-tint`, `--accent-gold`, `--accent-rose`, `--surface`, `--surface-2`, `--border`, `--border-strong`, and Tailwind theme tokens `--color-*` + `--font-serif` (all consumed by every later task). Font CSS variable `--font-fraunces` (consumed via `font-serif` Tailwind utility).

- [ ] **Step 1: Replace `globals.css`**

```css
@import "tailwindcss";

:root {
  --background: #14100d;
  --background-alt: #171310;
  --foreground: #f5f0e8;
  --body: #c7bcae;
  --muted: #8a8073;
  --accent: #d97b3f;
  --accent-tint: #e8a06c;
  --accent-gold: #e0b34d;
  --accent-rose: #c2664f;
  --surface: #1c1712;
  --surface-2: #221b14;
  --border: #2a231c;
  --border-strong: #3a3025;
}

@theme inline {
  --color-background: var(--background);
  --color-background-alt: var(--background-alt);
  --color-foreground: var(--foreground);
  --color-body: var(--body);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-tint: var(--accent-tint);
  --color-accent-gold: var(--accent-gold);
  --color-accent-rose: var(--accent-rose);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-serif: var(--font-fraunces);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--surface);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent);
}

::selection {
  background: rgba(217, 123, 63, 0.2);
  color: var(--accent);
}
```

(This drops the unused `.neon-glow` / `.neon-text` / `.purple-glow` utility classes — confirmed via `grep -rn "neon-glow\|neon-text\|purple-glow" src/` that nothing outside `globals.css` itself references them.)

- [ ] **Step 2: Add Fraunces font in `layout.tsx`**

Change:
```tsx
import { Geist, Geist_Mono } from "next/font/google";
```
to:
```tsx
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
```

After the `geistMono` declaration, add:
```tsx
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});
```

Change the body className from:
```tsx
className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-[#ededed]`}
```
to:
```tsx
className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-[#14100d] text-[#f5f0e8]`}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds with no TypeScript/lint errors.

- [ ] **Step 4: Visual check**

Run `npm run dev`, open the site. Expected: page background and default text are now warm dark/bone instead of pure black/white. Individual sections will still show old cyan/purple accents and old fonts — that's expected until their tasks land.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: warm-dark palette and Fraunces serif foundation"
```

---

### Task 2: Rebuild Hero — retire the globe, add the Prism flow diagram

**Files:**
- Create: `src/components/PrismFlowDiagram.tsx`
- Delete: `src/components/GlobeCanvas.tsx`
- Modify: `src/components/Hero.tsx` (full replace)
- Modify: `package.json` (remove `cobe` dependency)

**Interfaces:**
- Consumes: palette from Task 1 (`#14100d`, `#f5f0e8`, `#c7bcae`, `#8a8073`, `#d97b3f`, `#e8a06c`, `#2a231c`, `#1c1712`), `font-serif` utility.
- Produces: `export default function PrismFlowDiagram()` — no props, self-contained. Later tasks don't depend on this component.

**Why the globe and city-spotlight state go away entirely:** the tab bar / spotlight tooltip only existed to narrate the globe's rotation (Brooklyn / London / New Delhi). `JourneyMap.tsx` (kept, re-skinned in Task 6) already tells this exact geography story — plus Singapore — with more detail. Removing it from `Hero.tsx` isn't a content loss, it's de-duplication.

**Two more implicit simplifications in the rewrite below, not explicit in the spec — flag at hand-off:** the typewriter effect that cycled through `personalInfo.roles` ("AI/ML Engineer" → "Full-Stack Developer" → "Cloud Architect" → "Big Data Engineer") is replaced with one static line, and the 5 floating decorative particles are dropped. Both are exactly the kind of generic-template motion this redesign is trying to move away from; if the user wants the role-cycling text back, it can be re-added using the same `personalInfo.roles` data with the new palette.

- [ ] **Step 1: Create `PrismFlowDiagram.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type CacheState = "hit" | "miss";

const NODES = {
  app: { x: 30, y: 90, label: "App" },
  prism: { x: 190, y: 90, label: "Prism" },
  cache: { x: 190, y: 24, label: "Cache" },
  provider: { x: 350, y: 90, label: "Provider" },
} as const;

export default function PrismFlowDiagram() {
  const [cacheState, setCacheState] = useState<CacheState>("miss");
  const [breakerTripped, setBreakerTripped] = useState(false);

  const providerLineColor = breakerTripped ? "#8a8073" : "#d97b3f";
  const cacheLineColor = cacheState === "hit" ? "#d97b3f" : "#3a3025";

  return (
    <div className="w-full" style={{ maxWidth: 420 }}>
      <svg viewBox="0 0 380 150" className="w-full h-auto" role="img" aria-label="Prism request flow diagram">
        {/* App -> Prism */}
        <motion.line
          x1={NODES.app.x + 32} y1={NODES.app.y}
          x2={NODES.prism.x - 32} y2={NODES.prism.y}
          stroke="#d97b3f" strokeWidth={1.5} strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        {/* Prism -> Cache */}
        <line
          x1={NODES.prism.x} y1={NODES.prism.y - 22}
          x2={NODES.cache.x} y2={NODES.cache.y + 14}
          stroke={cacheLineColor} strokeWidth={1.5}
        />
        {/* Prism -> Provider (skipped when cache hits, dimmed when breaker trips) */}
        <motion.line
          x1={NODES.prism.x + 32} y1={NODES.prism.y}
          x2={NODES.provider.x - 32} y2={NODES.provider.y}
          stroke={providerLineColor} strokeWidth={1.5}
          strokeDasharray={cacheState === "hit" ? "2 6" : "4 4"}
          strokeOpacity={cacheState === "hit" ? 0.35 : 1}
          animate={cacheState === "hit" ? {} : { strokeDashoffset: [0, -16] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />

        {Object.entries(NODES).map(([key, n]) => (
          <g key={key} transform={`translate(${n.x}, ${n.y})`}>
            <rect x={-32} y={-16} width={64} height={32} rx={8} fill="#1c1712" stroke="#2a231c" strokeWidth={1} />
            <text textAnchor="middle" dominantBaseline="middle" fontSize={10} fontFamily="var(--font-geist-mono)" fill="#f5f0e8">
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs">
        <button
          onClick={() => setCacheState((s) => (s === "hit" ? "miss" : "hit"))}
          className="px-3 py-1.5 rounded-md border border-[#2a231c] text-[#c7bcae] hover:border-[#d97b3f]/50 hover:text-[#d97b3f] transition-colors"
        >
          cache: {cacheState}
        </button>
        <button
          onClick={() => setBreakerTripped((b) => !b)}
          className="px-3 py-1.5 rounded-md border border-[#2a231c] text-[#c7bcae] hover:border-[#d97b3f]/50 hover:text-[#d97b3f] transition-colors"
        >
          breaker: {breakerTripped ? "open" : "closed"}
        </button>
      </div>

      <p className="mt-3 text-[11px] font-mono text-[#8a8073]">~250 req/s · p95 ~80ms overhead</p>
    </div>
  );
}
```

- [ ] **Step 2: Delete `GlobeCanvas.tsx`**

```bash
rm src/components/GlobeCanvas.tsx
```

- [ ] **Step 3: Remove `cobe` from `package.json`**

Delete the `"cobe": "^0.6.5",` line from `dependencies`, then run:
```bash
npm install
```
Expected: `package-lock.json` updates, `cobe` no longer installed.

- [ ] **Step 4: Replace `Hero.tsx`**

```tsx
"use client";

import { Github, Linkedin, Mail, ArrowDown, Download, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import PrismFlowDiagram from "./PrismFlowDiagram";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const diagramVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center px-6 pb-20 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(217,123,63,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217,123,63,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 right-[22%] -translate-y-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(217,123,63,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-0 items-center pt-28 pb-12">
        {/* LEFT */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a231c] bg-[#1c1712] text-xs text-[#8a8073] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Available for opportunities · Brooklyn, NY
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif font-medium tracking-tight text-[#f5f0e8] mb-2 leading-[0.88]"
            style={{ fontSize: "clamp(60px, 9.5vw, 112px)" }}
          >
            <span className="block">Naman</span>
            <span className="block" style={{ color: "#c7bcae" }}>Tyagi</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl font-mono text-[#d97b3f] mb-7 mt-4">
            AI/ML Engineer · LLM Infrastructure
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-[#8a8073] text-base sm:text-lg max-w-md mb-10 leading-relaxed"
          >
            MS CS from NYU Tandon · Published Researcher · 6+ Internships.
            <br />
            Building LLM infrastructure and data systems that hold up in production.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#14100d] transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "#d97b3f" }}
            >
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-[#2a231c] text-[#f5f0e8] hover:border-[#d97b3f]/50 hover:text-[#d97b3f] transition-all duration-200"
            >
              <Download size={14} />
              Resume
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg font-semibold text-sm text-[#8a8073] hover:text-[#f5f0e8] transition-colors duration-200"
            >
              Contact →
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-3">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="GitHub">
              <Github size={19} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="LinkedIn">
              <Linkedin size={19} />
            </a>
            <a href={personalInfo.scholar} target="_blank" rel="noopener noreferrer"
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="Google Scholar">
              <GraduationCap size={19} />
            </a>
            <a href={`mailto:${personalInfo.email}`}
              className="p-2.5 rounded-lg border border-[#2a231c] text-[#8a8073] hover:text-[#d97b3f] hover:border-[#d97b3f]/40 transition-all duration-200" aria-label="Email">
              <Mail size={19} />
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — Prism flow diagram */}
        <motion.div
          variants={diagramVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center"
        >
          <p className="text-xs font-mono text-[#8a8073] uppercase tracking-widest mb-6">
            Prism — LLM gateway request flow
          </p>
          <PrismFlowDiagram />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8a8073]/50">
        <span className="text-[10px] font-mono tracking-widest uppercase">scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds. Confirm no remaining references to `GlobeCanvas` or `cobe`:
```bash
grep -rn "GlobeCanvas\|from \"cobe\"" src/
```
Expected: no output.

- [ ] **Step 6: Visual check**

`npm run dev` → Hero shows the new warm-toned headline, the Prism diagram (not a globe), and the cache/breaker buttons actually toggle the diagram's line styles.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: replace globe hero with Prism flow diagram"
```

---

### Task 3: Command palette + Navbar/Footer re-skin

**Files:**
- Create: `src/components/CommandPalette.tsx`
- Modify: `src/app/layout.tsx` (mount `CommandPalette`)
- Modify: `src/components/Navbar.tsx` (full replace — recolor + `⌘K` hint)
- Modify: `src/components/Footer.tsx` (full replace — recolor)
- Modify: `package.json` (add `cmdk`)

**Interfaces:**
- Consumes: palette from Task 1.
- Produces: `export default function CommandPalette()` — no props, mounted once in `layout.tsx`, owns its own open/close state and global keydown listener. No other component needs to reach into it (the `⌘K` hint in `Navbar.tsx` is a static, non-interactive visual hint — clicking it does nothing; the real trigger is the keyboard shortcut, per the spec's "quiet hint" framing).

- [ ] **Step 1: Add `cmdk`**

```bash
npm install cmdk
```

- [ ] **Step 2: Create `CommandPalette.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { personalInfo } from "@/lib/data";

const SECTIONS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Side Quests", href: "#sidequests" },
  { label: "Contact", href: "#contact" },
];

const itemClass =
  "px-3 py-2 rounded-md text-[#c7bcae] data-[selected=true]:bg-[#d97b3f]/10 data-[selected=true]:text-[#d97b3f] cursor-pointer outline-none";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const openLink = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(personalInfo.email);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-32 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-[#2a231c] bg-[#1c1712] overflow-hidden font-mono text-sm"
      >
        <Command.Input
          autoFocus
          placeholder="Jump to..."
          className="w-full px-4 py-3 bg-transparent text-[#f5f0e8] outline-none border-b border-[#2a231c] placeholder:text-[#8a8073]"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-2 text-[#8a8073]">No results.</Command.Empty>
          <Command.Group heading="Sections" className="text-[10px] uppercase tracking-widest text-[#8a8073] px-2 py-1">
            {SECTIONS.map((s) => (
              <Command.Item key={s.href} onSelect={() => go(s.href)} className={itemClass}>
                {s.label}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Actions" className="text-[10px] uppercase tracking-widest text-[#8a8073] px-2 py-1 mt-2">
            <Command.Item onSelect={() => openLink(personalInfo.github)} className={itemClass}>
              Open GitHub
            </Command.Item>
            <Command.Item onSelect={() => openLink(personalInfo.linkedin)} className={itemClass}>
              Open LinkedIn
            </Command.Item>
            <Command.Item onSelect={copyEmail} className={itemClass}>
              Copy email
            </Command.Item>
            <Command.Item onSelect={() => openLink("/resume.pdf")} className={itemClass}>
              Open résumé
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
```

- [ ] **Step 3: Mount it in `layout.tsx`**

Add the import:
```tsx
import CommandPalette from "@/components/CommandPalette";
```
Add `<CommandPalette />` inside `<body>`, alongside `{children}` and `<Analytics />`.

- [ ] **Step 4: Replace `Navbar.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Side Quests", href: "#sidequests" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#14100d]/90 backdrop-blur-md border-b border-[#2a231c]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="text-lg font-bold tracking-tight text-[#f5f0e8] hover:text-[#d97b3f] transition-colors">
          <span className="text-[#d97b3f]">&lt;</span>
          NT
          <span className="text-[#d97b3f]">/&gt;</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm text-[#8a8073] hover:text-[#d97b3f] transition-colors duration-200 font-medium">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <kbd className="text-[10px] font-mono text-[#8a8073] border border-[#2a231c] rounded px-1.5 py-1">⌘K</kbd>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[#d97b3f] text-[#d97b3f] hover:bg-[#d97b3f]/10 transition-all duration-200"
          >
            Resume
          </a>
        </div>

        <button className="md:hidden text-[#f5f0e8] p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-[#1c1712] border-t border-[#2a231c] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#8a8073] hover:text-[#d97b3f] transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#d97b3f] border border-[#d97b3f] px-4 py-2 rounded-lg text-center hover:bg-[#d97b3f]/10 transition-all"
          >
            Resume
          </a>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 5: Replace `Footer.tsx`**

```tsx
import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a231c] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#8a8073] font-mono">
          <span style={{ color: "#d97b3f" }}>&lt;</span>
          {personalInfo.name}
          <span style={{ color: "#d97b3f" }}>/&gt;</span>
        </p>
        <p className="text-xs text-[#8a8073]">
          Built with Next.js &amp; Tailwind CSS · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 7: Visual check**

`npm run dev` → press `⌘K`/`Ctrl+K`, confirm the palette opens, filters, and its "Sections"/"Actions" both work (scroll + open link + copy email). Confirm Navbar/Footer show new colors and the `⌘K` hint renders (non-interactively) next to Resume.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Cmd+K command palette, re-skin Navbar and Footer"
```

---

### Task 4: Projects — reorder, add ChainGuard highlight, re-skin

**Files:**
- Modify: `src/lib/data.ts:213-323` (`projects` array — reorder + add one field)
- Modify: `src/components/Projects.tsx` (full replace)

**Interfaces:**
- Consumes: `Project` type and `projects` array (unchanged shape — only order and one new `highlight` value change), palette from Task 1.

- [ ] **Step 1: Reorder `projects` in `data.ts` and add ChainGuard's highlight**

In `src/lib/data.ts`, reorder the `projects` array so it reads, in this exact order: `Prism`, `Airspace Congestion Monitoring System`, `RAGBase: Enterprise Document Q&A System`, `ChainGuard`, `Immune Cell Population Analysis`, `ConTicx`, then the remaining projects (`Sign Language Recognition`, `MindMend`, `Photo Search & Recognition`, `SmartScholar`, `Smart Door Lock System`, `DecentraStore`, `DiningBot on AWS`, `Student Performance Visualization`, `Todo App`) unchanged relative to each other.

Add a `highlight` to the `ChainGuard` entry (it currently has none):
```ts
{
  title: "ChainGuard",
  description:
    "LLM-based auditing tool detecting smart contract vulnerabilities (reentrancy, overflow, access control) with 85%+ accuracy across 100+ test contracts. Fine-tuned transformers for structured audit report generation.",
  tags: ["Solidity", "Ethereum", "Web3", "Security", "Python", "LLMs"],
  github: "https://github.com/Namantyagi2727/BlockGuard",
  highlight: "85%+ accuracy · 100+ test contracts",
},
```

- [ ] **Step 2: Replace `Projects.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { Github, ExternalLink, Star, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/data";

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <section id="projects" className="py-24 px-6 bg-[#171310]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">04 / Projects</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Featured Projects</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div
                key={project.title}
                onClick={() => setSelected(project)}
                className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 flex flex-col group hover:border-[#d97b3f]/30 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#d97b3f]/10 flex items-center justify-center text-lg font-bold font-mono text-[#d97b3f]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-[#8a8073] hover:text-[#f5f0e8] transition-colors" aria-label="GitHub">
                        <Github size={16} />
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-[#8a8073] hover:text-[#f5f0e8] transition-colors" aria-label="Live demo">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-[#f5f0e8] group-hover:text-[#d97b3f] transition-colors leading-snug mb-1">
                    {project.title}
                  </h3>
                  {project.highlight && (
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{ background: "rgba(217,123,63,0.1)", color: "#d97b3f", border: "1px solid rgba(217,123,63,0.2)" }}
                    >
                      <Star size={10} />
                      {project.highlight}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#8a8073] leading-relaxed flex-1 mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded font-mono text-[#8a8073] bg-[#241d16] border border-[#3a3025]">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded font-mono text-[#8a8073]/50 bg-[#241d16] border border-[#3a3025]">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-[#8a8073]/40 group-hover:text-[#d97b3f]/60 transition-colors mt-auto">
                  <ArrowUpRight size={11} />
                  click to expand
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://github.com/Namantyagi2727"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#8a8073] hover:text-[#d97b3f] transition-colors font-medium"
            >
              <Github size={16} />
              See more on GitHub →
            </a>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="relative w-full max-w-xl pointer-events-auto rounded-2xl overflow-hidden"
                style={{
                  background: "#1c1712",
                  border: "1px solid rgba(217,123,63,0.2)",
                  boxShadow: "0 0 60px rgba(217,123,63,0.08), 0 24px 80px rgba(0,0,0,0.6)",
                }}
              >
                <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #d97b3f, transparent)" }} />
                <div className="p-7">
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-5 right-5 p-1.5 rounded-lg text-[#8a8073] hover:text-[#f5f0e8] hover:bg-[#2a231c] transition-all"
                  >
                    <X size={17} />
                  </button>

                  {selected.highlight && (
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-mono mb-4"
                      style={{ background: "rgba(217,123,63,0.1)", color: "#d97b3f", border: "1px solid rgba(217,123,63,0.2)" }}
                    >
                      <Star size={10} />
                      {selected.highlight}
                    </span>
                  )}

                  <h2 className="text-xl font-bold text-[#f5f0e8] leading-snug mb-4 pr-8">{selected.title}</h2>
                  <p className="text-sm text-[#c7bcae] leading-relaxed mb-6">{selected.description}</p>

                  <div className="mb-6">
                    <p className="text-xs font-mono text-[#8a8073]/60 uppercase tracking-widest mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-md font-mono"
                          style={{ background: "rgba(217,123,63,0.08)", color: "#d97b3f", border: "1px solid rgba(217,123,63,0.2)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#2a231c]">
                    {selected.github ? (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                        style={{ background: "#d97b3f", color: "#14100d" }}
                      >
                        <Github size={15} />
                        View on GitHub
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#8a8073] border border-[#3a3025] cursor-not-allowed">
                        <Github size={15} />
                        Private Repo
                      </span>
                    )}
                    {selected.demo && (
                      <a
                        href={selected.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[#3a3025] text-[#f5f0e8] hover:border-[#d97b3f]/40 transition-all"
                      >
                        <ExternalLink size={15} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 4: Visual check**

`npm run dev` → Projects grid shows Prism first, ChainGuard now shows a highlight badge on its card. Click a card, modal opens with the new colors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: reorder projects around real flagship work, re-skin project cards"
```

---

### Task 5: Side Quests — drop status-badge chrome, re-skin

**Files:**
- Modify: `src/components/SideQuests.tsx` (full replace)

**Interfaces:**
- Consumes: `sideQuests`, `funStats` from `data.ts` (unchanged — the `status` field stays in the data model, it's just rendered differently).

- [ ] **Step 1: Replace `SideQuests.tsx`**

```tsx
"use client";

import { sideQuests, funStats } from "@/lib/data";

const statusLabel: Record<string, string> = {
  ACTIVE: "ongoing",
  "IN PROGRESS": "in progress",
  PASSIVE: "background",
};

export default function SideQuests() {
  return (
    <section id="sidequests" className="py-24 px-6 bg-[#14100d]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">07 / Side Quests</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Side Quests</h2>
          <p className="text-[#8a8073] mt-3 text-sm">Because life isn&apos;t just about the main storyline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {sideQuests.map((quest, i) => (
            <div
              key={i}
              className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:border-[#d97b3f]/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{quest.icon}</span>
                <span className="text-[10px] font-mono italic text-[#8a8073]">{statusLabel[quest.status]}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#f5f0e8]">{quest.title}</h3>
              <p className="text-xs text-[#8a8073] leading-relaxed">{quest.description}</p>
            </div>
          ))}
        </div>

        <div className="border border-[#2a231c] rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-[#2a231c]">
            {funStats.map((stat, i) => (
              <div key={i} className="p-5">
                <p className="text-[10px] font-mono text-[#8a8073] uppercase tracking-wider mb-1.5">{stat.label}</p>
                <p className="text-sm font-mono font-semibold text-[#f5f0e8]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev` → Side Quests cards show a plain italic mono note (`ongoing` / `in progress` / `background`) instead of a colored pill.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: replace side-quest status badges with plain notes, re-skin"
```

---

### Task 6: JourneyMap — retune semantic colors + re-skin chrome

**Files:**
- Modify: `src/components/JourneyMap.tsx` (full replace)

**Interfaces:**
- Consumes: nothing external (self-contained component); no data-shape changes, only color constants inside the file change.

**Color reassignment (semantic, not a mechanical sed):**
- Education → `#c2664f` (rose)
- Work → `#d97b3f` (accent)
- Research → `#e0b34d` (gold)
- Current (NYU Faculty Ops role) → `#22c55e` (unchanged status green)
- Route "ACADEMIC" → `#d97b3f`, "PROFESSIONAL" → `#e0b34d`, "RESEARCH" → `#c2664f`
- Generic chrome (HUD text, borders, geography fill, corner brackets, muted labels) uses the same mapping table as every other file.

- [ ] **Step 1: Replace `JourneyMap.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";
import { geoInterpolate } from "d3-geo";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const INDIA: [number, number] = [77.391, 28.535];
const LONDON: [number, number] = [-0.1278, 51.5074];
const SINGAPORE: [number, number] = [103.8198, 1.3521];
const NEW_YORK: [number, number] = [-73.9442, 40.7128];

type Category = "Education" | "Work" | "Research";

interface Entry {
  name: string;
  role: string;
  period: string;
  category: Category;
  detail: string;
  color: string;
}

interface MapNode {
  id: string;
  city: string;
  country: string;
  coords: [number, number];
  color: string;
  entries: Entry[];
}

const NODES: MapNode[] = [
  {
    id: "india", city: "Noida", country: "India",
    coords: INDIA, color: "#c2664f",
    entries: [
      {
        name: "Amity University", role: "B.Tech — CS & Engineering (Hons. AI & ML)",
        period: "Jul 2020 – Jun 2024", category: "Education",
        detail: "First Division with Distinction · Exchange programs in London & New York",
        color: "#c2664f",
      },
      {
        name: "Ciena", role: "Global Technical Support Engineer",
        period: "Jan 2024 – Jun 2024", category: "Work",
        detail: "Data-driven diagnostics on optical network systems · global telecom clients",
        color: "#d97b3f",
      },
    ],
  },
  {
    id: "london", city: "London", country: "United Kingdom",
    coords: LONDON, color: "#c2664f",
    entries: [
      {
        name: "Birkbeck, University of London", role: "Exchange Program",
        period: "During B.Tech", category: "Education",
        detail: "International undergraduate exchange · academic collaboration",
        color: "#c2664f",
      },
      {
        name: "University of Essex", role: "AI Research Intern",
        period: "Sep 2023 – Aug 2024", category: "Research",
        detail: "NLP & sentiment analysis for early BDD detection · IEEE Xplore published 2024",
        color: "#e0b34d",
      },
    ],
  },
  {
    id: "singapore", city: "Singapore", country: "Singapore",
    coords: SINGAPORE, color: "#d97b3f",
    entries: [
      {
        name: "Ulavi Technologies PTE. Ltd", role: "Frontend Developer",
        period: "Jan 2023 – Apr 2023", category: "Work",
        detail: "Responsive travel platform frontends · 15% performance uplift · Agile",
        color: "#d97b3f",
      },
    ],
  },
  {
    id: "newyork", city: "New York", country: "United States",
    coords: NEW_YORK, color: "#c2664f",
    entries: [
      {
        name: "Adelphi University", role: "Exchange Program",
        period: "During B.Tech", category: "Education",
        detail: "International undergraduate exchange · academic collaboration",
        color: "#c2664f",
      },
      {
        name: "NYU Tandon School of Engineering", role: "MS — Computer Science",
        period: "Aug 2024 – May 2026", category: "Education",
        detail: "Machine Learning · Big Data · Cloud · Blockchain · Application Security",
        color: "#c2664f",
      },
      {
        name: "Mast-Jägermeister US, Inc.", role: "AI & Power BI Intern",
        period: "Jun 2025 – Aug 2025", category: "Work",
        detail: "Fully offline RAG chatbot · NLP-enhanced Power BI Q&A · semantic search pipelines",
        color: "#d97b3f",
      },
      {
        name: "NYU — Office of Faculty Affairs", role: "Software Engineer — Faculty Operations Platform",
        period: "Jan 2026 – Aug 2026", category: "Work",
        detail: "Records management & dashboarding systems · full-stack · faculty administration",
        color: "#22c55e",
      },
    ],
  },
];

interface RouteConfig {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  dashArray: string;
  opacity: number;
  legs: [[number, number], [number, number]][];
}

const ROUTE_CONFIGS: RouteConfig[] = [
  {
    id: "academic", label: "ACADEMIC", subtitle: "DEL → LHR → JFK",
    color: "#d97b3f", dashArray: "7 4", opacity: 0.55,
    legs: [[INDIA, LONDON], [LONDON, NEW_YORK]],
  },
  {
    id: "professional", label: "PROFESSIONAL", subtitle: "SIN → JFK",
    color: "#e0b34d", dashArray: "7 4", opacity: 0.52,
    legs: [[SINGAPORE, NEW_YORK]],
  },
  {
    id: "research", label: "RESEARCH", subtitle: "DEL ↔ LHR",
    color: "#c2664f", dashArray: "3 7", opacity: 0.38,
    legs: [[INDIA, LONDON], [LONDON, INDIA]],
  },
];

function buildWaypoints(
  legs: [[number, number], [number, number]][],
  steps = 80,
  pause = 30,
): [number, number][] {
  const pts: [number, number][] = [];
  for (const [from, to] of legs) {
    const interp = geoInterpolate(from, to);
    for (let i = 0; i <= steps; i++) pts.push(interp(i / steps) as [number, number]);
    for (let p = 0; p < pause; p++) pts.push(to);
  }
  return pts;
}

const ALL_WAYPOINTS = ROUTE_CONFIGS.map((r) => buildWaypoints(r.legs));

function bearing([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): number {
  const R = Math.PI / 180;
  const dLon = (lon2 - lon1) * R;
  const y = Math.sin(dLon) * Math.cos(lat2 * R);
  const x = Math.cos(lat1 * R) * Math.sin(lat2 * R) - Math.sin(lat1 * R) * Math.cos(lat2 * R) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

const CAT_LABEL: Record<Category, string> = {
  Education: "EDUCATION",
  Work: "WORK",
  Research: "RESEARCH",
};

export default function JourneyMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const planeIdx = useRef<number[]>(
    ALL_WAYPOINTS.map((wp, i) => Math.floor((wp.length * i) / ROUTE_CONFIGS.length))
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      for (let i = 0; i < ALL_WAYPOINTS.length; i++) {
        planeIdx.current[i] = (planeIdx.current[i] + 1) % ALL_WAYPOINTS[i].length;
      }
      setTick((t) => t + 1);
    }, 40);
    return () => clearInterval(id);
  }, []);

  const activeNodeData = NODES.find((n) => n.id === activeNode);

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-[#2a231c] bg-[#0c0908]"
        style={{ boxShadow: "0 0 80px rgba(217,123,63,0.04), inset 0 0 120px rgba(0,0,0,0.7)" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(217,123,63,0.2) 2px, rgba(217,123,63,0.2) 3px)",
          }}
        />

        {[
          "top-3 left-3 border-t border-l",
          "top-3 right-3 border-t border-r",
          "bottom-3 left-3 border-b border-l",
          "bottom-3 right-3 border-b border-r",
        ].map((cls) => (
          <div key={cls} className={`absolute w-5 h-5 border-[#d97b3f]/28 ${cls}`} />
        ))}

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[#d97b3f]/60 animate-pulse" />
          <span className="text-[10px] font-mono text-[#d97b3f]/50 uppercase tracking-[0.28em]">GLOBAL JOURNEY LOG</span>
          <div className="w-1 h-1 rounded-full bg-[#d97b3f]/60 animate-pulse" />
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [20, 30] }}
          width={800}
          height={380}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#171310"
                  stroke="#2a231c"
                  strokeWidth={0.5}
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                />
              ))
            }
          </Geographies>

          {ROUTE_CONFIGS.map((route) =>
            route.legs.map(([from, to], li) => (
              <g key={`${route.id}-${li}`}>
                <Line from={from} to={to} stroke={route.color} strokeWidth={6} strokeOpacity={0.045} />
                <Line from={from} to={to} stroke={route.color} strokeWidth={2.5} strokeOpacity={0.10} />
                <Line
                  from={from} to={to}
                  stroke={route.color}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  strokeDasharray={route.dashArray}
                  strokeOpacity={route.opacity}
                />
              </g>
            ))
          )}

          {ROUTE_CONFIGS.map((route, ri) => {
            const idx = planeIdx.current[ri];
            const wp = ALL_WAYPOINTS[ri];
            const pos = wp[idx];
            const next = wp[(idx + 3) % wp.length];
            const b = bearing(pos, next);
            return (
              <Marker key={route.id} coordinates={pos}>
                <g transform={`rotate(${b - 90})`} style={{ transformOrigin: "0px 0px" }}>
                  <circle r={8} fill={route.color} opacity={0.12} />
                  <circle r={4} fill={route.color} opacity={0.18} />
                  <text
                    fontSize={11}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ userSelect: "none", filter: `drop-shadow(0 0 4px ${route.color}) drop-shadow(0 0 2px ${route.color})` }}
                  >
                    ✈
                  </text>
                </g>
              </Marker>
            );
          })}

          {NODES.map((node, i) => {
            const isActive = activeNode === node.id;
            return (
              <Marker key={node.id} coordinates={node.coords} onClick={() => setActiveNode(isActive ? null : node.id)}>
                <g style={{ cursor: "pointer" }}>
                  <circle r={14} fill="none" stroke={node.color} strokeWidth={1} opacity={0}>
                    <animate
                      attributeName="r"
                      values={`${isActive ? 14 : 10};${isActive ? 28 : 22};${isActive ? 14 : 10}`}
                      dur="2.6s" repeatCount="indefinite" begin={`${i * 0.45}s`}
                    />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" begin={`${i * 0.45}s`} />
                  </circle>
                  <circle
                    r={isActive ? 13 : 9}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={1}
                    opacity={isActive ? 0.55 : 0.28}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  <circle
                    r={isActive ? 6 : 4.5}
                    fill={node.color}
                    style={{ filter: `drop-shadow(0 0 ${isActive ? 8 : 5}px ${node.color})`, transition: "all 0.3s ease" }}
                  />
                  <text
                    y={-17}
                    fontSize={7.5}
                    fontFamily="monospace"
                    fill={node.color}
                    textAnchor="middle"
                    fontWeight="700"
                    letterSpacing="0.1em"
                    opacity={0.85}
                    style={{ userSelect: "none" }}
                  >
                    {node.city.toUpperCase()}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ComposableMap>

        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
          {ROUTE_CONFIGS.map((route) => (
            <div key={route.id} className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-55" style={{ background: route.color }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: route.color }} />
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest leading-none" style={{ color: route.color }}>
                {route.label}
              </span>
              <span className="text-[8px] font-mono text-[#8a8073]/55 leading-none">{route.subtitle}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
          {[
            { color: "#c2664f", label: "Education" },
            { color: "#d97b3f", label: "Work" },
            { color: "#e0b34d", label: "Research" },
            { color: "#22c55e", label: "Current" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
              <span className="text-[8.5px] font-mono text-[#8a8073] uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
          <span className="text-[8.5px] font-mono text-[#8a8073]/40 uppercase tracking-widest">tap a pin · details expand below</span>
        </div>
      </div>

      <AnimatePresence>
        {activeNodeData && (
          <motion.div
            key={activeNodeData.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-[#100c09] border border-[#2a231c] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #d97b3f, #e0b34d)" }} />
                  <div>
                    <p className="text-[10px] font-mono text-[#8a8073] uppercase tracking-widest">{activeNodeData.country}</p>
                    <p className="text-lg font-bold text-[#f5f0e8]">{activeNodeData.city}</p>
                  </div>
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                    style={{ color: "#8a8073", borderColor: "#2a231c", background: "#1c1712" }}
                  >
                    {activeNodeData.entries.length} {activeNodeData.entries.length === 1 ? "stop" : "stops"}
                  </span>
                </div>
                <button
                  onClick={() => setActiveNode(null)}
                  className="text-[#8a8073] hover:text-[#f5f0e8] transition-colors text-xs font-mono px-2 py-1 rounded border border-[#2a231c] hover:border-[#3a3025]"
                >
                  [×]
                </button>
              </div>

              <div
                className={`grid gap-3 ${
                  activeNodeData.entries.length >= 2 ? "sm:grid-cols-2" : ""
                }`}
              >
                {activeNodeData.entries.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="rounded-xl p-4 border"
                    style={{ background: `${entry.color}07`, borderColor: `${entry.color}22` }}
                  >
                    <div className="flex items-start justify-between mb-2.5 gap-2">
                      <span
                        className="text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-widest shrink-0"
                        style={{ color: entry.color, background: `${entry.color}18`, border: `1px solid ${entry.color}30` }}
                      >
                        {CAT_LABEL[entry.category]}
                      </span>
                      <span className="text-[9.5px] font-mono text-right leading-tight" style={{ color: entry.color }}>
                        {entry.period}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#f5f0e8] mb-0.5 leading-snug">{entry.name}</p>
                    <p className="text-xs text-[#c7bcae] leading-relaxed mb-2">{entry.role}</p>
                    <p className="text-[10.5px] font-mono text-[#8a8073]/65 italic leading-relaxed">{entry.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev`, scroll to About → JourneyMap shows warm map fill, rose/accent/gold route lines, and clicking a city pin shows the re-skinned detail card with category badges in the new hues.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: retune JourneyMap category colors to warm palette"
```

---

### Task 7: Skills — collapse per-category rainbow to single accent, re-skin

**Files:**
- Modify: `src/components/Skills.tsx` (full replace)

**Interfaces:**
- Consumes: `skills` from `data.ts` (unchanged shape).

- [ ] **Step 1: Replace `Skills.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/lib/data";

const ACCENT = "#d97b3f";

export default function Skills() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? skills : skills.filter((g) => g.category === active);

  return (
    <section id="skills" className="py-24 px-6 bg-[#171310]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">02 / Skills</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Technical Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {["All", ...skills.map((g) => g.category)].map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200"
                style={{
                  background: isActive ? `${ACCENT}15` : "transparent",
                  color: isActive ? ACCENT : "#8a8073",
                  border: `1px solid ${isActive ? `${ACCENT}40` : "#2a231c"}`,
                }}
              >
                {cat !== "All" && (
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                    style={{ background: isActive ? ACCENT : "#8a8073" }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((group) => (
              <div
                key={group.category}
                className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 transition-all duration-200"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${ACCENT}40`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2a231c"; }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACCENT }} />
                  <h3 className="text-sm font-semibold text-[#f5f0e8]">{group.category}</h3>
                  <span className="ml-auto text-xs font-mono text-[#8a8073]">{group.items.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md font-mono transition-all duration-150"
                      style={{ background: `${ACCENT}12`, color: ACCENT, border: `1px solid ${ACCENT}25` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev` → Skills filter tabs and chips all use one consistent accent color; filtering still works.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: collapse skill category rainbow to single accent, re-skin"
```

---

### Task 8: About — re-skin, collapse cert rainbow, retune education timeline

**Files:**
- Modify: `src/components/About.tsx` (full replace)

**Interfaces:**
- Consumes: `personalInfo`, `education`, `certifications`, `publications`, `projects` from `data.ts` (unchanged), `JourneyMap` from Task 6 (unchanged import).

**Structural decisions in this task:**
- `certCategoryColors` (3 hues) collapses to the single accent, matching Task 7's Skills decision.
- Education timeline currently alternates cyan/purple by index; retuned to: most recent entry (NYU, index 0 in the array as authored) gets the accent, the earlier entry (Amity) gets the muted border tone — a "current vs. past" distinction instead of an arbitrary alternating rainbow.
- The oversized decorative quote mark switches to the serif font.
- VIP Project callout (purple accent bar/tags) moves to the gold secondary tone, marking it as a distinct "featured" callout — same visual logic as the featured-publication treatment in Task 9.

- [ ] **Step 1: Replace `About.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { MapPin, BookOpen } from "lucide-react";
import { personalInfo, education, certifications, publications, projects, type Certification } from "@/lib/data";
import dynamic from "next/dynamic";

const JourneyMap = dynamic(() => import("./JourneyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-2xl border border-[#2a231c] bg-[#14100d] flex items-center justify-center">
      <p className="text-xs font-mono text-[#8a8073] uppercase tracking-widest animate-pulse">Loading flight log…</p>
    </div>
  ),
});

const stats = [
  { label: "Projects Built", value: `${projects.length}+` },
  { label: "Internships", value: "6+" },
  { label: "Publications", value: String(publications.length) },
  { label: "Certifications", value: "6+" },
];

const ACCENT = "#d97b3f";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function About() {
  const groupedCerts = certifications.reduce<
    Array<{ category: string; items: Certification[] }>
  >((acc, cert) => {
    const existing = acc.find((g) => g.category === cert.category);
    if (existing) {
      existing.items.push(cert);
    } else {
      acc.push({ category: cert.category, items: [cert] });
    }
    return acc;
  }, []);

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-16" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">01 / About</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">About Me</h2>
        </motion.div>

        <motion.div className="relative mb-20" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <span
            className="absolute -top-8 -left-4 text-8xl font-serif leading-none select-none pointer-events-none"
            style={{ color: "#d97b3f", opacity: 0.15 }}
          >
            &ldquo;
          </span>
          <p className="text-2xl sm:text-3xl leading-relaxed text-[#c7bcae] font-light max-w-4xl">
            {"I’m an "}
            <span className="text-[#f5f0e8] font-semibold">AI/ML engineer</span>
            {" with an MS in Computer Science from "}
            <span style={{ color: "#d97b3f" }}>NYU Tandon</span>
            {", passionate about building intelligent systems that solve real-world problems. With hands-on experience across "}
            <span className="text-[#f5f0e8] font-semibold">LLMs, cloud infrastructure, big data pipelines</span>
            {", and full-stack development, I bring ideas from research to production. "}
            <span className="text-[#f5f0e8] font-semibold">Published author</span>
            {" with "}
            <span style={{ color: "#d97b3f" }}>Cambridge Scholars Publishing</span>
            {", "}
            <span style={{ color: "#d97b3f" }}>IEEE</span>
            {", and "}
            <span style={{ color: "#d97b3f" }}>Human Behavior and Emerging Technologies</span>
            {", with "}
            <span className="text-[#f5f0e8] font-semibold">6+ internships</span>
            {" spanning AI, cloud, and enterprise software."}
          </p>
          <div className="flex items-center gap-2 text-sm text-[#8a8073] mt-6">
            <MapPin size={14} className="text-[#d97b3f]" />
            {personalInfo.location}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap sm:flex-nowrap gap-px border border-[#2a231c] rounded-2xl overflow-hidden mb-20"
          variants={containerVariants}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="flex-1 min-w-[140px] flex flex-col items-center justify-center py-8 px-4
                         bg-[#1c1712] hover:bg-[#221b14] transition-colors
                         border-r border-[#2a231c] last:border-r-0"
            >
              <p className="text-6xl sm:text-7xl font-bold font-mono leading-none" style={{ color: "#d97b3f" }}>
                {stat.value}
              </p>
              <p className="text-xs font-mono text-[#8a8073] uppercase tracking-widest mt-3 text-center">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mb-20" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <h3 className="text-sm font-mono text-[#d97b3f] uppercase tracking-widest mb-6">Academic Journey</h3>
          <JourneyMap />
        </motion.div>

        <div className="mb-20">
          <motion.h3
            className="text-sm font-mono text-[#d97b3f] uppercase tracking-widest mb-10"
            variants={itemVariants}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true }}
          >
            Education
          </motion.h3>

          <div className="relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-0.5 rounded-full" style={{ background: "linear-gradient(180deg, #d97b3f 0%, #8a8073 100%)" }} />

            <motion.div className="flex flex-col gap-12" variants={containerVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
              {education.map((edu, i) => {
                const isCurrent = i === 0;
                const nodeColor = isCurrent ? "#d97b3f" : "#8a8073";
                const pulseColor = isCurrent ? "rgba(217,123,63,0.2)" : "rgba(138,128,115,0.2)";
                const nodeGlow = isCurrent ? "0 0 12px rgba(217,123,63,0.7)" : "none";
                const hoverBorder = isCurrent ? "#d97b3f" : "#8a8073";

                return (
                  <motion.div key={edu.school} variants={itemVariants} className="relative pl-10">
                    <div className="absolute left-0 top-1.5">
                      <motion.div
                        className="absolute inset-0 w-5 h-5 rounded-full"
                        style={{ background: pulseColor }}
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      />
                      <div className="relative w-5 h-5 rounded-full border-2 border-[#14100d]" style={{ background: nodeColor, boxShadow: nodeGlow }} />
                    </div>

                    <div
                      className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 hover:border-opacity-30 transition-all duration-200 group"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${hoverBorder}30`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2a231c"; }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <p className="text-base font-semibold text-[#f5f0e8]">{edu.degree}</p>
                          <p className="text-sm text-[#8a8073] mt-0.5">{edu.school}</p>
                          {edu.details && <p className="text-xs text-[#8a8073]/70 mt-1 italic">{edu.details}</p>}
                          {edu.gpa && <p className="text-xs font-mono mt-1" style={{ color: "#d97b3f" }}>GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-mono" style={{ color: nodeColor }}>{edu.period}</p>
                          <p className="text-xs text-[#8a8073] mt-1">{edu.location}</p>
                        </div>
                      </div>

                      {edu.courses && (
                        <div>
                          <p className="text-xs text-[#8a8073] mb-2 flex items-center gap-1.5">
                            <BookOpen size={11} />
                            Relevant Coursework
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.courses.map((course) => (
                              <span
                                key={course}
                                className="text-xs px-2 py-0.5 rounded font-mono text-[#8a8073]
                                           bg-[#241d16] border border-[#3a3025]
                                           hover:text-[#d97b3f] hover:border-[#d97b3f]/30 transition-colors"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <motion.div className="mt-8 ml-10" variants={itemVariants} whileInView="visible" initial="hidden" viewport={{ once: true, margin: "-50px" }}>
            <div className="bg-[#1c1712] border border-[#e0b34d]/20 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs font-mono text-[#e0b34d] mb-1">Vertically Integrated Project · NYU FAMS Lab</p>
                  <p className="text-sm font-semibold text-[#f5f0e8]">TAJ Dataset — Endoscopic Laser Ablation Analysis</p>
                </div>
                <p className="text-xs font-mono text-[#d97b3f] flex-shrink-0">Fall 2025 – Present</p>
              </div>
              <p className="text-xs text-[#8a8073] leading-relaxed mb-3">
                Built a computer vision pipeline using YOLOv5 and U-Net to detect surgical regions and segment laser-affected tissue in endoscopic imagery. Generated tissue damage heatmaps to visualize ablation intensity and spatial spread, integrated with 3D Slicer for surgical decision support.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["YOLOv5", "U-Net", "PyTorch", "Computer Vision", "OpenCV", "3D Slicer", "Medical Imaging"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(224,179,77,0.1)", color: "#e0b34d", border: "1px solid rgba(224,179,77,0.2)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} whileInView="visible" initial="hidden" viewport={{ once: true }}>
          <motion.h3 className="text-sm font-mono text-[#d97b3f] uppercase tracking-widest mb-8" variants={itemVariants}>
            Certifications
          </motion.h3>

          <div className="flex flex-col gap-8">
            {groupedCerts.map(({ category, items }) => (
              <motion.div key={category} variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ACCENT }} />
                  <p className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: ACCENT }}>{category}</p>
                  <div className="flex-1 h-px" style={{ background: `${ACCENT}20` }} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map((cert) => (
                    <div
                      key={cert.name}
                      className="px-3 py-2 rounded-lg border transition-all duration-200 cursor-default"
                      style={{ background: `${ACCENT}08`, borderColor: `${ACCENT}20` }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = `${ACCENT}18`;
                        el.style.borderColor = `${ACCENT}50`;
                        el.style.boxShadow = `0 0 12px ${ACCENT}25`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = `${ACCENT}08`;
                        el.style.borderColor = `${ACCENT}20`;
                        el.style.boxShadow = "none";
                      }}
                    >
                      <p className="text-xs font-semibold text-[#f5f0e8]">{cert.name}</p>
                      <p className="text-xs font-mono text-[#8a8073] mt-0.5">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev` → About section: quote mark is serif, education timeline shows NYU (current) in accent and Amity in muted tone, certifications all one accent color, VIP callout uses the gold tone.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: re-skin About, collapse cert rainbow, retune education timeline"
```

---

### Task 9: Publications — retune featured card to gold, re-skin standard cards

**Files:**
- Modify: `src/components/Publications.tsx` (full replace)

**Interfaces:**
- Consumes: `publications` from `data.ts` (unchanged shape).

**Structural decision:** `typeConfig.book.color` moves from purple (`#a855f7`) to gold (`#e0b34d`) — this is the same "featured/elevated" gold treatment used for the VIP callout in Task 8, keeping a consistent visual language for "this is the standout one." `journal`/`conference` keep the standard accent.

- [ ] **Step 1: Replace `Publications.tsx`**

```tsx
"use client";

import { BookOpen, FileText, ExternalLink, Users, Hash, Star } from "lucide-react";
import { publications } from "@/lib/data";

const typeConfig = {
  book: { icon: BookOpen, label: "Book Chapter", color: "#e0b34d" },
  journal: { icon: FileText, label: "Journal", color: "#d97b3f" },
  conference: { icon: FileText, label: "Conference Paper", color: "#d97b3f" },
};

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-6 bg-[#171310]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">06 / Publications</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Publications</h2>
        </div>

        <div className="flex flex-col gap-6">
          {publications.map((pub, i) => {
            const { icon: Icon, label, color } = typeConfig[pub.type];
            const isBook = pub.type === "book";

            if (isBook) {
              return (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden transition-all duration-200 group"
                  style={{
                    background: "linear-gradient(135deg, rgba(224,179,77,0.08) 0%, rgba(28,23,18,1) 60%)",
                    border: "1px solid rgba(224,179,77,0.3)",
                    boxShadow: "0 0 40px rgba(224,179,77,0.06)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(224,179,77,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(224,179,77,0.3)")}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: "linear-gradient(180deg, #e0b34d, #d97b3f)" }} />

                  <div className="p-7 pl-8">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                        style={{ background: "rgba(224,179,77,0.18)", color: "#e0b34d", border: "1px solid rgba(224,179,77,0.35)" }}
                      >
                        <Star size={10} fill="#e0b34d" />
                        Featured
                      </span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-mono font-medium"
                        style={{ background: "rgba(224,179,77,0.1)", color: "#e0b34d", border: "1px solid rgba(224,179,77,0.2)" }}
                      >
                        {label}
                      </span>
                      {pub.highlight && (
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                          style={{ background: "rgba(224,179,77,0.12)", color: "#e8c37a", border: "1px solid rgba(224,179,77,0.2)" }}
                        >
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#8a8073] font-mono ml-auto">{pub.date}</span>
                    </div>

                    <p className="text-xs font-mono text-[#e0b34d]/70 mb-3 uppercase tracking-widest">{pub.publisher}</p>
                    <h3 className="text-base font-bold text-[#f5f0e8] leading-snug mb-4 group-hover:text-[#e8c37a] transition-colors">
                      {pub.title}
                    </h3>

                    {pub.authors && (
                      <p className="text-xs text-[#c7bcae] mb-4 flex items-start gap-2">
                        <Users size={12} className="mt-0.5 flex-shrink-0 text-[#e0b34d]" />
                        {pub.authors}
                      </p>
                    )}

                    <p className="text-xs text-[#8a8073] leading-relaxed mb-5">{pub.description}</p>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#e0b34d]/10">
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:underline"
                          style={{ color: "#e0b34d" }}
                        >
                          <ExternalLink size={12} />
                          View on Cambridge Scholars
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={i}
                className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 group transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}30`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a231c")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}15` }}>
                    <Icon size={18} style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                      >
                        {label}
                      </span>
                      {pub.highlight && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                          style={{ background: "rgba(217,123,63,0.1)", color: "#d97b3f", border: "1px solid rgba(217,123,63,0.2)" }}
                        >
                          {pub.highlight}
                        </span>
                      )}
                      <span className="text-xs text-[#8a8073] font-mono ml-auto">{pub.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#f5f0e8] leading-snug mb-1.5 group-hover:text-[#d97b3f] transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-xs font-mono text-[#8a8073] mb-3 leading-relaxed">{pub.publisher}</p>

                    {pub.authors && (
                      <p className="text-xs text-[#8a8073] mb-3 flex items-start gap-1.5">
                        <Users size={11} className="mt-0.5 flex-shrink-0" style={{ color }} />
                        {pub.authors}
                      </p>
                    )}

                    <p className="text-xs text-[#8a8073] leading-relaxed mb-4">{pub.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      {pub.doi && (
                        <p className="text-xs font-mono text-[#8a8073]/70 flex items-center gap-1">
                          <Hash size={10} />
                          DOI: {pub.doi}
                        </p>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline"
                          style={{ color }}
                        >
                          <ExternalLink size={12} />
                          View Publication
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev` → Cambridge Scholars card shows the gold-toned featured treatment (not purple); IEEE/Wiley-adjacent standard cards show the accent color.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: retune featured publication card to gold, re-skin standard cards"
```

---

### Task 10: Experience — re-skin

**Files:**
- Modify: `src/components/Experience.tsx` (full replace)

**Interfaces:**
- Consumes: `experiences` from `data.ts` (unchanged shape).

- [ ] **Step 1: Replace `Experience.tsx`**

```tsx
import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">03 / Experience</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Work Experience</h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#2a231c]" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-16 group">
                <div
                  className="absolute left-[18px] top-1 w-4 h-4 rounded-full border-2 border-[#14100d] transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: i === 0 ? "#d97b3f" : "#2a231c",
                    borderColor: i === 0 ? "#d97b3f" : "#2a231c",
                    boxShadow: i === 0 ? "0 0 12px rgba(217,123,63,0.6)" : "none",
                    outline: i !== 0 ? "2px solid #2a231c" : "none",
                  }}
                />

                <div className="bg-[#1c1712] border border-[#2a231c] rounded-xl p-6 hover:border-[#d97b3f]/30 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#f5f0e8] group-hover:text-[#d97b3f] transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-[#8a8073] mt-0.5 flex items-center gap-1.5">
                        <Briefcase size={12} />
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-mono text-[#d97b3f]">{exp.period}</p>
                      <p className="text-xs text-[#8a8073] mt-0.5">{exp.location}</p>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-1.5 mb-4">
                    {exp.description.map((point, j) => (
                      <li key={j} className="text-sm text-[#8a8073] flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#d97b3f]/50 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-mono text-[#8a8073] bg-[#241d16] border border-[#3a3025]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev` → Experience timeline re-skinned, most recent role's dot is accent-colored, older roles are muted.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: re-skin Experience timeline"
```

---

### Task 11: Contact — re-skin

**Files:**
- Modify: `src/components/Contact.tsx` (full replace)

**Interfaces:**
- Consumes: `personalInfo` from `data.ts`, `WEB3FORMS_KEY` constant (unchanged — do not touch the Web3Forms integration itself, only colors).

- [ ] **Step 1: Replace `Contact.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Mail, Github, Linkedin, GraduationCap, MapPin, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo } from "@/lib/data";

const WEB3FORMS_KEY = "476f9eaf-3a76-455f-bf27-41f1bf7d7d8f";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio contact from ${form.name}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-[#171310] border border-[#2a231c] rounded-lg px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#8a8073]/50 focus:outline-none focus:border-[#d97b3f]/50 focus:ring-1 focus:ring-[#d97b3f]/20 transition-all duration-200 font-mono";

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-mono text-[#d97b3f] uppercase tracking-widest mb-2">08 / Contact</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#f5f0e8]">Get In Touch</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-[#8a8073] leading-relaxed mb-8">
              I'm currently open to full-time roles, research collaborations, and interesting projects in AI/ML, cloud, and full-stack engineering. If you have an opportunity or just want to chat, my inbox is always open.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1712] border border-[#d97b3f]/30 text-sm text-[#f5f0e8] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#d97b3f] animate-pulse" />
              Open to opportunities
            </div>

            <div className="flex flex-col gap-4">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 text-[#8a8073] hover:text-[#d97b3f] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#1c1712] border border-[#2a231c] flex items-center justify-center group-hover:border-[#d97b3f]/40 transition-colors">
                  <Mail size={15} />
                </div>
                <span className="text-sm">{personalInfo.email}</span>
              </a>

              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#8a8073] hover:text-[#d97b3f] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#1c1712] border border-[#2a231c] flex items-center justify-center group-hover:border-[#d97b3f]/40 transition-colors">
                  <Github size={15} />
                </div>
                <span className="text-sm">github.com/Namantyagi2727</span>
              </a>

              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#8a8073] hover:text-[#d97b3f] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#1c1712] border border-[#2a231c] flex items-center justify-center group-hover:border-[#d97b3f]/40 transition-colors">
                  <Linkedin size={15} />
                </div>
                <span className="text-sm">linkedin.com/in/naman-tyagi-nt2727</span>
              </a>

              <a href={personalInfo.scholar} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#8a8073] hover:text-[#d97b3f] transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-[#1c1712] border border-[#2a231c] flex items-center justify-center group-hover:border-[#d97b3f]/40 transition-colors">
                  <GraduationCap size={15} />
                </div>
                <span className="text-sm">Google Scholar</span>
              </a>

              <div className="flex items-center gap-3 text-[#8a8073]">
                <div className="w-9 h-9 rounded-lg bg-[#1c1712] border border-[#2a231c] flex items-center justify-center">
                  <MapPin size={15} />
                </div>
                <span className="text-sm">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1712] border border-[#2a231c] rounded-2xl p-7 hover:border-[#d97b3f]/20 transition-colors">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <CheckCircle size={32} className="text-[#22c55e]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#f5f0e8] mb-2">Message sent!</h3>
                  <p className="text-sm text-[#8a8073] mb-6">I'll get back to you as soon as possible.</p>
                  <button onClick={() => setStatus("idle")} className="text-xs font-mono text-[#d97b3f] hover:underline">
                    Send another →
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-[#f5f0e8] mb-1">Send a message</h3>

                  <div>
                    <label className="block text-xs font-mono text-[#8a8073] mb-1.5">Name</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8a8073] mb-1.5">Email</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#8a8073] mb-1.5">Message</label>
                    <textarea name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="What's on your mind?" className={`${inputClass} resize-none`} />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
                      <AlertCircle size={13} />
                      Something went wrong. Try emailing directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-[#14100d] transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
                    style={{ background: "#d97b3f" }}
                  >
                    {status === "loading" ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
                    {status === "loading" ? "Sending…" : "Send Message"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build` → expect success.

- [ ] **Step 3: Visual check**

`npm run dev` → Contact form re-skinned; submit a test message and confirm the Web3Forms integration still succeeds (success state shows, still green checkmark).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: re-skin Contact section"
```

---

### Task 12: Final verification pass

**Files:** none (verification only).

**Interfaces:** none — this task confirms the previous 11 tasks are complete and consistent.

- [ ] **Step 1: Confirm no old palette literals remain**

```bash
grep -rn "#00d4ff\|#a855f7\|#0a0a0a\|#ededed\|#6b7280\|#9ca3af\|#111111\|#1e1e1e\|#0d0d0d\|#f59e0b\|#f97316\|#10b981\|#06b6d4\|#c084fc\|#7c3aed" src/
```
Expected: no output. If anything remains, it's a missed spot from an earlier task — fix it there rather than patching ad hoc here.

- [ ] **Step 2: Confirm `cobe` is fully gone**

```bash
grep -rn "cobe" package.json src/
```
Expected: no output.

- [ ] **Step 3: Full build**

Run: `npm run build`
Expected: succeeds with no errors or warnings about unused imports.

- [ ] **Step 4: Full visual walkthrough**

`npm run dev`, scroll through every section in order (Hero → About → Skills → Experience → Projects → Publications → Side Quests → Contact → Footer), confirm:
- Consistent warm-dark background, no leftover pure-black/pure-white panels.
- One accent color dominates; gold appears only on the two "featured" treatments (VIP project callout, Cambridge Scholars publication); rose/gold/accent appear only inside JourneyMap.
- `⌘K` opens the command palette from any scroll position.
- Prism diagram's cache/breaker buttons respond.
- Contact form still submits successfully.

- [ ] **Step 5: Commit (if step 1 turned up fixes)**

```bash
git add -A
git commit -m "fix: catch remaining old-palette literals"
```

---

## Out of scope for this plan

- The GitHub profile README (finalized copy is in the spec doc) — it lives in a separate `Namantyagi2727/Namantyagi2727` repository, not this codebase. Creating/pushing that repo is a manual step for the user, or a separate explicit request — not part of this plan's execution.
