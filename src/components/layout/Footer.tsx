"use client";

import Image from "next/image";
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
  const onServicesPage = pathname?.startsWith("/services/");
  const onHomepage = pathname === "/";

  // Homepage has no scroll past the final contact panel — the social row
  // and copyright live INSIDE that panel (see FullscreenScroller's
  // ContactPanel) so the whole experience fits inside one scroll length.
  if (onHomepage) return null;

  if (onServicesPage) {
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
        {/* Single row: logo | handwriting (center) | LinkedIn */}
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 flex-1">
            <span
              aria-hidden
              className="block h-7 w-7 shrink-0"
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
            <span className="font-headline text-2xl leading-none">Startle Labs</span>
          </div>
          <p className="font-handwritten text-xl flex items-center gap-2" style={{ color: "#230F2C" }}>
            Hand-drawn with
            <span className="relative group inline-block" style={{ width: 24, height: 24 }}>
              <Image
                src="/images/icons/Heart .png"
                alt="love"
                width={24}
                height={24}
                className="inline-block"
              />
              <RadiatingBolts color="white" scale={0.12} bolts={HEART_BOLTS} />
            </span>
            in TLV
          </p>
          <div className="flex-1 flex justify-end">
            <a href="https://linkedin.com/in/shaidavis" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] font-semibold hover:opacity-70 transition-opacity">
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

        {/* Copyright centered below */}
        <div className="mt-4 text-center">
          <span className="text-xs opacity-70" style={{ color: "#230F2C" }}>
            © {new Date().getFullYear()} Startle Labs
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-8 px-8 text-sm text-neutral-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} Startle Labs</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://linkedin.com/in/shaidavis" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
