/**
 * Hero scroll-choreography timing, shared between the FullscreenScroller
 * (which owns the animation) and the Topbar (which pins its logo's
 * centered → left slide to the end of the word-cycle phase).
 *
 * This lives in a plain module — NOT inside the "use client" scroller
 * component — so the constants import cleanly into both client components.
 * Importing a non-component value across a "use client" module boundary does
 * not resolve reliably here, which silently made the Topbar's threshold NaN.
 *
 * Units are "normal section spans"; one span == one viewport-height of scroll
 * (see useSectionTiming / the totalVHUnits math in FullscreenScroller).
 */

/** Word-cycling phase length — words fade in, push up, and cycle to "success". */
export const HERO_EXTRA_VH = 2;

/**
 * Resolve/collapse phase length. After cycling, the wheel fades out and the
 * column retracts so the line distills to the clean "Creativity that inspires."
 * (with a brief hold) before the horizontal slide-out.
 */
export const HERO_COLLAPSE_VH = 0.6;

/**
 * Fraction of the resolve phase spent on the active collapse MOTION (the rest
 * is the punchline hold). This defines the exact scroll window in which the
 * underline retracts leftward — the Topbar pins the logo's centered → left
 * slide to the same window so the two move as one.
 *
 * Collapse-motion window, in viewport-heights of scroll from the top:
 *   start = HERO_EXTRA_VH
 *   end   = HERO_EXTRA_VH + HERO_COLLAPSE_VH * HERO_RESOLVE_PORTION
 */
export const HERO_RESOLVE_PORTION = 0.6;
