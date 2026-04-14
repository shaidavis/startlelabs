"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "./Navigation";

/**
 * Section accent colors — matches the service data order.
 * hero → brand-strategy → creative-direction → digital-design → about → contact
 */
const SECTION_ACCENTS = [
  "transparent",  // hero
  "#2563eb",      // brand strategy (blue)
  "#9333ea",      // creative direction (purple)
  "#ea580c",      // digital design (orange)
  "transparent",  // about
  "transparent",  // contact
];

/**
 * Section-aware topbar. On the homepage, it listens to scroll and shifts
 * its backdrop + accent indicator per section. On inner pages, it shows
 * the default dark/blur style.
 */
export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [variant, setVariant] = useState({
    pastHero: false,
    accentColor: "transparent",
    isHomepage: false,
  });

  useEffect(() => {
    const container = document.querySelector<HTMLElement>("[data-scroller-sections]");
    if (!container) {
      setVariant({ pastHero: true, accentColor: "transparent", isHomepage: false });
      return;
    }

    const totalSections = SECTION_ACCENTS.length;
    const last = totalSections - 1;

    function onScroll() {
      const rect = container!.getBoundingClientRect();
      const containerH = container!.scrollHeight;
      const viewH = window.innerHeight;
      // scrollYProgress equivalent: 0 when top of container at top of viewport,
      // 1 when bottom of container at bottom of viewport
      const scrollable = containerH - viewH;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;

      const nearestIndex = Math.min(Math.round(progress * last), last);
      setVariant({
        pastHero: progress > 0.05,
        accentColor: SECTION_ACCENTS[nearestIndex] || "transparent",
        isHomepage: true,
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBackdrop = !variant.isHomepage || variant.pastHero;
  const hasAccent = variant.accentColor !== "transparent";

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[88px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Animated backdrop */}
        <motion.div
          className="absolute inset-0 -z-10 border-b border-white/5"
          animate={{
            backgroundColor: showBackdrop ? "rgba(10,10,10,0.7)" : "rgba(10,10,10,0)",
            backdropFilter: showBackdrop ? "blur(12px)" : "blur(0px)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Section accent indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          animate={{
            backgroundColor: hasAccent ? variant.accentColor : "transparent",
            opacity: hasAccent ? 0.6 : 0,
          }}
          transition={{ duration: 0.5 }}
        />

        <a href="/" className="text-xl font-bold tracking-tight">
          Startle Labs
        </a>

        <button
          onClick={() => setMenuOpen(true)}
          className="relative z-50 flex flex-col items-center justify-center w-10 h-10 gap-1.5"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-6 h-0.5 bg-current transition-transform" />
          <span className="block w-6 h-0.5 bg-current transition-transform" />
        </button>
      </motion.header>

      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
