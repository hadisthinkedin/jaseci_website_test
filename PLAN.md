# Jaseci.org Redesign — Plan

## Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Scope:** Frontend only (static / SSG)
- **Hosting:** Vercel

## Setup
- [ ] `npx create-next-app@latest jaseci-website` (App Router, **Tailwind: yes**)
- [ ] Clean default boilerplate (`globals.css`, `page.js`)
- [ ] Configure `tailwind.config.js`:
  - Theme colors (primary, secondary, accent, neutral)
  - Custom fonts (extend `fontFamily`)
  - Container widths + spacing scale
- [ ] Set up folder structure:
  - `app/` — routes
  - `components/` — reusable UI
  - `public/` — images, logo, favicon
  - `lib/` — helpers, constants

## Pages
- [ ] `/` — Home (hero, intro to Jaseci, CTA)
- [ ] `/about` — Mission, team, history
- [ ] `/docs` — Link out to docs or embed
- [ ] `/blog` — Optional, static posts
- [ ] `/community` — Discord, GitHub, contributors
- [ ] `/contact` — Email, social links

## Components
- [ ] `Navbar` — logo + links
- [ ] `Footer` — links, copyright, socials
- [ ] `Hero` — headline + CTA
- [ ] `FeatureCard` — reusable section block
- [ ] `Button` — consistent CTA style

## Design Basics
- [ ] Pick color palette → add to `tailwind.config.js` `theme.extend.colors`
- [ ] Pick fonts (1 heading + 1 body, via `next/font/google`) → extend `fontFamily`
- [ ] Use Tailwind's built-in spacing scale (`p-4`, `gap-8`, etc.)
- [ ] Mobile-first responsive with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- [ ] Dark mode via `dark:` variant (set `darkMode: 'class'` in config)

## Content
- [ ] Write homepage copy
- [ ] Gather logos, screenshots, diagrams
- [ ] Update links to GitHub, docs, Discord

## Pre-launch
- [ ] Favicon + OG image + meta tags
- [ ] `next/image` for all images
- [ ] Lighthouse pass (perf, a11y, SEO)
- [ ] Test on mobile + desktop

## Deploy
- [ ] Push to GitHub
- [ ] Connect repo to Vercel
- [ ] Set custom domain `jaseci.org`
- [ ] Verify HTTPS + previews on PRs
