"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Project } from "@/data/projects";
import { PageTransition } from "@/components/layout/PageTransition";

interface CaseStudyTemplateProps {
  project: Project;
}

export function CaseStudyTemplate({ project }: CaseStudyTemplateProps) {
  return (
    <PageTransition>
      {/* Hero */}
      <section
        className="flex items-center justify-center min-h-[80vh] px-8"
        style={{ backgroundColor: project.accentColor }}
      >
        <div className="max-w-4xl text-center text-white">
          <p className="text-sm uppercase tracking-widest mb-4 text-white/60">
            {project.tags.join(" / ")}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{project.title}</h1>
          <p className="text-lg text-white/80">{project.description}</p>
        </div>
      </section>

      {/* Content placeholder */}
      <section className="py-24 px-8 bg-neutral-950">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
            <p className="text-neutral-400 mb-12 leading-relaxed">
              Placeholder text describing the challenge this project addressed.
              This section will be populated with real case study content.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-6">The Approach</h2>
            <p className="text-neutral-400 mb-12 leading-relaxed">
              Placeholder text describing the strategic and creative approach taken.
            </p>
          </motion.div>

          {/* Image grid placeholder */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" variants={fadeInUp}>
            <div className="aspect-[4/3] rounded-xl bg-neutral-800" />
            <div className="aspect-[4/3] rounded-xl bg-neutral-800" />
            <div className="aspect-[4/3] rounded-xl bg-neutral-800 md:col-span-2" />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-6">The Result</h2>
            <p className="text-neutral-400 leading-relaxed">
              Placeholder text describing the outcomes and impact of the project.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Next project */}
      <section className="py-16 px-8 bg-black text-center">
        <a href="/work" className="text-neutral-400 hover:text-white transition-colors">
          &larr; Back to all work
        </a>
      </section>
    </PageTransition>
  );
}
