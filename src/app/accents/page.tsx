"use client";

import {
  Accent,
  ACCENT_SHAPES,
  ACCENT_ASPECTS,
  type AccentShape,
} from "@/components/ui/Accent";

/**
 * Internal reference page for the <Accent> component. Lists every shape in
 * every brand color, plus the four idle-animation modes and a sample collage.
 *
 * Not linked from public navigation — reach via /accents.
 */

const PALETTE: { name: string; value: string; bg: string }[] = [
  { name: "Ink", value: "#230F2C", bg: "#f2f1fa" },
  { name: "Yellow", value: "#E9C402", bg: "#f2f1fa" },
  { name: "Orange", value: "#E85D28", bg: "#f2f1fa" },
  { name: "Green", value: "#05AB8A", bg: "#f2f1fa" },
  { name: "Blue", value: "#137FBF", bg: "#f2f1fa" },
  { name: "Pink", value: "#F84267", bg: "#f2f1fa" },
  // White accents need a dark cell or they vanish.
  { name: "White", value: "#FFFFFF", bg: "#230F2C" },
];

// Each grid cell renders the accent inside a fixed box. Pick a render size
// that fits within the cell while preserving the shape's natural aspect —
// width-bound for wide shapes, height-bound for tall ones.
const CELL_W = 140;
const CELL_H = 90;

function fitSize(shape: AccentShape): number {
  const aspect = ACCENT_ASPECTS[shape];
  const widthFitH = CELL_W / aspect;
  if (widthFitH <= CELL_H) return CELL_W;
  return CELL_H * aspect;
}

export default function AccentsLibraryPage() {
  return (
    <div className="min-h-screen bg-[#f2f1fa] text-[#230F2C] pt-28 pb-32">
      <div className="max-w-[1320px] mx-auto px-8">
        <header className="mb-14">
          <h1 className="text-5xl md:text-6xl font-headline tracking-tight mb-4">
            Accent library
          </h1>
          <p className="text-[#230F2C]/60 max-w-2xl text-lg leading-relaxed">
            Hand-drawn ink-stroke shapes. Each is a single transparent
            silhouette PNG that recolors via CSS mask, so any accent can render
            in any brand color.
          </p>
        </header>

        {/* Palette ─────────────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-2xl font-headline mb-5">Palette</h2>
          <div className="flex flex-wrap gap-3">
            {PALETTE.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-3 border border-[#230F2C]/10 rounded-lg p-2 pr-4 bg-white"
              >
                <div
                  className="w-10 h-10 rounded"
                  style={{
                    backgroundColor: c.value,
                    boxShadow:
                      c.value === "#FFFFFF"
                        ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                        : undefined,
                  }}
                />
                <div className="text-sm leading-tight">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-[#230F2C]/50 font-mono text-xs">
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shape × color matrix ─────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-headline mb-5">All shapes × all colors</h2>
          <div className="space-y-3">
            {/* Column header (color names) */}
            <div className="flex items-center gap-3 pl-[148px] hidden md:flex">
              {PALETTE.map((c) => (
                <div
                  key={c.name}
                  style={{ width: CELL_W }}
                  className="text-xs font-mono text-[#230F2C]/40 uppercase tracking-wider text-center"
                >
                  {c.name}
                </div>
              ))}
            </div>
            {ACCENT_SHAPES.map((shape) => {
              const size = fitSize(shape);
              return (
                <div
                  key={shape}
                  className="flex items-center gap-3 flex-wrap md:flex-nowrap"
                >
                  <code className="w-[140px] shrink-0 text-sm font-mono text-[#230F2C]">
                    {shape}
                  </code>
                  <div className="flex flex-wrap gap-2">
                    {PALETTE.map((c) => (
                      <div
                        key={c.name}
                        style={{
                          backgroundColor: c.bg,
                          width: CELL_W,
                          height: CELL_H,
                        }}
                        className="flex items-center justify-center rounded border border-[#230F2C]/5 overflow-hidden"
                        title={`${shape} / ${c.name}`}
                      >
                        <Accent shape={shape} color={c.value} size={size} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Animation modes ──────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-headline mb-5">Animation modes</h2>
          <p className="text-[#230F2C]/60 mb-6 max-w-2xl">
            Each accent supports an idle animation that loops in place.
            Animations compose around a static{" "}
            <code className="px-1.5 py-0.5 rounded bg-[#230F2C]/5 font-mono text-xs">
              angle
            </code>
            , so rotation isn&apos;t lost when motion is enabled.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["none", "wiggle", "float", "pulse"] as const).map((mode) => (
              <div
                key={mode}
                className="bg-white rounded-lg p-8 flex flex-col items-center justify-center gap-4 border border-[#230F2C]/5 h-48"
              >
                <Accent shape="bolt-1" color="#230F2C" size={110} animate={mode} />
                <code className="text-sm font-mono text-[#230F2C]/60">
                  {mode}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Sample composition ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-headline mb-5">Composition</h2>
          <p className="text-[#230F2C]/60 mb-6 max-w-2xl">
            Stack accents at different sizes, angles, colors, and animations
            to build collage emphasis.
          </p>
          <div className="relative bg-[#E9C402] h-[420px] rounded-2xl overflow-hidden flex items-center justify-center">
            <Accent
              shape="zigzag-4"
              color="#230F2C"
              size={320}
              angle={-6}
              animate="wiggle"
              className="absolute top-10 left-10 opacity-80"
            />
            <Accent
              shape="bolt-1"
              color="#F84267"
              size={140}
              angle={20}
              animate="float"
              className="absolute top-10 right-16"
            />
            <Accent
              shape="spring-1"
              color="#137FBF"
              size={260}
              angle={5}
              animate="float"
              delay={0.5}
              className="absolute bottom-14 left-24"
            />
            <Accent
              shape="burst"
              color="#E85D28"
              size={170}
              angle={-12}
              animate="pulse"
              className="absolute bottom-10 right-24"
            />
            <Accent
              shape="triangle"
              color="#05AB8A"
              size={80}
              angle={15}
              animate="wiggle"
              delay={1}
              className="absolute"
              style={{ top: "calc(50% - 40px)", left: "calc(50% - 40px)" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
