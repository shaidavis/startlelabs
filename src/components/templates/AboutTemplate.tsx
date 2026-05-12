"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { TornEdge } from "@/components/ui/TornEdge";
import { PageTransition } from "@/components/layout/PageTransition";
import type { AboutData, Review } from "@/data/about";

const GRUNGE: CSSProperties = {
  backgroundImage: "url(/images/backgrounds/HeroGrunge.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundBlendMode: "overlay",
};

// ─── Color theme ────────────────────────────────────────────────
// Orange accent replaces the yellow we had. Pairs with the deep
// purple ink used sitewide. Same structural role as a service page's
// `accentColor` — used for hero, manifesto (mid-page accent), CTA.
const ORANGE = "#E85D28";
const DARK = "#1d0b35";
const INK = "#230F2C";
const PAGE_BG = "#f2f1fa";
const STATS_BG = "#e7e6f2";

// ─── Figma-native torn seams (lifted from ServicePageTemplate) ──
// Each one mirrors the exact polygon shapes exported from the Figma
// section backgrounds. Rotating through them across the page gives
// each seam its own character — tilted paper, single-peak, rolling
// wedge — rather than a uniform jagged line.
const FIGMA_TORN = {
  // Gentle tilt — from Stats.svg. Rises on far-left, dips on far-right.
  statsTop: { path: "M0,1 L560,20 L1016,20 L1440,62 L1440,64 L0,64 Z", h: 64 },
  // 26px diagonal wedge — from Deliverables.svg. Flat right, tilting left.
  deliverablesTop: { path: "M0,25.6 L721.5,0 L1440,0 L1440,26 L0,26 Z", h: 26 },
  // 43px moderate — from Quote.svg top edge.
  quoteTop: { path: "M0,0 L500,43 L1007,0 L1440,24 L1440,43 L0,43 Z", h: 43 },
  // 49px single central peak — from Quote.svg bottom edge.
  projectsTop: { path: "M0,49 L1007,0 L1440,49 Z", h: 49 },
  // 112px more pronounced — from Principles.svg top.
  principlesTop: {
    path: "M0,112 L432,40 L949.5,88.5 L1440,0 L1440,112 Z",
    h: 112,
  },
  // 57px cta top peak.
  ctaTop: {
    path: "M0,41 L301.5,57 L754.5,0 L957,17 L1440,41 L1440,57 L0,57 Z",
    h: 57,
  },
} as const;

export function AboutTemplate({ data }: { data: AboutData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageTransition>
      <div style={{ backgroundColor: PAGE_BG, color: INK }}>
        {/* ─── 1. Hero (ORANGE) ─────────────────────────────── */}
        <section
          className="relative pt-32 sm:pt-36 pb-36 sm:pb-44 px-8 sm:px-16 md:px-24 lg:px-32 overflow-hidden"
          style={{ backgroundColor: ORANGE, color: INK, ...GRUNGE }}
        >
          <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-headline text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
                {data.hero.heading}
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: `${INK}cc` }}
              >
                {data.hero.body}
              </p>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center justify-center w-64 h-64 lg:w-80 lg:h-80 rounded-full flex-shrink-0 overflow-hidden"
              style={{ background: `${INK}18`, boxShadow: `0 0 0 6px ${INK}12` }}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {data.hero.image ? (
                <Image
                  src={data.hero.image}
                  alt="Shai Davis — Startle Labs founder"
                  width={640}
                  height={640}
                  priority
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl" style={{ color: INK }}>
                  ✦
                </span>
              )}
            </motion.div>
          </div>
        </section>

        {/* ─── 2. Reviews (3-column vertical marquee) ───────── */}
        <section
          className="relative pt-24 sm:pt-28 pb-24 sm:pb-28"
          style={{ backgroundColor: STATS_BG, ...GRUNGE }}
        >
          <TornEdge
            color={STATS_BG}
            customPath={FIGMA_TORN.deliverablesTop.path}
            viewBoxHeight={FIGMA_TORN.deliverablesTop.h}
            grunge
          />
          <div className="relative z-10 max-w-6xl mx-auto px-8 sm:px-16 md:px-24 lg:px-32 mb-12 text-center">
            <div
              className="text-xs uppercase tracking-[0.18em] font-semibold mb-3"
              style={{ color: ORANGE }}
            >
              What clients say
            </div>
            <h2 className="font-headline text-3xl md:text-4xl leading-tight max-w-2xl mx-auto">
              Kind words from the people we build for.
            </h2>
          </div>

          <ReviewsMarquee reviews={data.reviews} fadeColor={STATS_BG} />
        </section>

        {/* ─── 3. Story (PAGE_BG) ────────────────────────────── */}
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-24 sm:pt-28 pb-24 sm:pb-28"
          style={{ backgroundColor: PAGE_BG }}
        >
          <TornEdge
            color={PAGE_BG}
            customPath={FIGMA_TORN.statsTop.path}
            viewBoxHeight={FIGMA_TORN.statsTop.h}
          />
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {[data.story.started, data.story.going].map((side, col) => (
              <div key={col}>
                <h2 className="font-headline text-3xl md:text-4xl mb-10 leading-tight">
                  {side.heading}
                </h2>
                <motion.div
                  className="space-y-7"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                >
                  {side.cards.map((card, i) => (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      className="flex gap-4"
                    >
                      <div
                        className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
                        style={{ background: STATS_BG }}
                      >
                        {card.image && (
                          <Image
                            src={card.image}
                            alt=""
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {card.heading}
                        </h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                          {card.body}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. Values (4 text blocks, WHITE) ───────────── */}
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-28 sm:pt-32 pb-28 sm:pb-32"
          style={{ backgroundColor: "#ffffff" }}
        >
          <TornEdge
            color="#ffffff"
            customPath={FIGMA_TORN.quoteTop.path}
            viewBoxHeight={FIGMA_TORN.quoteTop.h}
          />
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="mb-14 max-w-2xl">
              <div
                className="text-xs uppercase tracking-[0.18em] font-semibold mb-3"
                style={{ color: ORANGE }}
              >
                How we work
              </div>
              <h2 className="font-headline text-3xl md:text-4xl leading-tight">
                Four ideas we keep coming back to.
              </h2>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {data.values.map((value, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="relative pl-10"
                >
                  <span
                    className="absolute left-0 top-0.5 font-headline text-3xl leading-none"
                    style={{ color: ORANGE }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-headline text-2xl mb-3 leading-tight">
                    {value.heading}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-neutral-600">
                    {value.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── 5. Manifesto (ORANGE mid-page accent) ──────── */}
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-24 sm:pt-28 pb-24 sm:pb-28"
          style={{ backgroundColor: ORANGE, color: INK, ...GRUNGE }}
        >
          <TornEdge
            color={ORANGE}
            customPath={FIGMA_TORN.projectsTop.path}
            viewBoxHeight={FIGMA_TORN.projectsTop.h}
            grunge
          />
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 md:gap-16 items-center">
            <motion.div
              className="flex gap-5 items-start"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <svg
                className="flex-shrink-0 mt-3"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 19V5M5 12l7-7 7 7"
                  stroke={INK}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="font-headline text-4xl md:text-5xl leading-[1.05]">
                {data.manifesto.heading}
              </h2>
            </motion.div>
            <motion.p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: `${INK}d9` }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {data.manifesto.body}
            </motion.p>
          </div>
        </section>


        {/* ─── 7. Portfolio (Notion embed, WHITE) ──────────── */}
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-24 sm:pt-28 pb-24 sm:pb-28"
          style={{ backgroundColor: "#ffffff" }}
        >
          <TornEdge
            color="#ffffff"
            customPath={FIGMA_TORN.deliverablesTop.path}
            viewBoxHeight={FIGMA_TORN.deliverablesTop.h}
          />
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="mb-10 max-w-2xl">
              <div
                className="text-xs uppercase tracking-[0.18em] font-semibold mb-3"
                style={{ color: ORANGE }}
              >
                Portfolio
              </div>
              <h2 className="font-headline text-3xl md:text-4xl leading-tight mb-4">
                {data.portfolio.heading}
              </h2>
              <p className="text-base leading-relaxed text-neutral-600">
                {data.portfolio.body}
              </p>
            </div>
            <motion.div
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: "#eceaf5", background: PAGE_BG }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <iframe
                src={data.portfolio.notionEmbedUrl}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                title="Startle Labs portfolio"
                className="block w-full"
              />
            </motion.div>
          </div>
        </section>

        {/* ─── 8. FAQs (PAGE_BG) ──────────────────────────── */}
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-24 sm:pt-28 pb-24 sm:pb-28"
          style={{ backgroundColor: PAGE_BG }}
        >
          <TornEdge
            color={PAGE_BG}
            customPath={FIGMA_TORN.statsTop.path}
            viewBoxHeight={FIGMA_TORN.statsTop.h}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="mb-10">
              <div
                className="text-xs uppercase tracking-[0.18em] font-semibold mb-3"
                style={{ color: ORANGE }}
              >
                FAQs
              </div>
              <h2 className="font-headline text-3xl md:text-4xl leading-tight">
                The questions we hear most.
              </h2>
            </div>
            <div className="space-y-2">
              {data.faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between px-6 py-5 text-left"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium pr-4">{faq.question}</span>
                      <span
                        className="text-2xl leading-none font-light flex-shrink-0 transition-transform"
                        style={{
                          color: ORANGE,
                          transform: isOpen
                            ? "rotate(45deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-sm text-neutral-500 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 9. Closing CTA (ORANGE) ──────────────────── */}
        <section
          className="relative px-8 sm:px-16 md:px-24 lg:px-32 pt-32 sm:pt-36 pb-32 sm:pb-36"
          style={{ backgroundColor: ORANGE, color: INK, ...GRUNGE }}
        >
          <TornEdge
            color={ORANGE}
            customPath={FIGMA_TORN.ctaTop.path}
            viewBoxHeight={FIGMA_TORN.ctaTop.h}
            grunge
          />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.h2
              className="font-headline text-5xl md:text-6xl leading-tight mb-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {data.cta.heading}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Link
                href={data.cta.buttonHref}
                className="inline-block px-8 py-4 rounded-full font-medium text-lg transition-opacity hover:opacity-80"
                style={{ background: INK, color: "white" }}
              >
                {data.cta.buttonLabel}
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function splitFirstSentence(text: string): [string, string] {
  const m = text.match(/^(.*?[.!?])(\s+[\s\S]*)?$/);
  if (m?.[1]) return [m[1], m[2] ?? ""];
  return [text, ""];
}

// ─── Testimonial card ────────────────────────────────────────────
function TestimonialCard({ review }: { review: Review }) {
  const [first, rest] = splitFirstSentence(review.quote);
  return (
    <div
      className="bg-white rounded-2xl p-6 border"
      style={{ borderColor: "#eceaf5" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, s) => (
            <span
              key={s}
              className="text-base leading-none"
              style={{ color: s < review.rating ? ORANGE : "#e5e5e5" }}
              aria-hidden
            >
              ★
            </span>
          ))}
        </div>
        <span
          className="text-xl leading-none"
          title={review.country}
          aria-label={review.country}
        >
          {review.flag}
        </span>
      </div>
      <p className="text-[15px] leading-relaxed text-[#230F2C] mb-5">
        &ldquo;<span style={{ fontWeight: 700, background: "#FFE566", padding: "0 3px", borderRadius: 2 }}>{first}</span>{rest}&rdquo;
      </p>
      <span
        className="inline-block text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: `${ORANGE}1a`, color: ORANGE }}
      >
        {review.category}
      </span>
    </div>
  );
}

// ─── 3-column marquee ────────────────────────────────────────────
// Columns 1 and 3 scroll DOWN (content translates from -50% → 0%),
// column 2 scrolls UP (0% → -50%). Each column's children are
// duplicated once so the animation loops seamlessly at the 50%
// boundary. A fixed-height window + top/bottom gradient fades hide
// the card entry/exit edges.
function ReviewsMarquee({
  reviews,
  fadeColor,
}: {
  reviews: Review[];
  fadeColor: string;
}) {
  const shouldReduce = useReducedMotion();

  // Round-robin into 3 columns so each column has a balanced mix of
  // categories rather than all one kind stacked together.
  const columns: Review[][] = [[], [], []];
  reviews.forEach((r, i) => columns[i % 3].push(r));

  // On mobile we fall back to a simple stacked list — 3 narrow
  // columns would crush each card.
  return (
    <div className="relative z-10">
      {/* Mobile: plain stack (first 6 reviews, gives a taste) */}
      <div className="md:hidden px-8 space-y-4">
        {reviews.slice(0, 6).map((r, i) => (
          <TestimonialCard key={i} review={r} />
        ))}
      </div>

      <div className="hidden md:block relative mx-auto max-w-6xl px-8 md:px-12 lg:px-16">
        <div
          className="relative overflow-hidden"
          style={{ height: 640 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.marquee-track').forEach(el => {
              el.style.animationDuration = el.dataset.hoverDur!;
            });
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.marquee-track').forEach(el => {
              el.style.animationDuration = el.dataset.baseDur!;
            });
          }}
        >
          <div className="grid grid-cols-3 gap-5 h-full">
            <MarqueeColumn
              items={columns[0]}
              direction="down"
              duration={70}
              reduceMotion={!!shouldReduce}
            />
            <MarqueeColumn
              items={columns[1]}
              direction="up"
              duration={80}
              reduceMotion={!!shouldReduce}
            />
            <MarqueeColumn
              items={columns[2]}
              direction="down"
              duration={75}
              reduceMotion={!!shouldReduce}
            />
          </div>

          {/* Top + bottom fades — same color as the section bg so
              cards appear to dissolve in/out at the edges. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10"
            style={{
              background: `linear-gradient(to bottom, ${fadeColor}, ${fadeColor}00)`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-10"
            style={{
              background: `linear-gradient(to top, ${fadeColor}, ${fadeColor}00)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MarqueeColumn({
  items,
  direction,
  duration,
  reduceMotion,
}: {
  items: Review[];
  direction: "up" | "down";
  duration: number;
  reduceMotion: boolean;
}) {
  // Static fallback for users who prefer reduced motion — show the
  // column without any animation at all.
  if (reduceMotion) {
    return (
      <div className="flex flex-col gap-5">
        {items.map((item, i) => (
          <TestimonialCard key={i} review={item} />
        ))}
      </div>
    );
  }

  // Duplicate once so the animation's end-state visually matches its
  // start-state (seamless loop at the 50% boundary). Uses CSS keyframes
  // (see globals.css) instead of framer-motion so we can leverage
  // `animation-play-state: paused` for hover-to-freeze without
  // resetting the animation's current position.
  const doubled = [...items, ...items];
  const animationName = direction === "up" ? "marquee-up" : "marquee-down";

  return (
    <div className="relative">
      <div
        className="marquee-track flex flex-col gap-5 will-change-transform"
        data-base-dur={`${duration}s`}
        data-hover-dur={`${duration * 3}s`}
        style={{
          animationName,
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={i} review={item} />
        ))}
      </div>
    </div>
  );
}

