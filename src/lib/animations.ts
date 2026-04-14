import type { Variants, Transition } from "framer-motion";

const smooth: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: smooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const slideInFromRight: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: smooth },
  exit: { x: "100%", transition: { ...smooth, duration: 0.4 } },
};

export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.3 },
};

export const menuFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const menuLinkItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export const menuLinkContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};
