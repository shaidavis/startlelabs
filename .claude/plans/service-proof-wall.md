# Service-page proof — layout C (hybrid)

Decided 2026-10-09. Branch: `feat/service-proof-wall`.

**Done =** each of the 3 service pages shows (1) a client-logo strip under the hero,
(2) the existing mid-page pull-quote, unchanged, and (3) a curated bento wall of work
samples, testimonials and Fiverr reviews replacing the "Selected Projects" carousel —
all fed from one `src/data/proof.ts`, verified at 375 / 768 / 1440 with tsc + lint clean.

## Decisions (settled — don't re-ask)

- **Layout C**, not one mixed wall (logos read as filler in tiles) and not split by type
  (four thin sections).
- **Fixed, curated order per service.** No reshuffle on load: loses the curated lead
  tile, can't be random server-side on a static page, and client-side shuffle shifts
  layout after load. Freshness, if wanted later, = rotate only the 1×1 Fiverr slots.
- **Cross-service reuse by tags, not by browsing history.** An asset lists every service
  it legitimately belongs to; no sessionStorage "already seen" logic.
- **Bento grid with fixed spans by kind**, not true masonry (keeps reading order, stays
  predictable on mobile). Proposed spans: sample 2×2 · testimonial 2×1 · Fiverr 1×1.
- Pull-quote (`service.quote`) stays its own field — not pulled from the wall.

## Data model (proposal)

```ts
type ServiceSlug = "brand-strategy" | "creative-direction" | "digital-design";

interface ProofBase { id: string; services: ServiceSlug[]; featured?: boolean }

type ProofItem =
  | ProofBase & { kind: "logo"; client: string; logo: string }
  | ProofBase & { kind: "testimonial"; client: string; quote: string; author: string; role?: string; image?: string }
  | ProofBase & { kind: "sample"; client: string; image: string; blurb?: string }
  | ProofBase & { kind: "fiverr"; quote: string; reviewer: string; country?: string; stars: number; date?: string };

export const proof: ProofItem[] = [ /* array order = display order */ ];
export const proofFor = (slug: ServiceSlug, kind?: ProofItem["kind"]) => ...;
```

Replaces `Service.testimonials` / `TestimonialEntry`; the bare `{ client: "Clalit" }`
entries become `logo` items.

## Asset intake — what I need per type

| Type | Per item | File spec |
| --- | --- | --- |
| Client logos | client name · which services | SVG preferred, else transparent PNG ≥ 400px wide. Single-colour versions if you have them (strip renders mono). |
| Fiverr reviews | review text · reviewer name/handle · country · stars · date · which service | Text, not screenshots (screenshots don't reflow at 375px). |
| Work samples | client · 1–2 line blurb · which services | Square-ish crop, ≥ 1200×1200 for the 2×2 tile. |
| Testimonials | quote · author · role · client · which services | Optional photo or work image. |

Target per service: **8–12 wall items** (samples + testimonials + Fiverr) and
**5+ logos**. Fewer than ~6 wall items reads as a card grid, not a wall.

## Steps

1. [ ] Asset counts + files from Shai
2. [ ] `src/data/proof.ts` — types, migrate existing testimonials/client names, tag services
3. [ ] `LogoStrip` under the hero
4. [ ] `ProofWall` bento replacing `ProjectsCarousel` — keep its top `TornEdge` (it owns the
       accent→page seam under the pull-quote) and reuse the yellow scribble frame +
       accent quote marks for visual continuity
5. [ ] Remove `testimonials` / `TestimonialEntry` / `ProjectsCarousel`
6. [ ] Verify: tsc, lint, 375 / 768 / 1440 on all 3 services, no orphaned words

## Backlog (out of scope)

- _(empty)_
