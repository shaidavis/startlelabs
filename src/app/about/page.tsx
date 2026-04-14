"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { team } from "@/data/team";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="flex items-center justify-center min-h-[60vh] px-8 bg-neutral-950">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">About Startle Labs</h1>
          <p className="text-lg text-neutral-400">
            We believe connection isn&apos;t a skill — it&apos;s a choice. We help brands make that
            choice intentionally.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-8 bg-black">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <p className="text-neutral-400 leading-relaxed mb-6">
            Placeholder text about the founding story and mission of Startle Labs.
            This section will be populated with real content.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            Placeholder text about the agency&apos;s philosophy and approach to branding work.
          </p>
        </motion.div>
      </section>

      {/* Team */}
      <section className="py-24 px-8 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">The Team</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member) => (
              <motion.div key={member.name} className="text-center" variants={fadeInUp}>
                <div className="w-40 h-40 rounded-full bg-neutral-800 mx-auto mb-6" />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-neutral-400 text-sm mb-3">{member.role}</p>
                <p className="text-neutral-500 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
