"use client";

import { MotionConfig } from "framer-motion";

/**
 * Site-wide framer-motion config. `reducedMotion="user"` makes every
 * framer-motion animation respect the OS-level "reduce motion" setting —
 * transform/layout animations are skipped, opacity/color still tween.
 * The CSS kill-switch in globals.css only covers CSS animations; this is
 * the missing half for the JS-driven ones (scroll indicator bounce,
 * entrance springs, idle wiggles).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
