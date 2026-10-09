"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PAIRINGS } from "@/app/naming/fonts";
import { sceneStyle, readableOn } from "@/lib/namingScenes";
import { grungeBackground } from "@/lib/texture";
import { STYLE_LABELS, type NamingSample } from "@/data/naming";

const INK = "#230F2C";
const PAPER = "#f6f4fb";

/**
 * The flip-card grid on /naming. Front = the "barebones brand": name in its
 * display face over a generated scene, tagline, market chip. Back = business
 * overview, naming rationale, style chips.
 *
 * Flip mechanics live in globals.css (`.name-card*`): hover flips on
 * pointer devices, `data-flipped` flips on tap/keyboard, and reduced motion
 * swaps the rotate for a crossfade. The card is a <button> so it's reachable
 * and toggleable from the keyboard.
 */
export function NamingWall({ samples }: { samples: NamingSample[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 list-none p-0 m-0">
      {samples.map((s, i) => (
        <motion.li
          key={s.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
        >
          <NameCard sample={s} />
        </motion.li>
      ))}
    </ul>
  );
}

/**
 * Shrinks the name's font-size just enough to keep it on one line. The display
 * faces range from Bebas-narrow to Syne-wide, so a length-based size tier
 * can't guarantee a fit; measuring can. Re-runs when the card resizes and
 * once the web font has actually loaded (they're `display: swap`).
 */
function useFitOneLine(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      const base = parseFloat(getComputedStyle(el).fontSize);
      const { scrollWidth, clientWidth } = el;
      if (scrollWidth > clientWidth) {
        el.style.fontSize = `${Math.floor(base * (clientWidth / scrollWidth) * 98) / 100}px`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [ref]);
}

function NameCard({ sample }: { sample: NamingSample }) {
  const [flipped, setFlipped] = useState(false);
  const nameRef = useRef<HTMLHeadingElement>(null);
  useFitOneLine(nameRef);
  const pairing = PAIRINGS[sample.pairing];
  const [base, accent] = sample.palette;
  const frontInk = readableOn(base);
  const chipInk = readableOn(accent);

  return (
    <button
      type="button"
      className="name-card group relative block w-full aspect-[4/5] text-left rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/70"
      data-flipped={flipped || undefined}
      aria-pressed={flipped}
      aria-label={`${sample.name} — ${flipped ? "hide" : "show"} the naming story`}
      onClick={() => setFlipped((f) => !f)}
      style={{ fontFamily: pairing.body }}
    >
      <div className="name-card-inner relative w-full h-full">
        {/* ── Front ─────────────────────────────────────────── */}
        <div
          className="name-card-face absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-7"
          style={{ ...sceneStyle(sample.scene, sample.palette), color: frontInk }}
        >
          <span
            className="self-start text-[11px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
            style={{ background: accent, color: chipInk }}
          >
            {sample.market}
          </span>
          {/* Scrim: the busier scenes (stripes, checker) fight the tagline,
              so the bottom third fades back to the base colour. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${base} 30%, ${base}cc 60%, transparent 100%)` }}
          />
          <div className="relative">
            <h3
              ref={nameRef}
              className={cn(
                "leading-[0.95] whitespace-nowrap mb-3",
                sample.name.length > 14 ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
              )}
              style={{
                fontFamily: pairing.display,
                fontWeight: pairing.displayWeight,
                letterSpacing: `${pairing.tracking}em`,
                textTransform: pairing.uppercase ? "uppercase" : undefined,
              }}
            >
              {sample.name}
            </h3>
            <p className="text-sm sm:text-[15px] leading-snug text-pretty opacity-90">
              {sample.tagline}
            </p>
          </div>
        </div>

        {/* ── Back ──────────────────────────────────────────── */}
        <div
          className="name-card-face name-card-back absolute inset-0 rounded-2xl overflow-hidden flex flex-col p-6 sm:p-7"
          style={{ ...grungeBackground(INK, { pngSrc: "" }), color: PAPER }}
        >
          <p
            className="text-lg leading-tight mb-1"
            style={{
              fontFamily: pairing.display,
              fontWeight: pairing.displayWeight,
              textTransform: pairing.uppercase ? "uppercase" : undefined,
            }}
          >
            {sample.name}
          </p>
          <p className="text-[13px] leading-snug mb-4" style={{ color: `${PAPER}b3` }}>
            {sample.business}
          </p>
          <p className="text-[13.5px] sm:text-sm leading-relaxed text-pretty flex-1 overflow-hidden">
            {sample.rationale}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <Chip>{STYLE_LABELS[sample.style]}</Chip>
            <Chip>{sample.market}</Chip>
          </div>
        </div>
      </div>
    </button>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10.5px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
      style={{ border: `1px solid ${PAPER}55`, color: `${PAPER}cc` }}
    >
      {children}
    </span>
  );
}
