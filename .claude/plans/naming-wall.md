# Naming samples wall

Started 2026-10-09. Branch: `feat/naming-samples` (off `main`).

**Done =** ~50 curated brand names, each with tagline, 1-sentence business overview,
2–3 line naming rationale, a Google-font pairing and a generated background, typed in
`src/data/naming.ts`; rendered as a flip-card grid at `/naming`; verified at 375 / 768 /
1440 with tsc + lint clean; pushed.

## Decisions (settled — don't re-ask)

- **Sources:** `~/Documents/Work/Fiverr/Fiverr Gigs/{Naming,Taglines}` and the Dropbox
  `StartleLabs Portfolio - Master/3 Branding/{0,1,2}`. Extracted with `pdftotext` to a
  scratchpad corpus (428 reports, ~430k words); 7 Sonnet helpers shortlisted per slice.
- **Pick our favourites.** Shai almost never knows which name the client chose, so the wall
  shows the names we like best, across a range of markets, naming styles and tones. No
  "chosen by client" claim anywhere in the copy.
- **Standalone `/naming` page**, not a section on the brand-strategy page (50 flip cards
  would bury it). A teaser on the service page is a follow-up, not in this "done".
- **Card = "barebones brand":** name set in a display Google font + body font pairing over
  a generated background (CSS gradients/patterns + the shared grunge recipe). No photos in
  v1; a handful of Envato/Unsplash photos is a follow-up if the patterns feel flat.
- **Flip on hover, tap-to-flip on touch, focus flips for keyboard.** Front: name, tagline,
  market chip. Back: business overview + rationale + style tags. Reduced motion =
  crossfade instead of the 3D rotate.
- **Font budget:** ~12 display + ~6 body families, declared once in
  `src/app/naming/fonts.ts` with `preload: false` so they only load on this route.
- Each card declares `pairing` + `scene` ids; the template never hard-codes a font.

## Data model

```ts
interface NamingSample {
  id: string;            // slug, unique
  name: string;          // the brand name exactly as proposed
  tagline: string;       // one line; from the report if it had one, else written to fit
  business: string;      // 1 sentence: what the client does
  rationale: string;     // 2–3 sentences, the naming story
  market: string;        // display tag, e.g. "Fintech"
  style: NamingStyle;    // coined | compound | metaphor | classical-root | descriptive |
                         // playful | foreign-word | acronym | portmanteau | real-word
  pairing: PairingId;    // key into fonts.ts
  scene: SceneId;        // key into src/lib/namingScenes.ts
  palette: [string, string]; // two colours the scene is painted with
}
```

## Steps

- [x] Survey sources, extract corpus, slice, brief helpers
- [ ] Helpers return ~100 candidates + ~30 taglines → I shortlist ~70 → Shai trims to 50
- [x] Scaffold: data types, font pairings, scenes, NamingWall, `/naming` route (placeholders)
- [ ] Fill `naming.ts` with the 50 picks; write missing taglines in the report's voice
- [ ] Assign pairing + scene + palette per card for visual range
- [ ] Visual pass 375 / 768 / 1440, console clean, tsc + lint
- [ ] Commit, push

## Backlog (outside "done" — needs Shai's yes)

- Teaser block of ~6 cards on the brand-strategy service page linking to `/naming`.
- Nav/footer link to `/naming` (route is reachable by URL only until then).
- Photos for a subset of cards (Envato Elements via MCP, or Unsplash).
- Lazy-load fonts for below-the-fold cards if the page weight is noticeable.
