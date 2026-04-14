"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { projects } from "@/data/projects";
import { PageTransition } from "@/components/layout/PageTransition";

export default function WorkPage() {
  return (
    <PageTransition>
      <section className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Work</h1>
          <p className="text-lg text-neutral-400 mb-16 max-w-xl">
            Selected projects across brand identity, digital design, and creative direction.
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => (
              <motion.a
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group relative block aspect-[4/3] rounded-2xl overflow-hidden"
                style={{ backgroundColor: project.accentColor }}
                variants={fadeInUp}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-white/60 text-sm">{project.tags.join(" / ")}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
