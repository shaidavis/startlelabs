import type { CSSProperties } from "react";
import { grungeBackground } from "./texture";

/**
 * Generated backgrounds for the naming cards. Each scene is a CSS recipe
 * painted in two colours — [base, accent] — and composited with the shared
 * grunge texture so the cards sit in the same printed world as the rest of
 * the site. No image assets; everything is gradients.
 */
export const SCENE_IDS = [
  "sunrise",
  "duotone",
  "stripes",
  "dots",
  "grid",
  "waves",
  "glow",
  "checker",
  "diagonal",
  "rings",
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

type Recipe = (base: string, accent: string) => string;

const RECIPES: Record<SceneId, Recipe> = {
  // Two soft radial blooms — the mesh-gradient look.
  sunrise: (b, a) =>
    `radial-gradient(120% 90% at 15% 100%, ${a} 0%, transparent 60%), ` +
    `radial-gradient(90% 70% at 100% 0%, ${a}99 0%, transparent 55%), ` +
    `linear-gradient(${b}, ${b})`,
  // Hard split on a slant.
  duotone: (b, a) => `linear-gradient(160deg, ${b} 0 52%, ${a} 52% 100%)`,
  // Diagonal stripes.
  stripes: (b, a) =>
    `repeating-linear-gradient(-35deg, ${a} 0 14px, transparent 14px 34px), linear-gradient(${b}, ${b})`,
  // Dot grid.
  dots: (b, a) =>
    `radial-gradient(${a} 2.5px, transparent 3px) 0 0 / 22px 22px, linear-gradient(${b}, ${b})`,
  // Thin blueprint grid.
  grid: (b, a) =>
    `linear-gradient(${a}55 1px, transparent 1px) 0 0 / 28px 28px, ` +
    `linear-gradient(90deg, ${a}55 1px, transparent 1px) 0 0 / 28px 28px, ` +
    `linear-gradient(${b}, ${b})`,
  // Concentric ripples from the bottom corner.
  waves: (b, a) =>
    `repeating-radial-gradient(circle at 110% 110%, ${a} 0 18px, transparent 18px 44px), linear-gradient(${b}, ${b})`,
  // One big glow behind the name.
  glow: (b, a) =>
    `radial-gradient(60% 50% at 50% 45%, ${a} 0%, transparent 70%), linear-gradient(${b}, ${b})`,
  // Checkerboard, oversized.
  checker: (b, a) =>
    `conic-gradient(${a} 25%, transparent 0 50%, ${a} 0 75%, transparent 0) 0 0 / 64px 64px, linear-gradient(${b}, ${b})`,
  // Single broad diagonal band.
  diagonal: (b, a) =>
    `linear-gradient(125deg, transparent 0 38%, ${a} 38% 62%, transparent 62% 100%), linear-gradient(${b}, ${b})`,
  // Off-centre rings.
  rings: (b, a) =>
    `repeating-radial-gradient(circle at 80% 20%, transparent 0 30px, ${a}66 30px 34px), linear-gradient(${b}, ${b})`,
};

/** Style object for a card face: the scene over `base`, plus the site grunge. */
export function sceneStyle(
  id: SceneId,
  [base, accent]: [string, string],
): CSSProperties {
  const grunge = grungeBackground(base, { pngSrc: "", grainOpacity: 0.35 });
  return {
    ...grunge,
    backgroundImage: `${grunge.backgroundImage}, ${RECIPES[id](base, accent)}`,
    backgroundSize: `${grunge.backgroundSize}, auto`,
    backgroundPosition: `${grunge.backgroundPosition}, 0 0`,
    backgroundRepeat: `${grunge.backgroundRepeat}, repeat`,
    backgroundBlendMode: `${grunge.backgroundBlendMode}, normal`,
  };
}

/** Relative luminance → pick ink or paper for text over `hex`. */
export function readableOn(hex: string): "#230F2C" | "#f6f4fb" {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.4 ? "#230F2C" : "#f6f4fb";
}
