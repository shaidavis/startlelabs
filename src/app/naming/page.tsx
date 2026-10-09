import { NamingWall } from "@/components/sections/NamingWall";
import { namingSamples } from "@/data/naming";
import { grungeBackground } from "@/lib/texture";

export const metadata = {
  title: "Naming — Startle Labs",
  description:
    "Brand names we've proposed, each with its tagline and the story behind it. A range of markets, styles and tones.",
};

const INK = "#230F2C";
const PAGE_BG = "#f2f1fa";

export default function NamingPage() {
  return (
    <div
      className="pt-32 sm:pt-36 pb-28 sm:pb-36 px-6 sm:px-16 md:px-24 lg:px-32"
      style={{ ...grungeBackground(PAGE_BG), color: INK }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: "#BA4A20" }}>
            Naming
          </p>
          <h1 className="font-headline text-5xl md:text-6xl leading-[1.05] tracking-tight mb-5 text-balance">
            Names with a story to tell
          </h1>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${INK}cc` }}>
            A few of the brand names we&rsquo;ve proposed over the years, stripped to the bone:
            a name, a line, a typeface. Flip a card for the business behind it and the thinking
            behind the name.
          </p>
        </header>
        <NamingWall samples={namingSamples} />
      </div>
    </div>
  );
}
