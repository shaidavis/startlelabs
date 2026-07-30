# Startle Labs — Launch Plan

**Generated:** 2026-07-30 · **Target:** one focused afternoon (~4h core, ~6h with extras)
**Nothing in this file is committed.** Approve a block → paste it → verify → move on.

Sources read: `src/data/services.ts`, `src/data/about.ts`, `ServicePageTemplate.tsx`,
`Footer.tsx`, the Notion portfolio (30 projects), and
`~/Downloads/Startle Labs Testimonials (Responses).xlsx` (5 responses).

---

## ⚠️ Read this first — the real blocker isn't copy polish

Blocker #4 and #5 in your brief assumed the About page needs *drafting*. It doesn't.
It needs **correcting**. `src/data/about.ts` currently asserts, as fact:

| Line | Current claim | Contradicted by |
|---|---|---|
| `timeline` 2019 | "opens its doors in **Toronto**" | `Footer.tsx` — "Hand-drawn with ♥ in **TLV**" |
| `timeline` 2019 | Founded **2019** | Demb: worked with you "over the past **10 years**"; `Startlelabs_info.pptx` dated **2016**; "First Site Built in 1999" |
| `timeline` 2021 | "**Team grows to 4**… hire a senior designer" | All 5 testimonials describe *you*, personally |
| `timeline` 2023 | "New studio space in **the west end**" | No evidence; reads as Toronto geography |
| `faqs` | "Projects start at **$15K**" | Invented number |
| `story` (6 cards) | Founding narrative | Entirely invented |

This is the one genuine launch blocker. Everything else is finishable copy.
**Task A1 below is non-negotiable and comes first.**

The good news: `reviews[]` (the 3-column marquee, ~290 curated Fiverr reviews) is **real**
and needs nothing.

---

## Pre-flight checklist — gather in one pass (15 min)

- [ ] **Founding year + city** — the single fact that unlocks the whole timeline.
- [ ] **Solo or team?** Determines whether the site says "I" or "we" *everywhere*.
- [ ] **Client logo files** — all 5 respondents granted logo permission. Do you have
      SVG/PNG for BAMAH, LGBTech, bananaz, WINN.AI, Abe's Market? Drop in
      `/public/images/logos/`. *(Blocks C2 only — not launch.)*
- [ ] **Real starting price**, or decide to cut the pricing FAQ.
- [ ] **"Naboo" and "R2"** — real clients or leftovers? Neither is in Notion or the sheet.
- [ ] **2–3 real milestones** with a one-sentence story each (see Q6).
- [ ] ~~Notion access~~ — ✅ **done**, public link works, 30 projects read.

---

## Questions — answer these 8 and everything below unblocks

Marked drafts assume an answer; `[ASSUMPTION]` tags flag what I guessed.

1. **What year and city did Startle Labs actually start?** (Evidence points to ~2016 or
   earlier, Tel Aviv. `[ASSUMPTION]` used below: **2016, Tel Aviv**.)
2. **Solo practitioner with a partner network, or an actual team?** `[ASSUMPTION]`: solo +
   network — that's what `about.ts` values already hint at ("a tight network of specialists")
   and what every testimonial describes.
3. **Does the site speak as "I" or "we"?** `[ASSUMPTION]`: keep **"we"** for the studio
   voice, switch to **"I"** only in the About-me section. Cheapest correct answer — it
   avoids rewriting all of `services.ts`.
4. **Real starting price**, or cut the pricing FAQ entirely? `[ASSUMPTION]`: **cut it** —
   an invented number is worse than no number, and "transparent from the first
   conversation" survives without it.
5. **Naboo and R2** — keep, replace, or drop? `[ASSUMPTION]`: **replace** with portfolio
   projects that have real quotes (see B1).
6. **Two or three real milestones.** One sentence each. Prompts: first paying client? the
   project that changed how you work? when you went full-time? the WINN.AI or Fiverr work?
7. **Of the 3 About-me tones in D1 — which?** (Or splice.)
8. **Venn diagram: build it, or ship without?** `[ASSUMPTION]`: **ship without** — see F1.
   I agree with your brief that it's nice-to-have.

---

# THE PLAN

**Minimum Viable Launch = Phase A + B.** If you get 3 hours, do those and ship.
Phase C is polish. Phase D–F are the "nice, not necessary" tier.

---

## PHASE A — Correctness (60 min) · 🔴 MUST SHIP

### A1. Fix the fabricated About data `[INTERVIEW → then MECHANICAL]` · 35 min

Needs Q1, Q2, Q6. Once answered, this is paste-work.

**A1a — `timeline.milestones`.** Ready-to-paste under `[ASSUMPTION]` 2016/Tel Aviv/solo.
Replace `date`/`heading`/`body`; keep the `tag` shape.

```ts
timeline: {
  heading: "How we got here",
  milestones: [
    {
      date: "2016",
      tag: "Day 1",
      heading: "Startle Labs opens in Tel Aviv",
      body: "One person, one conviction: most good ideas don't fail on merit, they fail on presentation.",
    },
    {
      date: "2019",
      tag: "Proof",
      heading: "Founders start sending founders",
      body: "The work stops coming from job boards and starts coming from the last client — the only referral loop that means anything.",
    },
    {
      date: "2021",
      tag: "Scale",
      heading: "Decks that raise rounds",
      body: "Investor decks and messaging for companies through fundraises — bananaz, Tastewise, Hunters — with hundreds of millions raised behind them.",
    },
    {
      date: "2023",
      tag: "Range",
      heading: "From naming to shipped product",
      body: "The scope widens: name, identity, messaging, website, and the product surfaces the brand actually lives on.",
    },
    {
      date: "2026",
      tag: "Today",
      heading: "Still boutique, on purpose",
      body: "A handful of projects at a time, each with a founder in the room — not an account manager.",
    },
  ],
},
```

⚠️ **The 2021 entry names real clients and a real claim.** "Hundreds of millions" already
appears in `services.ts` stats. Confirm you're comfortable stating it on the About page too.

**A1b — kill the pricing FAQ.** Delete the `"How much does a project cost?"` entry
(`about.ts:522-525`) unless you give me a real number. Replacement, if you'd rather keep
a cost-shaped answer:

```ts
{
  question: "How do you price projects?",
  answer: "Fixed scope, fixed price — quoted after a first conversation about what you actually need. No hourly billing, no surprise invoices. Small engagements and full brand builds are very different numbers, so the honest answer is: ask.",
},
```

**A1c — the other 5 FAQs are fine.** Process, timeline, strategy-vs-visual, stewardship
retainer, who-you-work-with all read as true and unremarkable. Leave them.

### A2. Rewrite the 6 story cards `[DRAFT-READY]` · 15 min

Current cards are invented agency-origin fiction. These are grounded in the testimonials
and portfolio. Paste into `about.ts` `story`:

```ts
story: {
  started: {
    heading: "How It Started...",
    cards: [
      {
        image: "",
        heading: "Good ideas, bad packaging",
        body: "Watching strong companies get overlooked because their deck, their name, or their site undersold them. That gap is the whole reason this exists.",
      },
      {
        image: "",
        heading: "Questions before pixels",
        body: "The habit that stuck from the first project: ask uncomfortable, context-heavy questions until the strategy is obvious. The design part gets easy after that.",
      },
      {
        image: "",
        heading: "One founder at a time",
        body: "No account managers, no handoffs to a junior. The person you brief is the person who does the work — which is why clients kept coming back.",
      },
    ],
  },
  going: {
    heading: "How It's Going...",
    cards: [
      {
        image: "",
        heading: "Named, launched, funded",
        body: "Brands named and built, sites shipped, and investor decks behind rounds that closed — across AI, fintech, food tech, nonprofit, and culture.",
      },
      {
        image: "",
        heading: "A studio the size of a phone call",
        body: "Deliberately small, with a tight bench of developers, illustrators, and animators who plug in when a project needs them.",
      },
      {
        image: "",
        heading: "Clients who send other clients",
        body: "Every testimonial on this page says a version of the same thing: they recommended us to someone else. That's the only growth metric we track.",
      },
    ],
  },
},
```

*(Card 6 makes a claim the reviews section directly backs — 4 of 5 respondents ticked
"I've recommended Shai to other friends and colleagues.")*

### A3. Verify · 10 min

`npx tsc --noEmit` → `npm run lint` → dev server on **:3100**, look at `/about` at
375 / 768 / 1440. Watch for orphaned single words in the new headings.

---

## PHASE B — Real testimonials on the service pages (75 min) · 🔴 MUST SHIP

### B1. The mapping problem `[DRAFT-READY]` · 10 min to approve

You have **5 real quotes** and **10 testimonial slots**. Current state — every slot is
`PLACEHOLDER_QUOTE`, and brand-strategy has **zero** real quotes available under its
current client list.

| Service | Current slots | Real quote available? |
|---|---|---|
| brand-strategy | Clalit, Corpora, PointFive | ❌ none |
| creative-direction | Bananaz, Naboo, Tastewise, SodaStream | ✅ Bananaz only |
| digital-design | Bamah, Fiverr, R2 | ✅ Bamah only |

**Recommended re-slot** — every service gets at least one real, attributed quote, and
quote-less entries stay as portfolio samples (`quote` is already optional in
`TestimonialEntry`, and the template only renders the blockquote when it's present):

| Service | Slot 1 (real quote) | Slot 2 (real quote) | Slot 3–4 (sample only) |
|---|---|---|---|
| brand-strategy | **LGBTech** — Grembek | **WINN.AI** — Oren | Clalit, PointFive |
| creative-direction | **bananaz** — Or Israel | **Abe's Market** — Demb | Tastewise, SodaStream |
| digital-design | **BAMAH** — Flo Low | — | Fiverr, Corpora |

Rationale from the Notion tags: LGBTech is `brand messaging`, WINN.AI is
`brand identity + messaging + visual identity`, bananaz is `investor deck + storyboarding`,
Abe's Market is Demb's "transform a conversation to a standout written and/or visual
presentation" — that's the deck service exactly. BAMAH is website + messaging.
**Naboo and R2 are dropped** (Q5) — neither exists in your portfolio or sheet.

### B2. Schema change — the template can't show a name `[MECHANICAL]` · 15 min

`TestimonialEntry` has no author field, so `ServicePageTemplate.tsx:862` hardcodes
`Placeholder Name, Role · {client}`. Two small edits, interface first per
`.claude/rules/content-model.md`:

```ts
// src/data/services.ts — add to TestimonialEntry
export interface TestimonialEntry {
  client: string;
  quote?: string;
  logo?: string;
  /** Attributed author. Omit for portfolio samples with no approved quote. */
  author?: string;
  /** Author's title + company, e.g. "Executive Director, BAMAH". */
  role?: string;
}
```

```tsx
// ServicePageTemplate.tsx:861-863 — replace the hardcoded footer
{active.author && (
  <footer className="mt-6 text-xs uppercase tracking-widest opacity-60">
    {active.author}{active.role ? `, ${active.role}` : ""} · {active.client}
  </footer>
)}
```

Sample-only entries then render the client name and artwork with no fake attribution.

### B3. Ready-to-paste testimonial objects `[DRAFT-READY]` · 25 min

All 5 respondents granted **name + testimonial + logo + edit-for-length** permission.
These are trimmed for the card (full text preserved in the sheet); every one is the
client's own wording, cut only for length.

```ts
// brand-strategy
testimonials: [
  {
    client: "LGBTech",
    author: "Shachar Grembek",
    role: "Chair, LGBTech",
    quote:
      "Shai's unique ability to combine creativity with a structured, methodical approach has truly stood out. His thoroughness in asking deep, context-driven questions ensured the end results were not only visually impressive but strategically aligned with our goals.",
  },
  {
    client: "WINN.AI",
    author: "Oren Hacohen",
    role: "Head of Growth, WINN.AI",
    quote:
      "I've worked with Shai on brand building and creating the website of winn.ai from scratch. Shai had both great ideas and a very professional attitude. I couldn't be happier with the outcome.",
  },
  { client: "Clalit" },
  { client: "PointFive" },
],
```

```ts
// creative-direction
testimonials: [
  {
    client: "bananaz",
    author: "Or Israel",
    role: "CEO, bananaz",
    quote:
      "Shai quickly understood our vision, making adjustments on the fly and delivering content that not only aided in securing key investments but also elevated our branding. He felt like a true teammate throughout.",
  },
  {
    client: "Abe's Market",
    author: "Richard Demb",
    role: "Founder, Abe's Market",
    quote:
      "I've worked with Shai over the past 10 years and he has consistently impressed me with how he can transform a conversation into a standout written and visual presentation. I only recommend Shai to founders and execs.",
  },
  { client: "Tastewise" },
  { client: "SodaStream" },
],
```

```ts
// digital-design
testimonials: [
  {
    client: "BAMAH",
    author: "Flo Low",
    role: "Executive Director, BAMAH",
    quote:
      "Shai is the first person I want to collaborate with — his strategic mind and keen sense of visual design mean he's always thinking ahead on how to capture a brand's essence. Thanks to Shai, BAMAH not only has a beautiful website, we have a clearer understanding of how to talk about what we do.",
  },
  { client: "Fiverr" },
  { client: "Corpora" },
],
```

⚠️ **Demb's full quote opens with a joke** — "My hesitation with recommending Shai is I want
to be sure he still has time for my companies." It's the best line in the whole sheet.
Consider leading with it instead of the trimmed version; your call, it's a tone decision.

### B4. Kill the remaining placeholders `[DRAFT-READY]` · 15 min

**Closing CTA bodies** — all 3 are `"Placeholder body — real closing copy coming soon."`:

```ts
// brand-strategy — closingCta.body
"Let's find the version of your brand that walks into the room like it belongs there. First conversation is free and usually clarifying."

// creative-direction — closingCta.body
"Bring the deck you've got, or the idea you haven't built yet. Either way you'll leave the first call with a sharper story than you came in with."

// digital-design — closingCta.body
"Tell us who you're trying to reach and what you want them to feel. We'll show you what that looks like as a site people actually stay on."
```

**Principles intro** — `ServicePageTemplate.tsx:617` is hardcoded `Lorem ipsum`.
Add a field rather than hardcoding per service:

```ts
// services.ts — add to Service interface
/** One-line intro above the principles grid. */
principlesIntro: string;
```

```ts
// brand-strategy
principlesIntro: "Six things every brand we build has to earn before it ships.",
// creative-direction
principlesIntro: "What separates a deck that gets a second meeting from one that gets a polite no.",
// digital-design
principlesIntro: "The non-negotiables behind every site we put our name on.",
```

```tsx
// ServicePageTemplate.tsx:616-620 — replace the Lorem block
<p className="text-white/80 leading-relaxed">{service.principlesIntro}</p>
```

### B5. Verify · 10 min

Typecheck, lint, then all three `/services/[slug]` pages at 375 / 768 / 1440. Click through
the testimonial carousel arrows on each — confirm sample-only slides render without a
dangling attribution line.

---

## 🟢 MVL line — you can ship here. Everything below is upside.

---

## PHASE C — Service copy polish (60 min) · 🟡 NICE

### C1. Service copy audit `[DRAFT-READY]` · 30 min

Verdict per field, having read all three services:

| Field | Verdict |
|---|---|
| `heroIntro` × 3 | ✅ **Final.** Confident, specific, distinct voice. The `TODO` at `services.ts:59` is stale — clear it. |
| `stats` × 3 | ✅ **Final.** "Never Use 'Em" and "All of them" are the best jokes on the site. |
| `quote` × 3 | ⚠️ RuPaul / Einstein / Star Trek. Einstein-on-curiosity is the tiredest quote in tech. RuPaul and Star Trek are great. **Swap the Einstein one.** |
| `deliverables` × 18 | ✅ **Final.** |
| `principles` × 18 | ⚠️ See C3. |
| `heroTagline` | ⚠️ brand-strategy is `"Branding & Creative Strategy"` — a *label*, while the other two are puns (`"Pitch perfect."`, `"Web perfect."`). **Inconsistent.** Suggest `"Brand perfect."` for symmetry, or `"Unmissable."` if you want one to break the pattern deliberately. |

Einstein replacement options:
- *"If you're not confused, you're not paying attention."* — Tom Peters
- *"The most beautiful thing we can experience is the mysterious."* — (still Einstein, less worn)
- *"Tell me a fact and I'll learn. Tell me a truth and I'll believe. But tell me a story and it will live in my heart forever."* — Native American proverb

### C2. Client logos `[MECHANICAL, blocked on assets]` · 20 min

`TestimonialEntry.logo` exists and is unused; `ServicePageTemplate.tsx:845` has
`TODO: drop the actual client logo/hero here`. All 5 respondents granted logo permission.
Drop files in `/public/images/logos/`, add `logo:` paths. **Skip if assets aren't ready** —
the yellow scribble frame is a fine fallback.

### C3. Diagnose the "meh" principles `[DRAFT-READY]` · 10 min to read, more to rewrite

You said these felt weak. Here's why, concretely:

1. **They're not yours.** "SEO Optimization," "Speed & Performance," "Mobile
   Responsiveness," "Security & Stability" are a generic web-agency checklist. Any
   competitor could publish that list verbatim. Compare to your stats block ("Transition
   Effects — Never Use 'Em"), which nobody else could have written.
2. **Every `description` starts with "We."** 18 of 18. It reads as a wall.
3. **They describe hygiene, not point of view.** "Mobile Responsiveness" in 2026 is like
   promising the doors will be attached to the car. A principle should be something you'd
   *lose an argument over*.

digital-design is the worst offender. Rewrite direction — trade the checklist for opinions:

```ts
// digital-design — replacement principles (pick 6 of these, or riff)
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

brand-strategy and creative-direction principles are **noticeably better** — leave them
unless you want the same treatment. Fix digital-design and stop there.

---

## PHASE D — About-me section (45 min) · 🟡 NICE

### D1. Three tones, drafted from evidence `[DRAFT-READY]` · 30 min

Drafted **only** from your testimonials, the portfolio, and the site's existing voice — you
don't have to write a word, just react. All three assume solo + first person (Q2, Q3).
There's no `aboutMe` field yet; it slots under `hero` or as a new `AboutData` key.

**Tone A — Understated Operator.** *Confidence through specificity. Fewest adjectives.*

> I'm Shai. I've been naming companies, writing their words, and building the decks and
> sites that carry them since before "brand strategy" was a job title you could put on
> LinkedIn.
>
> Thirty-odd companies, from a Tel Aviv HMO to an AI cybersecurity startup to a vineyard.
> Some of the decks raised rounds. Some of the names are on storefronts. One client has
> been sending me work for a decade.
>
> I work with founders directly. No account layer, no handoff. You brief me, I do the work,
> and you get a straight answer about what's not working — which is usually the part people
> say they remember.

**Tone B — The Frustration.** *Leads with the conviction. Closest to your manifesto voice.*

> Most companies don't lose because the idea was bad. They lose because the idea showed up
> badly dressed.
>
> I've spent my career on that gap — the distance between how good something is and how
> good it looks. It turns out closing it is mostly a matter of asking harder questions than
> people expect, and then refusing to make anything pretty until the answers are clear.
>
> I'm Shai, and Startle Labs is deliberately one person with a very good bench. That's not
> a limitation I'm apologizing for. It's the reason the work is good.

**Tone C — Let Them Talk.** *You barely speak. Highest trust, lowest ego. `[RECOMMENDED]`*

> **"I only recommend Shai to founders and execs."** — Richard Demb, ten years a client
>
> I'd rather not write about myself, so here's what other people wrote: *creative,
> resourceful, dependable.* *Visionary, reliable, results-driven.* *Talented, professional
> & kind.*
>
> What I'll add is the boring part. I'm Shai. I run Startle Labs out of Tel Aviv. I name
> things, write things, and design the decks and websites that decide whether anyone takes
> your company seriously. I work with a handful of founders at a time, directly, and I'll
> tell you when your idea needs work before I make it look good.

> 💡 **Why C:** it solves your actual problem — you hate writing about yourself, so this
> version has you writing three sentences and lets five clients do the rest. It's also the
> only one whose central claim is externally verifiable. The descriptors quoted are
> verbatim from the sheet.

### D2. Values + manifesto `[DRAFT-READY]` · 15 min

Both are **already good.** `values` (clarity over cleverness / strategy before craft /
client as collaborator / built to last) are specific and defensible. `manifesto`
("Connection isn't a skill — it's a choice") ties to the digital-design pull-quote.

One flag: values say "we," and if Q2 confirms solo, "Client as collaborator" reads slightly
off for a one-person studio. Minimal fix — retitle to **"You know your audience. I don't."**
and switch that one card to first person. Leave the other three.

---

## PHASE E — Final sweep (30 min) · 🟡 NICE

- Clear the 3 stale `TODO`s in `services.ts` (lines 9, 59) once C1 is approved.
- `ctaArt` for digital-design (`services.ts:355`) — needs a Figma export. **Falls back to
  `heroImage` automatically**, so this is cosmetic, not blocking.
- `ServicePageTemplate.tsx:463` — `TODO: swap for <DrawingIcon>`. Defer.
- The 2 pre-existing lint errors (`set-state-in-effect` in `Topbar.tsx:71`,
  `FullscreenScroller.tsx:143`) are unrelated to launch. Leave them.
- Full pass: `/`, `/about`, all 3 services, `/contact` at 375 / 768 / 1440. **Orphan-word
  check on every heading you changed.**

---

## PHASE F — Creativity Venn (not this afternoon) · ⚪ DEFER

### F1. Three directions, with estimates `[you choose — don't build today]`

Prior art in-repo: `/values-venn` route, `InteractiveVennCanvas`, `ValuesVennHero`,
`RadiatingBolts`, `LightningEffect`, Framer Motion via `MotionProvider`.

**Direction 1 — Scroll-Driven Convergence.** ~4–6h
Three labelled circles start apart, scroll-scrub drives them into overlap; the center
lights up with `RadiatingBolts` at full intersection. Uses `useScrollProgress`, which
already exists. *Lowest risk, reads clearly on mobile, no canvas work.*

**Direction 2 — Hand-Drawn Ink Bloom.** ~8–12h
Circles draw themselves in as rough ink strokes (SVG `stroke-dashoffset`), overlaps bloom
with the grunge texture from `src/lib/texture.ts` via `mix-blend-mode`. *Best fit with the
site's hand-drawn identity. Real risk: three overlapping blend layers behave badly on
Safari mobile.*

**Direction 3 — Interactive Drag.** ~12–16h+
Visitor drags the circles; labels rewrite as regions overlap. Extends
`InteractiveVennCanvas`. *Highest payoff, highest risk. Needs real touch handling, a
reduced-motion path, and a keyboard-accessible fallback — that last one is what actually
sinks the estimate.*

> 💡 **Recommendation: Direction 1, in a separate session.** It gets ~80% of the "whoa" for
> ~30% of the cost, and it can't sink a launch afternoon. **I agree with your brief: this
> is not a launch blocker.** The About page has a full reviews marquee, story cards, values,
> manifesto, timeline, portfolio embed, and FAQs. It is not a thin page without a Venn.

---

## Time budget

| Phase | Time | Tier |
|---|---|---|
| Pre-flight + questions | 15 min | 🔴 |
| A — Correctness | 60 min | 🔴 |
| B — Real testimonials | 75 min | 🔴 |
| **MVL subtotal** | **2h 30m** | **← ship here** |
| C — Service copy | 60 min | 🟡 |
| D — About-me | 45 min | 🟡 |
| E — Final sweep | 30 min | 🟡 |
| **Full subtotal** | **4h 45m** | |
| F — Venn | 4–16h | ⚪ separate session |

Sequencing is deliberate: A and B are the two things that are *wrong* rather than *unfinished*.
Everything after the MVL line makes a correct site better. Nothing after it makes an
incorrect site shippable.

---

## Verification protocol (every phase)

1. `npx tsc --noEmit` — clean.
2. `npm run lint` — no *new* errors (2 pre-existing are known and unrelated).
3. Dev server on **:3100**, affected routes at **375 / 768 / 1440**.
4. **No orphaned single words** in any title or subtitle — the 375px pass is where this bites.
5. Console clean.
