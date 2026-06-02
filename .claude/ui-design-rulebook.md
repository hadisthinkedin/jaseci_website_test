# Website UI Design Rulebook

You are helping me design and build a website. I have a design reference file that defines the project's visual identity. This document tells you how to use it.

**My design reference file:** `design-system.md` (at the repo root)

## Core principle

The design file is the **single source of truth for visual identity** — colors, fonts, and any other tokens it defines. Those are locked. Everything else — layout, composition, components, motion — is yours to design well. Constrain the identity; apply your full craft to the rest.

## First, always

Before you produce or change any UI, code, or visual output:
1. Open and read the design file.
2. Identify the tokens relevant to what you're building (colors, type, spacing, etc.).
3. Build using those exact values. When you write code, reference the file's actual variables/names (e.g. the CSS custom properties / Tailwind theme keys) — don't hardcode duplicate values or eyeball equivalents.

## Locked — must come from the file, never invented

- **Colors.** Use only the palette defined in the file. No new hues, and no tints/shades that aren't defined or directly derived from a defined token. "Close enough" is not allowed.
- **Typography.** Use the font families, type scale/sizes, weights, line-heights, letter-spacing, and text treatments (e.g. uppercase headings, tracking) exactly as specified. Don't swap in a different typeface — even a "better" one — unless I explicitly ask.
- **Any other defined tokens.** If the file specifies spacing units, border-radius, max-widths, shadows (or the deliberate absence of them), etc., follow them.
- **The overall aesthetic.** Match the mood the file implies — e.g. flat vs. layered, minimal vs. decorative, editorial vs. playful. Don't introduce effects (gradients, drop shadows, glassmorphism, etc.) that the system clearly excludes.

## Yours to decide — use strong design judgment

Within the locked tokens above, make great, opinionated choices on:
- Layout, grid, page structure, and visual hierarchy.
- Component design and all their states — buttons, inputs, cards, nav, menus — assembled from the locked tokens.
- Spacing rhythm and whitespace (respecting the file's scale if it defines one).
- Hover, focus, active, loading, empty, and error states (using accent colors from the file).
- Microinteractions and transitions.
- Responsive behavior and breakpoints.
- Accessibility: sufficient contrast, visible focus rings, semantic HTML, adequate touch targets, reduced-motion support.
- Imagery, iconography, and illustration style that fits the established vibe.

I trust your taste here — don't ask permission for ordinary design decisions. Just keep them consistent with the file.

## When the file doesn't cover something

You'll often need a value the file doesn't define (a hover shade, a chart color set, a disabled state, a new component color). When that happens:
- Derive it from the existing tokens so it harmonizes — e.g. darken the accent for a hover, use a defined muted color for secondary text, build a tint from an existing color.
- Never introduce something that conflicts with or competes with the system.
- In a short note, tell me what you added and why, so I can fold it back into the design file. Keep the file as the canonical record.

## When something is ambiguous or conflicting

If two rules in the file conflict, or a genuinely identity-level decision is unclear and guessing would noticeably affect the result, ask me one focused question instead of guessing. For everything else, proceed.

## Before you show me work

- Briefly say which tokens/values from the file you used (e.g. "background `--bg`, accent `--accent`, Inter for headings").
- Flag any additions or assumptions you made in one short list so I can review them.
- Reuse existing components and patterns before inventing new ones.

Follow these rules for the whole project unless I tell you otherwise.
