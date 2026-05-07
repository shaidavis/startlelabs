import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Friendly section-anchor URLs. The homepage scroller already knows how to
  // snap to a panel from a hash (via FullscreenScroller's useLayoutEffect),
  // so we just redirect short paths into the same channel:
  //
  //   /strategy        → /#brand-strategy   (panel)
  //   /presentations   → /#creative-direction
  //   /websites        → /#digital-design
  //   /about           → /#about
  //   /contact         → /#contact
  //
  // Redirects run BEFORE file-system routing, so /about and /contact above
  // intentionally supersede the standalone /about and /contact page files —
  // we only have the one Yalla/About flow now (the homepage scroller).
  // Status 307 (permanent: false) keeps things flexible while the URL
  // structure is still settling.
  async redirects() {
    return [
      { source: "/strategy", destination: "/#brand-strategy", permanent: false },
      { source: "/presentations", destination: "/#creative-direction", permanent: false },
      { source: "/websites", destination: "/#digital-design", permanent: false },
      { source: "/contact", destination: "/#contact", permanent: false },
    ];
  },
};

export default nextConfig;
