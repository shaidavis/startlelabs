"use client";

import { usePathname } from "next/navigation";
import { TornEdge } from "@/components/ui/TornEdge";

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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
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
          <div className="flex gap-8 text-sm uppercase tracking-[0.2em] font-semibold">
            <a href="#" className="hover:opacity-70 transition-opacity">Twitter</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Instagram</a>
            <a href="#" className="hover:opacity-70 transition-opacity">LinkedIn</a>
          </div>
          <span className="text-xs opacity-70">
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
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
