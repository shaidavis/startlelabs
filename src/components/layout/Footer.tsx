"use client";

import { usePathname } from "next/navigation";
import { TornEdge } from "@/components/ui/TornEdge";
import { RadiatingBolts } from "@/components/effects/RadiatingBolts";

// 8 bolts evenly spaced — fewer than the hero's 12 to suit the small icon.
const HEART_BOLTS = (() => {
  const count = 8;
  const out = [];
  for (let i = 0; i < count; i++) {
    const angle = -90 + (i * 360) / count;
    out.push({ shape: "zigzag-1" as const, angle, size: 230, delay: i * 55 });
  }
  return out;
})();

/**
 * Footer — defaults to a quiet dark variant everywhere, but switches to the
 * yellow brand band on `/services/*` routes to match the Figma wireframe
 * (#e9c402 full-bleed block).
 *
 * On services pages the top of the yellow footer is torn (not flat) — the
 * path is lifted from `public/images/backgrounds/other-services.svg`'s
 * bottom-polygon edge (points (-17.5, 504), (288, 509.5), (755, 489.6),
 * (964, 495.5), (1457, 503.8); normalized → 20px range). This makes the
 * yellow footer tear UP into the lavender cross-sell above it rather
 * than meeting it at a flat horizontal line.
 */
const FOOTER_TORN = {
  path: "M0,14.7 L288,19.9 L755,0 L964,5.9 L1440,13.9 L1440,20 L0,20 Z",
  viewBoxHeight: 20,
};

export function Footer() {
  const pathname = usePathname();
  const onHomepage = pathname === "/";

  // Homepage has no scroll past the final contact panel — the branding row
  // and copyright live INSIDE that panel (see FullscreenScroller's
  // ContactPanel) so the whole experience fits inside one scroll length.
  if (onHomepage) return null;

  // One footer for every other route — the yellow torn band with the same
  // content as the menu screen's footer: logo | hand-drawn with ♥ in TLV |
  // LinkedIn, copyright centered below.
  return (
      <footer
        className="relative py-12 px-8 sm:px-16 md:px-24 lg:px-32"
        style={{
          backgroundColor: "#e9c402",
          color: "#230F2C",
          backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <TornEdge
          color="#e9c402"
          customPath={FOOTER_TORN.path}
          viewBoxHeight={FOOTER_TORN.viewBoxHeight}
          grunge
        />
        {/* Single row: logo | handwriting (center) | LinkedIn.
            Stacks vertically below `sm` — three-across overflows the right
            edge on phone widths and clipped the LinkedIn link. */}
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          {/* Logo keeps the header's items-center composition (tall bolt
              vertically centered on the wordmark). That centering lifts the
              wordmark's baseline ~7px above the row's text baseline, so on the
              horizontal (sm+) layout we nudge the whole logo down to drop its
              wordmark onto the shared baseline of the handwriting + LinkedIn. */}
          <div className="flex items-center gap-0 sm:flex-1 sm:translate-y-[7px]">
            <span
              aria-hidden
              className="block h-7 sm:h-8 w-7 sm:w-8 shrink-0"
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
            <span className="font-headline text-xl sm:text-2xl leading-none">Startle Labs</span>
          </div>
          {/* div, not <p>: RadiatingBolts renders <div>s, which are invalid
              inside a paragraph and caused React hydration errors. */}
          <div className="font-handwritten text-xl whitespace-nowrap" style={{ color: "#230F2C" }}>
            Hand-drawn with{" "}
            <span
              className="relative group inline-block align-middle mx-1"
              style={{ width: 24, height: 24, transform: "translateY(-3px)" }}
            >
              <span
                aria-hidden
                role="img"
                aria-label="love"
                className="block h-full w-full"
                style={{
                  backgroundColor: "#137FBF",
                  WebkitMaskImage: "url(/images/icons/Heart%20.png)",
                  maskImage: "url(/images/icons/Heart%20.png)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <RadiatingBolts color="white" scale={0.12} bolts={HEART_BOLTS} />
            </span>{" "}
            in TLV
          </div>
          <div className="sm:flex-1 sm:text-right">
            <a href="https://linkedin.com/in/shaidavis" target="_blank" rel="noopener noreferrer" className="inline-block py-3 -my-3 text-sm uppercase tracking-[0.2em] font-semibold hover:opacity-70 transition-opacity whitespace-nowrap">
              LinkedIn
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline-block align-middle h-4 w-4 ml-1.5"
                aria-hidden
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright centered below */}
        <div className="mt-4 text-center">
          <span className="text-xs opacity-70" style={{ color: "#230F2C" }}>
            © {new Date().getFullYear()} Startle Labs
          </span>
        </div>
      </footer>
    );
}
