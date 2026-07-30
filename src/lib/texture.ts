import type { CSSProperties } from "react";

/**
 * ── Universal texture control ─────────────────────────────────────────────
 * Single source of truth for the site-wide "printed silkscreen poster"
 * texture. Every section background — homepage panels, service + about
 * sections, footer, and top nav — composites this over its own flat color.
 *
 * Two layers over the base color:
 *   1. HeroGrunge.png   — coarse printed distress / blotches   (blend pngBlend)
 *   2. procedural grain — fine crisp ink speckle from an SVG feTurbulence
 *      tile. Resolution-independent, so it stays sharp where the 1440×954
 *      raster PNG upscales soft on hi-DPI / ultrawide.          (blend grainBlend)
 *
 * TUNE ONCE, EVERYWHERE: edit the values in `TEXTURE` to restyle every surface
 * at once. Need a one-off? pass `overrides` to `grungeBackground()` at the call
 * site (see that function's examples).
 */
export interface TextureConfig {
  /** Coarse raster distress layer. Empty string disables the PNG layer. */
  pngSrc: string;
  /** Blend of the PNG layer with the base color. */
  pngBlend: string;
  /** background-size for the PNG ("cover", "800px", …). */
  pngSize: string;
  /** Fine procedural grain on/off. */
  grain: boolean;
  /** Grain tile size in px (also the feTurbulence viewport). */
  grainSize: number;
  /** feTurbulence baseFrequency — higher = finer speckle. */
  grainFrequency: number;
  /** feTurbulence octaves — more = richer / noisier. */
  grainOctaves: number;
  /** Grain strength, 0–1. */
  grainOpacity: number;
  /** Blend of the grain layer. */
  grainBlend: string;
}

/** THE global control. Edit these to change the texture across the whole site. */
export const TEXTURE: TextureConfig = {
  pngSrc: "/images/backgrounds/HeroGrunge.png",
  // `overlay` is the safe default across the section colors (dark orange, ink
  // text, etc.). The homepage's bright flats override this to `hard-light` for
  // a punchier print — see grungeBackground() calls in FullscreenScroller.
  pngBlend: "overlay",
  pngSize: "cover",
  grain: true,
  grainSize: 120,
  grainFrequency: 0.9,
  grainOctaves: 2,
  grainOpacity: 0.55,
  grainBlend: "soft-light",
};

export interface TextureOverrides extends Partial<TextureConfig> {
  /** Explicit crop position for the PNG layer (default: derived from color). */
  crop?: string;
  /** Nudge the auto-crop so surfaces sharing a color don't align. */
  seed?: number;
}

/** Crop offsets so repeated panels read as distinct printed sheets, not one clone. */
const CROPS = [
  "center",
  "top left",
  "bottom right",
  "top right",
  "bottom left",
  "20% 80%",
];

/** Stable small int from a string → deterministic per-color crop pick. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Build the feTurbulence grain tile as a data-URI. */
function grainUri(c: TextureConfig): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${c.grainSize}' height='${c.grainSize}'>` +
    `<filter id='g'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${c.grainFrequency}' numOctaves='${c.grainOctaves}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#g)' opacity='${c.grainOpacity}'/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Precompute the default tile once; only rebuilt when a call overrides grain params.
const DEFAULT_GRAIN_URI = grainUri(TEXTURE);
const GRAIN_KEYS = [
  "grainSize",
  "grainFrequency",
  "grainOctaves",
  "grainOpacity",
] as const;

/**
 * CSS background style for a textured section over `color`.
 *
 * @example grungeBackground("#E9C402")                     // default recipe
 * @example grungeBackground(accent, { seed: 1 })           // shift the crop
 * @example grungeBackground(ink, { pngBlend: "multiply" }) // one-off blend
 * @example grungeBackground(c, { grain: false })           // PNG only
 * @example grungeBackground(c, { pngSrc: "" })             // grain only
 */
export function grungeBackground(
  color: string,
  overrides: TextureOverrides = {},
): CSSProperties {
  const c: TextureConfig = { ...TEXTURE, ...overrides };
  const crop =
    overrides.crop ??
    CROPS[(hashStr(color) + (overrides.seed ?? 0)) % CROPS.length];

  const images: string[] = [];
  const sizes: string[] = [];
  const positions: string[] = [];
  const repeats: string[] = [];
  const blends: string[] = [];

  if (c.grain) {
    const grainOverridden = GRAIN_KEYS.some((k) => overrides[k] !== undefined);
    images.push(`url("${grainOverridden ? grainUri(c) : DEFAULT_GRAIN_URI}")`);
    sizes.push(`${c.grainSize}px ${c.grainSize}px`);
    positions.push("center");
    repeats.push("repeat");
    blends.push(c.grainBlend);
  }
  if (c.pngSrc) {
    images.push(`url(${c.pngSrc})`);
    sizes.push(c.pngSize);
    positions.push(crop);
    repeats.push("no-repeat");
    blends.push(c.pngBlend);
  }

  if (images.length === 0) return { backgroundColor: color };

  return {
    backgroundColor: color,
    backgroundImage: images.join(", "),
    backgroundSize: sizes.join(", "),
    backgroundPosition: positions.join(", "),
    backgroundRepeat: repeats.join(", "),
    backgroundBlendMode: blends.join(", "),
  };
}
