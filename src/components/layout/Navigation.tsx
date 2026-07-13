"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { RadiatingBolts } from "@/components/effects/RadiatingBolts";
import { servicesList } from "@/data/services";

const HEART_BOLTS = (() => {
  const count = 8;
  const out = [];
  for (let i = 0; i < count; i++) {
    const angle = -90 + (i * 360) / count;
    out.push({ shape: "zigzag-1" as const, angle, size: 230, delay: i * 55 });
  }
  return out;
})();

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

// Services are listed individually so each one has a discoverable, shareable
// route through the menu. Previously we collapsed them into a single
// "Services" entry that just linked to brand-strategy — which hid the other
// two and gave no indication of what was offered. The full service detail
// pages live at `/services/{slug}`; the homepage scroller panels are
// accessible via SectionNav's icon strip.
const links = [
  { label: "Home", href: "/" },
  ...servicesList.map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  })),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navigation({ isOpen, onClose }: NavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // The overlay stays MOUNTED and animates between states instead of using
  // AnimatePresence exit: after the upstream navbar rework, the exit pass
  // stopped completing, leaving an invisible full-screen overlay that
  // swallowed every click on the page. Keeping it mounted with
  // `inert` + pointer-events:none while closed is more robust and also
  // removes the hidden menu from the tab order / accessibility tree.
  return (
    <div
      ref={navRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      inert={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
          {/* Close button — positioned exactly over the Topbar hamburger
              (same right padding + bar height + hit area) and built from
              the same two lines, which rotate from parallel into an X as
              the overlay fades in. Reads as the burger itself morphing
              rather than a separate ✕ appearing elsewhere. */}
          <button
            onClick={onClose}
            className="absolute top-0 right-8 sm:right-10 md:right-12 h-[64px] sm:h-[76px] flex items-center text-white/80 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <span className="relative flex items-center justify-center w-11 h-11">
              <span
                className={`absolute block w-5 h-[1.5px] bg-current transition-transform duration-300 ease-out ${
                  isOpen ? "translate-y-0 rotate-45" : "-translate-y-[3.25px] rotate-0"
                }`}
                style={{ transitionDelay: isOpen ? "120ms" : "0ms" }}
              />
              <span
                className={`absolute block w-5 h-[1.5px] bg-current transition-transform duration-300 ease-out ${
                  isOpen ? "translate-y-0 -rotate-45" : "translate-y-[3.25px] rotate-0"
                }`}
                style={{ transitionDelay: isOpen ? "120ms" : "0ms" }}
              />
            </span>
          </button>

          {/* Footer bar — mirrors the services-page footer, white text, yellow heart/rays */}
          <div className="absolute bottom-0 left-0 right-0 py-5 px-8 sm:px-16 md:px-24 lg:px-32 border-t border-white/10">
            {/* Stacks below `sm` — three-across overflows the right edge on
                phone widths and clipped the LinkedIn link. */}
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-6">
              <div className="hidden sm:flex items-center gap-3 sm:flex-1">
                <span
                  aria-hidden
                  className="block h-7 w-7 shrink-0"
                  style={{
                    backgroundColor: "white",
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
                <span className="font-headline text-xl leading-none text-white">Startle Labs</span>
              </div>
              {/* div, not <p>: RadiatingBolts renders <div>s, which are
                  invalid inside a paragraph and caused hydration errors. */}
              <div className="font-handwritten text-xl flex items-center gap-2 text-white">
                Hand-drawn with
                <span className="relative group inline-block" style={{ width: 24, height: 24 }}>
                  <Image
                    src="/images/icons/Heart .png"
                    alt="love"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                  <RadiatingBolts color="#e9c402" scale={0.12} bolts={HEART_BOLTS} />
                </span>
                in TLV
              </div>
              <div className="sm:flex-1 flex sm:justify-end">
                <a href="https://linkedin.com/in/shaidavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 py-3 -my-3 text-sm uppercase tracking-[0.2em] font-semibold text-white hover:opacity-70 transition-opacity">
                  LinkedIn
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-white/50">© {new Date().getFullYear()} Startle Labs</span>
            </div>
          </div>

          {/* Links — Haze spacing: gap 24px, padding 64px desktop / 32px phone.
              CSS-staggered entrance: each link slides in from the right with
              an increasing transition-delay while the overlay fades. */}
          <nav className="flex flex-col items-center gap-6 px-8 py-8 sm:px-16 sm:py-16">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`grid font-headline text-3xl sm:text-4xl text-center text-white/70 lowercase hover:uppercase tracking-[0.08em] hover:text-white transition-[opacity,transform,color] duration-300 ease-out ${
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
                style={{ transitionDelay: isOpen ? `${150 + i * 60}ms` : `${i * 30}ms` }}
                onClick={onClose}
              >
                {/* Always-uppercase invisible ghost reserves the cell to the
                    uppercase footprint, so flipping case on hover doesn't
                    resize/reflow the link. The visible label inherits the
                    link's case (lowercase → uppercase on hover) and is
                    centered over the ghost in the same grid cell. */}
                <span aria-hidden className="col-start-1 row-start-1 invisible uppercase">
                  {link.label}
                </span>
                <span className="col-start-1 row-start-1">{link.label}</span>
              </a>
            ))}
          </nav>
    </div>
  );
}
