"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Service } from "@/data/services";
import { PageTransition } from "@/components/layout/PageTransition";

interface ServicePageTemplateProps {
  service: Service;
}

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  return (
    <PageTransition>
      {/* Hero */}
      <section
        className="flex items-center justify-center min-h-[70vh] px-8"
        style={{ backgroundColor: service.accentColor }}
      >
        <div className="max-w-4xl text-center text-white">
          <p className="text-sm uppercase tracking-widest mb-4 text-white/60">{service.title}</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{service.headline}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{service.description}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-8 bg-neutral-950">
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
      </section>

      {/* Features */}
      <section className="py-24 px-8 bg-black">
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
      </section>

      {/* Testimonial */}
      <section className="py-24 px-8 bg-neutral-950">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
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
    </PageTransition>
  );
}
