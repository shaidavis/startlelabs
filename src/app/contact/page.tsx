"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { PageTransition } from "@/components/layout/PageTransition";

export default function ContactPage() {
  return (
    <PageTransition>
      <section className="flex items-center justify-center min-h-[80vh] px-8">
        <motion.div
          className="max-w-2xl text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" variants={fadeInUp}>
            Let&apos;s Talk
          </motion.h1>
          <motion.p className="text-lg text-neutral-400 mb-12" variants={fadeInUp}>
            Have a project in mind? We&apos;d love to hear about it.
          </motion.p>

          <motion.div className="flex flex-col gap-6" variants={fadeInUp}>
            <a
              href="mailto:hello@startlelabs.com"
              className="text-2xl font-medium hover:text-neutral-300 transition-colors"
            >
              hello@startlelabs.com
            </a>

            <div className="flex justify-center gap-8 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
