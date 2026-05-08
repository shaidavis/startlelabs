"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";

const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

type Speed = "default" | "slow";
type Size = "default" | "large";

type ScrollTrigger = {
  scrollYProgress: MotionValue<number>;
  snapPoint: number;
  sectionSpan: number;
  /** Fraction of sectionSpan around snapPoint that "activates" the panel. Default 0.4. */
  threshold?: number;
};

interface ValuesVennHeroProps {
  size?: Size;
  speed?: Speed;
  scrollTrigger?: ScrollTrigger;
  /** When false, render the assembled diagram with no entry animation. */
  animate?: boolean;
}

const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: SMOOTH_EASE } },
};

const LAYER_SRCS: { src: string; alt: string; isCenter?: boolean }[] = [
  // Phase 1 — major circles (one at a time)
  { src: "/images/values/connection.png", alt: "Connection" },
  { src: "/images/values/curiosity.png", alt: "Curiosity" },
  { src: "/images/values/confidence.png", alt: "Confidence" },
  // Phase 2 — intersection lenses (one at a time)
  { src: "/images/values/empathy.png", alt: "Empathy" },
  { src: "/images/values/leadership.png", alt: "Leadership" },
  { src: "/images/values/artistry.png", alt: "Artistry" },
  // Phase 3 — center
  { src: "/images/values/creativity.png", alt: "Creativity", isCenter: true },
];

function buildVariants(speed: Speed) {
  const slow = speed === "slow";
  // Each layer fades in while scaling up. Stagger >= duration so each
  // element fully enters before the next begins (one-at-a-time).
  const fadeDur = slow ? 0.9 : 0.6;
  const stagger = slow ? 0.95 : 0.7;
  const delayChildren = slow ? 0.3 : 0.15;

  const fadeEnlarge: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: fadeDur, ease: SMOOTH_EASE },
    },
  };

  // Center gets a small overshoot to punctuate the bolt landing.
  const centerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.4 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: fadeDur,
        ease: SMOOTH_EASE,
        scale: { type: "spring", stiffness: 180, damping: 12 },
      },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren,
        staggerChildren: stagger,
      },
    },
  };

  return { fadeEnlarge, centerVariants, containerVariants };
}

const reducedContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const SIZE_CLASSES: Record<Size, string> = {
  default: "w-72 sm:w-80 md:w-96 lg:w-[28rem]",
  large: "w-72 sm:w-96 md:w-[28rem] lg:w-[32rem]",
};

export function ValuesVennHero({
  size = "default",
  speed = "default",
  scrollTrigger,
  animate = true,
}: ValuesVennHeroProps = {}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(!scrollTrigger);

  useEffect(() => {
    if (!scrollTrigger || active || !animate) return;
    const { scrollYProgress, snapPoint, sectionSpan, threshold = 0.4 } = scrollTrigger;
    const check = (v: number) => {
      const normalized = (v - snapPoint) / sectionSpan;
      if (Math.abs(normalized) < threshold) {
        setActive(true);
      }
    };
    check(scrollYProgress.get());
    const unsub = scrollYProgress.on("change", check);
    return unsub;
  }, [scrollTrigger, active, animate]);

  // Static mode: render the assembled diagram with no motion at all.
  if (!animate) {
    return (
      <div
        className={`relative aspect-square flex-shrink-0 ${SIZE_CLASSES[size]}`}
        aria-label="Connection, Curiosity, Confidence — Empathy, Leadership, Artistry — Creativity"
      >
        {LAYER_SRCS.map((layer) => (
          <Image
            key={layer.src}
            src={layer.src}
            alt={layer.alt}
            fill
            sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 28rem, (min-width: 640px) 24rem, 18rem"
            priority
            className="object-contain"
          />
        ))}
      </div>
    );
  }

  const { fadeEnlarge, centerVariants, containerVariants } = buildVariants(speed);

  return (
    <motion.div
      className={`relative aspect-square flex-shrink-0 ${SIZE_CLASSES[size]}`}
      variants={reduce ? reducedContainerVariants : containerVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      aria-label="Connection, Curiosity, Confidence — Empathy, Leadership, Artistry — Creativity"
    >
      {LAYER_SRCS.map((layer) => (
        <motion.div
          key={layer.src}
          className="absolute inset-0"
          variants={reduce ? fadeOnly : layer.isCenter ? centerVariants : fadeEnlarge}
        >
          <Image
            src={layer.src}
            alt={layer.alt}
            fill
            sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 28rem, (min-width: 640px) 24rem, 18rem"
            priority
            className="object-contain"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
