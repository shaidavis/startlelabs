"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import type { Service } from "@/data/services";
import { HazeBackground } from "@/components/ui/HazeBackground";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface ScrollSectionData {
  id: string;
  label: string;
  type: "hero" | "service" | "about" | "contact";
  service?: Service;
  index: number;
}

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
  // Parallax multiplier: text moves faster than its panel background.
  // Panel bg slides at 1x scroll rate; text moves at ~1.4x, creating depth.
  // Higher stagger = element enters/exits slightly later (cascading fly-off).
  const parallaxStrength = 120 + staggerOffset * 40; // px of extra horizontal travel
  const staggerDelay = staggerOffset * 0.06; // normalized scroll units

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (v: number) => {
      const normalized = (v - snapPoint) / sectionSpan;

      // Horizontal parallax: text flies ahead of the panel's own x-push.
      // At normalized=0 (centered), x=0. As the panel exits, text leads it.
      const x = normalized * -parallaxStrength;

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

const SCROLL_WORDS = ["teams", "users", "investors", "success", "joy", "vision", "innovation"];
const SUCCESS_INDEX = 3; // index of "success" in the word list

function HeroPanel({ scrollYProgress, snapPoint, sectionSpan }: PanelProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wordHeight, setWordHeight] = useState(56);
  const hasLeftHeroRef = useRef(false);

  // The hero span includes word cycling + one normal transition span.
  // Split them so parallax only kicks in during the slide-out phase.
  const normalSpanHero = sectionSpan / (1 + HERO_EXTRA_VH);
  const wordCycleEnd = snapPoint + sectionSpan - normalSpanHero;

  // Custom parallax: fully visible during word cycling, flies off during slide-out
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const update = (v: number) => {
      if (v <= wordCycleEnd) {
        el.style.opacity = "1";
        el.style.transform = "translateX(0px)";
      } else {
        const normalized = (v - wordCycleEnd) / normalSpanHero;
        const x = normalized * -160;
        const opacity = Math.max(0, 1 - normalized * 1.5);
        el.style.opacity = String(Math.max(0, opacity));
        el.style.transform = `translateX(${x}px)`;
      }
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, wordCycleEnd, normalSpanHero]);

  // Measure word height once
  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const firstWord = el.querySelector("[data-scroll-word]");
    if (firstWord) {
      setWordHeight(firstWord.getBoundingClientRect().height);
    }
  }, []);

  // Track scroll to drive the word wheel + detect when user leaves hero
  useEffect(() => {
    const update = (v: number) => {
      const normalized = (v - snapPoint) / sectionSpan;

      // Detect if user has scrolled past hero
      if (normalized > 0.8) {
        hasLeftHeroRef.current = true;
      }

      const el = wheelRef.current;
      if (!el) return;

      let wordIndex: number;
      if (hasLeftHeroRef.current) {
        wordIndex = SUCCESS_INDEX;
      } else {
        // Word cycling uses only the pre-transition portion of the hero span
        const wordCycleSpan = sectionSpan - sectionSpan / (1 + HERO_EXTRA_VH);
        const microProgress = Math.max(0, Math.min(1, (v - snapPoint) / wordCycleSpan));
        wordIndex = microProgress * (SCROLL_WORDS.length - 1);
      }

      // Position the word list so the active word aligns at the headline slot
      const translateY = -wordIndex * wordHeight;
      el.style.transform = `translateY(${translateY}px)`;

      // Update individual word opacities
      const words = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
      words.forEach((word, i) => {
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
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, snapPoint, sectionSpan, wordHeight]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#E9C402] px-6 sm:px-8 overflow-hidden">
      {/* Offset upward so the headline + active word row is visually centered,
          not pulled down by the faded words below */}
      <div
        ref={rowRef}
        className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-4 will-change-transform"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-headline tracking-tight text-[#230F2C] whitespace-nowrap shrink-0">
          Creativity that inspires
        </h1>

        {/* Scroll wheel + period inline wrapper */}
        <div className="flex items-baseline gap-1 sm:gap-2">
          {/* Scroll wheel column — all words visible, active word at headline baseline */}
          <div className="relative" style={{ width: "max-content", minWidth: "6ch", height: wordHeight }}>
            {/* Fixed underline at headline level (bottom of the "slot") */}
            <div className="absolute left-0 right-0 h-[2px] bg-[#230F2C]/40 z-10" style={{ top: wordHeight }} />

            {/* Moving word stack — absolutely positioned so overflow doesn't affect flex centering */}
            <div
              ref={wheelRef}
              className="absolute left-0 right-0 flex flex-col items-center transition-none will-change-transform"
            >
              {SCROLL_WORDS.map((word) => (
                <div
                  key={word}
                  data-scroll-word
                  className="flex items-center justify-center font-handwritten text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#230F2C] leading-tight"
                  style={{ height: wordHeight }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Inline period */}
          <span className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-headline text-[#230F2C] shrink-0">
            .
          </span>
        </div>
      </div>
    </div>
  );
}

function ServicePanel({
  service,
  scrollYProgress,
  snapPoint,
  sectionSpan,
}: PanelProps & { service: Service }) {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useScrollContent(labelRef, scrollYProgress, snapPoint, sectionSpan, 0);
  useScrollContent(h2Ref, scrollYProgress, snapPoint, sectionSpan, 1);
  useScrollContent(descRef, scrollYProgress, snapPoint, sectionSpan, 2);
  useScrollContent(ctaRef, scrollYProgress, snapPoint, sectionSpan, 3);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]"
    >
      <HazeBackground accentColor={service.accentColor} />
      <div className="relative z-10 flex flex-col items-center text-center gap-4 text-white px-8 max-w-4xl w-full">
        <p
          ref={labelRef}
          className="text-sm uppercase tracking-widest text-white/50 will-change-transform"
        >
          {service.title}
        </p>
        <h2
          ref={h2Ref}
          className="text-5xl md:text-7xl font-bold will-change-transform"
        >
          {service.headline}
        </h2>
        <p
          ref={descRef}
          className="text-lg text-white/70 max-w-lg will-change-transform"
        >
          {service.description}
        </p>
        <a
          ref={ctaRef}
          href={`/services/${service.slug}`}
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors will-change-transform"
        >
          Learn More
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12L12 4M12 4H6M12 4V10" />
          </svg>
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
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 px-8">
      <div className="text-center max-w-3xl">
        <h2
          ref={h2Ref}
          className="text-4xl md:text-6xl font-bold mb-6 will-change-transform"
        >
          About Startle Labs
        </h2>
        <p
          ref={subRef}
          className="text-lg text-neutral-400 mb-8 will-change-transform"
        >
          We&apos;re a branding and creative agency that believes connection isn&apos;t a skill — it&apos;s a choice.
        </p>
        <a
          ref={ctaRef}
          href="/about"
          className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors inline-block will-change-transform"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

function ContactPanel({ scrollYProgress, snapPoint, sectionSpan }: PanelProps) {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useScrollContent(h2Ref, scrollYProgress, snapPoint, sectionSpan, 0);
  useScrollContent(subRef, scrollYProgress, snapPoint, sectionSpan, 1);
  useScrollContent(ctaRef, scrollYProgress, snapPoint, sectionSpan, 2);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black px-8">
      <div className="text-center max-w-2xl">
        <h2
          ref={h2Ref}
          className="text-3xl md:text-5xl font-bold mb-4 will-change-transform"
        >
          Let&apos;s work together
        </h2>
        <p
          ref={subRef}
          className="text-neutral-400 mb-8 will-change-transform"
        >
          Ready to build something remarkable?
        </p>
        <a
          ref={ctaRef}
          href="/contact"
          className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-colors inline-block will-change-transform"
        >
          Get in Touch
        </a>
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
  const totalVHUnits = totalSections + HERO_EXTRA_VH;
  const heroSpan = (1 + HERO_EXTRA_VH) / totalVHUnits;
  const normalSpan = 1 / totalVHUnits;

  if (sectionIndex === 0) {
    return { snapPoint: 0, sectionSpan: heroSpan };
  }

  // Snap point = end of hero + (sectionIndex - 1) normal spans
  const snapPoint = heroSpan + (sectionIndex - 1) * normalSpan;
  return { snapPoint, sectionSpan: normalSpan };
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

  const totalVHUnits = totalSections + HERO_EXTRA_VH;
  const heroSpan = (1 + HERO_EXTRA_VH) / totalVHUnits;
  const normalSpan = 1 / totalVHUnits;

  // Horizontal push: hero stays put during its word-cycling scroll,
  // then all sections slide left/right in unison.
  const x = useTransform(
    scrollYProgress,
    (v: number) => {
      if (section.index === 0) {
        // Hero stays put during word cycling, then slides out during transition
        const wordCycleEnd = heroSpan - normalSpan;
        if (v <= wordCycleEnd) return "0%";
        const postCycle = (v - wordCycleEnd) / normalSpan;
        return `${-postCycle * 100}%`;
      }
      // Non-hero: position relative to their snap point
      const offset = (v - snapPoint) / normalSpan;
      return `${-offset * 100}%`;
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
const SECTION_ICONS: Record<string, React.ReactNode> = {
  "service-1": (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 1H1v6.5L7.5 14 13 8.5 7.5 1z" />
      <circle cx="4" cy="4" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  "service-2": (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="12" height="12" rx="1.5" />
      <path d="M1 10l3.5-3.5L7 9l2.5-2.5L13 10" />
    </svg>
  ),
  "service-3": (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="5" height="5" rx="1" />
      <rect x="8" y="1" width="5" height="5" rx="1" />
      <rect x="1" y="8" width="5" height="5" rx="1" />
      <rect x="8" y="8" width="5" height="5" rx="1" />
    </svg>
  ),
  about: (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="6" />
      <path d="M4.5 8.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" />
      <circle cx="5" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="9" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
};

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
  const iconSections = sections.filter((s) => SECTION_ICONS[s.id]);

  return (
    <div className="fixed top-0 left-0 right-0 h-[72px] sm:h-[88px] z-[55] hidden md:flex items-center px-8">
      <div className="flex-1 relative flex items-center justify-center mx-[180px] lg:mx-[220px]">
        {iconSections.map((section, i) => (
          <div key={section.id} className="flex items-center">
            {i > 0 && (
              <div className="w-12 lg:w-20 xl:w-28 border-t border-dashed border-[#230F2C]/20" />
            )}
            <TopDot
              index={section.index}
              label={section.label}
              totalSections={sections.length}
              scrollYProgress={scrollYProgress}
              containerRef={containerRef}
              icon={SECTION_ICONS[section.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopDot({
  index,
  label,
  totalSections,
  scrollYProgress,
  containerRef,
  icon,
}: {
  index: number;
  label: string;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  icon?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const { snapPoint, sectionSpan } = useSectionTiming(index, totalSections);

  const lo = Math.max(0, snapPoint - sectionSpan * 0.3);
  const hi = Math.min(1, snapPoint + sectionSpan * 1.3);

  // Scale: swell to 1.4x when this section is active
  const scale = useTransform(
    scrollYProgress,
    [lo, snapPoint, snapPoint + sectionSpan * 0.5, hi],
    [1, 1.4, 1.4, 1]
  );

  // Opacity: brighter when active
  const iconOpacity = useTransform(
    scrollYProgress,
    [lo, snapPoint, snapPoint + sectionSpan * 0.5, hi],
    [0.35, 1, 1, 0.35]
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
      className="relative z-10 flex items-center justify-center cursor-pointer pointer-events-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Hover tooltip — label appears below */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -bottom-7 whitespace-nowrap text-[10px] uppercase tracking-widest text-[#230F2C]/60"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon with swell + opacity driven by scroll */}
      <motion.div
        className="w-8 h-8 flex items-center justify-center text-[#230F2C]"
        style={{ scale, opacity: iconOpacity }}
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.2 }}
      >
        {icon || (
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

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-[100] pointer-events-none"
      style={{ opacity }}
    >
      <motion.div
        className="w-10 h-16 rounded-full border-2 border-[#230F2C]/40 flex items-center justify-center"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#230F2C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3v10M4 9l4 4 4-4" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* Snap logic removed — Haze-style: free scroll with continuous transforms */

/* ─── Main Component ─────────────────────────────────────────────────── */

interface FullscreenScrollerProps {
  services: Service[];
}

/**
 * Extra scroll VHs allocated to the hero section so that all scroll-wheel words
 * have time to cycle before the first service section slides in.
 */
const HERO_EXTRA_VH = 2; // hero gets 3x the scroll distance of a normal section

export function FullscreenScroller({ services }: FullscreenScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const sections: ScrollSectionData[] = [
    { id: "hero", type: "hero", label: "Home", index: 0 },
    ...services.map((service, i) => ({
      id: `service-${i + 1}`,
      type: "service" as const,
      label: service.title,
      service,
      index: i + 1,
    })),
    { id: "about", type: "about", label: "About", index: services.length + 1 },
    { id: "contact", type: "contact", label: "Contact", index: services.length + 2 },
  ];

  const totalSections = sections.length;

  // Total scroll height: hero gets extra VHs so words can fully cycle
  const totalVH = totalSections * 100 + HERO_EXTRA_VH * 100;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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

          <ScrollIndicator scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* Haze-style top nav: dots + progress line between them */}
      <TopNav sections={sections} scrollYProgress={scrollYProgress} containerRef={containerRef} />
    </>
  );
}
