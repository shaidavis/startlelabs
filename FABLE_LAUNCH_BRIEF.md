# Fable launch brief

Paste the block below into Fable in this repo when you have a free afternoon to work
the plan (not necessarily the afternoon you paste it — the point is Fable builds the
plan now, you execute it later).

---

```
You are my design-and-content partner for launching Startle Labs. Read CLAUDE.md,
AGENTS.md, and the .claude/rules/ files first — this is a real, data-driven Next.js 16
site where all content is typed TypeScript in src/data/*.ts (services.ts, about.ts),
NOT markup. Copy changes are edits to those objects.

THE SITUATION — read this before anything else.
I've been building this site for 2.5 years. It's ~6 hours of work from launch and I
keep failing to do the final push. I do not want to grind through it blind, and I hate
writing about myself. So today I do NOT want you to do the work. I want you to produce
ONE thing: a sequenced, time-boxed LAUNCH PLAN I can execute in a single free afternoon,
where the hard/creative parts are already drafted so my afternoon is review-and-approve,
not write-from-a-blank-page. Call it LAUNCH_PLAN.md at the repo root.

Before you write the plan:
1. Read the repo to see what actually exists — the two big files (FullscreenScroller.tsx,
   ServicePageTemplate.tsx) via the bigfile-navigator agent so you don't burn context;
   the current copy and every TODO in src/data/services.ts and ServicePageTemplate.tsx;
   the shapes in src/data/about.ts (reviews, values, story, manifesto, timeline, faqs).
2. Read my testimonials: ~/Downloads/"Startle Labs Testimonials (Responses).xlsx" —
   5 responses (Richard Demb, Flo Low, Flo/BAMAH; Shachar Grembek/LGBTech; Or Israel/
   bananaz; Oren/WINN.AI), all with permission to use name + quote granted. The sheet has
   their "3-5 words" descriptor and a longer testimonial each.
3. Then ask me the 5–8 HIGHEST-LEVERAGE questions only — the answers that unlock the most
   drafting. Don't interview me broadly; batch the questions, make them specific, and
   prefer questions I can answer in a sentence. For anything you can infer from the repo,
   testimonials, or portfolio, infer it and mark it [ASSUMPTION] for me to correct.

Here are my six blockers. For each, the plan must give me a concrete, ordered task with a
time estimate, and tag it [DRAFT-READY] (you pre-write it, I approve), [INTERVIEW]
(you need 1-2 answers from me first, then draft), or [MECHANICAL] (grunt work, you just
do it once approved):

1. SERVICE SAMPLES + RECOMMENDATIONS. Each service (src/data/services.ts) has a
   TestimonialEntry[] and a deliverables grid. I have a stale portfolio in Notion I need
   to mine for samples:
   https://app.notion.com/p/shaidavis/a3b1ac214a534a3c993ea8248ec151a9?v=30f304d338d2457bba8ba2eb6ad6656c
   I'll need to grant you access or paste an export — tell me exactly what format you want.
   Map my 5 testimonials to the right services, propose which portfolio pieces become
   "samples" per service, and pre-fill the TestimonialEntry objects.

2. SERVICE COPY AUDIT. Review and rewrite all service text — hero taglines, heroIntro,
   deliverables, closing CTAs — and flag which current strings are placeholder vs final
   (the TODOs mark some). Give me before/after so I approve edits, not author them.

3. AREA / CORE PRINCIPLES. The Principle[] per service felt "meh" last time. Diagnose why,
   then rewrite them. Draft options and let me pick.

4. ABOUT-ME SECTION. I hate writing about myself. Do NOT ask me to write it. Draft it FROM
   EVIDENCE — the testimonials' descriptors, my portfolio, the site's own voice — in 2-3
   distinct tones, so I react and pick rather than compose. Interview me only for facts you
   can't infer (dates, a couple of stories).

5. REST OF THE ABOUT PAGE. story cards, values, manifesto, timeline milestones, FAQs
   (see about.ts shapes). Pre-draft all of it from evidence + a short interview.

6. CREATIVITY VENN DIAGRAM. The about page needs a strong visualization/animation of a
   creativity Venn diagram — it's conceptually complex but the payoff is high if it lands.
   There's prior art in the repo (/values-venn aid, RadiatingBolts/LightningEffect effects,
   Framer Motion via MotionProvider). Propose 2-3 concrete visual/animation directions with
   a rough build estimate each, and recommend one. Don't build it yet — I want to choose.

Constraints for the plan:
- Sequence tasks so the afternoon flows: mechanical/fast wins first, creative approvals in
  the middle, the Venn build (the biggest risk) scoped separately so it can't sink launch.
- Mark a MINIMUM VIABLE LAUNCH subset vs NICE-TO-HAVE, so if I only get 3 hours, I still
  ship. The Venn animation is almost certainly nice-to-have, not a launch blocker — tell me
  if you agree.
- List every asset you need from me up front (Notion access/export, headshots, client logos,
  any dates/stories) as a short pre-flight checklist, so I can gather them in one pass.
- Honor how I work: minimal surgical diffs, root-cause not band-aid, verify visually at
  375/768/1440 with no orphaned single-word wraps, typecheck + lint clean. Note the
  verification step in the plan.
- Where you pre-draft copy, put the drafts INLINE in LAUNCH_PLAN.md (or as ready-to-paste
  TS objects matching the interfaces), so approving = pasting.

Deliverable today: LAUNCH_PLAN.md + your batched questions + the pre-flight checklist.
Nothing gets committed. When I come back with a free afternoon, I want to open that file
and just execute. Finally. Sof sof.
```

## Before pasting

- The Notion portfolio link needs auth — Fable will hit the same wall I did. Have an
  export ready, or grant access, per whatever it asks for in step 1.2 of the plan.
