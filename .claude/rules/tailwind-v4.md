---
paths:
  - "src/app/globals.css"
  - "src/**/*.tsx"
---

# Tailwind CSS v4 conventions

This project uses Tailwind v4 via `@tailwindcss/postcss`. **There is no `tailwind.config.*`
file** — everything is in `src/app/globals.css`.

## Tokens

- Design tokens live in `@theme inline { … }` in `globals.css`: colors
  (`--color-primary #230F2C`, `--color-secondary #E9C402`, background/foreground), font vars,
  and breakpoints. Add new tokens there, not in a config file.
- **Breakpoints are non-default** ("Haze-aligned"): `sm = 810px`, `md = 1024px`,
  `lg = 1440px`. So `md:` means ≥1024, not the stock 768. Keep this in mind when reading or
  writing responsive classes.
- Fonts come from `next/font` in `layout.tsx` and are surfaced as `--font-*` vars. Use the
  `.font-headline` / `.font-handwritten` helper classes (or `font-sans`) — the raw `@theme`
  font tokens can't resolve runtime `next/font` vars, which is why those helper classes exist.

## Keyframes — the v4 footgun (do not undo)

`@keyframes` and the hover-helper classes (`.icon-anim-*`, `.cta-arrow`, `.banner-arrow`,
`.no-scrollbar`, Venn animations) **must stay OUTSIDE `@theme`**. Tailwind v4 tree-shakes
keyframes declared inside `@theme` when no `animate-*` utility references them in the JSX,
which silently breaks hover animations. This was hit and fixed once already — see the comment
block in `globals.css`. When adding an animation, define the keyframe outside `@theme`.

Also: `group-hover:animate-*` and arbitrary properties containing `var()` don't reliably emit
under v4 + Turbopack. The plain-CSS `.group:hover .icon-anim-*` selectors in `globals.css`
are the deliberate workaround — follow that pattern rather than fighting the utility variants.

## Classes

Merge/compose classes with `cn()` from `src/lib/utils.ts` (a thin `clsx` wrapper).
