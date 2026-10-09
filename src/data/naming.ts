import type { PairingId } from "@/app/naming/fonts";
import type { SceneId } from "@/lib/namingScenes";

/**
 * Naming samples — the "barebones brand" cards on /naming.
 *
 * Every card is data: the name, its tagline and rationale, plus the ids of a
 * font pairing (`src/app/naming/fonts.ts`) and a generated background scene
 * (`src/lib/namingScenes.ts`) painted in `palette`. The template never
 * hard-codes a font or colour — change the look here, not in NamingWall.
 *
 * These are names we proposed and like best. We rarely know which one the
 * client finally chose, so no copy here should claim a name "won".
 */

export const NAMING_STYLES = [
  "coined",
  "compound",
  "metaphor",
  "classical-root",
  "descriptive",
  "playful",
  "foreign-word",
  "acronym",
  "portmanteau",
  "real-word",
] as const;

export type NamingStyle = (typeof NAMING_STYLES)[number];

export interface NamingSample {
  /** URL-safe, unique. */
  id: string;
  /** The brand name exactly as proposed. */
  name: string;
  /** One line. From the report when it had one, else written to fit. */
  tagline: string;
  /** One sentence: what the client does. */
  business: string;
  /** 2–3 sentences: the naming story. */
  rationale: string;
  /** Display tag, e.g. "Fintech". */
  market: string;
  style: NamingStyle;
  pairing: PairingId;
  scene: SceneId;
  /** Two colours the scene is painted with: [base, accent]. */
  palette: [string, string];
}

/** Human labels for the style chips on the card back. */
export const STYLE_LABELS: Record<NamingStyle, string> = {
  coined: "Coined word",
  compound: "Compound",
  metaphor: "Metaphor",
  "classical-root": "Latin / Greek root",
  descriptive: "Descriptive",
  playful: "Playful",
  "foreign-word": "Borrowed word",
  acronym: "Acronym",
  portmanteau: "Portmanteau",
  "real-word": "Real word, new job",
};

// PLACEHOLDERS — template review only. Replaced by the curated picks once the
// shortlist is approved (see .claude/plans/naming-wall.md).
export const namingSamples: NamingSample[] = [
  {
    id: "aerie",
    name: "Aerie Home Financing",
    tagline: "A nest worth defending.",
    business: "Florida mortgage lender serving veterans and first-time buyers.",
    rationale:
      "An aerie is the nest of a large bird of prey — most often the eagle, America's own symbol. By happy coincidence the word also descends from the Latin for \"a level piece of ground\". If eagles represent the brave men and women of America, aeries are their homes.",
    market: "Mortgages",
    style: "metaphor",
    pairing: "editorial",
    scene: "sunrise",
    palette: ["#1f3a5f", "#f2b134"],
  },
  {
    id: "aurora-mortgage",
    name: "Aurora",
    tagline: "Every morning, a fresh start.",
    business: "Home mortgage brokerage setting up shop in the Sunshine State.",
    rationale:
      "Aurora, the Roman goddess of dawn, heralded the sun each morning — a harbinger of good things to come. A bright, sun-filled name for a bright, sun-filled home, and a nod to Florida.",
    market: "Mortgages",
    style: "classical-root",
    pairing: "luxury",
    scene: "duotone",
    palette: ["#fbe7c6", "#e85d28"],
  },
  {
    id: "focus-mortgage",
    name: "Focus",
    tagline: "See the whole picture. Sign with confidence.",
    business: "Mortgage solutions brand rebranding away from its founder's name.",
    rationale:
      "Chosen to echo the client's existing name phonetically — same opening and closing sounds — so the rebrand keeps its memory. Focus is also exactly what a buyer wants from a lender: clarity on the one number that matters.",
    market: "Mortgages",
    style: "real-word",
    pairing: "condensed",
    scene: "stripes",
    palette: ["#230f2c", "#e9c402"],
  },
  {
    id: "mylk-blend",
    name: "Oatly-ish",
    tagline: "Placeholder tagline, two lines max.",
    business: "Plant-based milk blend for coffee shops.",
    rationale:
      "Placeholder rationale. Two to three sentences that tell the naming story, keep the best phrase from the report verbatim, and end on why it fits the audience.",
    market: "Food & drink",
    style: "playful",
    pairing: "playful",
    scene: "dots",
    palette: ["#f2f1fa", "#2a9d8f"],
  },
  {
    id: "async-video",
    name: "Loomlike",
    tagline: "Placeholder tagline.",
    business: "Async video messaging for distributed teams.",
    rationale:
      "Placeholder rationale for a tech-flavoured name, so the mono body font and grid scene can be judged on real-looking text.",
    market: "B2B SaaS",
    style: "coined",
    pairing: "tech",
    scene: "grid",
    palette: ["#0b1020", "#7cf5c3"],
  },
  {
    id: "kids-food",
    name: "Nibbly",
    tagline: "Placeholder tagline.",
    business: "Healthy snacks for toddlers.",
    rationale:
      "Placeholder rationale for a kids' brand, so the rounded display face and the wave scene can be judged side by side with the darker cards.",
    market: "Kids",
    style: "playful",
    pairing: "rounded",
    scene: "waves",
    palette: ["#ffe66d", "#ff6b6b"],
  },
];
