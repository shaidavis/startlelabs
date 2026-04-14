"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Service } from "@/data/services";
import { HazeBackground } from "@/components/ui/HazeBackground";

interface ServicePageTemplateProps {
  service: Service;
}

/* ─── Parallax entrance variants ────────────────────────────────────── */

// The page wrapper slides up as one unit
const pageSlide: Transition = { type: "spring", damping: 28, stiffness: 180, mass: 1.2 };

// Hero content elements rise faster than the page (parallax),
// with staggered delays so each piece cascades in
const heroContent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

function heroItem(extraY: number, delay: number): Variants {
  return {
    hidden: { opacity: 0, y: extraY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        delay,
      },
    },
  };
}

// Content sections below the hero rise in with their own parallax
function risingSection(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 180,
        delay,
      },
    },
  };
}

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  return (
    // Page-level slide up (the elevator)
    <motion.div
      initial={{ y: "100vh" }}
      animate={{ y: 0 }}
      transition={pageSlide}
    >
      {/* Back to home */}
      <motion.a
        href="/"
        className="fixed top-24 left-8 z-40 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 12L6 8L10 4" />
        </svg>
        Back
      </motion.a>

      {/* Hero — content elements have their own parallax rising */}
      <section
        className="relative flex items-center justify-center min-h-[70vh] px-8 overflow-hidden"
      >
        <HazeBackground accentColor={service.accentColor} />
        <motion.div
          className="relative z-10 max-w-4xl text-center text-white"
          variants={heroContent}
          initial="hidden"
          animate="visible"
        >
          {/* Label — rises 80px, arrives first */}
          <motion.p
            className="text-sm uppercase tracking-widest mb-4 text-white/60"
            variants={heroItem(80, 0.1)}
          >
            {service.title}
          </motion.p>

          {/* Headline — rises 120px, fastest parallax feel */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={heroItem(120, 0.15)}
          >
            {service.headline}
          </motion.h1>

          {/* Description — rises 60px, arrives slightly behind */}
          <motion.p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            variants={heroItem(60, 0.25)}
          >
            {service.description}
          </motion.p>
        </motion.div>
      </section>

      {/* Stats — rises as a block with delay */}
      <motion.section
        className="py-24 px-8 bg-neutral-950"
        variants={risingSection(0.3)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {service.stats.map((stat) => (
            <motion.div key={stat.label} className="text-center" variants={fadeInUp}>
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features — rises with slightly more delay */}
      <motion.section
        className="py-24 px-8 bg-black"
        variants={risingSection(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">What we do</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {service.features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonial */}
      <section className="py-24 px-8 bg-neutral-950">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <blockquote className="text-2xl md:text-3xl font-light italic mb-6 text-neutral-200">
            &ldquo;{service.testimonial.quote}&rdquo;
          </blockquote>
          <p className="text-neutral-400">
            {service.testimonial.author} &mdash; {service.testimonial.role}
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-black text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <a
          href={service.cta.href}
          className="inline-block px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-colors"
        >
          {service.cta.text}
        </a>
      </section>
    </motion.div>
  );
}
