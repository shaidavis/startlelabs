"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { servicesList } from "@/data/services";

/**
 * Static section navigation — the icon strip that lives in the Topbar on
 * every page that ISN'T the homepage scroller.
 *
 * The homepage itself has its own scroll-driven version (see TopNav inside
 * FullscreenScroller.tsx) whose active icon grows/shrinks in pace with the
 * user's scroll position through the sections. This static variant serves
 * the same navigational purpose but without live scroll binding — it just
 * marks the current section and links every icon back to the corresponding
 * homepage panel via `/#{slug}` deep-links, which the scroller's
 * `useLayoutEffect` then resolves into an instant snap-to-section.
 *
 * The icon set (and their rough shapes) mirrors the ones in the scroller so
 * the whole site feels like one continuous wayfinding system. If icons
 * change, update both files — they're kept in sync manually.
 */

/**
 * Single hand-drawn white puck PNG used behind every nav icon. We tried
 * rotating through four different shapes for variety, but the bbox sizes
 * varied enough (1260×1440 up to 1547×1681) that the rendered pucks felt
 * inconsistent in size and vertical alignment. One shape keeps every dot
 * sized identically and centred to the same point.
 *
 * Picked `Untitled_Artwork 3.png` — its bbox aspect (0.92) is closest to
 * round of the available shapes and its bbox y-centre (967 out of 2048)
 * sits closest to the canvas centre, so `object-contain` rendering lands
 * the visible puck near the centre of the slot without per-puck offsets.
 */
export const PUCK_SRC = "/images/shapes/Untitled_Artwork%203.png";
/** Legacy export kept so any importer that still consumes the array gets
 *  the same single puck for every position. */
export const SHAPE_URLS = [PUCK_SRC];

/**
 * Icon configuration per section. Service icons carry both a `defaultSrc`
 * (the resting glyph — bulb / presentation / mouse) and a `hoverSrc` (the
 * "feeling" glyph — crown / eye / heart) which the ticker animation swaps
 * to on hover. The about entry is a single static SVG node, no swap.
 *
 * All PNGs are pure white ink on transparent backgrounds; rendered via CSS
 * `mask-image` so the alpha channel describes the shape and `currentColor`
 * paints them whatever the parent flows down.
 *
 * The `*MaskY` fields compensate for hand-drawn icons whose visible content
 * doesn't sit at the geometric center of their square 2048×2048 canvas.
 * Crown, presentation, and mouse all bias slightly low (their bbox y-center
 * is ~55–58% of image height); rendering at a default `mask-position: center`
 * pushes the visible glyph below the slot's optical center. We override
 * `mask-position-y` to `(1 - bboxYPct) * 100%` so the bbox center lands at
 * 50% of the slot — the math derivation is in `mask-position-y` MDN if you
 * want to verify.
 */
type IconConfig = {
  defaultSrc?: string;
  hoverSrc?: string;
  defaultNode?: ReactNode;
  /** mask-position-y % for the resting icon (default 50). Lower = pulls art up. */
  defaultMaskY?: number;
  /** mask-position-y % for the hover icon (default 50). */
  hoverMaskY?: number;
  /** When true, the icon does NOT swap on hover — instead it pivots from the
   *  wrist and waves back and forth (used by the about hand). Mutually
   *  exclusive with `hoverSrc`. */
  wavesOnHover?: boolean;
  /** Micro-animation played on the hover icon after the register tick settles. */
  hoverAnimation?: "heartbeat" | "blink" | "jiggle";
};

export const SECTION_ICONS: Record<string, IconConfig> = {
  // Bulb → Crown — Creative Strategy. Numbers below come from
  // (1 − alpha-weighted centroid Y%) for each PNG. Crown's hoverMaskY
  // is hand-tuned to 28 (vs the centroid-derived 36) — the crown's
  // perceived centre sits a few extra ticks above its mass centroid
  // because the spires read as "the crown" while the wide base reads
  // as the bedding it sits on.
  "brand-strategy": {
    defaultSrc: "/images/icons/Bulb%203.png",
    hoverSrc: "/images/icons/Crown%20copy.png",
    defaultMaskY: 59.5,
    hoverMaskY: 28,
    hoverAnimation: "jiggle",
  },
  // Presentation → Eye — Pitch Decks. Eye.png had heavy alpha-noise across
  // every edge of the 2048 canvas which was painting a faint square mask;
  // we cleaned it in place by thresholding alpha<100 to 0 so only the eye
  // itself contributes.
  "creative-direction": {
    defaultSrc: "/images/icons/Presentation%202.png",
    hoverSrc: "/images/icons/Eye.png",
    defaultMaskY: 49.9,
    hoverMaskY: 42.4,
    hoverAnimation: "blink",
  },
  // Mouse → Heart — Websites
  "digital-design": {
    defaultSrc: "/images/icons/Mouse.png",
    hoverSrc: "/images/icons/Heart%20.png",
    defaultMaskY: 36.4,
    hoverMaskY: 53.8,
    hoverAnimation: "heartbeat",
  },
  // Waving hand — pivots from the wrist on hover. Mask PNG painted via
  // currentColor so the orange accent flows down from NavIconLink.
  about: {
    defaultSrc: "/images/icons/Hand.png",
    wavesOnHover: true,
    defaultMaskY: 50,
  },
};

/**
 * Two-frame "ticking register" — the resting icon sits in a fixed-size
 * window; on hover (Tailwind `group-hover` from the parent Link) the inner
 * stack translates upwards by exactly one cell so the hover icon takes its
 * place. Pure CSS so it works regardless of React's event scheduler — and
 * the back-out easing curve gives a small overshoot that reads as a "tick"
 * the way a spring would, without needing a physics engine. Both cells
 * inherit `currentColor` from the wrapper so the swap stays in the
 * section's palette.
 *
 * Caller MUST place the parent (the Link / hover target) with `group` on
 * its className for the `group-hover` selector to fire.
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
  defaultNode?: ReactNode;
  defaultMaskY?: number;
  hoverMaskY?: number;
  wavesOnHover?: boolean;
  hoverAnimation?: "heartbeat" | "blink" | "jiggle";
  size?: number;
}) {
  // Static fallback — for any inline-SVG entries that don't swap.
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

  // Single-icon variant that waves on hover instead of ticking. The wrapper
  // applies the rotation animation so the inner translateY-centred mask
  // doesn't fight with the keyframe rotate property.
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

  // Each cell gets a per-image translateY to centre its bbox inside the
  // slot. We do this with `transform: translateY` rather than
  // `mask-position-y` because the latter is a no-op when `mask-size:
  // contain` makes the image fill the cell exactly. To stop the
  // translated paint from bleeding past the cell's box (and showing a
  // sliver of one icon inside the next cell's slot during the hover
  // tick), each masked span is wrapped in its own `overflow-hidden`
  // clip-box.
  const innerCellStyle = (src: string, yPct: number, bgColor = "currentColor"): CSSProperties => ({
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
  const wrapStyle: CSSProperties = {
    flexShrink: 0,
    width: size,
    height: size,
    overflow: "hidden",
  };

  // If a section has no hover icon (shouldn't happen in current data, but
  // keeps the type honest), fall back to repeating the default so the
  // ticker animates without flashing emptiness.
  const bottom = hoverSrc || defaultSrc;
  const bottomY = hoverSrc ? hoverMaskY : defaultMaskY;
  // Surprise icons (crown/eye/heart) are darkened so they read clearly
  // against their accent-colored topbar background.
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

/**
 * Hand-drawn progress line between two nav icons. The dashed PNG sits at
 * low opacity as the resting state; once the user has scrolled past this
 * gap the solid PNG fades in on top, slightly thicker so it reads as the
 * "filled-in" answer to the dashed sketch.
 *
 * Both PNGs are naturally vertical (75×455 / 88×911). We rotate them −90°
 * around centre and pre-rotation height matches the parent's display
 * width (the responsive Tailwind classes keep these in sync). Mask-image
 * + currentColor lets us tint the same artwork to dark navy or white
 * depending on tone.
 */
function ProgressLine({
  filled,
  toneIsLight,
}: {
  filled: boolean;
  toneIsLight: boolean;
}) {
  const ink = toneIsLight ? "#ffffff" : "#230F2C";
  const lineMask = (src: string): CSSProperties => ({
    backgroundColor: ink,
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
    <div className="relative w-12 lg:w-20 xl:w-28 h-3 flex items-center justify-center overflow-visible">
      {/* Dashed base — always visible at low opacity. Pre-rotation w-1.5
          (6px) becomes the line's thickness; pre-rotation height matches
          the parent width so the rotated line spans edge-to-edge. */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 w-1.5 h-12 lg:h-20 xl:h-28 -translate-x-1/2 -translate-y-1/2 rotate-[-88.2deg]"
        style={{ ...lineMask("/images/accents/line-dashed.png"), opacity: 0.4 }}
      />
      {/* Solid fill — slightly thicker (w-2.5 = 10px). Fades in once this
          gap is "behind" the active section. */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 w-2.5 h-12 lg:h-20 xl:h-28 -translate-x-1/2 -translate-y-1/2 rotate-[-88.2deg] transition-opacity duration-300"
        style={{
          ...lineMask("/images/accents/line-solid.png"),
          opacity: filled ? 0.85 : 0,
        }}
      />
    </div>
  );
}

interface NavItem {
  id: string;
  /** Where clicking this icon navigates. Service icons deep-link to the
   *  homepage scroller at the matching panel; /about goes to the homepage
   *  about section. */
  href: string;
  /** Aria label / hover tooltip */
  label: string;
  config: IconConfig;
  /** Used for the active-state color highlight */
  accent?: string;
}

interface SectionNavProps {
  /** The id (service slug or "about") of the currently-active section.
   *  Undefined when the user is on a page that doesn't correspond to one of
   *  these sections (e.g. /contact) — all icons render dimmed in that case. */
  activeId?: string;
  /**
   * Controls the nav's color palette. "dark" is for light/transparent
   * backgrounds (dark strokes, accent-colored active icon); "light" is for
   * solid accent-colored backgrounds like the service pages (white strokes,
   * yellow active icon that still pops on every service accent color).
   */
  tone?: "dark" | "light";
}

/**
 * Icon color rules — formalized so every route reads the same:
 *
 *   default  → ink (#230F2C on light bg, white on saturated services bar)
 *   hover    → section accent (yellow on services bar, since accent-on-
 *              accent would disappear)
 *   active   → section accent (same as hover)
 *
 * "Active" = the section corresponding to this icon is the one the user
 * is currently in. For the static SectionNav that's a URL match
 * (`/services/{slug}` or `/about`); the homepage scroller does its own
 * scroll-driven version of the same rule in TopDot.
 *
 * The "about" entry has no accent, so it falls back to ink/white in all
 * three states — the active signal is communicated via puck opacity +
 * scale instead.
 */
function NavIconLink({
  item,
  index,
  isActive,
  restingColor,
  activeColor,
  tooltipClass,
}: {
  item: NavItem;
  index: number;
  isActive: boolean;
  restingColor: string;
  activeColor: string;
  tooltipClass: string;
}) {
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      // Next.js 15 App Router strips the hash during client-side
      // cross-route navigation, so the FullscreenScroller's mount
      // effect can't read it. We stash the target in sessionStorage
      // as a reliable side-channel; the scroller reads it, jumps to
      // that panel, and clears the key.
      //
      // `scroll={false}` suppresses Next.js's auto-scroll-to-top on
      // navigation — otherwise its scroll would fire AFTER our
      // useLayoutEffect and reset the position we just jumped to.
      scroll={false}
      onClick={() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pending-section", item.id);
        }
      }}
      // `outline-none` kills the browser's default focus square on click —
      // it was bleeding through as a faint rectangle around the icon after
      // navigation. `focus-visible:ring-2` keeps the strip accessible to
      // keyboard users with a custom ring instead.
      className="relative z-10 group flex items-center justify-center w-14 h-14 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#230F2C]/40 focus-visible:ring-offset-2 rounded-full"
    >
      {/* White puck. Bumps to ~70% opacity when this section is active so
          the colored icon lands on a clean white circle and reads strong
          rather than mixing with the page background. */}
      <img
        src={PUCK_SRC}
        alt=""
        aria-hidden
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300 ${
          isActive ? "opacity-70" : "opacity-30"
        }`}
      />
      <motion.div
        className="flex items-center justify-center"
        initial={false}
        animate={{
          scale: isActive ? 1.4 : 1,
          opacity: isActive ? 1 : 0.55,
          color: isActive ? activeColor : restingColor,
        }}
        whileHover={{ scale: 1.5, opacity: 1, color: activeColor }}
        transition={{ duration: 0.2 }}
      >
        <RegisterIcon
          defaultSrc={item.config.defaultSrc}
          hoverSrc={item.config.hoverSrc}
          defaultNode={item.config.defaultNode}
          defaultMaskY={item.config.defaultMaskY}
          hoverMaskY={item.config.hoverMaskY}
          wavesOnHover={item.config.wavesOnHover}
          hoverAnimation={item.config.hoverAnimation}
          size={32}
        />
      </motion.div>

      {/* Hover tooltip — sits BELOW the icon. The Topbar header uses
          overflow-visible so this can render outside the 76px bar without
          clipping. Uses `font-headline` (Averia Gruesa Libre) so it
          carries the same hand-set tone as the rest of the brand. */}
      <span
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap font-headline text-sm opacity-0 group-hover:opacity-100 transition-opacity ${tooltipClass}`}
      >
        {item.label}
      </span>
    </Link>
  );
}

export function SectionNav({ activeId, tone = "dark" }: SectionNavProps) {
  const isLight = tone === "light";

  // Color tokens chosen so the strip reads on either background. On dark
  // tone (light/transparent page bg) all icons sit at the dark navy ink
  // color so they read as a calm "you-are-here" map; the ACTIVE one flips
  // to its section accent at full opacity so it really pops on top of the
  // white puck. On light tone (saturated service-page bar) every icon goes
  // white and the active one flips to yellow — accent-on-accent would
  // disappear into the background.
  const inactiveColor = isLight ? "#ffffff" : "#230F2C";
  const lightActiveColor = "#efce25"; // yellow — pops on every service accent bg
  const tooltipClass = isLight ? "text-white/80" : "text-[#230F2C]/70";

  const items: NavItem[] = [
    ...servicesList.map((s) => ({
      id: s.slug,
      href: `/#${s.slug}`,
      // Short tooltip label — falls back to title when no override is set.
      label: s.navTooltip ?? s.title,
      config: SECTION_ICONS[s.slug],
      accent: s.accentColor,
    })),
    {
      id: "about",
      href: "/#about",
      label: "About",
      config: SECTION_ICONS.about,
      // Orange — same hue as the /about page topbar background so the icon's
      // hover/active state matches the page identity.
      accent: "#E85D28",
    },
  ];

  // Progress fill: how far across the strip the user currently sits. If
  // nothing's active (e.g. /contact), no fill — the dashed track reads as
  // "untracked journey" rather than "at the start".
  const activeIdx = items.findIndex((i) => i.id === activeId);

  return (
    <div className="relative flex items-center">
      {items.map((item, i) => {
        const isActive = item.id === activeId;
        // Pair of colors per icon — the motion.div's `animate` picks
        // resting OR active; `whileHover` overrides to the active value
        // for transient hover feedback. Same value for hover and active
        // by design — see the rules block above NavIconLink.
        const restingColor = inactiveColor;
        const activeColor =
          item.accent ?? (isLight ? lightActiveColor : inactiveColor);
        // Each gap between icons gets a hand-drawn dashed base line;
        // segments BEFORE the active icon also show a thicker solid
        // overlay using the matching `line-solid` artwork. Keeping the
        // line split into per-gap segments (rather than one absolute line
        // across the strip) means it never passes behind a circle.
        const segmentFilled = activeIdx >= 0 && i - 1 < activeIdx;
        // Stagger the entrance: bar's own slide-in finishes around 0.8s
        // (0.2 delay + 0.6 duration), so icons start at ~0.55s and tick
        // in 70ms apart, finishing well within ~1.1s.
        const entranceDelay = 0.55 + i * 0.07;
        return (
          <motion.div
            key={item.id}
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
              <ProgressLine filled={segmentFilled} toneIsLight={isLight} />
            )}
            <NavIconLink
              item={item}
              index={i}
              isActive={isActive}
              restingColor={restingColor}
              activeColor={activeColor}
              tooltipClass={tooltipClass}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
