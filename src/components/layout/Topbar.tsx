"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Navigation } from "./Navigation";
import { SectionNav } from "./SectionNav";
import { services } from "@/data/services";

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
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const onHomepage = pathname === "/";
  const onServicesPage = pathname?.startsWith("/services/");
  const onAboutPage = pathname === "/about";
  const activeSlug = onServicesPage ? pathname?.split("/")[2] : null;
  const activeService = activeSlug ? services[activeSlug] : null;

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

  // Track whether the user has scrolled past the hero (first viewport) on
  // the homepage. This drives the switch from "logo only, centered" to the
  // full navbar. Threshold is 80% of vh so the navbar slides in just before
  // the second panel snaps into place.
  useEffect(() => {
    if (!onHomepage) {
      setPastHero(true);
      return;
    }
    setPastHero(window.scrollY >= window.innerHeight * 0.8);
    const handleScroll = () => {
      setPastHero(window.scrollY >= window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onHomepage]);

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
        {/* Logo markup shared between hero and full modes so layoutId can
            animate it from centered → left when the user scrolls in. */}
        {(() => {
          const logoContent = (
            <>
              <img
                src="/images/logos/SL%20logo%20grunge%20-dark%20black.png"
                aria-hidden
                alt=""
                className="block h-7 sm:h-8 w-7 sm:w-8 shrink-0 object-contain origin-bottom-left transition-[transform,filter] duration-150 ease-out group-hover:scale-[1.15] group-hover:-rotate-12 group-hover:[filter:drop-shadow(0_0_8px_rgba(239,206,37,0.7))]"
              />
              <span
                className="font-headline text-xl sm:text-2xl leading-none"
                style={{ color: "#230F2C" }}
              >
                Startle Labs
              </span>
            </>
          );

          const showHeroLogo = onHomepage && !pastHero;

          return (
            <AnimatePresence mode="wait">
              {showHeroLogo ? (
                /* ── Hero mode: logo centered, nothing else ── */
                <motion.div
                  key="hero"
                  className={`w-full h-full flex items-center justify-center ${collapsed ? "pointer-events-none" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: collapsed ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div layoutId="topbar-logo">
                    <Link
                      href={homeHref}
                      onClick={handleLogoClick}
                      onMouseEnter={() =>
                        window.dispatchEvent(new CustomEvent("lightning:strike"))
                      }
                      className="group flex items-center gap-0 shrink-0"
                    >
                      {logoContent}
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                /* ── Full navbar mode ── */
                <motion.div
                  key="full"
                  className={`w-full h-full flex items-center justify-between px-8 sm:px-10 md:px-12 ${collapsed ? "pointer-events-none" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: collapsed ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div layoutId="topbar-logo">
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
                    <div className="hidden md:flex flex-1 items-center justify-center px-6">
                      <SectionNav activeId={activeSectionId} tone="dark" />
                    </div>
                  )}

                  <div className="flex items-center gap-5 shrink-0">
                    <Link
                      href="/#contact"
                      scroll={false}
                      onClick={handleYallaClick}
                      className="relative group hidden sm:inline-flex items-center px-2 py-1 text-[#230F2C]"
                    >
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
                      <span className="relative z-10 font-handwritten text-2xl sm:text-3xl leading-none -translate-x-1 transition-transform duration-200 ease-out group-hover:-rotate-[6deg] group-focus-visible:-rotate-[6deg]">
                        Yalla!
                      </span>
                    </Link>

                    <button
                      onClick={() => setMenuOpen(true)}
                      className="relative z-50 flex flex-col items-center justify-center w-10 h-10 gap-[5px]"
                      aria-label="Open menu"
                      aria-expanded={menuOpen}
                    >
                      <span
                        className="block w-5 h-[1.5px] transition-transform"
                        style={{ backgroundColor: "#230F2C" }}
                      />
                      <span
                        className="block w-5 h-[1.5px] transition-transform"
                        style={{ backgroundColor: "#230F2C" }}
                      />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })()}
      </motion.header>

      <Navigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
