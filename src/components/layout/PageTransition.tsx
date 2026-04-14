"use client";

import { motion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  /** "fade" for subtle entrance, "slide-up" for vertical lift (service pages) */
  variant?: "fade" | "slide-up";
}

const fadeTransition: Transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };
const slideTransition: Transition = { type: "spring", damping: 30, stiffness: 200, mass: 1 };

export function PageTransition({ children, variant = "fade" }: PageTransitionProps) {
  const isFade = variant === "fade";

  return (
    <motion.div
      initial={isFade ? { opacity: 0, y: 12 } : { y: "100vh" }}
      animate={isFade ? { opacity: 1, y: 0 } : { y: 0 }}
      transition={isFade ? fadeTransition : slideTransition}
    >
      {children}
    </motion.div>
  );
}
