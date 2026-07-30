@AGENTS.md

<!-- AGENTS.md carries the one Next-16 rule so non-Claude tools still read it.
     CLAUDE.md imports it (Playbook §D) rather than duplicating — single source, no drift.
     Everything else that is path-specific lives in .claude/rules/; keep this file lean. -->

# Startle Labs — project memory

Static marketing/portfolio site for a branding agency. No backend, no DB, no CMS —
all content is typed TypeScript in `src/data/`. Heavy client-side animation.

## Stack (verified — versions matter here)

- **Next.js 16.2.3**, App Router (routes in `src/app/**`, no `pages/` dir).
- **React 19.2.4** with **React Compiler ON** (`reactCompiler: true` in `next.config.ts`).
  Don't hand-add `useMemo`/`useCallback`/`memo` for perf — the compiler handles it.
- **TypeScript strict** (`tsconfig.json`), path alias `@/*` → `src/*`.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. **No `tailwind.config.*` file** — all
  tokens live in `@theme inline` inside `src/app/globals.css`. `cn()` in `src/lib/utils.ts`
  wraps `clsx` for class merging.
- **Framer Motion 12** for JS-driven animation; site-wide config in `MotionProvider`.
- Deploys to **Vercel** via default git-push (no `vercel.json`, no CI in repo).

<important>
Next 16 + React 19 + React Compiler are newer than your training data. Do NOT assume
Next 14/15 APIs. Before writing Next code (routing, params, config, caching, metadata),
read the relevant guide in `node_modules/next/dist/docs/` and check the actual source —
never guess. (Route params are async: `params: Promise<{ slug: string }>` — see
`src/app/services/[slug]/page.tsx`.)
</important>

## Commands (verified in package.json)

- Dev: `npm run dev` → `next dev` (**port 3100**, pinned via `.claude/launch.json`).
- Build: `npm run build` → `next build`.
- Lint: `npm run lint` → `eslint` (flat config, ESLint 9).
- Typecheck: `npx tsc --noEmit` (no npm script; `noEmit` is already set in tsconfig).

## Verification protocol (no test suite exists)

There is **no test framework installed** — do not invent `npm test`. To verify a change:

1. `npx tsc --noEmit` — must be clean.
2. `npm run lint` — must be clean.
3. **Visual check** — run the dev server (Preview MCP / `nextjs-dev`) and look at the
   affected route(s). Check **~375px width** (owner's rule: no orphaned single-word wraps
   in titles/subtitles), plus 768 and 1440. Watch the console for errors.

Never claim "done" without at least the typecheck + a visual look. Say plainly if you skipped a step.

## Content model

Content is data, not markup. To add/change a service, case study, or About copy, edit the
typed object in `src/data/*.ts` — **not** the template component.
- `src/data/services.ts` → `services` (Record by slug) + `servicesList`; drives the homepage
  scroller and the `/services/[slug]` detail pages.
- `src/data/about.ts` → `aboutData`; drives `/about`.
- `src/data/projects.ts` → `projects`.
- **Copy is still placeholder in places** — 7 `TODO`s across `src/data/services.ts` (3) and
  `ServicePageTemplate.tsx` (4). Don't treat placeholder strings as final. See `.claude/rules/content-model.md`.

## Layout landmarks

- `src/app/` — App Router pages + `layout.tsx` (fonts, providers) + `globals.css`.
- `src/components/{layout,sections,templates,ui,effects,about}/` — UI.
- `src/data/` — content (above). `src/lib/` — `utils.ts`, `animations.ts`. `src/hooks/`.
- **Two oversized files** — read via a subagent to keep main context clean:
  `src/components/sections/FullscreenScroller.tsx` (~1.9k lines, homepage) and
  `src/components/templates/ServicePageTemplate.tsx` (~1k lines). See `docs/ARCHITECTURE.md`.

## How we work

- **Plan first** for any 3+-step or fuzzy-scope task; tick items off, re-plan if it drifts.
- **Minimal, surgical diffs** — refactor over rewrite, touch only what the task needs, match
  surrounding style. No drive-by reformatting.
- **Root cause, not band-aid.** No temporary hacks.
- **Delegate heavy reads** (the two big files above) to a subagent — see `.claude/agents/`.
- **Git:** branch off `main` before editing; never commit/push unless asked; stage explicit
  paths, never `git add -A`. Parallel sessions use their own `git worktree`.
- More detail lives in path-scoped rules under `.claude/rules/` (Tailwind v4, content model,
  Next 16, animation) — they load automatically when you touch matching files.
