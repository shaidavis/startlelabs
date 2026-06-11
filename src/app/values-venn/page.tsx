import { InteractiveVennCanvas } from "@/components/about/InteractiveVennCanvas";
import { TornEdge } from "@/components/ui/TornEdge";

export const metadata = {
  title: "Well-Rounded Values — Startle Labs",
  description:
    "Interactive reference: the three brand values animate in over a timeline, and every region names itself on rollover.",
};

const ORANGE = "#E85D28";
const CREAM = "#F4EEE1";
const LAVENDER = "#f2f1fa";
const INK = "#230F2C";

const GRUNGE = {
  backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundBlendMode: "overlay" as const,
};

/**
 * Internal reference page for the interactive Venn, shown in situ on a Startle
 * Labs cream surface — under the sitewide navbar and framed by torn-paper
 * section dividers, the way it would sit on the About page.
 *
 * Not linked from public navigation — reach via /values-venn.
 */
export default function ValuesVennPage() {
  return (
    <main>
      {/* Hero band (orange) — sits under the global navbar */}
      <section
        className="relative px-6 pt-32 pb-20 text-center sm:pt-36"
        style={{ backgroundColor: ORANGE, color: INK, ...GRUNGE }}
      >
        <h1 className="font-headline text-5xl leading-[1.05] sm:text-6xl">
          Well-Rounded Values
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg" style={{ color: `${INK}cc` }}>
          Each value arrives on its own, then every overlap — and the centre —
          names itself when you hover.
        </p>
      </section>

      {/* Venn section (cream) — torn divider seams it to the hero above */}
      <section
        className="relative px-6 pb-28 pt-20"
        style={{ backgroundColor: CREAM }}
      >
        <TornEdge color={CREAM} variant={3} grunge />
        {/* Visible paper-grunge texture across the cream surface */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
            backgroundSize: "620px",
            mixBlendMode: "multiply",
            opacity: 0.5,
          }}
        />
        <div className="relative z-10">
          <InteractiveVennCanvas />
        </div>
      </section>

      {/* Closing band (lavender) — another torn divider below the Venn */}
      <section
        className="relative px-6 pb-28 pt-20 text-center"
        style={{ backgroundColor: LAVENDER }}
      >
        <TornEdge color={LAVENDER} variant={2} grunge />
        <p className="font-headline text-2xl" style={{ color: INK }}>
          Creativity, where it all meets.
        </p>
      </section>
    </main>
  );
}
