# Jaseci.org — Design System

Single source of truth for visual identity. See `.claude/ui-design-rulebook.md` for how to use this file.

---

## Aesthetic direction

**Modern editorial-technical.** Confident typography, generous whitespace, flat surfaces, single accent color. Built for a developer audience without leaning into "techy" clichés (no gradients, no glow, no neon, no glassmorphism).

- **Flat, not layered.** Borders define structure, not shadows.
- **Editorial, not decorative.** Type does most of the work. Visuals support, don't decorate.
- **Minimal, not sterile.** One bold accent does the heavy lifting; everything else is neutral.

---

## Color

Defined as CSS custom properties; map directly to `tailwind.config.js` `theme.extend.colors`.

### Light (default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAFAF7` | Page background (warm off-white) |
| `--surface` | `#FFFFFF` | Cards, raised surfaces |
| `--fg` | `#0F0F0F` | Primary text |
| `--fg-muted` | `#6B6B6B` | Secondary text, captions |
| `--fg-subtle` | `#A0A0A0` | Tertiary text, placeholders |
| `--border` | `#E5E5E0` | Dividers, card borders, inputs |
| `--border-strong` | `#1A1A1A` | High-emphasis borders (rare) |
| `--accent` | `#E94B2B` | CTAs, links, focus, emphasis |
| `--accent-hover` | `#C73A1F` | Hover state for accent |
| `--accent-soft` | `#FDEBE6` | Accent backgrounds, badges |

### Dark

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0A0A0A` | Page background |
| `--surface` | `#141414` | Cards, raised surfaces |
| `--fg` | `#F5F5F0` | Primary text |
| `--fg-muted` | `#8A8A85` | Secondary text |
| `--fg-subtle` | `#5A5A55` | Tertiary text |
| `--border` | `#2A2A28` | Dividers, card borders |
| `--border-strong` | `#E5E5E0` | High-emphasis borders |
| `--accent` | `#FF6B4A` | CTAs, links, focus, emphasis |
| `--accent-hover` | `#FF8A6E` | Hover state |
| `--accent-soft` | `#2E1812` | Accent backgrounds, badges |

### Status (both modes — use sparingly)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--success` | `#1F8A4C` | `#3FB36C` | Success states only |
| `--warning` | `#B86E00` | `#E89030` | Warning states only |
| `--danger` | `#C3331F` | `#FF5E47` | Error/destructive states |

**Rules:**
- No color outside this list. No new hues, no eyeballed tints.
- Accent is the only saturated color in normal UI. Don't pair it with other saturated colors.
- Status colors are for status only — not for branding or emphasis.

---

## Typography

### Families

| Token | Font | Loaded via |
|---|---|---|
| `--font-sans` | **Inter** | `next/font/google` |
| `--font-display` | **Inter Tight** | `next/font/google` |
| `--font-mono` | **JetBrains Mono** | `next/font/google` |

- **Display** (Inter Tight) — H1–H3 only. Tighter tracking, more presence.
- **Sans** (Inter) — body, UI, H4–H6.
- **Mono** (JetBrains Mono) — code, jac snippets, inline `code`.

### Scale

| Token | Size | Line-height | Use |
|---|---|---|---|
| `text-xs` | 0.75rem (12px) | 1.5 | Captions, labels, footnotes |
| `text-sm` | 0.875rem (14px) | 1.5 | Secondary UI, small body |
| `text-base` | 1rem (16px) | 1.6 | Body |
| `text-lg` | 1.125rem (18px) | 1.6 | Lead paragraphs |
| `text-xl` | 1.25rem (20px) | 1.5 | H6, large body |
| `text-2xl` | 1.5rem (24px) | 1.4 | H5 |
| `text-3xl` | 1.875rem (30px) | 1.3 | H4 |
| `text-4xl` | 2.25rem (36px) | 1.2 | H3 — display |
| `text-5xl` | 3rem (48px) | 1.1 | H2 — display |
| `text-6xl` | 3.75rem (60px) | 1.05 | H1 — display, hero |
| `text-display` | 4.5rem (72px) | 1.0 | Marketing hero only |

### Weights

| Token | Weight | Use |
|---|---|---|
| `font-normal` | 400 | Body |
| `font-medium` | 500 | UI labels, buttons |
| `font-semibold` | 600 | H4–H6, emphasis |
| `font-bold` | 700 | H1–H3, display |

### Treatments

- Headings: tight tracking (`tracking-tight` for H1–H3).
- Eyebrows / labels above headings: `text-xs uppercase tracking-widest text-fg-muted`.
- Body: `text-base` normal weight, `--fg` color, `1.6` line-height.
- Links in body: underlined, `--accent` color, `--accent-hover` on hover.

---

## Spacing

Use Tailwind's default scale (`p-1` = 4px, `p-2` = 8px, etc.). Common rhythm:

- **Inside components:** `p-4`, `p-6`, `gap-3`, `gap-4`
- **Between sections:** `py-16` (mobile) → `py-24` (desktop) → `py-32` (hero)
- **Page max-width:** `max-w-6xl` (1152px) for content, `max-w-7xl` (1280px) for full layouts
- **Reading width:** `max-w-prose` (~65ch) for long-form text

---

## Layout

- **Container:** centered, `max-w-6xl`, horizontal padding `px-6` (mobile) → `px-8` (desktop).
- **Grid:** 12-column on `lg:` and up. Mobile is single-column flow.
- **Vertical rhythm:** sections separated by `py-24` minimum on desktop.

---

## Borders & radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Buttons, badges, inputs |
| `--radius-md` | 6px | Cards |
| `--radius-lg` | 10px | Large surfaces (rarely used) |
| `--radius-full` | 9999px | Pills, avatars |

- Default border width: `1px`, color `--border`.
- No double borders. No giant rounded blobs.

---

## Shadows

**Almost none.** This is a flat system. Only one shadow exists:

| Token | Value | Use |
|---|---|---|
| `--shadow-hover` | `0 4px 12px rgba(0,0,0,0.06)` | Subtle hover lift on cards/buttons only |

- No drop shadows on text, icons, or surfaces by default.
- No layered shadows. No colored shadows. No glow.

---

## Motion

- **Default transition:** `150ms ease-out` for color/background/border.
- **Hover lifts:** `200ms ease-out` for transform.
- **Page transitions:** none (let Next.js routing be instant).
- **Respect `prefers-reduced-motion`:** disable all transforms and lengthy transitions.

---

## Iconography

- **Style:** stroke-based, 1.5px stroke, 24×24 grid. Use **Lucide** (`lucide-react`).
- No filled icons mixed with stroked. No emoji as UI.
- Size: `w-4 h-4` (16px) inline, `w-5 h-5` (20px) buttons, `w-6 h-6` (24px) standalone.

---

## Component defaults

**Button (primary):** `--accent` bg, white text, `--radius-sm`, `px-4 py-2`, `font-medium`. Hover → `--accent-hover`. Focus ring → 2px `--accent` offset 2px.

**Button (secondary):** transparent bg, `--fg` text, 1px `--border-strong` border, same padding. Hover → `--bg` darkens slightly via existing tokens.

**Card:** `--surface` bg, 1px `--border`, `--radius-md`, `p-6`. Optional hover → `--shadow-hover`.

**Input:** `--surface` bg, 1px `--border`, `--radius-sm`, `px-3 py-2`. Focus ring → 2px `--accent` offset 2px, border becomes `--accent`.

**Link (in prose):** `--accent` color, underlined. Hover → `--accent-hover`.

---

## Accessibility

- All text must meet WCAG AA contrast against its background. The palette above is designed for this.
- Focus rings always visible. Never `outline: none` without a replacement.
- Touch targets ≥ 44×44px on mobile.
- Semantic HTML first (real `<button>`, `<a>`, `<nav>`, `<main>`).
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

---

## What this system explicitly excludes

If you're tempted by any of these, the answer is no:
- Gradients (linear, radial, mesh — none)
- Glassmorphism / backdrop blur
- Neumorphism
- Glow effects, neon, bloom
- Layered or colored shadows beyond `--shadow-hover`
- Decorative borders (double, dashed, gradient)
- More than one accent color in the UI at a time
- Custom fonts beyond the three families above
