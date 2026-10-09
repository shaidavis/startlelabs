import {
  Playfair_Display,
  Bebas_Neue,
  Fraunces,
  Space_Grotesk,
  Cormorant_Garamond,
  Righteous,
  Syne,
  Abril_Fatface,
  Josefin_Sans,
  Lora,
  Unbounded,
  Pacifico,
  Inter,
  Work_Sans,
  Montserrat,
  Nunito,
  IBM_Plex_Mono,
  Karla,
} from "next/font/google";

/**
 * Font pairings for the naming cards. Declared here (not in layout.tsx) so
 * the families are only emitted for the /naming route. `preload: false`
 * keeps ~18 preload tags out of the head; the browser fetches each face
 * when a card first uses it, and `display: swap` keeps text visible.
 *
 * next/font needs literal options at module scope, so each family is its
 * own const. Add a pairing = add a display font (and maybe a body font),
 * then a row in PAIRINGS.
 */
// next/font's compiler transform needs each call's options written out as a
// literal object — no shared const + spread — hence the repetition below.

// ── Display faces ────────────────────────────────────────────────
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false });
const bebas = Bebas_Neue({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], display: "swap", preload: false, weight: ["500", "600"] });
const righteous = Righteous({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });
const syne = Syne({ subsets: ["latin"], display: "swap", preload: false });
const abril = Abril_Fatface({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });
const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap", preload: false });
const lora = Lora({ subsets: ["latin"], display: "swap", preload: false });
const unbounded = Unbounded({ subsets: ["latin"], display: "swap", preload: false });
const pacifico = Pacifico({ subsets: ["latin"], display: "swap", preload: false, weight: "400" });

// ── Body faces ───────────────────────────────────────────────────
const inter = Inter({ subsets: ["latin"], display: "swap", preload: false });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", preload: false });
const nunito = Nunito({ subsets: ["latin"], display: "swap", preload: false });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", preload: false, weight: ["400", "500"] });
const karla = Karla({ subsets: ["latin"], display: "swap", preload: false });

export interface Pairing {
  /** CSS font-family for the brand name. */
  display: string;
  /** CSS font-family for tagline + card back. */
  body: string;
  /** Display weight, where the face offers a choice. */
  displayWeight: number;
  /** Letter-spacing for the name, in em. Condensed faces want air. */
  tracking: number;
  /** Uppercase the name? Only for faces that are built for it. */
  uppercase?: boolean;
}

export type PairingId =
  | "editorial"
  | "condensed"
  | "softserif"
  | "tech"
  | "luxury"
  | "playful"
  | "fashion"
  | "poster"
  | "geometric"
  | "warm"
  | "wide"
  | "script"
  | "rounded";

export const PAIRINGS: Record<PairingId, Pairing> = {
  editorial: { display: playfair.style.fontFamily, body: workSans.style.fontFamily, displayWeight: 600, tracking: -0.01 },
  condensed: { display: bebas.style.fontFamily, body: inter.style.fontFamily, displayWeight: 400, tracking: 0.04, uppercase: true },
  softserif: { display: fraunces.style.fontFamily, body: karla.style.fontFamily, displayWeight: 500, tracking: -0.015 },
  tech: { display: spaceGrotesk.style.fontFamily, body: plexMono.style.fontFamily, displayWeight: 700, tracking: -0.02 },
  luxury: { display: cormorant.style.fontFamily, body: montserrat.style.fontFamily, displayWeight: 600, tracking: 0.02 },
  playful: { display: righteous.style.fontFamily, body: nunito.style.fontFamily, displayWeight: 400, tracking: 0 },
  fashion: { display: syne.style.fontFamily, body: inter.style.fontFamily, displayWeight: 800, tracking: -0.03, uppercase: true },
  poster: { display: abril.style.fontFamily, body: workSans.style.fontFamily, displayWeight: 400, tracking: 0 },
  geometric: { display: josefin.style.fontFamily, body: karla.style.fontFamily, displayWeight: 600, tracking: 0.08, uppercase: true },
  warm: { display: lora.style.fontFamily, body: nunito.style.fontFamily, displayWeight: 600, tracking: -0.01 },
  wide: { display: unbounded.style.fontFamily, body: montserrat.style.fontFamily, displayWeight: 700, tracking: -0.02 },
  script: { display: pacifico.style.fontFamily, body: karla.style.fontFamily, displayWeight: 400, tracking: 0 },
  rounded: { display: nunito.style.fontFamily, body: inter.style.fontFamily, displayWeight: 900, tracking: -0.02 },
};
