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

/* ─── Types ──────────────────────────────────────────────────────────── */

interface ScrollSectionData {
  id: string;
  label: string;
  type: "hero" | "service" | "about" | "contact";
  service?: Service;
  index: number;
}

/* ─── Panel content components ───────────────────────────────────────── */

function HeroPanel({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] px-8">
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0 : 0 }}
        >
          Creativity that inspires
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-neutral-400 max-w-2xl"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.1 : 0 }}
        >
          Brand identity, strategy, art direction, and products that inspire.
          We build brands that move markets.
        </motion.p>
        <motion.div
          className="mt-4"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.2 : 0 }}
        >
          <span className="px-8 py-4 bg-white text-black font-medium rounded-full inline-block cursor-pointer hover:bg-neutral-200 transition-colors">
            Explore Services
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function ServicePanel({ service, visible }: { service: Service; visible: boolean }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: service.accentColor }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      <div className="relative z-10 flex flex-col items-center text-center gap-4 text-white px-8 max-w-4xl w-full">
        <motion.p
          className="text-sm uppercase tracking-widest text-white/50"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0 : 0 }}
        >
          {service.title}
        </motion.p>
        <motion.h2
          className="text-5xl md:text-7xl font-bold"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.08 : 0 }}
        >
          {service.headline}
        </motion.h2>
        <motion.p
          className="text-lg text-white/70 max-w-lg"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.16 : 0 }}
        >
          {service.description}
        </motion.p>
        <motion.a
          href={`/services/${service.slug}`}
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.24 : 0 }}
        >
          Learn More
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12L12 4M12 4H6M12 4V10" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}

function AboutPanel({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 px-8">
      <div className="text-center max-w-3xl">
        <motion.h2
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0 : 0 }}
        >
          About Startle Labs
        </motion.h2>
        <motion.p
          className="text-lg text-neutral-400 mb-8"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.1 : 0 }}
        >
          We&apos;re a branding and creative agency that believes connection isn&apos;t a skill — it&apos;s a choice.
        </motion.p>
        <motion.a
          href="/about"
          className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors inline-block"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.2 : 0 }}
        >
          Learn More
        </motion.a>
      </div>
    </div>
  );
}

function ContactPanel({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black px-8">
      <div className="text-center max-w-2xl">
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0 : 0 }}
        >
          Let&apos;s work together
        </motion.h2>
        <motion.p
          className="text-neutral-400 mb-8"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.1 : 0 }}
        >
          Ready to build something remarkable?
        </motion.p>
        <motion.a
          href="/contact"
          className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-colors inline-block"
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: visible ? 0.2 : 0 }}
        >
          Get in Touch
        </motion.a>
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

  // Linear x offset: always edge-to-edge with neighbors
  const x = useTransform(
    scrollYProgress,
    (v: number) => `${(snapPoint - v) * last * 100}%`
  );

  // Content visibility: active when within ~20% of snap point
  const [isActive, setIsActive] = useState(section.index === 0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const distance = Math.abs(v - snapPoint);
      const threshold = 0.5 / last; // half a section width
      setIsActive(distance < threshold * 0.4);
    });
    return unsubscribe;
  }, [scrollYProgress, snapPoint, last]);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ x }}
    >
      {section.type === "hero" && <HeroPanel visible={isActive} />}
      {section.type === "service" && section.service && (
        <ServicePanel service={section.service} visible={isActive} />
      )}
      {section.type === "about" && <AboutPanel visible={isActive} />}
      {section.type === "contact" && <ContactPanel visible={isActive} />}
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
    <div className="fixed top-0 left-0 right-0 h-[88px] z-[55] flex items-center px-8">
      <div className="flex-1 relative flex items-center justify-between mx-[140px]">
        {/* Background track line (subtle) */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/10" />

        {/* Filled progress line — moves between dots with scroll */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] overflow-hidden">
          <motion.div
            className="h-full bg-white/40 origin-left"
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

/* ─── Snap Scroll Manager ────────────────────────────────────────────── */

function useSnapScroll(containerRef: React.RefObject<HTMLDivElement | null>, totalSections: number) {
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSnapping = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sectionHeight = container.scrollHeight / totalSections;

    function handleScroll() {
      if (isSnapping.current) return;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const scrollTop = window.scrollY;
        const containerTop = container!.offsetTop;
        const relativeScroll = scrollTop - containerTop;

        if (relativeScroll < 0 || relativeScroll > container!.scrollHeight - window.innerHeight) return;

        const nearestSection = Math.round(relativeScroll / sectionHeight);
        const snapTarget = containerTop + nearestSection * sectionHeight;

        if (Math.abs(scrollTop - snapTarget) > 10) {
          isSnapping.current = true;
          window.scrollTo({
            top: snapTarget,
            behavior: "smooth",
          });

          setTimeout(() => {
            isSnapping.current = false;
          }, 600);
        }
      }, 150);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [containerRef, totalSections]);
}

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

  useSnapScroll(containerRef, totalSections);

  return (
    <>
      <div
        ref={containerRef}
        style={{ height: `${totalSections * 100}vh` }}
        className="relative"
      >
        {/* Sticky viewport — pins to screen */}
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
