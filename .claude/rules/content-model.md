---
paths:
  - "src/data/**"
---

# Content model — static typed data

There is no CMS or backend. All site content is typed TypeScript in `src/data/`. Content is
**data, not markup** — change copy here, not in the template components that render it.

## Modules

- `services.ts` — exports `services: Record<string, Service>` (keyed by slug) and
  `servicesList = Object.values(services)`. Interfaces: `Service`, `Deliverable`,
  `Principle`, `TestimonialEntry`. Drives both the homepage `FullscreenScroller` and the
  `/services/[slug]` detail pages (`ServicePageTemplate`).
- `about.ts` — exports `aboutData: AboutData` (interfaces `StoryCard`, `Review`, `Value`,
  `Milestone`, `FAQ`). Drives `/about` via `AboutTemplate`.
- `projects.ts` — exports `projects: Project[]`.

## Slug → route

A service's `slug` field is its URL: `/services/<slug>`. `generateStaticParams` in
`src/app/services/[slug]/page.tsx` prerenders one page per entry in `servicesList`. Adding a
service = adding one object to `services` — no route/template changes. Keep `slug` unique and
URL-safe, and make sure `relatedServices` slugs point at real entries.

## Placeholder copy — not final

Copy is a rough draft (source: a Google Doc dated 2026-04-21; local snapshot in
`WEBSITE_COPY.md`). **7 `TODO` markers flag unfinished content** — 3 in `services.ts`
(`heroTagline` "confirm final copy", `ctaArt` "export reversed Websites hero artwork",
plus the header note) and 4 in `ServicePageTemplate.tsx`. Strings like the shared
`PLACEHOLDER_QUOTE` ("Placeholder testimonial — real copy coming soon.") are stand-ins.
Don't treat placeholder copy as approved, and don't invent "final" copy — flag it or ask.

## Types

Keep the interfaces the contract. When a template needs a new field, add it to the interface
first (mark it optional with a sensible template fallback if not all services have it — see
how `deliverablesBg?`, `ctaArt?`, `navTooltip?` are handled).
