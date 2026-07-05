---
paths:
  - "src/app/**"
  - "next.config.ts"
---

# Next.js 16 + React 19 + React Compiler

**This is Next.js 16.2.3 — not the Next 14/15 in your training data.** APIs, conventions, and
file structure may differ. Before writing Next code, read the relevant guide in
`node_modules/next/dist/docs/` and check actual source in this repo. Don't guess an API.

## App Router specifics (verified in this repo)

- **Route params are async.** In `src/app/services/[slug]/page.tsx`, `params` is typed
  `Promise<{ slug: string }>` and must be `await`ed. Same for `generateMetadata`. Do not
  write the old synchronous `params.slug` form.
- Routes live in `src/app/**` only — there is no `pages/` dir. Pages: `/` (homepage
  scroller), `/about`, `/services/[slug]`, plus `/accents` and `/values-venn` (design/dev
  aids) and `not-found.tsx`.
- Dynamic route uses `generateStaticParams` for SSG and `notFound()` for misses.

## Server vs client boundary

- 19 files carry `"use client"` — this is an animation-heavy site, so most interactive
  components are client components. Keep `"use client"` at the leaf that actually needs
  hooks/motion/browser APIs; don't mark a whole page client if only a child needs it.
- `layout.tsx` stays a server component and composes providers (`MotionProvider`) and fonts.

## React Compiler is ON

`reactCompiler: true` in `next.config.ts` (+ `babel-plugin-react-compiler`). The compiler
auto-memoizes. **Do not hand-add `useMemo` / `useCallback` / `React.memo` for performance** —
they're redundant and add noise. Only reach for them when semantics (not perf) require it.

## Redirects

`next.config.ts` `redirects()` maps short paths to homepage hash panels (`/strategy →
/#brand-strategy`, `/contact → /#contact`, etc.). These run **before** filesystem routing —
`/contact` deliberately supersedes `src/app/contact/page.tsx`. Don't "fix" that as a bug.
`/about` is intentionally not redirected. Redirects are `307` (`permanent: false`) while the
URL structure settles.
