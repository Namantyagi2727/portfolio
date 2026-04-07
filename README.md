<div align="center">

# Naman Tyagi — Portfolio

**AI/ML Engineer · Full-Stack Developer · Cloud Architect**

[![Live Site](https://img.shields.io/badge/Live%20Site-namantyagi.dev-00d4ff?style=for-the-badge&logo=vercel&logoColor=white)](https://namantyagi.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-naman--tyagi--nt2727-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/naman-tyagi-nt2727)
[![GitHub](https://img.shields.io/badge/GitHub-Namantyagi2727-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Namantyagi2727)

</div>

---

## Overview

Personal portfolio website built with **Next.js 15**, **TypeScript**, and **Tailwind CSS v4**. Features an interactive 3D globe, animated career journey map, and a clean single-page layout covering experience, projects, publications, and skills.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Framer Motion |
| 3D / Maps | COBE (WebGL globe) · React Simple Maps · D3.js |
| Fonts | Geist (Vercel) |
| Deployment | Vercel |

## Features

- **Interactive 3D Globe** — auto-rotating spotlight cycles between Brooklyn, London, and New Delhi; fully draggable
- **Journey Map** — SVG world map with animated connection lines tracing the career path across cities
- **Single source of truth** — all content lives in `src/lib/data.ts`; update once, reflects everywhere
- **Framer Motion animations** — staggered section reveals, particle effects in the hero
- **Responsive** — mobile-first layout, works across all screen sizes

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout, metadata, fonts
│   ├── page.tsx          # Page composition
│   └── globals.css       # Theme variables, Tailwind base
├── components/
│   ├── Hero.tsx          # Hero with 3D globe + particles
│   ├── GlobeCanvas.tsx   # COBE globe with spotlight state machine
│   ├── JourneyMap.tsx    # Interactive career map (D3 + React Simple Maps)
│   ├── Experience.tsx    # Work history timeline
│   ├── Projects.tsx      # Project cards
│   ├── Skills.tsx        # Categorized tech skills
│   ├── About.tsx         # Bio, education, certifications
│   ├── Publications.tsx  # Research papers
│   ├── SideQuests.tsx    # Fun stats
│   └── ...
└── lib/
    └── data.ts           # All portfolio content (single source of truth)
```

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Updating Content

All content is in `src/lib/data.ts`. Edit the exported arrays/objects:

| Export | What it controls |
|---|---|
| `personalInfo` | Name, title, bio, contact links |
| `experiences` | Work history |
| `projects` | Project cards |
| `skills` | Tech skills by category |
| `education` | Degrees and courses |
| `publications` | Research papers and books |
| `certifications` | Certs list |
| `sideQuests` | Fun stats section |

## Deployment

Deployed on **Vercel** — every push to `main` triggers an automatic redeploy.

---

<div align="center">
  <sub>Built by Naman Tyagi · MS CS @ NYU Tandon</sub>
</div>
