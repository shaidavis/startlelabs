"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Service } from "@/data/services";
import { RadiatingBolts } from "@/components/effects/RadiatingBolts";


/* ─── Types ──────────────────────────────────────────────────────────── */

interface ScrollSectionData {
  id: string;
  label: string;
  type: "hero" | "service" | "about" | "contact";
  service?: Service;
  index: number;
}

/**
 * Grunge-overlay background helper. Every full-screen hero panel gets a
 * shared distressed-paper texture composited over its accent color so the
 * bold colors read as a "weathered silkscreen poster" rather than flat
 * digital fill.
 *
 * `multiply` blend was picked over `overlay`/`soft-light` because the
 * texture PNG sits in the mid-gray range — under `overlay` mid-gray is
 * neutral, which left the result indistinguishable from a flat fill in
 * tests. Multiply makes the gray patches darken the underlying color
 * ~30–50%, giving the visible "dirty/printed" cast the user asked for
 * while keeping highlights (the lighter speckles in the PNG) bright.
 *
 * Blend-mode targets the bg layers only, so panel CONTENT (headlines,
 * CTAs, illustrations) renders cleanly above the texture — no readability
 * hit. Returns a `style` object so callers can spread or pass directly.
 */
const GRUNGE_BG = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundBlendMode: "hard-light",
});

/* ─── Scroll-driven content animation ──────────────────────────────── */

/**
 * Applies continuous opacity + y transforms to a DOM element based on scroll
 * progress, bypassing Framer Motion's WAAPI engine (which can't handle
 * function-derived motion values). Subscribes directly to the MotionValue
 * and writes styles via ref.
 */
function useScrollContent(
  ref: React.RefObject<HTMLElement | null>,
  scrollYProgress: MotionValue<number>,
  snapPoint: number,
  sectionSpan: number,
  staggerOffset = 0
) {
  // Parallax multiplier: text accelerates ahead of its panel background.
  // Higher stagger = element exits slightly later (cascading fly-off).
  const parallaxStrength = 200 + staggerOffset * 60; // px of extra horizontal travel
  const staggerDelay = staggerOffset * 0.06; // normalized scroll units

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (v: number) => {
      const normalized = (v - snapPoint) / sectionSpan;

      // Accelerating parallax: text barely moves at center, then ramps
      // as it nears the edge — quadratic curve for increasing velocity.
      const sign = Math.sign(normalized);
      const abs = Math.abs(normalized);
      const x = sign * -(abs * abs) * parallaxStrength;

      // Staggered opacity: later elements fade slightly behind the lead element
      const dist = Math.abs(normalized);
      let opacity = 1;
      if (dist > 0.6) {
        // Fade near edges of visibility
        opacity = Math.max(0, 1 - (dist - 0.6) / 0.4);
      }
      // Stagger: later items start fading slightly sooner
      if (staggerDelay > 0 && dist > 0.5 - staggerDelay) {
        opacity = Math.min(opacity, Math.max(0, 1 - (dist - (0.5 - staggerDelay)) / 0.5));
      }

      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.transform = `translateX(${x}px)`;
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [ref, scrollYProgress, snapPoint, sectionSpan, parallaxStrength, staggerDelay]);
}

/* ─── Panel content components ───────────────────────────────────────── */

interface PanelProps {
  scrollYProgress: MotionValue<number>;
  snapPoint: number;
  sectionSpan: number;
}

// Word wheel order — "success" is intentionally the FINAL resolution so the
// cycle always lands on it naturally as the user scrolls through the hero.
// Do not reorder without also updating the closing frame of the animation
// (the `hasLeftHeroRef` branch pins to SUCCESS_INDEX on back-scrolls).
const SCROLL_WORDS = ["teams", "users", "investors", "vision", "innovation", "joy", "success"];
const SUCCESS_INDEX = SCROLL_WORDS.indexOf("success"); // always last

function HeroPanel({ scrollYProgress, snapPoint, sectionSpan }: PanelProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const collapseRef = useRef<HTMLDivElement>(null); // desktop: shrinks width
  const mobileStackRef = useRef<HTMLDivElement>(null); // mobile: fades + lifts
  const inlinePeriodRef = useRef<HTMLSpanElement>(null); // mobile: fades in
  const [wordHeight, setWordHeight] = useState(56);
  const [maxWordWidth, setMaxWordWidth] = useState(200);
  const [isMobile, setIsMobile] = useState(false);
  const hasLeftHeroRef = useRef(false);

  // Three-phase hero timeline, expressed in units of a normal section span:
  //   expand (HERO_COLLAPSE_VH) → word cycling (HERO_EXTRA_VH) → slide-out (1)
  //
  // Phase 1 (expand): initial state reads "Creativity that inspires." with
  //   the period flush against the tagline. As the user starts scrolling,
  //   the underline (desktop) grows outwards pushing the period rightward,
  //   and once the column is ~half-grown the word wheel begins fading in.
  // Phase 2 (cycle): the wheel cycles through SCROLL_WORDS, landing on
  //   "success" as the final word at the end of the phase.
  // Phase 3 (slide-out): the whole row flies off to the left and the first
  //   service panel slides in from the right.
  //
  // Reuses the same span constants as the old timeline so total scroll
  // distance through the hero is unchanged — we're just re-ordering what
  // happens inside those spans.
  const normalSpanHero = sectionSpan / (1 + HERO_EXTRA_VH + HERO_COLLAPSE_VH);
  const expandSpan = normalSpanHero * HERO_COLLAPSE_VH;
  const wordCycleSpan = normalSpanHero * HERO_EXTRA_VH;
  const expandEnd = snapPoint + expandSpan;
  const cycleEnd = expandEnd + wordCycleSpan;

  // Detect mobile (below sm breakpoint = 810px). useLayoutEffect so the
  // detection commits before paint — otherwise on mobile, the user briefly
  // sees the desktop branch (rendered with the SSR-default isMobile=false)
  // before React swaps in the mobile layout.
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 809px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Row slide-out: fully in place through expand + cycle, then flies off
  // to the left once the user scrolls past the end of the cycle phase.
  // useLayoutEffect so the initial state lands before first paint.
  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const update = (v: number) => {
      if (v <= cycleEnd) {
        el.style.opacity = "1";
        el.style.transform = "translateX(0px)";
      } else {
        const normalized = (v - cycleEnd) / normalSpanHero;
        // Accelerating parallax: quadratic ramp matches service panels
        const x = -(normalized * normalized) * 250;
        const opacity = Math.max(0, 1 - normalized * 1.5);
        el.style.opacity = String(Math.max(0, opacity));
        el.style.transform = `translateX(${x}px)`;
      }
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, cycleEnd, normalSpanHero]);

  // Expand: grow the scroll-word column out from 0 (desktop) or crossfade
  // the inline period → word stack (mobile). Inverse direction of the old
  // "collapse" phase — this now happens at the START of the hero, not the
  // end, so the initial state reads "Creativity that inspires." (period
  // flush) and scrolling reveals the wheel.
  //
  // Desktop splits the phase in two: the underline/column grows first,
  // pushing the period rightward; the wheel opacity ramps up a beat later
  // so the words appear to "land" inside an already-drawn line.
  //
  // useLayoutEffect: the JSX initial styles are set to the v=0 collapsed
  // state, and this effect must run synchronously before paint to keep
  // them in sync with the actual scroll position (e.g. a refresh that
  // restored scroll past the hero) — otherwise we'd flash one frame of
  // collapsed state before the effect catches up.
  useLayoutEffect(() => {
    // p: 0 = collapsed (initial state), 1 = fully expanded (cycling-ready)
    const GROW_PORTION = 0.6; // first 60% grows the column
    const FADE_START = 0.5; // wheel begins fading in at 50% (slight overlap)
    const smoothstep = (t: number) => t * t * (3 - 2 * t);

    const update = (v: number) => {
      // Before snap: treat as if p=0 (hero fully collapsed, initial state)
      // During expand phase: p ramps 0 → 1
      // After expandEnd: pinned at 1 through cycling + slide-out
      let p = 1;
      if (v < expandEnd) {
        p = Math.max(0, Math.min(1, (v - snapPoint) / expandSpan));
      }

      if (isMobile) {
        // Mobile: stack fades in + slides up into place; inline period fades
        // out. Period starts visible so the initial tagline reads
        // "Creativity that inspires." before the user has scrolled.
        const eased = smoothstep(p);
        const stack = mobileStackRef.current;
        if (stack) {
          stack.style.opacity = String(eased);
          stack.style.transform = `translateY(${(1 - eased) * 14}px)`;
        }
        const period = inlinePeriodRef.current;
        if (period) period.style.opacity = String(1 - eased);
        // Reset desktop targets in case of viewport swap
        const col = collapseRef.current;
        if (col) {
          col.style.width = "";
          col.style.marginLeft = "";
          col.style.marginRight = "";
          col.style.opacity = "";
        }
        const wheel = wheelRef.current;
        if (wheel) wheel.style.opacity = "";
      } else {
        const growP = Math.min(1, Math.max(0, p / GROW_PORTION));
        const fadeP = Math.min(1, Math.max(0, (p - FADE_START) / (1 - FADE_START)));
        const growEased = smoothstep(growP);
        const fadeEased = smoothstep(fadeP);

        // Phase A: grow column + margins from 0 → full. Underline is
        // positioned `left-0 right-0` within the column so it extends with
        // the width — visually a horizontal line drawing outwards.
        const col = collapseRef.current;
        if (col) {
          const baseW = maxWordWidth + 16;
          col.style.width = `${baseW * growEased}px`;
          col.style.marginLeft = `${16 * growEased}px`;
          col.style.marginRight = `${8 * growEased}px`;
          col.style.opacity = "1";
        }

        // Phase B: wheel opacity ramps up once the column is ~halfway grown.
        // Multiplies into the per-word opacities set by the scroll tracker.
        const wheel = wheelRef.current;
        if (wheel) wheel.style.opacity = String(fadeEased);

        // Reset mobile targets
        const stack = mobileStackRef.current;
        if (stack) {
          stack.style.opacity = "";
          stack.style.transform = "";
        }
        const period = inlinePeriodRef.current;
        if (period) period.style.opacity = "0";
      }
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, snapPoint, expandSpan, expandEnd, isMobile, maxWordWidth]);

  // Measure word height and max width once. useLayoutEffect so the measured
  // values are available before paint, avoiding a re-flow when wordHeight
  // jumps from the placeholder (56) to the actual rendered height.
  // Uses scrollWidth to get true text width even when absolutely positioned.
  useLayoutEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
    if (words.length === 0) return;
    setWordHeight(words[0].getBoundingClientRect().height);
    let widest = 0;
    words.forEach((w) => {
      const ww = w.scrollWidth;
      if (ww > widest) widest = ww;
    });
    setMaxWordWidth(Math.ceil(widest));
  }, [isMobile]);

  // Seed initial word opacities once per isMobile change so hydration doesn't
  // flash all 7 words at full opacity. The scroll-driven effect takes over
  // from here — without the dep guard, every unrelated re-render would hard-
  // reset the wheel back to word[0]=1 mid-scroll.
  useLayoutEffect(() => {
    if (!isMobile) return;
    const el = wheelRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
    words.forEach((word, i) => {
      word.style.opacity = i === 0 ? "1" : "0";
    });
  }, [isMobile]);

  // Track scroll to drive the word wheel + detect when user leaves hero.
  // useLayoutEffect so the wheel transform/word opacities are set in the
  // same paint as the column expansion — otherwise the wheel briefly
  // flashes word[0] at the wrong translateY before the effect catches up.
  useLayoutEffect(() => {
    const update = (v: number) => {
      const normalized = (v - snapPoint) / sectionSpan;

      // Detect if user has fully scrolled past hero
      if (normalized > 1) {
        hasLeftHeroRef.current = true;
      }

      const el = wheelRef.current;
      if (!el) return;

      let wordIndex: number;
      if (hasLeftHeroRef.current) {
        wordIndex = SUCCESS_INDEX;
      } else {
        // Word cycling happens in the middle phase of the hero timeline,
        // starting once the column has fully expanded (expandEnd) and
        // ending on the last word ("success") at cycleEnd. Clamped so
        // scrolling further just pins on success.
        const microProgress = Math.max(
          0,
          Math.min(1, (v - expandEnd) / wordCycleSpan)
        );
        wordIndex = microProgress * (SCROLL_WORDS.length - 1);
      }

      if (isMobile) {
        // Mobile: fade between words (no scroll), all words stacked in same spot
        el.style.transform = "translateY(0px)";
        const words = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
        words.forEach((word, i) => {
          const dist = Math.abs(i - wordIndex);
          // Crossfade: active word fades in, others fade out
          word.style.opacity = dist < 0.5 ? "1" : "0";
          word.style.transition = "opacity 0.3s ease";
        });
      } else {
        // Desktop: vertical scroll wheel with graduated opacity
        const translateY = -wordIndex * wordHeight;
        el.style.transform = `translateY(${translateY}px)`;

        const words = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
        words.forEach((word, i) => {
          word.style.transition = "none";
          const dist = Math.abs(i - wordIndex);
          if (dist < 0.5) {
            word.style.opacity = "1";
          } else if (dist < 1.2) {
            word.style.opacity = "0.35";
          } else if (dist < 2.2) {
            word.style.opacity = "0.18";
          } else {
            word.style.opacity = "0.08";
          }
        });
      }
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, snapPoint, sectionSpan, expandEnd, wordCycleSpan, wordHeight, isMobile]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-6 sm:px-8 overflow-hidden"
      style={GRUNGE_BG("#E9C402")}
    >
      <div
        ref={rowRef}
        className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 sm:gap-0 will-change-transform"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-headline tracking-tight text-[#230F2C] whitespace-nowrap shrink-0">
          Creativity that inspires
          {/* Mobile-only inline period. VISIBLE on initial load so the hero
              reads "Creativity that inspires." before the user scrolls;
              fades out as the scroll-driven expand phase reveals the word
              stack below. */}
          {isMobile && (
            <span
              ref={inlinePeriodRef}
              className="font-headline"
              style={{ opacity: 1 }}
            >
              .
            </span>
          )}
        </h1>

        {/* Mobile: word + underline stack below headline (fades out during resolve) */}
        {/* Desktop: scroll wheel column + period (column shrinks during resolve) */}
        {isMobile ? (
          // Initial style matches the v=0 state computed by the expand
          // effect (opacity 0, translateY(14px)) so SSR/hydration paints
          // the collapsed start frame instead of flashing the stack at
          // full opacity for one frame.
          <div
            ref={mobileStackRef}
            className="flex flex-col items-center w-full will-change-transform"
            style={{ opacity: 0, transform: "translateY(14px)" }}
          >
            <div className="relative w-full" style={{ height: wordHeight }}>
              <div
                ref={wheelRef}
                className="absolute inset-0 transition-none will-change-transform"
              >
                {SCROLL_WORDS.map((word) => (
                  <div
                    key={word}
                    data-scroll-word
                    className="absolute inset-0 flex items-end justify-center font-handwritten text-6xl text-[#230F2C] leading-none whitespace-nowrap"
                    style={{ height: wordHeight }}
                  >
                    {/* Period baked into the handwritten string so it's
                        rendered in Pecita as part of the same glyph run
                        — a separate element in a different font reads
                        as a dropped full stop floating beside the word. */}
                    {`${word}.`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Scroll-word column — width + margins grow from 0 during the
                hero's expand phase, then collapse back if the user scrolls
                back to the top. Initial JSX styles match the v=0 collapsed
                state (width 0, no margins) so the SSR/hydration paint shows
                "Creativity that inspires." with the period flush — without
                this, the column rendered at full width on first paint and
                then snapped to 0 once the layout effect ran. */}
            <div
              ref={collapseRef}
              className="relative overflow-visible will-change-[width,margin,opacity]"
              style={{
                width: 0,
                height: wordHeight,
                marginLeft: 0,
                marginRight: 0,
              }}
            >
              <div className="absolute left-0 right-0 h-[2px] bg-[#230F2C]/40 z-10" style={{ top: wordHeight + 4 }} />
              {/* Wheel starts at opacity 0 to match the v=0 fadeEased value
                  the expand effect computes — keeps the words invisible
                  until scrolling brings the column halfway open. */}
              <div
                ref={wheelRef}
                className="absolute left-0 right-0 flex flex-col items-center transition-none will-change-transform"
                style={{ opacity: 0 }}
              >
                {SCROLL_WORDS.map((word) => (
                  <div
                    key={word}
                    data-scroll-word
                    // whitespace-nowrap so width/height measurement is stable
                    // even when the parent column is collapsed to 0px wide
                    // (otherwise long words like "investors" would wrap and
                    // throw off the height read).
                    className="flex items-end justify-center font-handwritten text-4xl md:text-5xl lg:text-6xl text-[#230F2C] leading-none whitespace-nowrap"
                    style={{ height: wordHeight }}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            <span className="text-4xl md:text-6xl lg:text-7xl font-headline text-[#230F2C] shrink-0">
              .
            </span>
          </>
        )}
      </div>

      {/* Scroll indicator — only on the hero panel */}
      <ScrollIndicator scrollYProgress={scrollYProgress} />
    </div>
  );
}

function ServicePanel({
  service,
  scrollYProgress,
  snapPoint,
  sectionSpan,
}: PanelProps & { service: Service }) {
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useScrollContent(textRef, scrollYProgress, snapPoint, sectionSpan, 0);
  useScrollContent(ctaRef, scrollYProgress, snapPoint, sectionSpan, 2);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-start px-8 sm:px-16 md:px-24 lg:px-32"
      style={GRUNGE_BG(service.accentColor)}
    >
      {/* Hero illustration — overflows bottom, centered.
          Mobile uses an explicit HEIGHT (not width) because Tailwind's
          preflight applies `max-width: 100%` to <img>, which silently
          clamps any viewport-width sizing like `w-[140vw]` back to 100vw.
          Sizing by height + `max-w-none` lets the square PNGs scale up
          and bleed past the viewport edges via the wrapper's
          overflow-hidden, while `object-bottom` keeps the character's
          feet grounded at the panel's lower edge.

          Mobile sizing is tuned per-PNG because the source artwork has
          different amounts of transparent space above the character:
          `artdirection.png` (digital-design) fills ~75% of the square
          so a taller box reads as "just right", while `branding.png`
          and `presentations.png` leave ~40% transparent at the top —
          at the same box height the character appears oversized AND
          sits too low (since object-bottom grounds the feet and the
          whitespace pushes the head down). A smaller box + a small
          `bottom` offset lifts the whole figure higher without losing
          the grounded-feet feel. */}
      {/* All service panels need visible overflow so the radiating-bolt
          halo can extend past the image bbox — each bolt flies out
          ~140 + 230 = 370px from its anchor (crown / eye / heart). */}
      <div className={`absolute inset-x-0 sm:inset-x-auto sm:right-0 flex justify-center sm:justify-end pointer-events-none overflow-visible sm:bottom-0 ${
        service.slug === "digital-design" ? "bottom-0" : "bottom-[6%]"
      }`}>
        {/* `group` + `relative` lets the bolt overlay sit on top of the
            img and react to hover. The img wrapper inline-blocks to its
            natural rendered size so the bolts' percentage origin aligns
            with the artwork rather than the surrounding empty space.
            `pointer-events-auto` re-enables hover on this hot zone since
            the parent disables pointer events globally. */}
        <div className="relative group inline-block pointer-events-auto">
          <img
            src={service.heroImage}
            alt=""
            className={`block w-auto max-w-none sm:w-auto sm:max-w-full sm:h-[88vh] object-contain object-bottom ${
              service.slug === "digital-design" ? "h-[62vh]" : "h-[46vh]"
            }`}
          />
          {/* Yellow halo radiating from the icon "feature" baked into each
              hero PNG. Coordinates are % of the PNG's bbox — eyeballed
              from each source asset:
                • branding.png crown — upper-right
                • presentations.png eye — left third, mid-height
                • artdirection.png heart — right of center, slightly low */}
          {(() => {
            const HALO: Record<string, { x: number; y: number }> = {
              "brand-strategy": { x: 75, y: 55 },
              "creative-direction": { x: 27, y: 55 },
              "digital-design": { x: 65, y: 63 },
            };
            const center = HALO[service.slug];
            return center ? (
              <RadiatingBolts centerOffset={center} color="#E9C402" />
            ) : null;
          })()}
        </div>
      </div>

      {/* Text content — mobile: centered, desktop: left-aligned */}
      <div className="relative z-10 flex flex-col items-center sm:items-start text-white max-w-full sm:max-w-[50%] lg:max-w-[45%] mt-[120px] sm:mt-0 mb-auto sm:mb-0 sm:my-auto">
        <div
          ref={textRef}
          className="will-change-transform"
        >
          <h2 className="text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-headline leading-[1.1] whitespace-pre-line text-center sm:text-left">
            {service.headline}
          </h2>

          {/* Handwritten accent word + underline. Underline is positioned as
              an absolute child of the cursive span (made `relative inline-block`
              so it sizes to its content) and stretched to `left-0 right-0` —
              that ties the line's width to the actual rendered word width at
              every breakpoint, instead of hard-coding 80% of the column and
              ending up too short on words like "connection" or too long on
              shorter ones. The period stays a sibling so it lands on the
              same baseline as the cursive script. */}
          <div className="mt-2 text-center sm:text-left">
            <span className="relative inline-block font-handwritten text-4xl sm:text-5xl md:text-[70px] text-[#E9C402] leading-none">
              {service.description}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 -bottom-2 h-[3px] bg-[#E9C402]"
              />
            </span>
            <span className="font-headline text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] text-white">.</span>
          </div>
        </div>

        <a
          ref={ctaRef}
          href={`/services/${service.slug}`}
          className="mt-5 sm:mt-10 inline-flex items-center gap-2 px-7 sm:px-9 py-3 sm:py-4 bg-[#E9C402] text-[#230F2C] font-semibold rounded-lg hover:brightness-110 transition-all will-change-transform text-sm sm:text-base"
        >
          {service.cta.text}
        </a>
      </div>
    </div>
  );
}

function AboutPanel({ scrollYProgress, snapPoint, sectionSpan }: PanelProps) {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useScrollContent(h2Ref, scrollYProgress, snapPoint, sectionSpan, 0);
  useScrollContent(subRef, scrollYProgress, snapPoint, sectionSpan, 1);
  useScrollContent(ctaRef, scrollYProgress, snapPoint, sectionSpan, 2);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-8"
      style={GRUNGE_BG("#FF733C")}
    >
      <div className="text-center max-w-3xl">
        <h2
          ref={h2Ref}
          className="text-4xl md:text-6xl font-headline text-[#230F2C] mb-6 will-change-transform"
        >
          About Startle Labs
        </h2>
        <p
          ref={subRef}
          className="text-lg text-[#230F2C]/80 mb-8 will-change-transform"
        >
          We&apos;re a branding and creative agency that believes connection isn&apos;t a skill — it&apos;s a choice.
        </p>
        <a
          ref={ctaRef}
          href="/about"
          className="px-8 py-4 bg-[#230F2C] text-white font-medium rounded-full hover:bg-[#230F2C]/80 transition-colors inline-block will-change-transform"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

/**
 * Final scroller panel — mirrors the standalone /contact landing so the
 * homepage flow ends on the same yellow energy it opens with. Big "Yalla."
 * headline, a one-line ask, and a dark-navy CTA pill that hands off to
 * /contact for the full prompt-cards layout. Copy + colours intentionally
 * tight to one breath — the panel is 100vh and the scrollable detail page
 * is right there for anyone who clicks through.
 */
function ContactPanel({ scrollYProgress, snapPoint, sectionSpan }: PanelProps) {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const footerRowRef = useRef<HTMLDivElement>(null);

  useScrollContent(eyebrowRef, scrollYProgress, snapPoint, sectionSpan, 0);
  useScrollContent(h2Ref, scrollYProgress, snapPoint, sectionSpan, 1);
  useScrollContent(subRef, scrollYProgress, snapPoint, sectionSpan, 2);
  useScrollContent(ctaRef, scrollYProgress, snapPoint, sectionSpan, 3);
  useScrollContent(footerRowRef, scrollYProgress, snapPoint, sectionSpan, 4);

  return (
    <div
      className="absolute inset-0 flex flex-col px-8 sm:px-16 md:px-24 lg:px-32 pt-24 sm:pt-32 pb-8 sm:pb-10"
      style={GRUNGE_BG("#E9C402")}
    >
      {/* Main copy — flex-1 + items-center vertically centres this block in
          the remaining space above the footer row, keeping the Yalla.
          headline at the optical centre regardless of viewport height. */}
      <div className="flex-1 flex items-center">
        <div className="max-w-5xl w-full">
          <p
            ref={eyebrowRef}
            className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold mb-6 text-[#230F2C] will-change-transform"
          >
            Get in touch
          </p>
          <h2
            ref={h2Ref}
            className="font-headline text-6xl sm:text-7xl md:text-[8rem] leading-[0.95] tracking-tight mb-8 text-[#230F2C] will-change-transform"
          >
            Yalla
            <span className="font-handwritten text-[#230F2C]">.</span>
          </h2>
          <p
            ref={subRef}
            className="text-lg sm:text-xl max-w-xl leading-relaxed mb-10 text-[#230F2C]/80 will-change-transform"
          >
            Tell us what you&apos;re working on. We answer fast — usually same
            day, always before you start regretting sending it.
          </p>
          <a
            ref={ctaRef}
            href="/contact"
            className="inline-flex items-center gap-3 px-7 sm:px-9 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg bg-[#230F2C] text-[#E9C402] hover:translate-y-[-1px] transition-transform will-change-transform"
          >
            hello@startlelabs.com
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 7h8" />
              <path d="M7 3l4 4-4 4" />
            </svg>
          </a>
        </div>
      </div>

      {/* In-panel footer row — replaces the global Footer on the homepage so
          the scroller terminates cleanly without a separate footer screen.
          Same content the dark Footer had: copyright + social links. */}
      <div
        ref={footerRowRef}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 pt-6 border-t border-[#230F2C]/15 will-change-transform"
      >
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#230F2C]/60">
          © {new Date().getFullYear()} Startle Labs
        </span>
        <div className="flex gap-6 sm:gap-8 text-xs uppercase tracking-[0.2em] font-semibold text-[#230F2C]">
          <a
            href="https://twitter.com/startlelabs"
            className="hover:opacity-60 transition-opacity"
          >
            Twitter
          </a>
          <a
            href="https://www.instagram.com/startle.labs"
            className="hover:opacity-60 transition-opacity"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/startle-labs"
            className="hover:opacity-60 transition-opacity"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Scroll Panel ───────────────────────────────────────────────────── */

/**
 * Haze-style full-width push: sections are always exactly 100vw apart.
 *
 * Math: x = (snapPoint - scrollYProgress) * (totalSections - 1) * 100%
 *
 * This guarantees:
 *   - At its snap point, section is at x = 0% (fully visible)
 *   - Adjacent sections are exactly ±100% away (edge-to-edge, no gap)
 *   - All sections slide in unison — the entire strip moves left together
 */
/**
 * Compute snap points and spans accounting for the hero's extra scroll weight.
 * The hero section occupies (1 + HERO_EXTRA_VH) / totalVHUnits of the total
 * scroll progress, while all other sections each occupy 1 / totalVHUnits.
 */
function useSectionTiming(sectionIndex: number, totalSections: number) {
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  const totalVHUnits = (totalSections - 1) + HERO_EXTRA_VH + HERO_COLLAPSE_VH;
  const heroSpan = (1 + HERO_EXTRA_VH + HERO_COLLAPSE_VH) / totalVHUnits;
  const normalSpan = 1 / totalVHUnits;

  if (sectionIndex === 0) {
    return { snapPoint: 0, sectionSpan: heroSpan };
  }

  // Snap point = end of hero + (sectionIndex - 1) normal spans
  const snapPoint = heroSpan + (sectionIndex - 1) * normalSpan;
  return { snapPoint, sectionSpan: normalSpan };
}

/**
 * Snap easing: double-smoothstep creates a pronounced "groove" at each section.
 * Sections dwell longer at rest, then ramp quickly through the transition,
 * then decelerate into the next groove.
 *
 *   Single smoothstep at x=0.1: 0.028  (barely moving)
 *   Double smoothstep at x=0.1: 0.002  (locked in groove)
 */
function snapEase(t: number): number {
  if (Math.abs(t) >= 1) return t;
  const sign = Math.sign(t);
  const abs = Math.abs(t);
  // First pass: 3x² − 2x³
  const s1 = abs * abs * (3 - 2 * abs);
  // Second pass: amplifies the flat zones and steepens the ramp
  const eased = s1 * s1 * (3 - 2 * s1);
  return sign * eased;
}

function ScrollPanel({
  section,
  totalSections,
  scrollYProgress,
}: {
  section: ScrollSectionData;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { snapPoint, sectionSpan } = useSectionTiming(section.index, totalSections);

  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  const totalVHUnits = (totalSections - 1) + HERO_EXTRA_VH + HERO_COLLAPSE_VH;
  const heroSpan = (1 + HERO_EXTRA_VH + HERO_COLLAPSE_VH) / totalVHUnits;
  const normalSpan = 1 / totalVHUnits;

  // Horizontal push: hero stays put through word cycling AND the resolve/
  // collapse phase, then all sections slide left/right in unison.
  const x = useTransform(
    scrollYProgress,
    (v: number) => {
      if (section.index === 0) {
        // Hero stays pinned until only the final slide-out span remains
        const slideStart = heroSpan - normalSpan;
        if (v <= slideStart) return "0%";
        const postCycle = (v - slideStart) / normalSpan;
        return `${-snapEase(postCycle) * 100}%`;
      }
      // Non-hero: snap easing makes sections settle into and launch from center
      const offset = (v - snapPoint) / normalSpan;
      return `${-snapEase(offset) * 100}%`;
    }
  );

  const panelProps = { scrollYProgress, snapPoint, sectionSpan };

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ x }}
    >
      {section.type === "hero" && <HeroPanel {...panelProps} />}
      {section.type === "service" && section.service && (
        <ServicePanel service={section.service} {...panelProps} />
      )}
      {section.type === "about" && <AboutPanel {...panelProps} />}
      {section.type === "contact" && <ContactPanel {...panelProps} />}
    </motion.div>
  );
}

/* ─── Top Dots + Progress Line (Haze-style) ─────────────────────────── */

/**
 * The progress line runs between dots, tracking scroll position in pace
 * with the user's scrolling. Dots sit on top of the track.
 */
/**
 * Section-specific icons for the top nav indicators.
 * Index maps to: 0=home, 1=brand-strategy, 2=creative-direction, 3=digital-design, 4=about, 5=contact
 * Only non-hero, non-contact sections get icons. Hero and contact are excluded from the nav.
 */
// Single hand-drawn white puck PNG — see SectionNav.PUCK_SRC for the
// sizing / centring rationale. Using one shape ensures every dot in the
// strip is identical in size and vertical position.
const PUCK_SRC = "/images/shapes/Untitled_Artwork%203.png";

/**
 * Icon configuration per scroller section. Service entries carry both the
 * resting glyph (bulb / presentation / mouse) and the on-hover swap target
 * (crown / eye / heart). Kept in sync with SectionNav.SECTION_ICONS.
 *
 * `*MaskY` numbers compensate for hand-drawn icons whose visible bbox
 * isn't centered in the 2048×2048 canvas — see SectionNav for the math.
 */
type IconConfig = {
  defaultSrc?: string;
  hoverSrc?: string;
  defaultNode?: React.ReactNode;
  defaultMaskY?: number;
  hoverMaskY?: number;
  /** When true, the icon waves on hover instead of ticking — used by about. */
  wavesOnHover?: boolean;
  /** Micro-animation played on the hover icon after the register tick settles. */
  hoverAnimation?: "heartbeat" | "blink" | "jiggle";
};

const SECTION_ICONS: Record<string, IconConfig> = {
  // Bulb → Crown — Creative Strategy (brand-strategy). MaskY values are
  // (1 − alpha-weighted centroid Y%) — see SectionNav.SECTION_ICONS for
  // the rationale. Crown's hover Y hand-tuned to 28 because the perceived
  // centre sits above its mass centroid (spires read as "the crown",
  // base reads as the surface it rests on). Eye.png was alpha-cleaned
  // in place earlier (edge noise was painting a square halo on hover).
  "service-1": {
    defaultSrc: "/images/icons/Bulb%203.png",
    hoverSrc: "/images/icons/Crown%20copy.png",
    defaultMaskY: 59.5,
    hoverMaskY: 28,
    hoverAnimation: "jiggle",
  },
  // Presentation → Eye — Pitch Decks (creative-direction)
  "service-2": {
    defaultSrc: "/images/icons/Presentation%202.png",
    hoverSrc: "/images/icons/Eye.png",
    defaultMaskY: 49.9,
    hoverMaskY: 42.4,
    hoverAnimation: "blink",
  },
  // Mouse → Heart — Websites (digital-design)
  "service-3": {
    defaultSrc: "/images/icons/Mouse.png",
    hoverSrc: "/images/icons/Heart%20.png",
    defaultMaskY: 36.4,
    hoverMaskY: 53.8,
    hoverAnimation: "heartbeat",
  },
  // Waving hand — single icon that pivots from the wrist on hover.
  about: {
    defaultSrc: "/images/icons/Hand.png",
    wavesOnHover: true,
    defaultMaskY: 50,
  },
};

/**
 * Two-frame "ticking register" — see SectionNav.RegisterIcon for full
 * rationale. Duplicated here to keep this file self-contained; both copies
 * use the same `group-hover`-driven CSS transition so the swap feels
 * identical on the homepage scroller and every other route. The parent
 * (TopDot's outer div) MUST have `group` on its className.
 */
function RegisterIcon({
  defaultSrc,
  hoverSrc,
  defaultNode,
  defaultMaskY = 50,
  hoverMaskY = 50,
  wavesOnHover = false,
  hoverAnimation,
  size = 22,
}: {
  defaultSrc?: string;
  hoverSrc?: string;
  defaultNode?: React.ReactNode;
  defaultMaskY?: number;
  hoverMaskY?: number;
  wavesOnHover?: boolean;
  hoverAnimation?: "heartbeat" | "blink" | "jiggle";
  size?: number;
}) {
  if (!defaultSrc) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {defaultNode}
      </div>
    );
  }

  // Single-icon variant that waves on hover — pivots from the wrist.
  if (wavesOnHover) {
    return (
      <div
        className="flex items-center justify-center icon-anim-wave"
        style={{ width: size, height: size, transformOrigin: "50% 92%" }}
      >
        <span
          aria-hidden
          style={{
            display: "block",
            width: size,
            height: size,
            backgroundColor: "currentColor",
            WebkitMaskImage: `url(${defaultSrc})`,
            maskImage: `url(${defaultSrc})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            transform: `translateY(${((defaultMaskY - 50) / 100) * size}px)`,
          }}
        />
      </div>
    );
  }

  // Per-cell translateY to centre each icon's bbox in the slot, wrapped
  // in an overflow-hidden clip-box so the offset doesn't bleed into the
  // adjacent cell during the hover tick. See SectionNav.RegisterIcon for
  // the full rationale.
  const innerCellStyle = (src: string, yPct: number, bgColor = "currentColor"): React.CSSProperties => ({
    display: "block",
    width: size,
    height: size,
    backgroundColor: bgColor,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    transform: `translateY(${((yPct - 50) / 100) * size}px)`,
  });
  const wrapStyle: React.CSSProperties = {
    flexShrink: 0,
    width: size,
    height: size,
    overflow: "hidden",
  };

  const bottom = hoverSrc || defaultSrc;
  const bottomY = hoverSrc ? hoverMaskY : defaultMaskY;
  const hoverBg = hoverAnimation
    ? "color-mix(in srgb, currentColor 55%, #000 45%)"
    : "currentColor";

  const animClass =
    hoverAnimation === "heartbeat" ? "icon-anim-heartbeat" :
    hoverAnimation === "blink"     ? "icon-anim-blink" :
    hoverAnimation === "jiggle"    ? "icon-anim-jiggle" :
    "";

  if (!animClass) {
    return (
      <div className="relative overflow-hidden" style={{ width: size, height: size }}>
        <div
          className="flex flex-col will-change-transform transition-transform duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] icon-tick-frame"
          style={{ ["--tick-up" as string]: `-${size}px` }}
        >
          <span aria-hidden style={wrapStyle}>
            <span style={innerCellStyle(defaultSrc, defaultMaskY)} />
          </span>
          <span aria-hidden style={wrapStyle}>
            <span style={innerCellStyle(bottom, bottomY, hoverBg)} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`origin-center ${animClass}`} style={{ width: size, height: size }}>
      <div className="relative overflow-hidden" style={{ width: size, height: size }}>
        <div
          className="flex flex-col will-change-transform transition-transform duration-[320ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] icon-tick-frame"
          style={{ ["--tick-up" as string]: `-${size}px` }}
        >
          <span aria-hidden style={wrapStyle}>
            <span style={innerCellStyle(defaultSrc, defaultMaskY)} />
          </span>
          <span aria-hidden style={wrapStyle}>
            <span style={innerCellStyle(bottom, bottomY, hoverBg)} />
          </span>
        </div>
      </div>
    </div>
  );
}

function TopNav({
  sections,
  scrollYProgress,
  containerRef,
}: {
  sections: ScrollSectionData[];
  scrollYProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Filter to only sections that have icons (services + about)
  const iconSections = sections.filter((s) => Boolean(SECTION_ICONS[s.id]));
  const totalSections = sections.length;

  // Per-segment progress line: each gap between icons gets its own scroll-
  // bound fill. A single absolute line across the strip would leak through
  // the translucent puck fills once stretched past their position; splitting
  // it into per-gap overlays keeps the line physically out of the circles.
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  const totalVHUnits = (totalSections - 1) + HERO_EXTRA_VH + HERO_COLLAPSE_VH;
  const heroSpan = (1 + HERO_EXTRA_VH + HERO_COLLAPSE_VH) / totalVHUnits;
  const normalSpan = 1 / totalVHUnits;
  const snapForIndex = (idx: number) =>
    idx === 0 ? 0 : heroSpan + (idx - 1) * normalSpan;

  // Hidden over the hero (homepage scroll < 80vh); fades in as the user
  // moves into the next panel. Mirrors Topbar's pastHero threshold so the
  // navbar + icon row arrive together. useTransform driven by the same
  // scrollYProgress so we don't need a second window scroll listener.
  const navOpacity = useTransform(scrollYProgress, [heroSpan * 0.7, heroSpan * 0.9], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[64px] sm:h-[76px] z-[55] hidden md:flex items-center px-8 pointer-events-none"
      style={{ opacity: navOpacity }}
    >
      <div className="flex-1 flex items-center justify-center mx-[180px] lg:mx-[220px]">
        <div className="relative flex items-center">
          {iconSections.map((section, i) => {
            // Stagger the entrance — mirrors SectionNav. Tick into place
            // after the Topbar header's own fade-in settles (0.2 delay +
            // 0.6 duration ≈ 0.8s), 70ms apart per item.
            const entranceDelay = 0.55 + i * 0.07;
            return (
              <motion.div
                key={section.id}
                className="flex items-center"
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 28,
                  delay: entranceDelay,
                }}
              >
                {i > 0 && (
                  <ProgressSegment
                    scrollYProgress={scrollYProgress}
                    fromSnap={snapForIndex(iconSections[i - 1].index)}
                    toSnap={snapForIndex(section.index)}
                  />
                )}
                <TopDot
                  index={section.index}
                  label={section.label}
                  totalSections={totalSections}
                  scrollYProgress={scrollYProgress}
                  containerRef={containerRef}
                  iconConfig={SECTION_ICONS[section.id]}
                  shapeUrl={PUCK_SRC}
                  color={
                    section.id === "about"
                      ? "#E85D28"
                      : section.service?.accentColor ?? "#230F2C"
                  }
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Hand-drawn progress segment between two TopDot icons. The dashed PNG
 * (line-dashed.png) is the resting "sketch" base; the thicker solid PNG
 * (line-solid.png) overlays it and reveals left-to-right in pace with the
 * user's scroll position through this gap. Both PNGs are naturally
 * vertical (75×455 / 88×911) so we rotate −90° around centre and let the
 * pre-rotation height match the parent's display width via responsive
 * Tailwind classes.
 *
 * Reveal mechanism: the solid line is rotated −90°, so its pre-rotation
 * BOTTOM edge maps to the display RIGHT edge. To "fill from the left" we
 * clip from the bottom (pre-rotation), which translates to clipping from
 * the right post-rotation. inset(top right bottom left) — we animate the
 * `bottom` value from 100% (fully clipped, nothing visible) → 0% (full
 * line revealed) as scroll progress goes 0 → 1.
 */
function ProgressSegment({
  scrollYProgress,
  fromSnap,
  toSnap,
}: {
  scrollYProgress: MotionValue<number>;
  fromSnap: number;
  toSnap: number;
}) {
  const progress = useTransform(scrollYProgress, (v) =>
    toSnap <= fromSnap
      ? 0
      : Math.max(0, Math.min(1, (v - fromSnap) / (toSnap - fromSnap)))
  );
  const fillClip = useTransform(
    progress,
    (p) => `inset(0 0 ${(1 - p) * 100}% 0)`
  );

  const lineMask = (src: string): React.CSSProperties => ({
    backgroundColor: "#230F2C",
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  });

  return (
    <div className="relative w-12 lg:w-20 xl:w-28 h-3 flex items-center justify-center">
      {/* Dashed base — always visible at low opacity. */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 w-1.5 h-12 lg:h-20 xl:h-28 -translate-x-1/2 -translate-y-1/2 rotate-[-88.2deg]"
        style={{ ...lineMask("/images/accents/line-dashed.png"), opacity: 0.4 }}
      />
      {/* Solid fill — slightly thicker (w-2.5 = 10px). Clip-path reveals
          left-to-right as the user scrolls through this gap. */}
      <motion.span
        aria-hidden
        className="absolute top-1/2 left-1/2 w-2.5 h-12 lg:h-20 xl:h-28 -translate-x-1/2 -translate-y-1/2 rotate-[-88.2deg]"
        style={{
          ...lineMask("/images/accents/line-solid.png"),
          opacity: 0.85,
          clipPath: fillClip,
        }}
      />
    </div>
  );
}

function TopDot({
  index,
  label,
  totalSections,
  scrollYProgress,
  containerRef,
  iconConfig,
  shapeUrl,
  color,
}: {
  index: number;
  label: string;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  iconConfig?: IconConfig;
  shapeUrl: string;
  color: string;
}) {
  const { snapPoint, sectionSpan } = useSectionTiming(index, totalSections);

  // Active-zone span around this dot's snap point. Narrow + symmetric so
  // the previous panel's accent fully resolves to ink before the next
  // panel reaches the viewport — otherwise the strip reads as two icons
  // colored at once during the transition. Tiny post-snap plateau (0.05)
  // keeps the active state visually stable against sub-pixel scroll jitter.
  // For the LAST section (about), `snap` lands at progress 1.0, so we
  // clamp the upper half-zone to <= 1.0 — otherwise framer-motion's WAAPI
  // engine throws "Offsets must be in [0, 1]" on non-monotonic keyframes.
  const lo = Math.max(0, snapPoint - sectionSpan * 0.3);
  const hi = Math.min(1, snapPoint + sectionSpan * 0.3);
  const midHi = Math.min(hi, snapPoint + sectionSpan * 0.05);

  // Scale: swell to 1.4x when this section is active
  const scale = useTransform(
    scrollYProgress,
    [lo, snapPoint, midHi, hi],
    [1, 1.4, 1.4, 1]
  );

  // Color rules — three phases (matches SectionNav):
  //   default:  ink (#230F2C)
  //   active:   section accent — fades in as scroll approaches the snap
  //   hover:    section accent (handled by `whileHover` on the wrapper)
  const iconColor = useTransform(
    scrollYProgress,
    [lo, snapPoint, midHi, hi],
    ["#230F2C", color, color, "#230F2C"]
  );

  // Puck opacity: bumps to 70% when this section is active so the colored
  // icon sits on a clean white circle instead of mixing with the page bg.
  const puckOpacity = useTransform(
    scrollYProgress,
    [lo, snapPoint, midHi, hi],
    [0.3, 0.7, 0.7, 0.3]
  );

  const handleClick = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const totalHeight = container.scrollHeight - window.innerHeight;
    const target = container.offsetTop + totalHeight * snapPoint;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, [containerRef, snapPoint]);

  return (
    <div
      className="relative z-10 group w-14 h-14 flex items-center justify-center cursor-pointer pointer-events-auto"
      onClick={handleClick}
    >
      {/* Hand-drawn white circle puck — fills the 56px hit area so the icon
          inside has comfortable breathing room. Opacity scales with scroll
          proximity so the active dot reads as a clean white backdrop for
          its colored icon. */}
      <motion.img
        src={shapeUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{ opacity: puckOpacity }}
      />

      {/* Hover tooltip — sits below the dot in the brand's headline font
          (Averia Gruesa Libre). Pure CSS group-hover so it fires even if
          React state updates lag the pointer. */}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap font-headline text-sm text-[#230F2C]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {label}
      </span>

      {/* Color rules — three states, same as SectionNav:
            default → ink (#230F2C)
            active  → section accent (driven by `iconColor` motion value
                      which interpolates dark→accent based on scroll
                      proximity to the snap point)
            hover   → section accent (whileHover override)
          The whileHover `color` takes priority while pointer is over the
          dot; once unhovered, framer-motion hands control back to the
          MotionValue and the scroll-driven interpolation resumes. */}
      <motion.div
        className="flex items-center justify-center"
        style={{ scale, color: iconColor }}
        whileHover={{ scale: 1.5, color }}
        transition={{ duration: 0.2 }}
      >
        {iconConfig ? (
          <RegisterIcon
            defaultSrc={iconConfig.defaultSrc}
            hoverSrc={iconConfig.hoverSrc}
            defaultNode={iconConfig.defaultNode}
            defaultMaskY={iconConfig.defaultMaskY}
            hoverMaskY={iconConfig.hoverMaskY}
            wavesOnHover={iconConfig.wavesOnHover}
            hoverAnimation={iconConfig.hoverAnimation}
            size={32}
          />
        ) : (
          <div className="w-[7px] h-[7px] rounded-full bg-[#230F2C]/40" />
        )}
      </motion.div>
    </div>
  );
}

/* ─── Scroll Indicator ───────────────────────────────────────────────── */

function ScrollIndicator({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-[100]"
      style={{ opacity }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="pointer-events-none select-none"
        style={{
          width: 380,
          height: 60,
          marginBottom: -8,
          clipPath: hovered ? "inset(-20px 0% -20px 0)" : "inset(-20px 100% -20px 0)",
          transition: `clip-path ${hovered ? "0.8s ease-in-out" : "0s"}`,
        }}
        aria-hidden
      >
        <svg
          width="380"
          height="60"
          viewBox="0 -10 380 60"
          style={{ overflow: "visible" }}
        >
          <defs>
            <path id="scroll-arc" d="M 15,16 A 600,600 0 0,1 365,16" />
          </defs>
          <text
            fill="#000000"
            fontSize="30"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-pecita), cursive" }}
          >
            <textPath href="#scroll-arc" startOffset="50%">
              {"Scroll & keep on s"}<tspan dx="-1">c</tspan><tspan dx="-4">r</tspan>{"olling!"}
            </textPath>
          </text>
        </svg>
      </div>
      <motion.div
        className="w-10 h-16 rounded-full border-2 border-[#230F2C]/40 flex items-center justify-center cursor-pointer"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Hand-drawn arrow — `arrow-3.png` is naturally a horizontal
            arrow pointing right (565×147, aspect ~3.84:1). We mask it
            with the brand ink colour, preserve its native aspect, and
            rotate 90° clockwise so it points down. Sized at 28×7.28 so
            it fills the oval comfortably without distortion. */}
        <span
          aria-hidden
          className="block rotate-90"
          style={{
            width: 28,
            height: (28 * 147) / 565,
            backgroundColor: "#230F2C",
            WebkitMaskImage: "url(/images/accents/arrow-3.png)",
            maskImage: "url(/images/accents/arrow-3.png)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Auto-snap at rest: if the user stops scrolling within a threshold of a
 * section boundary, smoothly scroll to the nearest snap point.
 *
 * The 15% threshold means: if the eased position of a section is within
 * 15% of fully visible (either entering or leaving), we snap it into view.
 */
function useScrollSnap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  scrollYProgress: MotionValue<number>,
  totalSections: number
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const SNAP_THRESHOLD = 0.15; // 15% of a section span
    const DEBOUNCE_MS = 150; // ms after scroll stops before snapping

    // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  const totalVHUnits = (totalSections - 1) + HERO_EXTRA_VH + HERO_COLLAPSE_VH;
    const heroSpan = (1 + HERO_EXTRA_VH + HERO_COLLAPSE_VH) / totalVHUnits;
    const normalSpan = 1 / totalVHUnits;

    // Build snap points array
    const snapPoints: number[] = [0]; // hero at 0
    for (let i = 1; i < totalSections; i++) {
      snapPoints.push(heroSpan + (i - 1) * normalSpan);
    }

    const handleScrollEnd = () => {
      const progress = scrollYProgress.get();

      // Find which section boundary we're nearest
      let bestTarget = 0;
      let bestDist = Infinity;

      for (const sp of snapPoints) {
        const dist = Math.abs(progress - sp);
        if (dist < bestDist) {
          bestDist = dist;
          bestTarget = sp;
        }
      }

      // Determine which span applies for this target
      const targetIndex = snapPoints.indexOf(bestTarget);
      const span = targetIndex === 0 ? heroSpan : normalSpan;

      // Only snap if we're within the threshold of the edge (not already centered)
      // "Within threshold" means: we're close to a snap point but not at it
      const normalizedDist = bestDist / span;
      if (normalizedDist > 0.01 && normalizedDist < SNAP_THRESHOLD) {
        const totalHeight = container.scrollHeight - window.innerHeight;
        const targetScroll = container.offsetTop + totalHeight * bestTarget;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    };

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScrollEnd, DEBOUNCE_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [containerRef, scrollYProgress, totalSections]);
}

/* ─── Main Component ─────────────────────────────────────────────────── */

interface FullscreenScrollerProps {
  services: Service[];
}

/**
 * Extra scroll VHs allocated to the hero section so that all scroll-wheel words
 * have time to cycle before the first service section slides in.
 */
const HERO_EXTRA_VH = 2; // word-cycling phase
/**
 * Resolve/collapse phase that sits between word cycling and the horizontal
 * slide-out. During this window the scroll-word column shrinks and the
 * remaining "Creativity that inspires." headline settles into its final form.
 */
const HERO_COLLAPSE_VH = 0.6;

export function FullscreenScroller({ services }: FullscreenScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroller panels: hero → 3 service teasers → about → contact. The
  // contact panel mirrors the standalone /contact landing — yellow bg,
  // big "Yalla." headline, dark-navy CTA pill — so the homepage flow
  // finishes with the same colour energy it started with.
  const sections: ScrollSectionData[] = [
    { id: "hero", type: "hero", label: "Home", index: 0 },
    ...services.map((service, i) => ({
      id: `service-${i + 1}`,
      type: "service" as const,
      // Use the short navTooltip for the topbar label; falls back to title.
      label: service.navTooltip ?? service.title,
      service,
      index: i + 1,
    })),
    { id: "about", type: "about", label: "About", index: services.length + 1 },
    { id: "contact", type: "contact", label: "Contact", index: services.length + 2 },
  ];

  const totalSections = sections.length;

  // Total scroll height: hero gets extra VHs so words can fully cycle
  const totalVH = totalSections * 100 + (HERO_EXTRA_VH + HERO_COLLAPSE_VH) * 100;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Auto-snap to nearest section when scroll stops near a boundary
  useScrollSnap(containerRef, scrollYProgress, totalSections);

  // Deep-link restore: on mount, jump to a specific section if either
  //   - the URL has a hash matching a service slug (`/#creative-direction`), OR
  //   - sessionStorage has a `pending-section` key set by SectionNav's click
  //     handler (Next.js 15 App Router strips the hash during client-side
  //     cross-route navigation, so the sessionStorage channel is the
  //     reliable path for intra-site nav; hash still works for external
  //     deep-links, bookmarks, and the ✕ button on service pages which does
  //     a full-ish nav via the logo Link).
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const hashSlug = window.location.hash.replace(/^#/, "");
    const pendingSlug = sessionStorage.getItem("pending-section") || "";
    const slug = hashSlug || pendingSlug;
    // Always clear the pending marker — even if nothing matches, we don't
    // want it lingering and triggering a jump on a later accidental refresh.
    sessionStorage.removeItem("pending-section");
    if (!slug) return;

    // "about" isn't a service, but it has its own panel in the scroller.
    const target = sections.find((s) => {
      if (s.type === "service") return s.service?.slug === slug;
      return s.id === slug; // e.g. "about"
    });
    if (!target) return;

    // Compute the target section's snap point using the same math as
    // useSectionTiming so they stay in sync.
    // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  // -1 unit so the LAST panel's snap point lands exactly at scrollYProgress
  // = 1.0. Without this, the user could keep scrolling past the contact
  // panel and watch it slide off-screen, exposing the dark sticky bg —
  // i.e. the "black screen after contact" the user kept hitting.
  const totalVHUnits = (totalSections - 1) + HERO_EXTRA_VH + HERO_COLLAPSE_VH;
    const heroSpan = (1 + HERO_EXTRA_VH + HERO_COLLAPSE_VH) / totalVHUnits;
    const normalSpan = 1 / totalVHUnits;
    const snapPoint =
      target.index === 0 ? 0 : heroSpan + (target.index - 1) * normalSpan;

    const container = containerRef.current;
    if (!container) return;

    const scrollRange = container.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: container.offsetTop + scrollRange * snapPoint,
      behavior: "instant" as ScrollBehavior,
    });
    // Clear the hash so refreshes don't re-trigger the jump.
    if (hashSlug) {
      history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        data-scroller-sections={totalSections}
        style={{ height: `${totalVH}vh` }}
        className="relative"
      >
        {/* Sticky viewport — pins to screen while user scrolls */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a]">
          {sections.map((section) => (
            <ScrollPanel
              key={section.id}
              section={section}
              totalSections={totalSections}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* Haze-style top nav: dots + progress line between them */}
      <TopNav sections={sections} scrollYProgress={scrollYProgress} containerRef={containerRef} />
    </>
  );
}
