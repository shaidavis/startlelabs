"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";

/**
 * /contact — single-page "let's talk" landing.
 *
 * Background colors mirror the AboutTemplate pattern: a saturated brand
 * accent for the hero (yellow, matching the homepage), a soft cream
 * surface for the body, deep ink text throughout. The light page
 * background is what lets the dark-navy SectionNav icons up in the Topbar
 * read clearly — on a #0a0a0a default body the icons would disappear.
 *
 * Copy is intentionally personal and short — contact page traffic is
 * usually high-intent ("I want to email these people") so the page
 * earns its keep by giving them the email address up top, then a
 * small ladder of "what we'd love to hear" prompts to help them
 * structure the message before they hit Compose.
 */

const YELLOW = "#E9C402";
const PAGE_BG = "#f7f5ee";
const INK = "#230F2C";

const PROMPTS = [
  {
    title: "A new brand from scratch",
    body: "Naming, identity, the works — you've got an idea, we've got the kit.",
    accent: "#05AB8A",
  },
  {
    title: "A pitch you need to nail",
    body: "Investor decks, sales decks, founder narrative, on a deadline.",
    accent: "#137FBF",
  },
  {
    title: "A site that finally fits",
    body: "Marketing pages, product UI, art direction. Built for connection.",
    accent: "#F84267",
  },
];

export default function ContactPage() {
  return (
    <PageTransition>
      <div style={{ backgroundColor: PAGE_BG, color: INK }}>
        {/* Hero — yellow band that echoes the homepage. Big "Yalla." headline,
            email drop right under it. Top padding clears the 76px Topbar. */}
        <section
          className="relative pt-36 sm:pt-44 pb-32 sm:pb-40 px-8 sm:px-16 md:px-24 lg:px-32 overflow-hidden"
          style={{ backgroundColor: YELLOW, color: INK }}
        >
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.p
              className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Get in touch
            </motion.p>
            <motion.h1
              className="font-headline text-6xl sm:text-7xl md:text-[8rem] leading-[0.95] tracking-tight mb-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Yalla
              <span className="font-handwritten" style={{ color: INK }}>
                .
              </span>
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl max-w-xl leading-relaxed mb-10"
              style={{ color: `${INK}cc` }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              Tell us what you&apos;re working on. We answer fast — usually
              same day, always before you start regretting sending it.
            </motion.p>

            <motion.a
              href="mailto:hello@startlelabs.com?subject=Hello%20Startle"
              className="inline-flex items-center gap-3 px-7 sm:px-9 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg transition-all hover:translate-y-[-1px]"
              style={{ backgroundColor: INK, color: YELLOW }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
            >
              hello@startlelabs.com
              <svg
                width="18"
                height="18"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 7h8" />
                <path d="M7 3l4 4-4 4" />
              </svg>
            </motion.a>
          </div>
        </section>

        {/* Prompts — three cards keyed to the three services. Each one is a
            mailto with a pre-filled subject so the recipient lands in their
            inbox already half-drafted. */}
        <section className="px-8 sm:px-16 md:px-24 lg:px-32 py-24 sm:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="font-headline text-3xl sm:text-4xl md:text-5xl leading-tight mb-3"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Tell us what brought you here.
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg mb-12 max-w-xl"
              style={{ color: `${INK}99` }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Pick the one that fits — or write your own.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PROMPTS.map((p, i) => (
                <motion.a
                  key={p.title}
                  href={`mailto:hello@startlelabs.com?subject=${encodeURIComponent(p.title)}`}
                  className="group relative p-7 sm:p-8 rounded-2xl border transition-all hover:translate-y-[-2px]"
                  style={{
                    borderColor: `${INK}1a`,
                    backgroundColor: "#ffffff",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                >
                  <span
                    aria-hidden
                    className="block w-10 h-1 rounded-full mb-5"
                    style={{ backgroundColor: p.accent }}
                  />
                  <h3 className="font-headline text-xl sm:text-2xl leading-snug mb-2">
                    {p.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: `${INK}99` }}
                  >
                    {p.body}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    Start a thread
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M3 7h8" />
                      <path d="M7 3l4 4-4 4" />
                    </svg>
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Tail — quiet block with the alt channels. Social, location, hours.
            Nothing fancy — just the metadata you'd want before reaching out. */}
        <section
          className="px-8 sm:px-16 md:px-24 lg:px-32 py-20 sm:py-24 border-t"
          style={{ borderColor: `${INK}14` }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
                style={{ color: `${INK}77` }}
              >
                Elsewhere
              </p>
              <ul className="space-y-2 text-base">
                <li>
                  <a
                    href="https://www.linkedin.com/company/startle-labs"
                    className="hover:underline underline-offset-4"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/startle.labs"
                    className="hover:underline underline-offset-4"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/startlelabs"
                    className="hover:underline underline-offset-4"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
                style={{ color: `${INK}77` }}
              >
                HQ
              </p>
              <p className="text-base leading-relaxed">
                Tel Aviv, IL
                <br />
                <span style={{ color: `${INK}99` }}>
                  Working with founders worldwide.
                </span>
              </p>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] font-semibold mb-3"
                style={{ color: `${INK}77` }}
              >
                Response time
              </p>
              <p className="text-base leading-relaxed">
                Usually within 4 hours
                <br />
                <span style={{ color: `${INK}99` }}>Sun – Thu, 9 to 7 IDT</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
