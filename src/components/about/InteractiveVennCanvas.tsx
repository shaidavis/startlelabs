"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Interactive blob Venn of the Startle Labs values. Three near-circular blobs —
 * Connection (top), Curiosity (bottom-left), Confidence (bottom-right) —
 * undulate gently and animate in one at a time, carrying their outline icon.
 * Creativity, the star, then pops in at the centre with a little lightning, and
 * the three pairwise lenses (Leadership, Artistry, Empathy) write themselves in
 * last, one at a time.
 *
 * Hovering a value or an overlap pours energy into the blobs underneath — they
 * surge bigger and wobble faster — and the labels brighten. Hovering Creativity
 * lights up all three at once.
 *
 * Props:
 *  - chrome: show the hint row + replay button + hover-reveal caption (default
 *    true). Set false to render just the diagram (e.g. as a hero visual).
 *  - scrollTrigger: gate the intro so it plays when the panel scrolls into view
 *    (mirrors ValuesVennHero). Without it the intro plays on mount.
 *
 * Lives as the homepage About panel visual; reference page at /values-venn.
 */

type ScrollTrigger = {
  scrollYProgress: MotionValue<number>;
  snapPoint: number;
  sectionSpan: number;
  /** Fraction of sectionSpan around snapPoint that "activates" it. Default 0.4. */
  threshold?: number;
};

interface InteractiveVennCanvasProps {
  /** Show the hint line + replay button above the diagram (default true). */
  chrome?: boolean;
  /** Show the hover-reveal caption (value headline + description) below it (default true). */
  caption?: boolean;
  /** Bump this number from a parent to replay the intro (e.g. an external CTA). */
  replayNonce?: number;
  scrollTrigger?: ScrollTrigger;
}

type Blob = {
  name: string;
  x: number;
  y: number;
  color: string; // vivid (hover)
  rgb: [number, number, number];
  anchor: [number, number];
  phase: [number, number, number];
  writeAt: number;
  /** Hand-drawn icon PNG, rendered as a currentColor mask. */
  icon: string;
};

const W = 560;
const H = 480;
const R = 128;

// bit0 = Connection, bit1 = Curiosity, bit2 = Confidence
const BLOBS: Blob[] = [
  { name: "Connection", x: 280, y: 175, color: "#F84267", rgb: [248, 66, 103], anchor: [280, 112], phase: [0.4, 1.7, 3.1], writeAt: 500, icon: "/images/icons/Heart%20.png" },
  { name: "Curiosity", x: 210, y: 302, color: "#2E9BD6", rgb: [46, 155, 214], anchor: [176, 372], phase: [2.1, 0.6, 4.4], writeAt: 1350, icon: "/images/icons/Eye.png" },
  { name: "Confidence", x: 350, y: 302, color: "#13B98C", rgb: [19, 185, 140], anchor: [384, 372], phase: [1.2, 3.3, 0.9], writeAt: 2200, icon: "/images/icons/Crown%20copy.png" },
];

const CENTER: [number, number] = [280, 250];
const STAR_COLOR = "#FFE000";
const CREATIVITY_AT = 3000;

// pairwise lenses — write in last, one at a time (Leadership, Artistry, Empathy)
const LENSES: { mask: number; name: string; anchor: [number, number]; writeAt: number }[] = [
  { mask: 5, name: "Leadership", anchor: [360, 214], writeAt: 3600 }, // Connection × Confidence
  { mask: 6, name: "Artistry", anchor: [280, 328], writeAt: 4140 }, // Curiosity × Confidence
  { mask: 3, name: "Empathy", anchor: [200, 214], writeAt: 4680 }, // Connection × Curiosity
];

// hover reveal — the "formula" for each region
const FORMULA: Record<number, string> = {
  1: "connection",
  2: "curiosity",
  4: "confidence",
  3: "curiosity + connection = empathy",
  5: "connection + confidence = leadership",
  6: "curiosity + confidence = artistry",
  7: "curiosity + confidence + connection = creativity",
};

const HARM = [
  { k: 3, a: 0.026, s: 0.00045 },
  { k: 5, a: 0.017, s: 0.0007 },
  { k: 2, a: 0.013, s: -0.00035 },
];

const STAGGER = 850;
const DUR = 1000;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pctX = (x: number) => `${(x / W) * 100}%`;
const pctY = (y: number) => `${(y / H) * 100}%`;
const INK = "#230F2C";

export function InteractiveVennCanvas({ chrome = true, caption = true, replayNonce = 0, scrollTrigger }: InteractiveVennCanvasProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverMask, setHoverMask] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [runId, setRunId] = useState(0);
  // When a scrollTrigger is supplied, hold the intro until the panel is in view.
  const [active, setActive] = useState(!scrollTrigger);

  // External replay (e.g. a "Replay animation" CTA in the parent panel).
  const lastNonce = useRef(replayNonce);
  useEffect(() => {
    if (replayNonce === lastNonce.current) return;
    lastNonce.current = replayNonce;
    setActive(true);
    setRunId((k) => k + 1);
  }, [replayNonce]);

  useEffect(() => {
    if (!scrollTrigger || active) return;
    const { scrollYProgress, snapPoint, sectionSpan, threshold = 0.4 } = scrollTrigger;
    const check = (v: number) => {
      if (Math.abs((v - snapPoint) / sectionSpan) < threshold) setActive(true);
    };
    check(scrollYProgress.get());
    return scrollYProgress.on("change", check);
  }, [scrollTrigger, active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(prefersReduce);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Hold everything hidden until the panel is active (scrolled into view).
    if (!active) return;

    const grunge = new Image();
    grunge.src = "/images/backgrounds/HeroGrunge.png";
    let grungeReady = false;
    grunge.onload = () => { grungeReady = true; };

    let start: number | null = null;
    let animT = 0;
    let hovered = 0;
    let lastMask = -1;
    let raf = 0;
    const introP = [0, 0, 0];
    const hoverP = [0, 0, 0];
    let exciteP = 0; // Creativity hovered -> all blobs alive

    const blobRadius = (b: Blob, theta: number, scale: number, alive: number) => {
      let wob = 1;
      for (let h = 0; h < HARM.length; h++) {
        const amp = HARM[h].a * (1 + 1.15 * alive); // hover pours in energy
        const speed = HARM[h].s * (1 + 1.4 * alive);
        wob += amp * Math.sin(HARM[h].k * theta + b.phase[h] + animT * speed);
      }
      return R * scale * wob;
    };

    const traceBlob = (b: Blob, scale: number, alive: number) => {
      const N = 72;
      const pts: [number, number][] = [];
      for (let i = 0; i < N; i++) {
        const theta = (i / N) * Math.PI * 2;
        const r = prefersReduce ? R * scale : blobRadius(b, theta, scale, alive);
        pts.push([b.x + r * Math.cos(theta), b.y + r * Math.sin(theta)]);
      }
      const mid = (p: [number, number], q: [number, number]): [number, number] => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      ctx.beginPath();
      const m0 = mid(pts[N - 1], pts[0]);
      ctx.moveTo(m0[0], m0[1]);
      for (let i = 0; i < N; i++) {
        const curr = pts[i];
        const m = mid(curr, pts[(i + 1) % N]);
        ctx.quadraticCurveTo(curr[0], curr[1], m[0], m[1]);
      }
      ctx.closePath();
    };

    const frame = (now: number) => {
      if (start == null) start = now;
      animT = now - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      const exciteTarget = hovered === 7 ? 1 : 0;
      exciteP = prefersReduce ? exciteTarget : lerp(exciteP, exciteTarget, 0.12);

      for (let i = 0; i < 3; i++) {
        introP[i] = prefersReduce ? 1 : (() => {
          const t = (animT - i * STAGGER) / DUR;
          return t <= 0 ? 0 : t >= 1 ? 1 : easeOut(t);
        })();
        const target = Math.max(hovered & (1 << i) ? 1 : 0, exciteP);
        hoverP[i] = prefersReduce ? target : lerp(hoverP[i], target, 0.16);
      }

      for (let i = 0; i < 3; i++) {
        const p = introP[i];
        if (p <= 0.001) continue;
        const b = BLOBS[i];
        const alive = Math.max(hoverP[i], exciteP);
        const scale = (0.25 + 0.75 * p) * (1 + 0.16 * hoverP[i] + 0.06 * exciteP);

        traceBlob(b, scale, alive);
        ctx.fillStyle = `rgba(${b.rgb[0]},${b.rgb[1]},${b.rgb[2]},${(0.85 + 0.1 * hoverP[i]) * p})`;
        ctx.fill();

        if (grungeReady) {
          ctx.save();
          traceBlob(b, scale, alive);
          ctx.clip();
          ctx.globalCompositeOperation = "multiply";
          ctx.globalAlpha = 0.5 * p;
          ctx.drawImage(grunge, 0, 0, 300, 300 * (grunge.height / grunge.width || 0.66), b.x - R * scale, b.y - R * scale, R * scale * 2, R * scale * 2);
          ctx.restore();
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        }

        traceBlob(b, scale, alive);
        ctx.lineWidth = 1.25 + 1.75 * hoverP[i];
        ctx.strokeStyle = `rgba(${b.rgb[0]},${b.rgb[1]},${b.rgb[2]},${(0.7 + 0.3 * hoverP[i]) * p})`;
        ctx.stroke();
      }

      if (prefersReduce || animT >= CREATIVITY_AT) {
        const pulse = prefersReduce ? 0.12 : 0.1 + 0.04 * Math.sin(animT * 0.0024);
        const boost = 0.08 * exciteP;
        const g = ctx.createRadialGradient(CENTER[0], CENTER[1], 2, CENTER[0], CENTER[1], 86);
        g.addColorStop(0, `rgba(255,224,0,${pulse + boost + 0.06})`);
        g.addColorStop(0.55, `rgba(255,224,0,${(pulse + boost) * 0.4})`);
        g.addColorStop(1, "rgba(255,224,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(CENTER[0], CENTER[1], 86, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const maskAt = (mx: number, my: number) => {
      let m = 0;
      for (let i = 0; i < 3; i++) {
        const b = BLOBS[i];
        const dx = mx - b.x;
        const dy = my - b.y;
        const scale = (0.25 + 0.75 * introP[i]) * (1 + 0.16 * hoverP[i] + 0.06 * exciteP);
        if (Math.hypot(dx, dy) <= blobRadius(b, Math.atan2(dy, dx), scale, Math.max(hoverP[i], exciteP))) m |= 1 << i;
      }
      return m;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * W;
      const my = ((e.clientY - rect.top) / rect.height) * H;
      const m = maskAt(mx, my);
      hovered = m;
      if (m !== lastMask) { lastMask = m; setHoverMask(m); }
    };
    const onLeave = () => {
      hovered = 0;
      if (lastMask !== 0) { lastMask = 0; setHoverMask(0); }
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [runId, active]);

  // gate intro animations: hidden before active, animate when active, static under reduced-motion
  const motionStyle = (animation: string): CSSProperties =>
    !active ? { opacity: 0 } : reduce ? {} : { animation };
  const writeAnim = (delay: number) => motionStyle(`venn-write 680ms cubic-bezier(0.5,0.1,0.25,1) ${delay}ms both`);
  const fadeAnim = (delay: number) => motionStyle(`venn-fade 480ms ease ${delay}ms both`);
  const popAnim = (delay: number) => motionStyle(`venn-pop 720ms cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`);
  const zapStyle: CSSProperties =
    !active || reduce ? {} : { animation: `venn-zap 2.6s ease-in-out ${CREATIVITY_AT + 600}ms infinite`, transformOrigin: "50% 18%" };

  const maskStyle = (icon: string, bg: string): CSSProperties => ({
    backgroundColor: bg,
    WebkitMaskImage: `url(${icon})`,
    maskImage: `url(${icon})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  });

  const runKey = `${runId}-${active}`;

  return (
    <div className="flex flex-col items-center">
      {chrome && (
        <div className="mb-3 flex w-full max-w-[560px] items-center justify-between gap-3">
          <span className="text-sm" style={{ color: `${INK}80` }}>Hover the blobs, the overlaps, and the centre</span>
          <button
            type="button"
            onClick={() => setRunId((k) => k + 1)}
            className="rounded-full border px-4 py-1.5 text-sm transition hover:border-[#E85D28] hover:text-[#E85D28]"
            style={{ borderColor: `${INK}33`, color: `${INK}b3` }}
          >
            Replay intro
          </button>
        </div>
      )}

      <div className="relative w-full max-w-[560px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-crosshair"
          aria-label="Interactive Venn diagram of Connection, Curiosity and Confidence meeting at Creativity. Hover any region to reveal its name and description."
        />

        {/* Big three — outline icon + handwritten label; brighten on hover */}
        {BLOBS.map((b, i) => {
          const lit = Boolean(hoverMask & (1 << i)) || hoverMask === 7;
          return (
            <div
              key={`${b.name}-${runKey}`}
              className="pointer-events-none absolute flex flex-col items-center gap-1"
              style={{
                left: pctX(b.anchor[0]),
                top: pctY(b.anchor[1]),
                color: lit ? "#FFFFFF" : "rgba(255,255,255,0.85)",
                transform: `translate(-50%, -50%) scale(${lit ? 1.14 : 1})`,
                transition: "transform 0.4s ease, color 0.3s ease",
              }}
            >
              <span
                aria-hidden
                className="block h-9 w-9 sm:h-11 sm:w-11"
                style={{ ...maskStyle(b.icon, "currentColor"), ...fadeAnim(b.writeAt - 80) }}
              />
              <span className="font-handwritten text-2xl leading-none sm:text-3xl" style={writeAnim(b.writeAt)}>
                {b.name}
              </span>
            </div>
          );
        })}

        {/* Pairwise lenses — write in last; brighten + lift on hover (no wiggle) */}
        {LENSES.map((l) => {
          const lit = hoverMask === l.mask;
          return (
            <span
              key={`${l.name}-${runKey}`}
              className="pointer-events-none absolute block text-sm font-medium leading-none sm:text-base"
              style={{
                left: pctX(l.anchor[0]),
                top: pctY(l.anchor[1]),
                color: lit ? "#FFFFFF" : "rgba(255,255,255,0.82)",
                transform: `translate(-50%, -50%) scale(${lit ? 1.12 : 1})`,
                transition: "transform 0.3s ease, color 0.25s ease",
                ...writeAnim(l.writeAt),
              }}
            >
              {l.name}
            </span>
          );
        })}

        {/* Creativity — the star — pops in after the blobs, bolt keeps zapping */}
        <div
          key={`creativity-${runKey}`}
          className="pointer-events-none absolute flex flex-col items-center"
          style={{
            left: pctX(CENTER[0]),
            top: pctY(CENTER[1]),
            transform: `translate(-50%, -50%) scale(${hoverMask === 7 ? 1.12 : 1})`,
            transition: "transform 0.4s ease",
          }}
        >
          <div className="flex flex-col items-center gap-1" style={popAnim(CREATIVITY_AT)}>
            <span
              aria-hidden
              className="block h-8 w-8 sm:h-9 sm:w-9"
              style={{ ...maskStyle("/images/accents/bolt-3.png", STAR_COLOR), ...zapStyle }}
            />
            <span className="font-headline text-2xl leading-none tracking-tight sm:text-3xl" style={{ color: STAR_COLOR }}>
              Creativity
            </span>
          </div>
        </div>
      </div>

      {caption && (
        <div className="mt-4 flex min-h-[52px] w-full max-w-[520px] flex-col items-center text-center">
          {hoverMask && FORMULA[hoverMask] ? (
            <span className="font-headline text-2xl leading-tight" style={{ color: INK }}>
              {FORMULA[hoverMask]}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
