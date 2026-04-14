"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-8"
    >
      <motion.div
        className="flex flex-col items-center text-center gap-6 max-w-4xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none"
          variants={fadeInUp}
        >
          Creativity that inspires
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-neutral-400 max-w-2xl"
          variants={fadeInUp}
        >
          Brand identity, strategy, art direction, and products that inspire.
          We build brands that move markets.
        </motion.p>
        <motion.a
          href="#projects"
          className="mt-4 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors"
          variants={fadeInUp}
        >
          Explore Work
        </motion.a>
      </motion.div>
    </section>
  );
}
