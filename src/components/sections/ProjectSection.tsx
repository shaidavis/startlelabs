"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/data/projects";

interface ProjectSectionProps {
  project: Project;
  index: number;
}

export function ProjectSection({ project, index }: ProjectSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });

  return (
    <section
      ref={ref}
      id={`project-${index + 1}`}
      className="relative flex items-center justify-center w-full h-screen"
      style={{ backgroundColor: project.accentColor }}
    >
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-4 text-white px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h2 className="text-5xl md:text-7xl font-bold">{project.title}</h2>
        <p className="text-lg text-white/70 max-w-lg">{project.description}</p>
        <a
          href={`/work/${project.slug}`}
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors"
        >
          View Project
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12L12 4M12 4H6M12 4V10" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
