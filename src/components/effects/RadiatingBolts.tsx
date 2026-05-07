"use client";

import type { CSSProperties } from "react";
import { Accent, type AccentShape } from "@/components/ui/Accent";

/**
 * Radiating jagged bolts — a halo of hand-drawn zigzag accents that
 * "emanate" from a single anchor point on hover.
 *
 * Each bolt is anchored at the crown CENTER initially (collapsed to a
 * point) and animates outward by:
 *   1. translating along its radial direction from 0 → innerRadius (the
 *      bolt's inner end flies out from the crown to the ring radius), and
 *   2. scaling from 0 → 1 around its inner end (the bolt extends from a
 *      seed at its tip out to its full length as it travels).
 * Both happen simultaneously so the bolt reads as a single line shooting
 * out from the crown rather than appearing in place at the ring.
 *
 * Drop inside a parent that has `position: relative` and `className="group"`.
 * The `group:hover` / `group:focus-within` selectors drive the animation.
 *
 * Use `centerOffset` to anchor the burst on a feature in the parent —
 * e.g. `{ x: 75, y: 55 }` to center on a crown that sits in the upper-
 * right of a square illustration. `innerRadius` controls the empty
 * ring between the anchor and the bolts' inner ends at full extension.
 */

interface BoltConfig {
  shape: AccentShape;
  /** Direction the bolt points outward, in degrees. 0 = right, 90 = down. */
  angle: number;
  /** Bolt length (PNG width) in px. Bigger = extends further from crown. */
  size: number;
  /** Stagger delay in ms — controls when this bolt starts emanating. */
  delay: number;
}

// 12 long zigzags evenly spaced at 30°. Adjacent bolts have a 55ms
// delay offset (≈605ms total spread, slightly longer than the per-bolt
// transition) so the cluster reads as a rotational FAN sweeping around
// the crown — each bolt clearly trails the previous one rather than
// blurring into a single simultaneous burst.
const RING_COUNT = 12;
const STAGGER_MS = 55;
const DEFAULT_BOLTS: BoltConfig[] = (() => {
  const out: BoltConfig[] = [];
  for (let i = 0; i < RING_COUNT; i++) {
    const angle = -90 + (i * 360) / RING_COUNT;
    out.push({
      shape: "zigzag-1",
      angle,
      size: 230,
      delay: i * STAGGER_MS,
    });
  }
  return out;
})();

interface RadiatingBoltsProps {
  /** Override the default arrangement. */
  bolts?: BoltConfig[];
  /** Bolt fill color. Defaults to brand yellow. */
  color?: string;
  /**
   * Where the burst originates, expressed as % of the parent's box.
   * Default `{ x: 50, y: 50 }` (parent center).
   */
  centerOffset?: { x: number; y: number };
  /**
   * Empty-ring radius (in px) between the anchor and each bolt's inner
   * end at full extension. Bolts START at the anchor (collapsed to a
   * point) and animate OUTWARD to this radius. Default 140.
   */
  innerRadius?: number;
  /** Multiplier on every bolt's size + innerRadius. */
  scale?: number;
  /** Force-show bolts (debug aid — pretends the parent is hovered). */
  forceVisible?: boolean;
}

export function RadiatingBolts({
  bolts = DEFAULT_BOLTS,
  color = "#efce25",
  centerOffset = { x: 50, y: 50 },
  innerRadius = 140,
  scale = 1,
  forceVisible = false,
}: RadiatingBoltsProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {bolts.map((b, i) => {
        const size = b.size * scale;

        // Per-bolt radial-offset target. At rest --rox/--roy are 0 (bolt
        // collapsed at crown). On hover they animate to these targets so
        // the bolt's inner end flies outward to the ring radius.
        const angleRad = (b.angle * Math.PI) / 180;
        const targetROx = innerRadius * scale * Math.cos(angleRad);
        const targetROy = innerRadius * scale * Math.sin(angleRad);

        // 0×0 reference point at the crown anchor.
        const anchorStyle: CSSProperties = {
          position: "absolute",
          left: `${centerOffset.x}%`,
          top: `${centerOffset.y}%`,
        };

        // Bolt sits with right:0 / top:0 inside the anchor — its right
        // edge lands at the anchor's x, top edge at anchor's y.
        // transform-origin: 100% 50% pivots scale + rotate around the
        // right-middle of the bbox, which (after `right: 0`) coincides
        // with the anchor itself. translateY(-50%) centers the bbox
        // vertically on the anchor's y. Rotation by `angle + 180` aligns
        // the natural-right edge as the inner end pointing toward crown.
        // The leading translate(--rox, --roy) is applied LAST in
        // coordinate space (right-to-left), so it shifts the rotated +
        // scaled bolt by (rox, roy) in WORLD coords — i.e. moves the
        // whole bolt outward along its radial direction.
        const boltStyle: CSSProperties & Record<string, string> = {
          position: "absolute",
          right: 0,
          top: 0,
          transformOrigin: "100% 50%",
          transform: `translate(var(--rox), var(--roy)) translateY(-50%) rotate(${b.angle + 180}deg) scale(var(--bs))`,
          opacity: "var(--bo)" as unknown as number,
          transitionDelay: `${b.delay}ms`,
          ["--rox-target" as string]: `${targetROx}px`,
          ["--roy-target" as string]: `${targetROy}px`,
          ...(forceVisible
            ? {
                ["--bs" as string]: "1",
                ["--bo" as string]: "1",
                ["--rox" as string]: `${targetROx}px`,
                ["--roy" as string]: `${targetROy}px`,
              }
            : {}),
        };

        return (
          <div key={i} style={anchorStyle}>
            <div className="radiating-bolt" style={boltStyle}>
              <Accent shape={b.shape} size={size} color={color} />
            </div>
          </div>
        );
      })}
      <style>{`
        /* Register so var()-driven scale/opacity/translation actually
           transition. Without @property the var changes flip instantly
           and the CSS transition never fires (Chrome/Safari requirement). */
        @property --bs { syntax: '<number>'; inherits: false; initial-value: 0; }
        @property --bo { syntax: '<number>'; inherits: false; initial-value: 0; }
        @property --rox { syntax: '<length>'; inherits: false; initial-value: 0px; }
        @property --roy { syntax: '<length>'; inherits: false; initial-value: 0px; }
        .radiating-bolt {
          /* Translation slightly faster than scale so the bolt's inner
             end reaches the ring before the outer end fully extends —
             reads as "shooting outward" rather than expanding in place. */
          transition:
            --rox 480ms cubic-bezier(0.22, 1, 0.36, 1),
            --roy 480ms cubic-bezier(0.22, 1, 0.36, 1),
            --bs 580ms cubic-bezier(0.22, 1, 0.36, 1),
            --bo 180ms ease-out;
          will-change: transform, opacity;
        }
        .group:hover .radiating-bolt,
        .group:focus-within .radiating-bolt {
          --bs: 1;
          --bo: 1;
          --rox: var(--rox-target);
          --roy: var(--roy-target);
        }
      `}</style>
    </div>
  );
}
