"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Navigation } from "./Navigation";
import { SectionNav } from "./SectionNav";
import { services } from "@/data/services";
import {
  HERO_EXTRA_VH,
  HERO_COLLAPSE_VH,
  HERO_RESOLVE_PORTION,
} from "@/components/sections/heroTiming";

/**
 * Single, consistent Topbar across every route.
 *
 * Previously the services detail pages swapped to a "deep section" variant —
 * solid accent-colored bar, ✕ close button, yellow Yalla pill, white
 * hamburger. We've unified it back to the homepage styling (light bg,
 * outlined Yalla, dark hamburger) and instead emphasize the active section
 * with a compact centered pill: accent-colored dot + service nav title.
 *
 * The Startle logo still doubles as a "return to scroll experience" link —
 * on service pages it deep-links to `/#{slug}` so the homepage scroller
 * snaps straight to the panel the user came from.
 */
export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const onHomepage = pathname === "/";
  const onServicesPage = pathname?.startsWith("/services/");
  const onAboutPage = pathname === "/about";
  const activeSlug = onServicesPage ? pathname?.split("/")[2] : null;
  const activeService = activeSlug ? services[activeSlug] : null;

  // Scroll-driven logo slide (homepage). The logo translates from centered
  // (during the word-cycle) to its left rest position over the SAME scroll
  // window in which the hero's underline collapses — both are pinned to
  // [HERO_EXTRA_VH, HERO_EXTRA_VH + HERO_COLLAPSE_VH * HERO_RESOLVE_PORTION]
  // viewport-heights — so the logo and underline slide left as one. The Yalla
  // + hamburger controls fade in across that window.
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoX = useMotionValue(0);
  const controlsOpacity = useMotionValue(onHomepage ? 0 : 1);
  const controlsPointer = useTransform(controlsOpacity, (o) =>
    o < 0.05 ? "none" : "auto"
  );

  // On services pages the bar collapses to a thin accent-colored strip
  // while the user is actively scrolling, and re-expands when they stop.
  // Rationale: long service pages benefit from extra vertical real estate
  // during a read/scroll pass, but the strip still telegraphs "you're in
  // <service>" because the accent color survives the collapse.
  //
  // Rest detection = debounced scroll: every scroll event pushes out a
  // 220ms timer; when that timer finally fires without interruption, the
  // user is considered "at rest" and the bar expands.
  useEffect(() => {
    if (!onServicesPage && !onAboutPage) {
      setIsScrolling(false);
      return;
    }
    let timer: number | undefined;
    const handleScroll = () => {
      // setState with same value bails out in React, so this doesn't
      // cause a re-render on every scroll tick once already true.
      setIsScrolling(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIsScrolling(false), 220);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(timer);
    };
  }, [onServicesPage, onAboutPage]);

  // Drive the logo slide + controls fade from scroll position on the homepage,
  // locked to the hero's underline-collapse window:
  //   start = HERO_EXTRA_VH vh                                  (collapse onset)
  //   end   = HERO_EXTRA_VH + HERO_COLLAPSE_VH * HERO_RESOLVE_PORTION vh
  // since one scroller unit == one viewport-height of scroll. Off-homepage the
  // logo rests at its left position with the controls shown. useLayoutEffect so
  // the centered start frame is committed before paint (no left-then-center
  // flash on load).
  useLayoutEffect(() => {
    if (!onHomepage) {
      logoX.set(0);
      controlsOpacity.set(1);
      return;
    }
    const apply = () => {
      const el = logoWrapRef.current;
      const winH = window.innerHeight;
      if (!el || !winH) return;
      // Offset that centers the logo over the viewport from its left rest
      // position. offsetLeft/offsetWidth are layout-based, so this stays
      // correct regardless of the logo's current translate.
      const restCenter = el.offsetLeft + el.offsetWidth / 2;
      const centerOffset = window.innerWidth / 2 - restCenter;
      const startPx = winH * HERO_EXTRA_VH;
      const endPx =
        winH * (HERO_EXTRA_VH + HERO_COLLAPSE_VH * HERO_RESOLVE_PORTION);
      const p = Math.max(
        0,
        Math.min(1, (window.scrollY - startPx) / (endPx - startPx))
      );
      // Same smoothstep easing the underline uses for its width, so the logo
      // and the line travel left frame-for-frame, not just sharing endpoints.
      const eased = p * p * (3 - 2 * p);
      // p=0 (through the whole cycle): centered. p=1 (collapse done): left rest.
      logoX.set(centerOffset * (1 - eased));
      // Controls fade in over the back half of the slide so they arrive as the
      // logo settles rather than competing with it mid-slide.
      controlsOpacity.set(Math.max(0, Math.min(1, (p - 0.4) / 0.6)));
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, [onHomepage, logoX, controlsOpacity]);

  // Logo always returns to the very start of the site — the yellow hero
  // panel at scroll 0. Previously it deep-linked to the matching service
  // panel on service pages, which conflicted with the user's expectation
  // that a logo click means "take me home".
  const homeHref = "/";

  // On the homepage, clicking <Link href="/"> while already at "/" is a
  // no-op for Next's router. Intercept and smooth-scroll back to the hero
  // so the logo also works as a "back to top" affordance once the user
  // has scrolled into a section.
  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onHomepage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Off-homepage: let Next.js handle the navigation. Default scroll-to-
    // top behavior lands the user at the hero, which is the goal.
  };

  // Symmetric to the logo: Yalla = "take me to the END of the scroller", the
  // yellow contact panel that closes the homepage flow. The standalone
  // /contact route still exists for direct URLs but the topbar CTA stays on
  // the homepage so we get the full scroll experience instead of two
  // parallel Yalla pages.
  //   - On homepage: smooth-scroll to the bottom (the contact panel snaps
  //     to scrollYProgress = 1.0 thanks to the totalVHUnits math).
  //   - Off homepage: drop the same sessionStorage key SectionNav uses so
  //     the FullscreenScroller's mount effect jumps to the contact panel
  //     after route navigation. Hash works for external deep-links;
  //     sessionStorage is the reliable cross-route channel.
  const handleYallaClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onHomepage) {
      e.preventDefault();
      const scrollEl = document.documentElement;
      window.scrollTo({
        top: scrollEl.scrollHeight - window.innerHeight,
        behavior: "smooth",
      });
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending-section", "contact");
    }
  };

  // Compute which section icon should glow. On /services/<slug> it's the
  // service itself; on /about it's "about"; elsewhere (like /contact) no
  // icon is active and the strip reads as "untracked".
  let activeSectionId: string | undefined;
  if (activeService) activeSectionId = activeService.slug;
  else if (pathname === "/about") activeSectionId = "about";

  // On service pages the bar takes on the service's accent color as a solid
  // fill so the page identity carries through the navigation. The CONTENT on
  // top of that bar (logo, icons, Yalla, hamburger) stays dark ink on every
  // route — consistency means the user never sees the same controls render
  // in two different palettes. Icons get their contrast from the white
  // hand-drawn pucks behind them; menu items rely on dark-on-accent contrast.
  const barBg = activeService?.accentColor ?? (onAboutPage ? "#E85D28" : undefined);

  // Collapse logic — only on services pages, only while actively scrolling,
  // and never when the menu is open or the user is hovering the bar (so
  // they can interact without waiting for the debounce to expire).
  const collapsed =
    Boolean(onServicesPage || onAboutPage) && isScrolling && !menuOpen && !hovered;

  return (
    <>
      {/* The bar uses `overflow-visible` so per-icon tooltips can render
          BELOW the bar without being clipped by its 76px height. The collapse
          animation still reads cleanly because the inner content is faded to
          opacity:0 (children become transparent) when collapsed — the visible
          piece during collapse is just the bar's own background color, which
          shrinks from 76 → 6px independently. */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 overflow-visible transition-[height,background-color] duration-300 ease-out ${
          collapsed ? "h-[6px]" : "h-[64px] sm:h-[76px]"
        }`}
        style={barBg ? {
          backgroundColor: barBg,
          backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        } : undefined}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* Single content layout. On the homepage the logo translates from
            centered (during the word-cycle) to its left rest position over the
            underline's collapse window via `logoX`, and the Yalla + hamburger
            controls fade in via `controlsOpacity`. Off-homepage the logo rests
            left with the controls shown. */}
        {(() => {
          const logoContent = (
            <>
              <span
                aria-hidden
                className="block h-7 sm:h-8 w-7 sm:w-8 shrink-0 origin-bottom-left transition-[transform,filter] duration-150 ease-out group-hover:scale-[1.15] group-hover:-rotate-12 group-hover:[filter:drop-shadow(0_0_8px_rgba(239,206,37,0.7))]"
                style={{
                  backgroundColor: "#230F2C",
                  WebkitMaskImage: "url(/images/accents/bolt-3.png)",
                  maskImage: "url(/images/accents/bolt-3.png)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <span
                className="font-headline text-xl sm:text-2xl leading-none"
                style={{ color: "#230F2C" }}
              >
                Startle Labs
              </span>
            </>
          );

          return (
            <motion.div
              className={`w-full h-full flex items-center justify-between px-8 sm:px-10 md:px-12 ${collapsed ? "pointer-events-none" : ""}`}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                ref={logoWrapRef}
                style={{ x: logoX }}
                className="shrink-0"
              >
                <Link
                  href={homeHref}
                  onClick={handleLogoClick}
                  onMouseEnter={
                    onServicesPage || onAboutPage
                      ? undefined
                      : () =>
                          window.dispatchEvent(
                            new CustomEvent("lightning:strike")
                          )
                  }
                  className="group flex items-center gap-0 shrink-0"
                >
                  {logoContent}
                </Link>
              </motion.div>

              {onHomepage ? (
                <div className="flex-1" />
              ) : (
                <nav
                  aria-label="Sections"
                  className="hidden md:flex flex-1 items-center justify-center px-6"
                >
                  <SectionNav activeId={activeSectionId} tone="dark" />
                </nav>
              )}

              <motion.div
                className="flex items-center gap-5 shrink-0"
                style={{ opacity: controlsOpacity, pointerEvents: controlsPointer }}
              >
                <Link
                  href="/#contact"
                  scroll={false}
                  onClick={handleYallaClick}
                  className="relative group hidden sm:inline-flex items-center pl-7 pr-5 pt-4 pb-3 sm:pl-8 sm:pr-6 text-[#230F2C]"
                >
                  {/* Hand-drawn white blob — the CTA's resting backdrop. Same
                      puck artwork and opacity as the nav icon pucks
                      (SectionNav: object-contain, opacity-30), but stretched
                      oblong via `object-fill` to wrap "Yalla!" instead of
                      sitting as a circle. The button padding gives the word
                      breathing room inside the puck's opaque centre. Fades out
                      on hover (and on /contact, where the burst is pinned on)
                      so the explosion has the stage to itself. */}
                  <img
                    src="/images/shapes/Untitled_Artwork%203.png"
                    alt=""
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 h-full w-full select-none object-fill transition-opacity duration-200 ease-out ${
                      pathname === "/contact"
                        ? "opacity-0"
                        : "opacity-50 group-hover:opacity-0 group-focus-visible:opacity-0"
                    }`}
                  />

                  <span
                    aria-hidden
                    className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[100px] sm:w-[200px] sm:h-[125px] transition-opacity duration-200 ease-out ${
                      pathname === "/contact"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                    style={{
                      backgroundColor: "#ffffff",
                      WebkitMaskImage: "url(/images/accents/burst.png)",
                      maskImage: "url(/images/accents/burst.png)",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                  <span className="relative z-10 font-handwritten text-2xl sm:text-3xl leading-none transition-transform duration-200 ease-out group-hover:-rotate-[6deg] group-focus-visible:-rotate-[6deg]">
                    Yalla!
                  </span>
                </Link>

                {/* Hover: the two lines wiggle apart with a hand-drawn tilt
                    (mirrors the logo's playful hover). The open-state X
                    morph lives in Navigation's close button, which sits at
                    these exact coordinates above the overlay. */}
                <button
                  onClick={() => setMenuOpen((open) => !open)}
                  className="group relative z-50 flex flex-col items-center justify-center w-11 h-11 gap-[5px]"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  <span
                    className="block w-5 h-[1.5px] transition-transform duration-200 ease-out group-hover:-translate-y-[2px] group-hover:rotate-[-8deg] group-focus-visible:-translate-y-[2px] group-focus-visible:rotate-[-8deg]"
                    style={{ backgroundColor: "#230F2C" }}
                  />
                  <span
                    className="block w-5 h-[1.5px] transition-transform duration-200 ease-out group-hover:translate-y-[2px] group-hover:rotate-[6deg] group-focus-visible:translate-y-[2px] group-focus-visible:rotate-[6deg]"
                    style={{ backgroundColor: "#230F2C" }}
                  />
                </button>
              </motion.div>
            </motion.div>
          );
        })()}

        {/* Torn bottom edge — a few subtle angles so the bar tears into the
            page rather than meeting it at a flat line. Stays attached to the
            bar's bottom (top-full) so it follows the collapse animation. */}
        {barBg && (
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-full w-full"
            style={{ height: 7 }}
            viewBox="0 0 1440 7"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L1440,0 L1440,3 L1040,7 L660,2 L300,7 L0,4 Z" fill={barBg} />
          </svg>
        )}
      </motion.header>

      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
