"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { services, type Service } from "@/data/services";
import { TornEdge } from "@/components/ui/TornEdge";
import { SectionBackground } from "@/components/ui/SectionBackground";

/**
 * Figma-exported section backgrounds. When a new section's SVG lands in
 * /public/images/backgrounds/, copy the first path's `d` attribute here and
 * the component pulls the exact hand-drawn shape from Figma.
 */
const FIGMA_BG = {
  stats: {
    path:
      "M560 20.4636L-24.5 0L-89 412L788 391.536L1501 344.698L1459 64.1192L1016 20.4636H560Z",
    viewBox: "0 0 1440 412",
  },
  deliverables: {
    path: "M0 25.6051L721.5 0H1440V949.567L445 967L0 949.567V25.6051Z",
    viewBox: "0 0 1440 967",
  },
  // Page-tear shape (torn top + torn bottom) used for the mid-page quote.
  // Source: /public/images/backgrounds/Quote.svg — second path (the filled
  // polygon). The SVG also has baked-in text glyphs we don't want, so we
  // only copy the shape path here.
  // Visual breakdown of the path (in internal coords, viewBox 0 0 1440 656):
  //   - torn TOP edge at y≈126–168 (≈19–26% from top of viewBox)
  //   - torn BOTTOM edge at y≈490–539 (≈75–82% from top)
  // So when stretched to a section's bounds, the top 19% and bottom 18% of
  // the section are TRANSPARENT — sections above/below show through. We
  // negative-margin this section up to overlap the dark deliverables
  // section so the top strip reads as "dark tearing into accent".
  quote: {
    path: "M-1 126L500 168.996L1007 126L1440 150V539L1007 490.368L-1 539V126Z",
    viewBox: "0 0 1440 656",
  },
  // The Figma Principles export has a blue polygon (service accent) sitting
  // on top of a dark navy extension. We render just the blue shape here; the
  // dark continuation lives in the closing CTA section below.
  principles: {
    path:
      "M1440 147L949.5 235.5L432 187L-1 259.439V1433.55L432 1524.5L1005.5 1584.5L1440 1433.55V147Z",
    viewBox: "0 147 1440 1437",
  },
  closingCta: {
    path: "M0 0H1440V1291L957 1267L754.5 1250L301.5 1307L0 1291V0Z",
    viewBox: "0 0 1440 1307",
  },
  otherServices: {
    path:
      "M1457.5 63.415V503.818L964.663 495.531L755.758 489.596L755.368 489.599L288.061 509.497L-17.5 504.01V63.6426L329.236 36.5195L991.706 5.51562L1457.5 63.415Z",
    viewBox: "0 0 1440 515",
  },
};

/**
 * Services detail page — scaffolded to match the Figma wireframe (802:4390).
 *
 * Color system (from Figma):
 *   - Page bg:        #f2f1fa  (light lavender)
 *   - Header + Hero:  service.accentColor
 *   - Stats band:     #e7e6f2  (slightly deeper lavender)
 *   - Mid-page quote: service.accentColor
 *   - Deliverables:   #1d0b35  (deep purple)
 *   - Principles:     #1d0b35  (same deep purple)
 *   - Closing CTA:    continues #1d0b35, yellow button #efce25
 *   - Cross-sell:     related service colors
 *
 * Text colors flip based on background:
 *   - On light lavender → dark #230F2C
 *   - On service accent / dark → white
 *
 * TODO(polish):
 *   - Real hand-drawn icons with hover reveal (DrawingIcon component)
 *   - Yellow footer band (#e9c402) from Figma — currently the global Footer renders
 *   - Mobile responsive pass
 *   - Wire closing intro copy (placeholder right now)
 */

const DARK = "#1d0b35";
const INK = "#230F2C";
const PAGE_BG = "#f2f1fa";
const STATS_BG = "#e7e6f2";
const YELLOW = "#efce25";

/* Cross-sell banner art — one pair (idle / hover) per service slug.
   Loaded as <img> tags rather than CSS bg so we can swap them with a
   simple group-hover opacity crossfade. */
const CROSS_SELL_BANNERS: Record<string, { idle: string; hover: string }> = {
  "brand-strategy": {
    idle: "/images/banners/Branding%20Idle.svg",
    hover: "/images/banners/Branding%20Hover.svg",
  },
  "creative-direction": {
    idle: "/images/banners/Presentations%20Idle.png",
    hover: "/images/banners/Presentations%20Hover.png",
  },
  "digital-design": {
    idle: "/images/banners/Websites%20Idle.png",
    hover: "/images/banners/Websites%20Hover.png",
  },
};

const GRUNGE: CSSProperties = {
  backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundBlendMode: "overlay",
};

/**
 * Torn-edge paths lifted straight from the Figma section-background SVGs in
 * /public/images/backgrounds/. Each path describes the "tear" boundary
 * between two consecutive sections.
 *
 * Extraction method: open the SVG in the backgrounds folder, locate the
 * section's main filled polygon, isolate just the vertices that form the
 * torn edge (top or bottom), subtract the uppermost y so the path starts
 * at y=0, and close the shape along the flat merging edge.
 *
 * Each entry is rendered by TornEdge with `customPath` + `viewBoxHeight`,
 * which stretches the Figma shape to full section width while preserving
 * Figma's native vertical proportions.
 */
const FIGMA_TORN = {
  // Stats.svg top edge — raw points (-24.5, 0), (560, 20.46), (1016, 20.46),
  // (1459, 64.12). Clamped/interpolated to the 0-1440 viewport: at x=0 y≈1,
  // at x=1440 y≈62. Strip height = 64px (full span of the y-range from the
  // top-left corner down to the far-right corner). The shape is a gentle
  // tilt — flat across the middle, rising slightly on the far-left, dipping
  // progressively on the right — not a jagged tear. This makes the stats
  // band read like a loosely-placed paper rectangle rather than a perfect
  // horizontal strip.
  statsTop: {
    path: "M0,1 L560,20 L1016,20 L1440,62 L1440,64 L0,64 Z",
    viewBoxHeight: 64,
  },
  // Deliverables.svg TOP edge — the real Figma polygon path, not a
  // hand-drawn substitute. Points: (0, 25.60), (721.5, 0), (1440, 0).
  // The left half of the seam tilts down from y=0 at the mid to y=25.60
  // on the far left; the right half is flat at y=0. So the dark band
  // starts flush-with-the-top on the right half and dips 25.60px down
  // on the left. Strip height 26px (rounded up from 25.60 so the flat
  // bottom has room to merge cleanly with the section below).
  deliverablesTop: {
    path: "M0,25.6 L721.5,0 L1440,0 L1440,26 L0,26 Z",
    viewBoxHeight: 26,
  },
  // cta.svg bottom edge — points (0, 1291), (301.5, 1307), (754.5, 1250),
  // (957, 1267), (1440, 1291). Normalised (subtract 1250) → (0, 41),
  // (301.5, 57), (754.5, 0), (957, 17), (1440, 41). Strip height 57px.
  // Rendered at the TOP of the cross-sell section, painted PAGE_BG, so
  // the lavender tears UP into the dark closing-CTA. The shape has one
  // dominant peak left-of-center (x=754.5) and a shallower secondary
  // peak right-of-center (x=957) — matches the Figma closing seam.
  crossSellTop: {
    path:
      "M0,41 L301.5,57 L754.5,0 L957,17 L1440,41 L1440,57 L0,57 Z",
    viewBoxHeight: 57,
  },
  // Quote.svg top edge — points (-1,126), (500,169), (1007,126), (1440,150).
  // Subtract 126 → strip height 43px. The blue accent quote section's color
  // tears UP into the dark deliverables above.
  quoteTop: {
    path: "M0,0 L500,43 L1007,0 L1440,24 L1440,43 L0,43 Z",
    viewBoxHeight: 43,
  },
  // Quote.svg bottom edge — points (-1,539), (1007,490), (1440,539).
  // Subtract 490 → strip height 49px. The light PAGE_BG projects section
  // pokes UP into the blue quote above as a single central peak.
  projectsTop: {
    path: "M0,49 L1007,0 L1440,49 Z",
    viewBoxHeight: 49,
  },
  // Principles.svg BLUE polygon top edge — points (-1,259.44), (432,187),
  // (949.5,235.5), (1440,147). Subtract 147 → strip height 112px. The blue
  // accent principles section tears UP into the light projects above.
  principlesTop: {
    path: "M0,112 L432,40 L949.5,88.5 L1440,0 L1440,112 Z",
    viewBoxHeight: 112,
  },
  // Principles.svg BLUE polygon BOTTOM edge — points (-1,1433.55),
  // (432,1524.5), (1005.5,1584.5), (1440,1433.55). Subtract 1433.55 → strip
  // height 151px. The dark closing-CTA section fills BELOW this torn line
  // (with DARK color), so the blue above appears to tear DOWN into dark.
  closingCtaTop: {
    path: "M0,0 L432,91 L1005.5,151 L1440,0 L1440,151 L0,151 Z",
    viewBoxHeight: 151,
  },
} as const;

interface Props {
  service: Service;
}

/**
 * Break long intro copy into two roughly-balanced paragraphs at a natural
 * sentence boundary near the middle, so the hero body reads as two stacked
 * blocks like the Figma wireframe instead of one long run-on.
 */
function splitIntoParagraphs(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length < 2) return [text];
  const mid = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, mid).join(" ").trim(), sentences.slice(mid).join(" ").trim()];
}

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.2, 0.65, 0.3, 1] as const },
  }),
};

/* ─── Stat value animations ──────────────────────────────────────────────── */

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!?@#$%&*";

// Numeric values count up from 0; text values scramble-decrypt character by character.
function CountingValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const stripped = value.replace(/,/g, "");
    const numericMatch = stripped.match(/^([\d.]+)([+xX%]*)$/);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        if (numericMatch) {
          // ── counting animation ──
          const target = parseFloat(numericMatch[1]);
          const suffix = numericMatch[2] ?? "";
          const useCommas = /,/.test(value);
          const isFloat = value.includes(".");
          const format = (n: number) => {
            const rounded = isFloat ? n : Math.round(n);
            return (useCommas ? rounded.toLocaleString("en-US") : String(rounded)) + suffix;
          };
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(format(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setDisplay(format(target));
          };
          requestAnimationFrame(tick);
        } else {
          // ── decrypted text animation ──
          // Each character goes through ~8 random scrambles before snapping
          // to the real letter, revealing left-to-right.
          const chars = value.split("");
          const framesPerChar = 8;
          const totalFrames = chars.length * framesPerChar;
          let frame = 0;
          const interval = setInterval(() => {
            const revealedUpTo = Math.floor(frame / framesPerChar);
            setDisplay(
              chars
                .map((ch, i) => {
                  if (i < revealedUpTo) return ch;
                  if (ch === " " || ch === "\n") return ch;
                  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                })
                .join("")
            );
            frame++;
            if (frame > totalFrames) {
              clearInterval(interval);
              setDisplay(value);
            }
          }, 40);
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function ServicePageTemplate({ service }: Props) {
  const accent = service.accentColor;
  const related = service.relatedServices
    .map((slug) => services[slug])
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: PAGE_BG, color: INK }}>
      {/* ─── 1. Hero ──────────────────────────────────────────────────
          Matches Figma: short tagline + body copy on the left; yellow
          splash with service illustration layered on top bleeding in
          from the right. The colored Topbar above merges visually via
          the torn edge. */}
      <section
        className="relative pt-28 sm:pt-36 pb-44 sm:pb-52 px-8 sm:px-16 md:px-24 lg:px-32 overflow-hidden min-h-[620px] md:min-h-[680px]"
        style={{ backgroundColor: PAGE_BG, color: INK }}
      >
        {/* Jagged transition from the colored Topbar into this white hero */}
        <TornEdge color={accent} variant={2} pointing="down" height={50} grunge />

        {/* Yellow splash + service figure composition.
            CRITICAL: this block must look identical at every viewport width,
            so the composition is locked to the SVG's native aspect ratio
            (786 × 690, ≈1.139). Anchoring it to `bottom-0 right-0` keeps its
            bottom edge aligned with the hero's bottom edge — i.e. the exact
            point where the stats polygon below overlaps via its negative
            margin — regardless of the hero's overall height. The figure
            inside is positioned with percentages that hit the same spot
            inside the splash at every scale, so the stats polygon's
            diagonal always cuts through him at the same relative height.
            Do not revert to `h-full` / `object-fill` — those distort the
            splash's shape as the viewport changes. */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[65%] max-w-[820px] select-none"
          style={{ aspectRatio: "786 / 690" }}
        >
          <img
            src="/images/backgrounds/hero-splash-yellow.svg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full"
          />
          {service.ctaArt && (
            // Wrapper sized narrower than the splash so the figure reads as
            // sitting "inside" the yellow. Bottom reaches the splash's
            // bottom so the stats polygon (overlapping via negative margin)
            // crops the figure's feet visually — the next section "stands
            // on top of" him. Since the splash is aspect-locked, these
            // percentages now resolve to the same look at every width.
            <div className="absolute top-[2%] bottom-0 right-[2%] w-[72%]">
              <img
                src={service.ctaArt}
                alt=""
                aria-hidden
                className="w-full h-full object-contain object-bottom"
              />
            </div>
          )}
        </div>

        {/* Left copy column — hard-capped so it can never collide with the
            splash on the right, regardless of viewport width. */}
        <motion.div
          className="relative z-10 w-full max-w-[440px] pr-4"
          initial="hidden"
          animate="visible"
          variants={rise}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-[44px] font-headline leading-[1.05] tracking-tight"
            custom={0}
            variants={rise}
          >
            {service.heroTagline}
          </motion.h1>

          {/* Body split into 2 short paragraphs — matches Figma rhythm */}
          <motion.div
            className="mt-6 space-y-5 text-sm sm:text-base leading-relaxed opacity-85"
            custom={1}
            variants={rise}
          >
            {splitIntoParagraphs(service.heroIntro).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Intro paragraph was merged into the hero above (matches Figma). */}

      {/* ─── 2. Stats band ──────────────────────────────────────────
          Solid full-bleed STATS_BG with a hand-drawn tilt at the TOP
          lifted from Stats.svg (see FIGMA_TORN.statsTop for the raw
          points). The polygon gives the band a slightly rotated
          "pasted-on paper" feel rather than a hard horizontal line — its
          fill color appears to extend UP into the hero's PAGE_BG, at a
          gentle downward slope to the right. The bottom of the section
          meets the deliverables band at a flat seam; the tilt at the
          deliverables polygon's own TOP handles the visual offset
          between the two bands. */}
      {service.stats.length > 0 && (
        <section
          // No z-index: source-order stacking means every later section
          // naturally paints above the earlier one, so each section's
          // torn-edge strip (which extends above its own top into the
          // prior section's space) is automatically on top.
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-24 sm:pt-28 pb-24 sm:pb-28"
          style={{ backgroundColor: STATS_BG, ...GRUNGE }}
        >
          <TornEdge
            color={STATS_BG}
            customPath={FIGMA_TORN.statsTop.path}
            viewBoxHeight={FIGMA_TORN.statsTop.viewBoxHeight}
            grunge
          />
          <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {service.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div
                  className="text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold mb-3"
                  style={{ color: accent }}
                >
                  {stat.label}
                </div>
                <div className="text-2xl sm:text-[28px] md:text-[30px] font-headline leading-[1.2] whitespace-pre-line">
                  <CountingValue value={stat.value} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. Deliverables (solid dark bg) ─────────────────────────
          Full-bleed DARK background with the Figma-exact top-edge shape
          from Deliverables.svg (a 26px diagonal wedge: flat on the right
          half, tilting down on the left). The dark starts flush with
          the stats' bottom on the right and steps down ~26px on the
          left, creating a simple "loose paper" tilt rather than a
          jagged tear.

          Layout: one enlarged "featured" deliverable sits in the top-
          LEFT, spanning 2 cols × 2 rows; two more stack in the right
          column; the final three run across the bottom row. */}
      <section
        id="deliverables"
        className="relative px-8 sm:px-16 md:px-24 lg:px-32 py-28 sm:py-32"
        style={{ backgroundColor: service.deliverablesBg ?? DARK, color: "#ffffff" }}
      >
        <TornEdge
          color={service.deliverablesBg ?? DARK}
          customPath={FIGMA_TORN.deliverablesTop.path}
          viewBoxHeight={FIGMA_TORN.deliverablesTop.viewBoxHeight}
        />
        {/* Asymmetric 3x3 grid: featured deliverable anchors the top-LEFT,
            spanning 2 cols × 2 rows; the next two items fill the top-right
            column (stacked), and the final three run across the bottom row.
            Exactly matches the reference layout.

            Placement (CSS Grid auto-flow does the heavy lifting once the
            featured takes col-span-2 row-span-2):

              ┌───────────────┬───────┐
              │               │ item2 │
              │   FEATURED    ├───────┤
              │   (2×2)       │ item3 │
              ├───────┬───────┼───────┤
              │ item4 │ item5 │ item6 │
              └───────┴───────┴───────┘

            On mobile we drop to 2 cols: featured spans both at the top,
            then items flow as a 2-wide stack below. */}
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 md:gap-x-10 items-center">
          {service.deliverables[0] && (
            <motion.div
              className="col-span-2 sm:row-span-2 flex flex-col items-center text-center gap-5 sm:pr-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* TODO: swap for <DrawingIcon> when hand-drawn hover lands */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[340px] md:h-[340px]">
                <img
                  src={service.deliverables[0].icon}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-headline text-white">
                {service.deliverables[0].name}
              </div>
            </motion.div>
          )}

          {service.deliverables.slice(1).map((d, i) => (
            <motion.div
              key={d.name}
              className="flex flex-col items-center text-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                <img
                  src={d.icon}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white/90">
                {d.name}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 5. Mid-page pull-quote (solid accent bg) ────────────────
          Full-bleed ACCENT background. A TornEdge at the TOP of this
          section paints ACCENT teeth tearing UP into the dark
          deliverables above — one clean, single boundary. The BOTTOM
          boundary is handled by the ProjectsCarousel's own TornEdge,
          which paints PAGE_BG teeth tearing UP into this accent — again
          one clean seam. No polygon, no transparent strips, no PAGE_BG
          peeking through.

          `overflow-visible` lets the two yellow quote-mark flourishes
          extend OUTSIDE this section's box and straddle the torn edges
          (top mark bridges the DARK→ACCENT tear; bottom mark bridges
          the ACCENT→PAGE_BG tear). */}
      <section
        className="relative px-8 sm:px-16 md:px-24 lg:px-32 py-28 sm:py-32 overflow-visible"
        style={{ backgroundColor: accent, color: "#ffffff", ...GRUNGE }}
      >
        <TornEdge
          color={accent}
          customPath={FIGMA_TORN.quoteTop.path}
          viewBoxHeight={FIGMA_TORN.quoteTop.viewBoxHeight}
          grunge
        />

        {/* Opening yellow hand-drawn quote mark — top-left, centered
            vertically on the top torn edge (half in dark deliverables,
            half in accent quote). The base quote2.svg has a built-in
            `rotate(180)`, so the naked image renders "opening" style.
            We add `scale-x-[-1]` to mirror it horizontally — the design
            wants each mark flipped from its previous orientation so
            they read as a proper opening/closing pair facing opposite
            directions.

            Positioning: the TornEdge is 40px tall sitting above the
            section, so the tear line hovers ~20px above this section's
            top. For a ~192px-tall mark to center on that tear line we
            need `top ≈ -(20 + 192/2) ≈ -116px`. We use `-top-28` (112px)
            and `md:-top-32` (128px) for the wider sizes — close enough
            that ~50% of the mark sits on each side of the tear. */}
        <img
          src="/images/icons/quote2.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-4 sm:left-10 md:left-16 -top-24 sm:-top-28 md:-top-32 w-32 sm:w-40 md:w-52 h-auto select-none z-[2] scale-x-[-1]"
        />
        {/* Closing yellow hand-drawn quote mark — bottom-right, centered
            vertically on the BOTTOM torn edge (which is the ProjectsCarousel's
            TornEdge tearing UP into this accent). Same 40px-above-boundary
            math in reverse: bottom offset ≈ -(mark_height/2 - tear_height/2).
            With `rotate-180 scale-x-[-1]` the built-in SVG rotation is
            cancelled and THEN horizontally flipped, giving the mirror-image
            partner to the top mark. */}
        <img
          src="/images/icons/quote2.svg"
          alt=""
          aria-hidden
          // The bottom torn edge (belonging to the NEXT section) sits INSIDE
          // this section's last 40px, so its midpoint is ~20px above
          // section_bottom. Pulling the mark up with a smaller -bottom offset
          // keeps it straddling the torn line rather than drifting into the
          // projects section below.
          className="pointer-events-none absolute right-4 sm:right-10 md:right-16 -bottom-12 sm:-bottom-16 md:-bottom-20 w-32 sm:w-40 md:w-52 h-auto select-none z-[2] rotate-180 scale-x-[-1]"
        />

        <motion.blockquote
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-4xl sm:text-5xl md:text-6xl font-headline italic leading-[1.15]">
            {service.quote.text}
          </p>
          {/* Attribution uses the Pecita handwritten font (see
              `.font-handwritten` in globals.css) — matches the casual,
              hand-drawn vibe of the service pages. Sized larger than a
              normal footer caption so it reads as signature-like. */}
          <footer className="mt-8 font-handwritten text-2xl sm:text-3xl md:text-4xl text-white leading-none">
            — {service.quote.attribution}
          </footer>
        </motion.blockquote>
      </section>

      {/* ─── 6. Selected Projects / Testimonials — carousel ──────────
          One testimonial visible at a time; left/right arrows page through,
          dots show position. Uses Framer Motion's AnimatePresence so the
          outgoing slide fades out as the incoming slide fades/slides in.
          The slide direction is tracked so the motion matches the arrow
          pressed (right arrow → new slide enters from right, etc). */}
      <ProjectsCarousel
        testimonials={service.testimonials}
        accent={accent}
        pageBg={PAGE_BG}
      />

      {/* ─── 7. Principles (solid service-accent bg) ────────────────
          Full-bleed ACCENT background with a TornEdge at top that tears
          UP into the PAGE_BG of the projects carousel above. Replaces
          the earlier polygon-with-transparent-strips approach. */}
      <section
        className="relative px-8 sm:px-16 md:px-24 lg:px-32 py-24 pb-40"
        style={{ backgroundColor: accent, color: "#ffffff", ...GRUNGE }}
      >
        <TornEdge
          color={accent}
          customPath={FIGMA_TORN.principlesTop.path}
          viewBoxHeight={FIGMA_TORN.principlesTop.viewBoxHeight}
          grunge
        />
        <div className="relative z-10">
          <div className="max-w-2xl mb-16 mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline leading-tight text-white mb-4">
              Principles of the {service.title === "Pitch Decks" ? "Pitch" : service.title}.
            </h2>
            <p className="text-white/80 leading-relaxed">
              {/* TODO: replace with real principles intro copy */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14 max-w-5xl mx-auto">
            {service.principles.map((p, i) => (
              <motion.li
                key={p.title}
                className="flex flex-col items-start text-left"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-5xl sm:text-6xl font-headline leading-none text-white/30 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-headline text-white leading-tight">
                    {p.title}.
                  </h3>
                </div>
                <p className="text-white/75 leading-relaxed text-sm sm:text-base">
                  {p.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 8. Closing CTA — "Curiosity piqued?" layout ──────────────
          Solid DARK bg with a TornEdge at top tearing UP into the accent
          Principles section above. Matches Figma: dark background, hand-
          drawn reversed hero artwork on the left, short title + body +
          yellow pill button on the right. */}
      <section
        className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-12 pb-24 overflow-visible"
        style={{ backgroundColor: DARK, color: "#ffffff" }}
      >
        <TornEdge
          color={DARK}
          customPath={FIGMA_TORN.closingCtaTop.path}
          viewBoxHeight={FIGMA_TORN.closingCtaTop.viewBoxHeight}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline mb-6 text-white">
            {service.closingCta.title}
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-md">
            {service.closingCta.body}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-7 py-4 font-semibold rounded-full hover:brightness-105 transition-all"
            style={{ backgroundColor: YELLOW, color: INK }}
          >
            {service.closingCta.button}
            <svg
              width="20"
              height="12"
              viewBox="0 0 20 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 6h18M14 1l5 5-5 5" />
            </svg>
          </a>
        </div>
      </section>

      {/* ─── 9. Cross-sell cards ─────────────────────────────────────
          PAGE_BG with a torn top edge lifted from cta.svg — the lavender
          tears UP into the dark closing-CTA above in an undulating
          shape: shallow tear on the far left, a dip (valley) near
          x=20%, a dominant peak around x=52%, smaller peak at x=66%,
          then back to shallow on the right. */}
      {related.length > 0 && (
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 py-24"
          style={{ backgroundColor: PAGE_BG }}
        >
          <TornEdge
            color={PAGE_BG}
            customPath={FIGMA_TORN.crossSellTop.path}
            viewBoxHeight={FIGMA_TORN.crossSellTop.viewBoxHeight}
          />
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] opacity-70 mb-8">
            Also from Startle Labs
          </p>
          <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            {related.map((r) => {
              const banner = CROSS_SELL_BANNERS[r.slug];
              if (!banner) return null;
              return (
                <Link
                  key={r.slug}
                  href={`/services/${r.slug}`}
                  className="group relative block overflow-hidden transition-transform hover:-translate-y-1"
                  aria-label={`${r.title} — ${r.cta.text}`}
                >
                  {/* Idle banner art — fades out on hover. */}
                  <img
                    src={banner.idle}
                    alt=""
                    aria-hidden
                    className="block w-full h-auto select-none pointer-events-none transition-opacity duration-200 group-hover:opacity-0"
                  />
                  {/* Hover banner art — pinned to the same box, fades in. */}
                  <img
                    src={banner.hover}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                  {/* Text + squiggle arrow overlay, anchored to the right
                      half of the banner where the figure leaves whitespace. */}
                  <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[44%] max-w-md text-white">
                    <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl leading-tight whitespace-pre-line">
                      {r.headline}
                    </h3>
                    {/* Hand-drawn squiggle arrow rendered via CSS mask so we
                        can recolor it: white at rest, yellow on hover, with a
                        continuous left-shift wiggle while hovered. */}
                    <span
                      aria-hidden
                      className="banner-arrow mt-5 block h-6 sm:h-8 md:h-10 w-40 sm:w-56 md:w-72"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Global Footer renders from the root layout */}
    </div>
  );
}

/* ─── Selected Projects carousel ────────────────────────────────────────
   Kept inline in this file since it only exists inside ServicePageTemplate
   and shares styling tokens (PAGE_BG, accent) with the parent. If another
   page ever needs it, extract to components/ui/Carousel.tsx. */

interface CarouselProps {
  testimonials: Service["testimonials"];
  accent: string;
  pageBg: string;
}

function ProjectsCarousel({ testimonials, accent, pageBg }: CarouselProps) {
  const [[idx, direction], setState] = useState<[number, number]>([0, 0]);
  const count = testimonials.length;
  const hasMultiple = count > 1;

  // Wrap negative/overflow indices back into [0, count) so infinite paging works
  const activeIdx = ((idx % count) + count) % count;
  const active = testimonials[activeIdx];

  const paginate = (delta: number) => setState([idx + delta, delta]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section
      className="relative px-8 sm:px-16 md:px-24 lg:px-32 py-24"
      style={{ backgroundColor: pageBg }}
    >
      <TornEdge
        color={pageBg}
        customPath={FIGMA_TORN.projectsTop.path}
        viewBoxHeight={FIGMA_TORN.projectsTop.viewBoxHeight}
      />
      <h2 className="text-center font-headline text-4xl sm:text-5xl md:text-6xl mb-16">
        Selected Projects.
      </h2>

      <div className="relative max-w-5xl mx-auto">
        {/* Slide viewport — overflow hidden so in/out slides are clipped */}
        <div className="relative overflow-hidden px-2 sm:px-10 md:px-16">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.figure
              key={activeIdx}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-10 md:gap-14 items-center"
              variants={slideVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { duration: 0.45, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.3 } }}
            >
              {/* Yellow scribble frame — placeholder for real client imagery */}
              <div className="relative aspect-[545/684] w-full max-w-[320px] mx-auto md:mx-0">
                <img
                  src="/images/backgrounds/yellow-frame.svg"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full"
                />
                {/* TODO: drop the actual client logo/hero here */}
              </div>

              {/* Quote block on the right */}
              <div>
                <div
                  className="font-headline text-2xl sm:text-3xl mb-4"
                  style={{ color: accent }}
                >
                  {active.client}
                </div>
                {active.quote && (
                  <blockquote className="text-lg leading-relaxed opacity-85 max-w-xl">
                    {active.quote}
                  </blockquote>
                )}
                <footer className="mt-6 text-xs uppercase tracking-widest opacity-60">
                  Placeholder Name, Role · {active.client}
                </footer>
              </div>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Arrow controls — only rendered when there's more than one slide */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous project"
              className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: `${accent}33`, color: accent }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 1L3 7l6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next project"
              className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: `${accent}33`, color: accent }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 1l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot indicators — click to jump to a specific slide */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {testimonials.map((t, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={t.client}
                type="button"
                onClick={() => setState([i, i > activeIdx ? 1 : -1])}
                aria-label={`Go to project ${i + 1}`}
                aria-current={isActive}
                className="h-2 rounded-full transition-all"
                style={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive ? accent : `${accent}4d`,
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
