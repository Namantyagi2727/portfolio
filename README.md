# Naman Tyagi — Portfolio

Software Engineer · Applied AI & Machine Learning · LLM Systems, Computer Vision & Cloud

Live at **[namantyagi.dev](https://www.namantyagi.dev)** · [LinkedIn](https://www.linkedin.com/in/naman-tyagi-nt2727) · [GitHub](https://github.com/Namantyagi2727)

## What's here

A single-page portfolio plus four case-study routes:

| Route | Content |
|---|---|
| `/` | Hero, Selected Work (Prism, RAGBase, ConTicx, Immune Cell Population Analysis + an index of other projects), Experience, Research, About, Contact |
| `/work/prism` | Prism LLM gateway — request flow, infrastructure, local benchmark results, dashboards |
| `/work/faculty-ops` | My contributions to NYU Office of Faculty Affairs' team-built platform |
| `/work/medical-cv` | Ongoing kidney-stone detection research at NYU Tandon's FAMS Lab |
| `/work/airspace` | Airspace Congestion Monitoring — streaming architecture |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Vercel Analytics. Deployed on Vercel.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build + type check
```

## Updating content

All content lives in [`src/lib/data.ts`](src/lib/data.ts) — edit it once and every section, case-study page, and the command palette pick it up.

| Export | Controls |
|---|---|
| `personalInfo` | Name, headline, bio, contact links |
| `hero` | Hero statement, meta line, Now / Recently strip |
| `featuredProjects` | Featured project cards in Selected Work |
| `caseStudies` | Prism, Faculty Ops, kidney-stone research, and Airspace pages |
| `projects` | The compact Other Projects index |
| `experiences` | Experience section |
| `publications` | Research section (papers and book chapters are grouped separately) |
| `education`, `certifications` | About section (certificates & courses — never presented as professional cloud certifications) |

Content rule of thumb: every metric carries its test conditions (e.g. "local load test, one machine"), work on team-built systems describes individual contributions rather than team-wide totals, and nothing is claimed that the project's own repo or the résumé doesn't support.

The downloadable résumé is served from [`public/resume.pdf`](public/resume.pdf).

## Deployment

Every push to `main` triggers a Vercel deploy.
