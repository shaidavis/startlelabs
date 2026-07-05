# Architecture

A static, animation-heavy marketing site. Next.js 16 App Router, React 19 + React
Compiler, Tailwind v4, Framer Motion, deployed on Vercel. No backend, DB, or CMS.

> The old spec at `.claude/plans/startle-labs-build-plan.md` is **historical, not current** —
> it targets "Next.js 15" and documents routes/components that were since removed (`/work`
> case studies, `CaseStudyTemplate`, `team.ts`, `Button`, `ScrollProgress`, a `tailwind.config.ts`
> that never shipped). Trust the code and this file, not the plan.

## Sources of truth

- **Content** → `src/data/*.ts` (typed objects).
- **Design tokens** → `src/app/globals.css` (`@theme inline`).

Don't duplicate either into components — read from them.

## Data-driven page model

Content lives in typed modules and flows into template components via routes:

```
src/data/services.ts   ─┐
  services (Record<slug, Service>)   → src/app/services/[slug]/page.tsx
  servicesList                          → ServicePageTemplate.tsx  (detail page)
                                       → FullscreenScroller.tsx    (homepage panels)
src/data/about.ts (aboutData)    → src/app/about/page.tsx → AboutTemplate.tsx
src/data/projects.ts (projects)  → consumed by templates
```

`src/app/services/[slug]/page.tsx` is the only dynamic route. It:
- `generateStaticParams()` from `servicesList` → every service is prerendered (SSG).
- reads `params: Promise<{ slug }>` (**Next 16 async params** — must `await`), looks the
  service up in the `services` record, and calls `notFound()` on a miss.
- `generateMetadata()` builds the `<title>`/description from the same object.

Adding a service = adding one object to `services` in `src/data/services.ts`. No route or
template edits needed. (See the `add-service` skill.)

## Homepage: FullscreenScroller + hash panels + redirects

`src/components/sections/FullscreenScroller.tsx` (~1.9k lines, `"use client"`) is the
homepage. It is a fullscreen scroll-snap experience with named panels
(`#brand-strategy`, `#creative-direction`, `#digital-design`, `#contact`) and snaps to a
panel from the URL hash via a `useLayoutEffect`.

`next.config.ts` `redirects()` feeds friendly short paths into that same channel — e.g.
`/strategy → /#brand-strategy`, `/contact → /#contact`. Redirects run **before** filesystem
routing, so `/contact` intentionally supersedes the standalone `src/app/contact/page.tsx`
(the homepage "Yalla" panel is the one contact surface). `/about` is **not** redirected —
the standalone About page is live and linked from the homepage's "Learn More".

## Styling: Tailwind v4, no config file

All tokens are in `src/app/globals.css` under `@theme inline`: brand colors
(`--color-primary #230F2C`, `--color-secondary #E9C402`), fonts, and non-default
"Haze-aligned" breakpoints (`sm 810 / md 1024 / lg 1440`).

**Footgun (already fixed once, keep it fixed):** `@keyframes` and the `.icon-anim-*` /
`.cta-arrow` / `.banner-arrow` helper classes live **outside** `@theme`. Tailwind v4
tree-shook keyframes defined inside `@theme` when no `animate-*` utility referenced them in
JSX, which silently killed hover animations. See the in-file comments in `globals.css`.

## Animation

Two layers:
- **CSS** — `@keyframes` + helper classes in `globals.css`, triggered on `.group:hover` /
  `:focus-within` (icon wiggles, arrow bounces, marquees). Reduced-motion killed via a
  `@media (prefers-reduced-motion: reduce)` block.
- **JS (Framer Motion 12)** — used directly across ~13 components (scroller, templates,
  Venn canvas, Topbar, SectionNav, PageTransition, etc.). `src/lib/animations.ts` holds a
  couple of shared variants (`fadeInUp`, `staggerContainer`) but most motion is inline per
  component. `src/components/layout/MotionProvider.tsx` wraps the app in
  `<MotionConfig reducedMotion="user">` so JS animations honor the OS setting (the CSS block
  above only covers CSS animations). Hero entrance timing constants live in
  `src/components/sections/heroTiming.ts`.

## Fonts

`src/app/layout.tsx` wires `next/font/google` (Geist, Averia Gruesa Libre, DM Sans) and
`next/font/local` (Pecita handwriting from `public/fonts/Pecita.otf`), exposing them as CSS
vars consumed by the `@theme` font tokens and `.font-headline` / `.font-handwritten` helpers.

## Navigation landmarks (big files — isolate reads in a subagent)

| File | ~Lines | What |
|---|---|---|
| `src/components/sections/FullscreenScroller.tsx` | 1924 | Homepage scroller, all panels |
| `src/components/templates/ServicePageTemplate.tsx` | 978 | Service detail page scaffold |
| `src/components/templates/AboutTemplate.tsx` | 649 | About page |
| `src/data/about.ts` | 536 | About content |
| `src/data/services.ts` | 364 | Service content + types |
