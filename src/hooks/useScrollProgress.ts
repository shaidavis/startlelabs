"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

export function useScrollProgress(containerRef?: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll(
    containerRef ? { target: containerRef } : undefined
  );

  return scrollYProgress;
}

export function useScrollRange(
  scrollYProgress: MotionValue<number>,
  inputRange: number[],
  outputRange: number[]
) {
  return useTransform(scrollYProgress, inputRange, outputRange);
}
