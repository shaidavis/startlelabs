---
name: add-service
description: >
  Scaffold a new service on the Startle Labs site. Use when adding a new service offering,
  a new /services/[slug] detail page, or a new homepage service panel. Adds a typed Service
  object to src/data/services.ts and verifies the route renders. Trigger on "add a service",
  "new service page", "create a service".
---

# Add a service

Services are the site's core repeatable unit. A service is one typed `Service` object in
`src/data/services.ts`; the route and templates are already generic and pick it up
automatically. **Do not edit `ServicePageTemplate.tsx` or `FullscreenScroller.tsx` to add a
service** — only the data file.

## Steps

1. **Read the contract.** Open `src/data/services.ts` and read the `Service` interface (and
   `Deliverable`, `Principle`, `TestimonialEntry`) plus one existing entry (e.g.
   `"brand-strategy"`) as a template. Note which fields are required vs optional
   (`navTooltip?`, `deliverablesBg?`, `ctaArt?`, etc.).

2. **Add the object** to the `services` record with a **unique, URL-safe `slug`**. Fill:
   - identity: `slug`, `title`, `navTooltip`, `navTitle`, `headline` (uses `\n` for line
     breaks), `description` (handwritten accent word).
   - detail-page copy: `heroTagline`, `heroIntro`, `stats` (2–3), `quote`, `deliverables`
     (~6), `testimonials` (3–4), `principles` (6), `closingCta`, `cta`.
   - visuals: `heroImage`, `accentColor`, and **`accentText`** — the darkened text-safe hue
     (existing entries darken the accent to clear WCAG AA 4.5:1 on light surfaces; follow the
     inline comments).
   - `relatedServices`: 2 slugs of OTHER services that must already exist.
   - Image paths under `/images/...` must point at real files in `public/`.

3. **Placeholder copy is expected.** If final copy isn't available, follow the existing
   `TODO` / `PLACEHOLDER_QUOTE` convention and flag it — don't invent approved copy.

4. **(Optional) homepage panel / redirect.** If this service should appear on the homepage
   scroller as its own panel and short URL, wire it into `FullscreenScroller.tsx` panels and
   add a matching entry to `redirects()` in `next.config.ts` (pattern: `/<name>` →
   `/#<panel-id>`). Ask the owner whether this is wanted before editing the 1.9k-line scroller.

5. **Verify.**
   - `npx tsc --noEmit` — clean (catches missing required fields).
   - `npm run lint` — clean.
   - Run the dev server and open `http://localhost:3000/services/<slug>` — confirm it renders
     (a bad slug/missing entry 404s via `notFound()`). Check ~375px for orphaned-word wraps.
     See the `verify-visual` skill.

## Reference

- Data + types: `src/data/services.ts` (`services`, `servicesList`).
- Route: `src/app/services/[slug]/page.tsx` (async params, `generateStaticParams`).
- Template: `src/components/templates/ServicePageTemplate.tsx` (read-only for this task).
- Rule: `.claude/rules/content-model.md`.
