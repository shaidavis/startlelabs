---
paths:
  - "src/components/**"
  - "src/lib/animations.ts"
  - "src/app/globals.css"
---

# Animation conventions

Two coexisting layers. Pick the one that matches what you're touching.

## CSS animations (hover micro-interactions, marquees)

Defined in `src/app/globals.css` as `@keyframes` + helper classes (`.icon-anim-wave`,
`.icon-anim-heartbeat`, `.cta-arrow`, `.banner-arrow`, Venn `venn-*`, marquees). Triggered via
`.group:hover` / `:focus-within` selectors, not Tailwind variants.
- Keep keyframes **outside `@theme`** (v4 tree-shaking footgun — see `tailwind-v4.md`).
- Prefer the existing plain-CSS `.group:hover .icon-anim-*` pattern over
  `group-hover:animate-*` (unreliable under v4 + Turbopack).

## JS animations (Framer Motion 12)

Used directly in ~13 components (`FullscreenScroller`, `ServicePageTemplate`,
`AboutTemplate`, `ValuesVennHero`, `InteractiveVennCanvas`, `Topbar`, `SectionNav`,
`PageTransition`, `Accent`, contact page, `useScrollProgress`, …). Most motion is written
inline per component — there is **no single central variants file**. `src/lib/animations.ts`
holds only two shared variants (`fadeInUp`, `staggerContainer`); reuse them where they fit,
but don't expect all animation to live there.

- Homepage hero entrance timing constants: `src/components/sections/heroTiming.ts`.
- Reduced motion: `src/components/layout/MotionProvider.tsx` wraps the app in
  `<MotionConfig reducedMotion="user">`, so Framer honors the OS setting automatically —
  don't re-implement reduced-motion handling per component. (The `globals.css`
  `prefers-reduced-motion` block covers the CSS layer; MotionProvider covers the JS layer.)

## Verifying animation

There are no tests. After an animation change, run the dev server and watch it render at
~375/768/1440px, and toggle OS "reduce motion" to confirm the reduced-motion paths behave.
See the `verify-visual` skill.
