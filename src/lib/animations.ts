import type { Variants, Transition } from "framer-motion";

const smooth: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: smooth },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

