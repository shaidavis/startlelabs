"use client";

import { useScroll } from "framer-motion";

export function useScrollProgress(containerRef?: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll(
    containerRef ? { target: containerRef } : undefined
  );

  return scrollYProgress;
}
