"use client";

import { motion, type MotionProps } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Decorative ink-stroke accent — zigzags, arrows, bolts, etc. Renders a
 * transparent silhouette PNG as a CSS `mask-image` over a `background-color`
 * fill, so any shape can be tinted to any brand color from the call site
 * while preserving the hand-drawn grain in the alpha channel.
 *
 *   <Accent shape="zigzag-1" color="#E9C402" angle={-12} animate="wiggle" />
 *
 * Stack several with different shapes / angles / colors to build collage
 * accents around hero text, between sections, or as section markers.
 */

export const ACCENT_SHAPES = [
  "arrow-1",
  "arrow-2",
  "arrow-3",
  "arrow-4",
  "arrow-5",
  "arrow-6",
  "bolt-1",
  "bolt-2",
  "bolt-3",
  "burst",
  "line-dashed",
  "line-solid",
  "lines-loose",
  "lines-pair",
  "peaks",
  "scribble",
  "spring-1",
  "spring-2",
  "spring-3",
  "triangle",
  "zigzag-1",
  "zigzag-2",
  "zigzag-3",
  "zigzag-4",
] as const;

export type AccentShape = (typeof ACCENT_SHAPES)[number];

// Natural aspect ratios (width / height) derived from each silhouette's
// bounding box on the source sheet. Used to auto-size the mask wrapper so
// the accent renders with the correct proportions from a single `size` prop.
// Exported for callers that need to fit shapes inside fixed-size cells.
export const ACCENT_ASPECTS: Record<AccentShape, number> = {
  "arrow-1": 5.09,
  "arrow-2": 6.58,
  "arrow-3": 4.19,
  "arrow-4": 4.21,
  "arrow-5": 7.43,
  "arrow-6": 3.84,
  "bolt-1": 1.28,
  "bolt-2": 0.413,
  "bolt-3": 0.778,
  burst: 1.62,
  "line-dashed": 0.134,
  "line-solid": 0.08,
  "lines-loose": 0.34,
  "lines-pair": 0.237,
  peaks: 1.64,
  scribble: 1.26,
  "spring-1": 4.27,
  "spring-2": 2.93,
  "spring-3": 5.76,
  triangle: 0.91,
  "zigzag-1": 5.27,
  "zigzag-2": 2.04,
  "zigzag-3": 0.98,
  "zigzag-4": 5.52,
};

type IdleAnimation = "none" | "wiggle" | "float" | "pulse";

interface AccentProps {
  shape: AccentShape;
  /** Width in pixels. Height auto-scales to the shape's natural aspect. */
  size?: number;
  /** Any CSS color. Default `currentColor` inherits from the parent — handy
   *  when the accent should match surrounding text or theme. */
  color?: string;
  /** Rotation in degrees. Animations compose around this base angle. */
  angle?: number;
  /** Idle animation loop. */
  animate?: IdleAnimation;
  /** Delay (s) before the loop starts — useful for staggered groups. */
  delay?: number;
  /** Wrapper className. Typical use: `absolute top-0 left-1/2 ...`. */
  className?: string;
  /** Inline style for positioning. Avoid setting `transform` here — use the
   *  `angle` prop so animations don't fight the user's rotation. */
  style?: CSSProperties;
}

export function Accent({
  shape,
  size = 120,
  color = "currentColor",
  angle = 0,
  animate = "none",
  delay = 0,
  className,
  style,
}: AccentProps) {
  const height = size / ACCENT_ASPECTS[shape];
  const url = `/images/accents/${shape}.png`;

  const baseStyle: CSSProperties = {
    display: "inline-block",
    width: size,
    height,
    backgroundColor: color,
    WebkitMaskImage: `url("${url}")`,
    maskImage: `url("${url}")`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    ...style,
  };

  // Compose each idle mode around the user's static `angle`. Framer Motion
  // controls the transform via WAAPI, so we let it own `rotate` (re-asserting
  // it in `animate` for non-rotation modes keeps it from snapping back to 0).
  const motionProps: MotionProps = (() => {
    switch (animate) {
      case "wiggle":
        return {
          animate: { rotate: [angle - 3, angle + 3, angle - 3] },
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        };
      case "float":
        return {
          initial: { rotate: angle },
          animate: { y: [-4, 4, -4], rotate: angle },
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
        };
      case "pulse":
        return {
          initial: { rotate: angle, scale: 1 },
          animate: { scale: [1, 1.06, 1], rotate: angle },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
        };
      case "none":
      default:
        return {
          initial: { rotate: angle },
          animate: { rotate: angle },
        };
    }
  })();

  return (
    <motion.span
      aria-hidden
      className={className}
      style={baseStyle}
      {...motionProps}
    />
  );
}
