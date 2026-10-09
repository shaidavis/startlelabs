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

// Curated picks from ~430 past naming reports (2017–2025), shortlisted
// 2026-10-09. Taglines marked in the source report are kept verbatim; the
// rest were written for the wall. See .claude/plans/naming-wall.md.
export const namingSamples: NamingSample[] = [
  {
    id: "oomaa",
    name: "Oomaa",
    tagline: "Ooh. Mmm. Aah.",
    business: "A nut-based milk alternative for the UK grocery aisle.",
    rationale:
      "An invented word built from the sounds of enjoying a drink: \"ooh\" for wonder, \"mmm\" for delight, \"aa\" for refreshment, \"ma\" for care. Five letters, a whole wave of feel-good. And \"Oom\" is \"moo\" backwards: a dairy wink so subtle it is almost subliminal.",
    market: "Food & drink",
    style: "coined",
    pairing: "rounded",
    scene: "glow",
    palette: ["#fff4e0", "#f7b267"],
  },
  {
    id: "sift-advisory",
    name: "Sift Advisory",
    tagline: "Sift happens.",
    business: "An app that digs the hidden fees out of investment contracts and legalese.",
    rationale:
      "Sift conjures a prospector shaking the dust off to reveal gold, which is exactly the job: cut through the fine print and surface the fees nobody mentioned. The tagline makes a serious product approachable in two words.",
    market: "Fintech",
    style: "metaphor",
    pairing: "tech",
    scene: "grid",
    palette: ["#0f1b2d", "#f2c94c"],
  },
  {
    id: "cooling-brooks",
    name: "Cooling Brooks",
    tagline: "Colour your Sunday in.",
    business: "Adult colouring books for slow, meditative afternoons.",
    rationale:
      "A cooling brook of gently flowing water is the mood of a lazy Sunday with a colouring book. It is also an anagram of \"colouring book\", shares its initials, and rhymes with it. Three tricks in one calm little name.",
    market: "Publishing",
    style: "playful",
    pairing: "warm",
    scene: "waves",
    palette: ["#e6f2ef", "#2a9d8f"],
  },
  {
    id: "search-ventures",
    name: "SEARCH Ventures",
    tagline: "The search starts in Southeast Asia.",
    business: "A Singapore venture fund backing startups across Southeast Asia.",
    rationale:
      "The SEArch begins with SouthEast Asia: the first three letters quietly spell the region. And search is the whole job of a VC, hunting for the most promising companies and helping them grow.",
    market: "Venture capital",
    style: "acronym",
    pairing: "tech",
    scene: "diagonal",
    palette: ["#14213d", "#fca311"],
  },
  {
    id: "mermaid-cleaners",
    name: "Mermaid Cleaners",
    tagline: "Spotless, from the deep end up.",
    business: "A pool and window cleaning service.",
    rationale:
      "A mermaid's native habitat is the water, so she is the natural mascot for a pool cleaning company. What makes the name even better: \"maid\" is built right into it.",
    market: "Home services",
    style: "compound",
    pairing: "script",
    scene: "waves",
    palette: ["#0b7a8f", "#bdeeff"],
  },
  {
    id: "flashback-transfer",
    name: "Flashback Transfer",
    tagline: "The film arrives before the popcorn.",
    business: "Secure digital delivery of feature films from studios to cinemas worldwide.",
    rationale:
      "Flash is the speed of the transfer, in a flash. Back is the program running quietly in the background. And a flashback is a scene from a film's past, so the name belongs to the industry it serves.",
    market: "Media tech",
    style: "compound",
    pairing: "condensed",
    scene: "stripes",
    palette: ["#1a1a1a", "#e63946"],
  },
  {
    id: "farewell",
    name: "FareWell",
    tagline: "Ten dollars a night. Bon voyage.",
    business: "A travel app where every stay costs a flat ten dollars.",
    rationale:
      "A fare is a fixed fee for travel, an exact reference to the ten dollars users pay. Well means they are getting a good deal and faring well. Said together it is the send-off: bon voyage, have a great trip.",
    market: "Travel",
    style: "compound",
    pairing: "editorial",
    scene: "sunrise",
    palette: ["#f4e9d8", "#e76f51"],
  },
  {
    id: "make-the-call",
    name: "Make the Call",
    tagline: "HIPAA questions, answered on the first ring.",
    business: "On-call HIPAA compliance advice for medical offices.",
    rationale:
      "A sharp play on words that is both the judgement call a compliance officer has to make and the phone call a medical office should make to get direction. The name is the service.",
    market: "Healthcare",
    style: "real-word",
    pairing: "condensed",
    scene: "duotone",
    palette: ["#f1f5f9", "#1d4ed8"],
  },
  {
    id: "porpoise",
    name: "Porpoise",
    tagline: "Find your next project on porpoise.",
    business: "A platform matching freelancers with projects that need them.",
    rationale:
      "The porpoise is a clever, sociable, supportive creature, and the word is a play on purpose. It balances the noble aspirations of its users with a voice that is fun and friendly rather than earnest.",
    market: "Freelance platform",
    style: "playful",
    pairing: "rounded",
    scene: "rings",
    palette: ["#0a4d68", "#88e0ef"],
  },
  {
    id: "kuko",
    name: "Kuko",
    tagline: "Everything but the oven.",
    business: "Cake-decorating kits for home bakers.",
    rationale:
      "Kuko means cake in Esperanto. It is rhythmic and catchy, and because it is not an English word the brand gets to own it outright. Paired with Kits it turns alliterative and tells you what is in the box.",
    market: "Food & hobby",
    style: "foreign-word",
    pairing: "playful",
    scene: "dots",
    palette: ["#fff1f2", "#f43f5e"],
  },
  {
    id: "uplynx",
    name: "upLynx",
    tagline: "Text your mother from the summit.",
    business: "A satellite messenger for travellers and explorers.",
    rationale:
      "Links was too obvious, so we reached for its homophone. The lynx is a graceful beast whose name comes from the Indo-European root for brightness and light, and the whole word sounds like the uplinks that power satellite communication.",
    market: "Hardware",
    style: "coined",
    pairing: "tech",
    scene: "grid",
    palette: ["#0b1020", "#7cf5c3"],
  },
  {
    id: "babybabble",
    name: "BabyBabble",
    tagline: "Everything they need, before they can say so.",
    business: "An importer and retailer of baby gear.",
    rationale:
      "It is impossible to say this name out loud without a smile. Babbling is the sound a baby makes when first discovering their voice, and the word even sounds like \"baby\" itself.",
    market: "Kids",
    style: "compound",
    pairing: "rounded",
    scene: "dots",
    palette: ["#fef3c7", "#f59e0b"],
  },
  {
    id: "eos",
    name: "Eos",
    tagline: "Every bottle, a small dawn.",
    business: "A line of essential oils.",
    rationale:
      "Eos, the Greek goddess of dawn, stands for new beginnings and fresh starts, nature and wellness in one figure. And hiding in plain sight: Eos is Essential OilS.",
    market: "Wellness",
    style: "classical-root",
    pairing: "luxury",
    scene: "sunrise",
    palette: ["#fdf2e9", "#e9a23b"],
  },
  {
    id: "firecrest",
    name: "Firecrest",
    tagline: "We keep the lights on at 9,000 feet.",
    business: "A property management company in the Colorado mountains.",
    rationale:
      "A firecrest is a tiny bird: small and unobtrusive, but regal and proud. It is migratory, like many of the owners it would serve, and \"crest\" nods to the peaks. The word sounds high-end without trying.",
    market: "Property",
    style: "metaphor",
    pairing: "softserif",
    scene: "diagonal",
    palette: ["#2b2d42", "#ef8354"],
  },
  {
    id: "stormen",
    name: "Stormen",
    tagline: "Storm the gates. Tame the monster.",
    business: "A mobile monster-battle game.",
    rationale:
      "Ending in \"-en\" lets one word work as singular and plural. It carries the zeal of stormin' the gates. And the cherry on top: Stormen is an anagram of monster.",
    market: "Gaming",
    style: "coined",
    pairing: "fashion",
    scene: "glow",
    palette: ["#120a1f", "#9d4edd"],
  },
  {
    id: "vaxa",
    name: "Vaxa",
    tagline: "The suitcase that grows with the trip.",
    business: "An expandable suitcase with two sizes in one shell.",
    rationale:
      "Vaxa simply means grow in Icelandic. The simplicity of the word is sharpened by the way it is said: the opening V and the X in the middle give it a modern, engineered edge. Very ownable.",
    market: "Travel goods",
    style: "foreign-word",
    pairing: "wide",
    scene: "checker",
    palette: ["#e2e8f0", "#0f172a"],
  },
  {
    id: "qrtz",
    name: "Qrtz Glassware",
    tagline: "Built from the stuff mountains are made of.",
    business: "A maker of tough glass water bottles.",
    rationale:
      "Quartz is strong and is a core ingredient of glass; quarts is a quantity of liquid. Three reasons the word fits. Dropping the vowels gives it the terse, premium look of a label on a lab bottle.",
    market: "Housewares",
    style: "coined",
    pairing: "geometric",
    scene: "grid",
    palette: ["#f8fafc", "#334155"],
  },
  {
    id: "vitaroos",
    name: "Vitaroos",
    tagline: "Big hops for small people.",
    business: "A children's vitamin brand.",
    rationale:
      "Among live-born animals the biggest grower is the red kangaroo, which multiplies its birth weight about 96,000 times. Kangaroos are full of energy, cute and eminently illustratable: a vitamin and a mascot in one word.",
    market: "Kids health",
    style: "portmanteau",
    pairing: "playful",
    scene: "waves",
    palette: ["#ffe66d", "#ff6b6b"],
  },
  {
    id: "kula",
    name: "Kula",
    tagline: "Say the word. Dinner's coming.",
    business: "An online food-ordering and delivery platform.",
    rationale:
      "Kula is the Swahili word for eat. Two syllables, catchy, and it sounds a bit like cool.",
    market: "Food delivery",
    style: "foreign-word",
    pairing: "wide",
    scene: "duotone",
    palette: ["#fb923c", "#431407"],
  },
  {
    id: "awl-and-hammer",
    name: "Awl & Hammer",
    tagline: "Shoes that get resoled, not replaced.",
    business: "A cobbler and leather-goods brand.",
    rationale:
      "The two main tools of a cobbler, named plainly. It carries a sense of true craftsmanship and hands the designer a logo on a plate.",
    market: "Leather goods",
    style: "compound",
    pairing: "poster",
    scene: "stripes",
    palette: ["#3e2723", "#d7a86e"],
  },
  {
    id: "antsy",
    name: "Antsy",
    tagline: "For the itch to buy. And the itch to sell.",
    business: "A marketplace app for buying and selling second-hand treasures.",
    rationale:
      "A modern, Etsy-adjacent name. Antsy means eager or restless, like someone hunting for the perfect item, or someone who cannot wait to get rid of one. Plus, it has an ant in it.",
    market: "Marketplace",
    style: "playful",
    pairing: "rounded",
    scene: "dots",
    palette: ["#111827", "#fbbf24"],
  },
  {
    id: "balefire",
    name: "Balefire Apparel",
    tagline: "Wear it loud enough to see from the next hill.",
    business: "A statement-tee apparel brand.",
    rationale:
      "A balefire is a large outdoor fire lit as a signal, a technique older than the lighthouse. Fire is the right image for loud clothing, and so is signalling: these are tees that say something from a distance.",
    market: "Apparel",
    style: "metaphor",
    pairing: "condensed",
    scene: "glow",
    palette: ["#1a1a1a", "#ff4d1f"],
  },
  {
    id: "rhino-ventures",
    name: "Rhino Ventures",
    tagline: "Unicorns are a myth. Rhinos are hard to stop.",
    business: "A venture fund investing in Southeast Asia.",
    rationale:
      "The Indian rhinoceros, Rhinoceros unicornis, is the hard, strong, fierce version of the unicorn, which answers the VC world's unicorn obsession head-on. It is also native to Asia, so the name carries toughness and local roots at once.",
    market: "Venture capital",
    style: "metaphor",
    pairing: "poster",
    scene: "diagonal",
    palette: ["#2f3e46", "#cad2c5"],
  },
  {
    id: "casimir-cleaners",
    name: "Casimir Cleaners",
    tagline: "Floors fit for a prince.",
    business: "A floor and carpet cleaning company.",
    rationale:
      "Prince Casimir was a 15th-century Polish royal who slept on the floor rather than in his bed. Polish the country, polish the verb. And the Casimir effect, from physics, is best observed in a vacuum. A boring category, two stacked puns, one real story.",
    market: "Home services",
    style: "metaphor",
    pairing: "luxury",
    scene: "rings",
    palette: ["#f5f0e6", "#8b5e3c"],
  },
  {
    id: "wrapscallion",
    name: "Wrapscallion",
    tagline: "How do you roll?",
    business: "A fast-casual wrap sandwich shop.",
    rationale:
      "A rapscallion is a fun-loving, impish, mischievous person. Adding a W makes it wrap, the sandwich, plus scallion, the onion that suggests freshness. The rascal comes with a mascot built in.",
    market: "Food",
    style: "portmanteau",
    pairing: "playful",
    scene: "stripes",
    palette: ["#166534", "#bbf7d0"],
  },
  {
    id: "the-unbrella",
    name: "The Unbrella",
    tagline: "Look ma, no hands!",
    business: "A hands-free umbrella you wear on your head.",
    rationale:
      "Cut the second letter of umbrella and the meaning flips. The unbrella is the un-umbrella: it overturns everything the customer thought they knew about staying dry, one deleted letter at a time.",
    market: "Consumer products",
    style: "playful",
    pairing: "poster",
    scene: "waves",
    palette: ["#dbeafe", "#1e40af"],
  },
  {
    id: "czech-me-out",
    name: "Czech Me Out",
    tagline: "Nails, brows and a reason to turn heads.",
    business: "A nail and beauty spa in Prague.",
    rationale:
      "A true pun on the sound of Czech and check. The spa is where people go to get beautiful, and once they leave, people will certainly be checking them out. The name is its own tagline.",
    market: "Beauty",
    style: "playful",
    pairing: "script",
    scene: "dots",
    palette: ["#fdf2f8", "#db2777"],
  },
  {
    id: "mont-noir",
    name: "Mont Noir",
    tagline: "A cut above the rest.",
    business: "A premium, European-style cookware brand.",
    rationale:
      "Literally black mountain, the corollary to premium names like Mont Blanc. It signals Alpine, European luxury in two words, and the black suits the cookware itself.",
    market: "Home goods",
    style: "foreign-word",
    pairing: "luxury",
    scene: "duotone",
    palette: ["#0f0f0f", "#c9a227"],
  },
  {
    id: "ornate-riots",
    name: "Ornate Riots",
    tagline: "Beautiful messes, restored.",
    business: "A furniture and vintage restoration studio.",
    rationale:
      "A nearly nonsensical, absurdist, almost oxymoronic name. How can a riot be ornate? The work turns messes into something lovely, which is the point. And Ornate Riots is an anagram of restoration.",
    market: "Craft",
    style: "playful",
    pairing: "poster",
    scene: "checker",
    palette: ["#f4ece2", "#7c2d12"],
  },
  {
    id: "alula",
    name: "Alula",
    tagline: "Built to lift, not to fix.",
    business: "A mental-wellness app designed around the strengths of socially anxious people.",
    rationale:
      "The alula is the bird's thumb, the small winglet that makes flight possible, from the Latin for little wing. The app helps people spread their wings, all at the tips of their thumbs. It is also a palindrome, which gives it balance.",
    market: "Mental wellness",
    style: "classical-root",
    pairing: "softserif",
    scene: "glow",
    palette: ["#eef2ff", "#818cf8"],
  },
  {
    id: "sea-level-academy",
    name: "Sea Level Academy",
    tagline: "Leadership, from the top deck.",
    business: "Executive seminars held aboard a cruise ship.",
    rationale:
      "Sea level is zero altitude on the water and a pun on C-level, the executive suite. One name tells you who it is for and where it happens.",
    market: "Executive education",
    style: "playful",
    pairing: "geometric",
    scene: "waves",
    palette: ["#0c4a6e", "#e0f2fe"],
  },
  {
    id: "after-autumn",
    name: "After Autumn",
    tagline: "What comes after the machines come.",
    business: "A nonprofit retraining workers whose jobs are being automated away.",
    rationale:
      "Autumn connotes change, a slowing down in advance of a rebirth. Said aloud it also carries the sound of automation, so the name holds both the threat and the renewal that follows it.",
    market: "Nonprofit",
    style: "metaphor",
    pairing: "warm",
    scene: "sunrise",
    palette: ["#fff7ed", "#c2410c"],
  },
  {
    id: "steerjoy",
    name: "SteerJoy",
    tagline: "Walk out with the car and the upper hand.",
    business: "A consumer-advocacy app for buying a car.",
    rationale:
      "One letter off from sheer joy. The driving metaphor of steering becomes a feeling, and the app's promise of taking the wheel in a negotiation is right there in the word. Short, ownable, easy to say.",
    market: "Automotive",
    style: "playful",
    pairing: "wide",
    scene: "diagonal",
    palette: ["#fde047", "#1c1917"],
  },
  {
    id: "radial-tech",
    name: "Radial Tech",
    tagline: "Every angle, every millisecond.",
    business: "Lidar sensing for self-driving vehicles.",
    rationale:
      "A spin-and-scan image for how lidar sees the world, with a descriptor hidden in the letters: Radial Tech is an anagram of A Lidar Tech.",
    market: "Deep tech",
    style: "compound",
    pairing: "tech",
    scene: "rings",
    palette: ["#020617", "#38bdf8"],
  },
  {
    id: "kumara",
    name: "Kumara",
    tagline: "The roots of Howick.",
    business: "A community television channel for Howick, New Zealand.",
    rationale:
      "Kumara is the Maori word for sweet potato, a root crop with a long history in the region. It gives a local channel a grounded, place-specific identity, and the tagline finishes the metaphor.",
    market: "Community media",
    style: "foreign-word",
    pairing: "warm",
    scene: "dots",
    palette: ["#4a2c2a", "#f4a261"],
  },
  {
    id: "wedew",
    name: "WeDew",
    tagline: "Dig in, wherever you live.",
    business: "A garden box for small spaces.",
    rationale:
      "A palindrome: the same backwards and forwards, which looks balanced in a logo. It reads as a friendly invitation (we do) with the morning dew folded in.",
    market: "Gardening",
    style: "playful",
    pairing: "rounded",
    scene: "waves",
    palette: ["#ecfccb", "#4d7c0f"],
  },
  {
    id: "home2",
    name: "Home2",
    tagline: "Your Airbnb, run like a hotel.",
    business: "A support and management service for short-term rental hosts.",
    rationale:
      "Written as Home squared, it sounds like O2, suggests a second home and reads as home to the power of two. One compact mark, several readings.",
    market: "Hospitality",
    style: "compound",
    pairing: "geometric",
    scene: "checker",
    palette: ["#f1f5f9", "#0ea5e9"],
  },
  {
    id: "specular-medical",
    name: "Specular Medical",
    tagline: "The pain is real. So is the relief.",
    business: "Augmented-reality mirror therapy for phantom-limb pain.",
    rationale:
      "Specular means of, or pertaining to, a mirror, which is the therapy's core principle, and it carries an echo of spectacular. It explains the mechanism and sounds like a clinic.",
    market: "Medtech",
    style: "classical-root",
    pairing: "editorial",
    scene: "grid",
    palette: ["#f0fdfa", "#0f766e"],
  },
  {
    id: "unstock-films",
    name: "Unstock Films",
    tagline: "No stock. All story.",
    business: "An independent film production company in Stockholm.",
    rationale:
      "Stock footage is generic, bland and forgettable, and the name is the opposite of that. It also tips its hat to Stock(holm).",
    market: "Film",
    style: "playful",
    pairing: "condensed",
    scene: "stripes",
    palette: ["#18181b", "#fafafa"],
  },
  {
    id: "shift8",
    name: "shift8",
    tagline: "Home, one key away.",
    business: "A housing program helping low-income families afford a home.",
    rationale:
      "Shift signals a change in mindset and surroundings. Shift-8 on the keyboard is the star, a symbol of light and of dreaming, and the 8 nods to Section 8. As a bonus, the shift key's arrow looks like a house.",
    market: "Affordable housing",
    style: "coined",
    pairing: "tech",
    scene: "dots",
    palette: ["#1e1b4b", "#a5b4fc"],
  },
  {
    id: "bowerbird",
    name: "bowerbird",
    tagline: "Build the nest. Bring the family.",
    business: "A housing program helping low-income families afford a home.",
    rationale:
      "A bower is a pleasant, shady place under trees or climbing plants, and the male bowerbird builds one, staging his collection to start a family. A lovely image that mixes nature and home, and it reads well in lowercase.",
    market: "Affordable housing",
    style: "metaphor",
    pairing: "softserif",
    scene: "sunrise",
    palette: ["#f0f4e8", "#3f6212"],
  },
  {
    id: "cleave-studio",
    name: "Cleave Studio",
    tagline: "Split the clay. Mend the maker.",
    business: "A mindful ceramics studio where people reconnect with themselves through clay.",
    rationale:
      "Cleave is a contranym: it means both split apart and fuse together, the two core actions of ceramics. It captures the dualities within all of us, and the alliteration with clay makes it stick.",
    market: "Arts & wellness",
    style: "real-word",
    pairing: "softserif",
    scene: "duotone",
    palette: ["#e7e5e4", "#78350f"],
  },
  {
    id: "teratai-labs",
    name: "Teratai Labs",
    tagline: "Clear energy, from muddy data.",
    business: "An AI-driven energy research company serving Southeast Asia.",
    rationale:
      "Teratai is the Malay word for lotus, a regional symbol of purity, enlightenment and rebirth. The word happens to end in the letters AI, which was too irresistible to leave out. Like the lotus rising from muddy water, the company turns complex energy data into clarity.",
    market: "Energy & AI",
    style: "foreign-word",
    pairing: "wide",
    scene: "rings",
    palette: ["#042f2e", "#5eead4"],
  },
  {
    id: "setta",
    name: "Setta",
    tagline: "Set it. Taste it. Set it again.",
    business: "A countertop robot chef that records a recipe and replays it.",
    rationale:
      "Setta is an anagram of state and of taste, so it references both the states of matter the machine handles and the end goal. It also leans on set: all set, set it and forget it, a place setting.",
    market: "Kitchen tech",
    style: "coined",
    pairing: "geometric",
    scene: "glow",
    palette: ["#fafaf9", "#dc2626"],
  },
  {
    id: "cunning-folk",
    name: "Cunning Folk",
    tagline: "Proper on the label. Not on the street.",
    business: "A skate and streetwear brand with a voodoo-doll logo.",
    rationale:
      "The cunning folk were Britain's professional folk magicians. On first blush the phrase sounds gentlemanly and proper, which sits nicely against skater streetwear, but they were in fact subversive, just like the brand.",
    market: "Streetwear",
    style: "real-word",
    pairing: "poster",
    scene: "checker",
    palette: ["#fef9c3", "#1c1917"],
  },
  {
    id: "piece",
    name: "PIECE",
    tagline: "Every part of the supply chain, in its place.",
    business: "A logistics consultancy working between Israel and the United States.",
    rationale:
      "The five qualities of good logistics are planning, implementation, control, efficiency and effectiveness, and their initials spell PIECE. A simple, one-syllable word with a backstory that doubles as the pitch.",
    market: "B2B consulting",
    style: "acronym",
    pairing: "condensed",
    scene: "grid",
    palette: ["#1e293b", "#f8fafc"],
  },
  {
    id: "smug",
    name: "Smug",
    tagline: "Feel smug.",
    business: "An online shop for custom-printed mugs.",
    rationale:
      "Your mugs are better than everyone else's, which should make you pretty smug, right? One letter off from the product, and the feeling it sells is the brand.",
    market: "Consumer goods",
    style: "playful",
    pairing: "wide",
    scene: "duotone",
    palette: ["#fef2f2", "#111827"],
  },
  {
    id: "ilit",
    name: "ilit",
    tagline: "Israel, at the chef's table.",
    business: "High-end culinary experiences for visitors to Israel.",
    rationale:
      "The Hebrew word for haute, as in the most upscale dining there is. It sounds like the English elite, its first two letters are IL, the country code, and it shares a root with aliya, the journey to Israel. Four layers in four letters.",
    market: "Food & travel",
    style: "foreign-word",
    pairing: "luxury",
    scene: "glow",
    palette: ["#1c1917", "#d4a373"],
  },
  {
    id: "aerie",
    name: "Aerie Home Financing",
    tagline: "A nest worth defending.",
    business: "A Florida mortgage lender founded by a veteran, serving military families.",
    rationale:
      "An aerie is the nest of a large bird of prey, most often the eagle, America's own symbol. By happy coincidence the word also descends from the Latin for a level piece of ground. If eagles represent the brave men and women of America, aeries are their homes.",
    market: "Mortgages",
    style: "real-word",
    pairing: "editorial",
    scene: "sunrise",
    palette: ["#1f3a5f", "#f2b134"],
  },
  {
    id: "costars",
    name: "Costars",
    tagline: "Find your co-star!",
    business: "An app for personalised video messages from YouTube creators.",
    rationale:
      "Users and their recipients get to see themselves as co-stars with their favourite YouTubers. The name is the promise: it lifts everyday people to the level of their online idols.",
    market: "Creator economy",
    style: "compound",
    pairing: "fashion",
    scene: "stripes",
    palette: ["#4c1d95", "#f5d0fe"],
  },
  {
    id: "otto",
    name: "OTTO",
    tagline: "A second opinion before the first coffee.",
    business: "A video and text chat app for doctors consulting their peers.",
    rationale:
      "An otoscope is a device everyone recognises and few can name; oto means ear and scope means to look, which is exactly what the app does. In capitals the palindrome is symmetrical, and the two O's make a pair of eyes.",
    market: "Healthtech",
    style: "playful",
    pairing: "geometric",
    scene: "rings",
    palette: ["#f8fafc", "#2563eb"],
  },
  {
    id: "ministry-of-shine",
    name: "The Ministry of Shine",
    tagline: "Official business. Serious gloss.",
    business: "A supplier of coatings and detailing products for vehicles.",
    rationale:
      "The wildcard of its report. It evokes an old, mysterious government agency devoted to the art of the shine: vaguely subversive, highly imaginative, and an open invitation to an emblem logo and a faux-serious voice.",
    market: "Automotive",
    style: "playful",
    pairing: "luxury",
    scene: "stripes",
    palette: ["#0a0a0a", "#a3a3a3"],
  },
  {
    id: "cellar-door",
    name: "Cellar Door Media",
    tagline: "Where the beautiful stories are kept.",
    business: "A film and television production company.",
    rationale:
      "Cellar door is the phrase linguists cite as beautiful purely for its sound, regardless of meaning. As a metaphor it has a haunting pull, conjuring the stories and secrets of childhood, which is where films begin.",
    market: "Film & TV",
    style: "real-word",
    pairing: "editorial",
    scene: "glow",
    palette: ["#1c1917", "#b45309"],
  },
  {
    id: "humble-equity",
    name: "Humble Equity",
    tagline: "Quiet money for a loud problem.",
    business: "A Colorado clean-energy investment fund.",
    rationale:
      "In the fast-paced investment world it is rare to find a fund that sees itself as a steward of the planet. The name is reverse marketing: undersell yourself and turn it into a trait. Bold in its coyness, in a category full of Apex and Summit.",
    market: "Clean-energy finance",
    style: "compound",
    pairing: "softserif",
    scene: "diagonal",
    palette: ["#f5f5f4", "#365314"],
  },
  {
    id: "anan",
    name: "Anan",
    tagline: "Clean as a cloud.",
    business: "An organic cleaning-product brand sold online.",
    rationale:
      "Anan is the Hebrew word for cloud: white, pure, weightless and protective. To an English ear it reads as a minimalist modern brand, in the company of Sonos, Aesop and Muji.",
    market: "Home care",
    style: "foreign-word",
    pairing: "geometric",
    scene: "sunrise",
    palette: ["#f8fafc", "#bae6fd"],
  },
  {
    id: "hoopler",
    name: "Hoopler",
    tagline: "Built on seven promises.",
    business: "A European home-appliances brand.",
    rationale:
      "Built from the brand's own values: Honesty, Open-mindedness, Optimism, Passion, Loyalty, Efficiency, Reliability. Their initials spell a meaningless word that turns out to be rife with meaning for the people inside the company.",
    market: "Appliances",
    style: "acronym",
    pairing: "rounded",
    scene: "checker",
    palette: ["#fff7ed", "#ea580c"],
  },
  {
    id: "the-bellwether",
    name: "The Bellwether",
    tagline: "Hear the next big thing before it ticks.",
    business: "A luxury-watch commentator and community brand.",
    rationale:
      "A bellwether is the lead sheep wearing a bell, and so an indicator of where things are heading. Clock itself descends from the word for bell, so the name works for horology specifically: the go-to oracle of the watch world.",
    market: "Luxury watches",
    style: "metaphor",
    pairing: "luxury",
    scene: "rings",
    palette: ["#0f172a", "#cbd5e1"],
  },
  {
    id: "alicorn-capital",
    name: "Alicorn Capital",
    tagline: "The antidote to unicorn fever.",
    business: "A blockchain-focused venture capital firm.",
    rationale:
      "Unicorn was too obvious for a VC, so we reached for the slightly more corporate Alicorn: the unicorn's horn, once traded as a priceless universal antidote. It even carries a tenuous link to cryptozoology.",
    market: "Venture capital",
    style: "real-word",
    pairing: "editorial",
    scene: "diagonal",
    palette: ["#faf5ff", "#6d28d9"],
  },
];
