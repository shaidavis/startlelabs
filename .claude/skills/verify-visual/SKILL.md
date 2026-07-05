---
name: verify-visual
description: >
  Visually verify a change on the Startle Labs site using the Preview MCP. Use after any UI,
  layout, copy, styling, or animation change, or when asked to "check it renders", "verify
  visually", "screenshot the page", or confirm no orphaned-word wraps. There is no test suite,
  so this is the primary verification loop.
---

# Verify visually

This site has **no automated tests** — verification is typecheck + lint + looking at the
rendered page. Do this before claiming any UI/copy/animation change is done.

## Steps

1. **Static gates first** (cheap, catch real errors):
   - `npx tsc --noEmit` — must be clean.
   - `npm run lint` — must be clean.

2. **Start the dev server** via Preview MCP using the `nextjs-dev` config
   (`.claude/launch.json`, pinned to **port 3000**). Reuse it if already running.

3. **Open the affected route(s).** Common ones:
   - `/` — homepage `FullscreenScroller` (scroll through the panels; hash panels
     `#brand-strategy`, `#creative-direction`, `#digital-design`, `#contact`).
   - `/services/<slug>` — service detail pages.
   - `/about` — About page.

4. **Check each breakpoint** — the owner's rule is to verify at **~375px** especially:
   - **375px (phone)** — the important one. **No orphaned single words** wrapping onto their
     own line in any title/subtitle (rephrase or resize to fix). This is a hard rule.
   - 768px and 1440px — confirm layout holds (breakpoints are `sm 810 / md 1024 / lg 1440`).

5. **Watch the console** for errors/warnings on each route (Preview MCP console logs).

6. **For animation changes**, also toggle the OS "Reduce Motion" setting (emulate
   prefers-color/reduced-motion where the tool supports it) and confirm motion is suppressed
   — both the CSS layer (`globals.css` media query) and the JS layer (`MotionProvider`).

## Report

State plainly what you checked and at which widths, paste any console errors, and call out
anything you could NOT verify. Never imply completeness for a step you skipped.
