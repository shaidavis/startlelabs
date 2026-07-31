# Startle Labs — Launch Plan

**Last reconciled:** 2026-07-30 · **Branch:** merged to `main` @ `9bc2bcc`

The correctness work and the Venn are **done and shipped**. What is left is content Shai
has to supply — quotes, screenshots, logos — plus three copy decisions.

Sources: `src/data/services.ts`, `src/data/about.ts`, `ServicePageTemplate.tsx`,
`AboutTemplate.tsx`, the Notion portfolio (30 projects), and
`~/Downloads/Startle Labs Testimonials (Responses).xlsx` (5 signed responses).

---

# REMAINING MISSIONS

### M1. Fill the Selected Projects cards 🔴 · the big one

Verified live: a quote-less slide renders a **yellow frame + client name** and little else.
The `image` and `blurb` fields are now wired and waiting — adding content is a one-line
paste per client, no template work.

```ts
{ client: "PointFive", blurb: "Positioning and messaging for a cloud-cost startup.", image: "/images/work/pointfive.webp" }
```

| Client | Service | Quote | Shot | Blurb | Notion project |
|---|---|---|---|---|---|
| Clalit | brand-strategy | ⬜ | ⬜ | ⬜ | HMO Messaging & Copywriting |
| PointFive | brand-strategy | ⬜ | ⬜ | ⬜ | Cloud Optimization Brand Messaging |
| Tastewise | creative-direction | ⬜ | ⬜ | ⬜ | Food Intelligence Brand Messaging |
| SodaStream | creative-direction | ⬜ | ⬜ | ⬜ | Sodastream Presentation Messaging |
| Fiverr | digital-design | ⬜ | ⬜ | ⬜ | Fiverr Brand Messaging |
| Corpora | digital-design | ⬜ | ⬜ | ⬜ | Design Consultancy Brand & Website |
| R2 | ? | ⬜ | ⬜ | ⬜ | ⚠️ not in Notion |
| Naboo | ? | ⬜ | ⬜ | ⬜ | ⚠️ not in Notion |
| LGBTech | brand-strategy | ✅ | ⬜ | ⬜ | Israeli LGBT+ Diversity |
| WINN.AI | brand-strategy | ✅ | ⬜ | ⬜ | Ai for Salespeople Brand Messaging |
| bananaz | creative-direction | ✅ | ⬜ | ⬜ | AI for Engineers Website & Deck |
| Abe's Market | creative-direction | ✅ | ⬜ | ⬜ | ⚠️ not in Notion |
| BAMAH | digital-design | ✅ | ⬜ | ⬜ | ⚠️ not in Notion |

> 💡 **Do the blurbs first.** A card reading *"PointFive — Positioning and messaging for a
> cloud-cost startup, from category name to homepage"* is useful with no quote and no
> screenshot. A quote with no context isn't. All 13 blurbs are writable from the Notion
> tags in ~20 minutes, tonight, with nobody to chase. Quotes depend on people replying;
> screenshots depend on finding and cropping files.

**Screenshot spec:** portrait crop, min **640×804** (2× the 320×402 render box), `.webp`
or `.png`, into `/public/images/work/<client>.webp`.

### M1b. Add missing projects to the Notion portfolio 🟡

Notion is the source of truth for what's real on this site — the `/about` portfolio
card links out to it, and it's what service testimonials get checked against. (It was
an inline embed until 2026-07-31: Notion's embed runtime crashes Safari/iOS renderers,
so it must stay a link-out.)

- [ ] **Israel Healthcare Foundation**
- [ ] **ACT Security**
- [ ] **R2** — referenced by nothing since it was dropped from `services.ts`
- [ ] **Naboo** — same
- [ ] **Abe's Market** — has a signed testimonial but no portfolio row
- [ ] **BAMAH** — same
- [ ] …others as they come up — list them here

Each row needs the shape the existing 30 use: title, service tags (`brand messaging`,
`investor deck`, `website`, …), URL.

### M2. Client logos 🟡 · blocked on assets

`TestimonialEntry.logo` exists and is unused. Five signed logo permissions: BAMAH,
LGBTech, bananaz, WINN.AI, Abe's Market. Files into `/public/images/logos/`, then set
`logo` on those entries.

### M3. Three copy decisions 🟡 · ~15 min · everything drafted, needs Shai to pick

**M3a — the Einstein quote.** `creative-direction.quote` is *"The important thing is not to
stop questioning…"* — the most worn quote in tech. RuPaul (brand-strategy) and Star Trek
(digital-design) are genuinely good. Replacements:
- *"If you're not confused, you're not paying attention."* — Tom Peters
- *"The most beautiful thing we can experience is the mysterious."* — (still Einstein, less worn)
- *"Tell me a fact and I'll learn. Tell me a truth and I'll believe. But tell me a story and it will live in my heart forever."* — Native American proverb

**M3b — `heroTagline` inconsistency.** brand-strategy is `"Branding & Creative Strategy"`,
a *label*, while the other two are puns (`"Pitch perfect."`, `"Web perfect."`). Suggest
`"Brand perfect."` for symmetry, or `"Unmissable."` to break the pattern deliberately.
Resolving this also clears the stale `TODO` at `services.ts:76`.

**M3c — the digital-design principles.** Shai flagged these as "meh." Why, concretely:

1. **They're not yours.** "SEO Optimization," "Speed & Performance," "Mobile
   Responsiveness," "Security & Stability" are a generic web-agency checklist. Any
   competitor could publish that list verbatim. Compare to the stats block ("Transition
   Effects — Never Use 'Em"), which nobody else could have written.
2. **Every `description` starts with "We."** 18 of 18 across all services. Reads as a wall.
3. **They describe hygiene, not point of view.** "Mobile Responsiveness" in 2026 is like
   promising the doors will be attached to the car. A principle should be something you'd
   *lose an argument over*.

```ts
// digital-design — replacement principles (pick 6, or riff)
{ title: "Opinion First",  tagline: "A site that tries to appeal to everyone lands with no one.",
  description: "The strongest sites make a choice about who they're for — and quietly let the rest bounce." },
{ title: "Words Before Layout", tagline: "You can't design a page whose message you haven't settled.",
  description: "Copy comes first here. The layout is what the argument looks like once it's won." },
{ title: "Fast Is a Feature", tagline: "Speed isn't a technical metric — it's the first thing your brand says.",
  description: "A slow site reads as an unserious company before a single word is processed." },
{ title: "Nothing Decorative", tagline: "If an element isn't carrying meaning, it's carrying weight.",
  description: "Every animation, illustration, and flourish has to justify the attention it takes." },
{ title: "Built to Be Handed Over", tagline: "You shouldn't need us to change a headline.",
  description: "Sites ship in a shape your team can actually maintain after we're gone." },
{ title: "Designed for the Small Screen First", tagline: "Most of your audience will only ever see the phone version.",
  description: "If it doesn't work at 375px, it doesn't work — the desktop layout is the easy part." },
```

brand-strategy and creative-direction principles are noticeably better — leave them unless
you want the same treatment.

### M4. Loose ends ⚪ · none blocking

- `services.ts:415` — `ctaArt` for digital-design needs a Figma export. **Falls back to
  `heroImage` automatically**, so this is cosmetic.
- `services.ts:9` — header `TODO` note, clear once M3 lands.
- `ServicePageTemplate.tsx:27, 463` — `TODO(polish)` and `swap for <DrawingIcon>`. Defer.
- 2 pre-existing lint errors (`set-state-in-effect` in `Topbar.tsx:71`,
  `FullscreenScroller.tsx:143`). Unrelated to launch, left alone deliberately.

### M5. Creativity Venn ✅ · DONE — built, placed, shipping

**This was never outstanding.** The original brief listed it as blocker #6, and earlier
drafts of this plan proposed three "directions" at 4–16h each. That was wrong — written
from filenames rather than from reading the code.

`InteractiveVennCanvas` is a finished 475-line canvas component
(`src/components/about/InteractiveVennCanvas.tsx`) and it is **live on the homepage** as
the About panel (`FullscreenScroller.tsx:624`), beside "Creativity is at the center."

**The placement is deliberate and correct.** The homepage panel *is* the About splash;
`/about` is the extended page reached via its "Learn More" CTA. The Venn does not belong
on `/about` — putting it there would duplicate the splash. Nothing to move.

Already implemented:
- Three blobs (Connection / Curiosity / Confidence) animating in one at a time with icons
- Creativity popping in at centre with lightning
- Three pairwise lenses (Leadership / Artistry / Empathy) writing themselves in last
- Hover pours energy into the blobs beneath; hovering Creativity lights all three
- Scroll-gated intro via the `scrollTrigger` prop
- `prefers-reduced-motion` handling; DPR-capped retina canvas
- `chrome` / `caption` / `replayNonce` props; homepage drives replay from its own CTA
- Descriptive `aria-label` naming all four concepts
- Reference page at `/values-venn`, unlinked from nav

~~The one genuine open item — hover-only interaction~~ **✅ Fixed (feat/venn-a11y).**
All input paths now drive one region mask: taps persist (touch `pointerleave` no longer
clears), seven invisible focusable region buttons give keyboard access in intro order,
and the caption is an `aria-live` region (sr-only when the visible caption is off).

---

# ESTABLISHED FACTS

Answered by Shai 2026-07-30. These supersede the guesses the first draft of this plan made.

| | |
|---|---|
| **Founded** | **2015, Tel Aviv.** (The first draft guessed 2016; `about.ts` had claimed Toronto 2019.) |
| **Structure** | **Solo practitioner + partner network.** Not a team. |
| **Voice** | Studio copy stays **"we"**; the founder section speaks as **"I"**. |
| **Pricing** | No public number. Pricing FAQ **removed entirely**, not replaced. |
| **Timeline section** | **Cut, not rewritten.** It was never rendered — see below. |
| **About-me tone** | **Tone C — "Let Them Talk."** Client quote + descriptors carry it. |
| **Naboo / R2** | Real clients; quotes being chased. Currently absent from the site. |

---

# WHAT SHIPPED

Five commits, `887e5ce..9bc2bcc`, merged to `main`.

### The About page was fabricated, not unfinished — `57ff210`

This was the real launch blocker, and it wasn't copy polish. `about.ts` asserted as fact:
a Toronto founding in 2019, "team grows to 4," a senior designer hire, a west-end studio
move, and "$15K" starting pricing. All false.

**The timeline turned out to be dead data.** `AboutTemplate` numbers its sections 1–5 then
jumps to 7 — there was no 6, and nothing referenced `timeline`. Roughly 40 lines of
invented company history fed nothing. Deleted along with the `Milestone` interface.
Pricing FAQ deleted. Six story cards rewritten from the testimonials and portfolio.

> ⚠️ If you want a timeline on the About page later, it needs **new data and a new
> section built**. Re-filling an array won't do it — nothing renders it.

### Real testimonials replaced every placeholder — `6d89540`

All 10 slots rendered the same `PLACEHOLDER_QUOTE` under a hardcoded
`Placeholder Name, Role` byline; the principles grid was introduced by Lorem ipsum.

Mapping used, from Notion service tags — every service got at least one real quote:

| Service | Real quotes | Samples |
|---|---|---|
| brand-strategy | Shachar Grembek (LGBTech), Oren Hacohen (WINN.AI) | Clalit, PointFive |
| creative-direction | Or Israel (bananaz), Richard Demb (Abe's Market) | Tastewise, SodaStream |
| digital-design | Flo Low (BAMAH) | Fiverr, Corpora |

Schema: `author`/`role` added to `TestimonialEntry`; `principlesIntro` and
`principlesLabel` added to `Service`. The label replaced a hardcoded Pitch Decks
special-case that rendered **"Principles of the Websites."** — now "the Website."
`role` holds the job title only; the template appends the client, so
`"Chair, LGBTech"` rendered as `CHAIR, LGBTECH · LGBTECH`.

Naboo and R2 dropped — absent from both Notion and the testimonial sheet.

### Founder section + typography — `bac9e06`

Tone C lives in the section-6 gap the timeline left: client pull quote → four verbatim
"describe Shai in 3–5 words" answers → three sentences of first-person copy.

`text-balance` on four headings that orphaned a word at 375px, and the closing CTA stepped
to `text-4xl` on mobile — balance alone can't help 48px type in a 311px column.

### Work images + blurbs wired — `9bc2bcc`

`image` and `blurb` added to `TestimonialEntry`, both optional and rendering only when
present. Screenshot insets 5% inside the scribble frame, which paints on top so its
hand-drawn edge overlaps the crop. Blurb renders between client name and quote.

---

# VERIFICATION

Run after any change — there is no test suite.

1. `npx tsc --noEmit` — clean.
2. `npm run lint` — **2 known pre-existing errors**, no new ones.
3. `npm run build` — 11/11 pages generated.
4. Dev server on **:3100**, affected routes at **375 / 768 / 1440**.
5. **No orphaned single words** in any title or subtitle. Currently zero across all three widths.

> ⚠️ **The testimonial carousel can't be driven by automation.** The tool tab reports
> `document.hidden === true`, which pauses rAF, so Framer's exit animation never completes
> and `AnimatePresence mode="wait"` never mounts the next slide. Dots advance, the figure
> freezes. **Not a product bug** — confirmed working by hand in Safari. Check carousel
> changes in a real browser.
