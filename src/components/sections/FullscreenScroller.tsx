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

function HeroPanel({ scrollYProgress, snapPoint, sectionSpan }: PanelProps) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useScrollContent(h1Ref, scrollYProgress, snapPoint, sectionSpan, 0);
  useScrollContent(subRef, scrollYProgress, snapPoint, sectionSpan, 1);
  useScrollContent(ctaRef, scrollYProgress, snapPoint, sectionSpan, 2);

  return (
    <div className="absolute inset-0 flex items-end sm:items-center justify-center bg-[#0a0a0a] px-6 pb-32 sm:pb-0 sm:px-8">
      <div className="flex flex-col items-center text-center gap-4 sm:gap-6 max-w-4xl">
        <h1
          ref={h1Ref}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] will-change-transform"
        >
          Creativity that inspires
        </h1>
        <p
          ref={subRef}
          className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl will-change-transform"
        >
          Brand identity, strategy, art direction, and products that inspire.
          We build brands that move markets.
        </p>
        <div ref={ctaRef} className="mt-2 sm:mt-4 will-change-transform">
          <span className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-black font-medium rounded-full inline-block cursor-pointer hover:bg-neutral-200 transition-colors text-sm sm:text-base">
            Explore Services
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
function ScrollPanel({
  section,
  totalSections,
  scrollYProgress,
}: {
  section: ScrollSectionData;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
}) {
  const last = totalSections - 1;
  const snapPoint = section.index / last;
  const sectionSpan = 1 / last; // scroll distance per section

  // Horizontal push: sections slide left/right as a strip
  const x = useTransform(
    scrollYProgress,
    (v: number) => `${(snapPoint - v) * last * 100}%`
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
function TopNav({
  sections,
  scrollYProgress,
  containerRef,
}: {
  sections: ScrollSectionData[];
  scrollYProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Progress as percentage for the line fill — directly tied to scroll
  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed top-0 left-0 right-0 h-[88px] z-[55] hidden sm:flex items-center px-8">
      <div className="flex-1 relative flex items-center justify-between mx-[140px]">
        {/* Background track line (subtle) */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/10" />

        {/* Filled progress line — moves between dots with scroll */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] overflow-hidden">
          <motion.div
            className="h-full bg-white/30 origin-left"
            style={{ width: lineProgress }}
          />
        </div>

        {/* Dots on top of the line */}
        {sections.map((section) => (
          <TopDot
            key={section.id}
            index={section.index}
            label={section.label}
            totalSections={sections.length}
            scrollYProgress={scrollYProgress}
            containerRef={containerRef}
          />
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
}: {
  index: number;
  label: string;
  totalSections: number;
  scrollYProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHovered] = useState(false);
  const last = totalSections - 1;
  const snapPoint = index / last;
  const halfGap = 0.5 / last;

  const lo = Math.max(0, snapPoint - halfGap);
  const hi = Math.min(1, snapPoint + halfGap);

  // Monotonically increasing keyframes for fill transition
  const fillLo = Math.max(lo, snapPoint - halfGap * 0.2);
  const fillHi = Math.min(hi, snapPoint + halfGap * 0.2);

  // Active = filled, inactive = outline
  const fillOpacity = useTransform(
    scrollYProgress,
    [lo, fillLo, snapPoint, fillHi, hi],
    [0, 0, 1, 0, 0]
  );

  // Border brighter when near
  const borderColor = useTransform(
    scrollYProgress,
    [lo, snapPoint, hi],
    ["rgba(255,255,255,0.25)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.25)"]
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
      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -bottom-7 whitespace-nowrap text-[10px] uppercase tracking-widest text-white/70"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hit area + dot */}
      <div className="w-8 h-8 flex items-center justify-center">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.5 }}
          transition={{ duration: 0.2 }}
        >
          {/* Ring */}
          <motion.div
            className="w-[7px] h-[7px] rounded-full border"
            style={{ borderColor }}
          />
          {/* Fill */}
          <motion.div
            className="absolute inset-[1px] rounded-full bg-white"
            style={{ opacity: fillOpacity }}
          />
        </motion.div>
      </div>
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
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 z-[100] pointer-events-none"
      style={{ opacity }}
    >
      <span className="text-xs uppercase tracking-widest">Scroll</span>
      <motion.div
        className="w-px h-8 bg-neutral-500"
        animate={{ scaleY: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* Snap logic removed — Haze-style: free scroll with continuous transforms */

/* ─── Main Component ─────────────────────────────────────────────────── */

interface FullscreenScrollerProps {
  services: Service[];
}

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <div
        ref={containerRef}
        data-scroller-sections={totalSections}
        style={{ height: `${totalSections * 100}vh` }}
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
