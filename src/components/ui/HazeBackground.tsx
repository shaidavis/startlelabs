"use client";

/**
 * Haze-style background effect — a radial gradient glow from the section's
 * accent color, plus a subtle noise texture overlay. Creates depth behind
 * section content without using canvas or shaders.
 */
export function HazeBackground({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Radial gradient glow — centered, using the accent color */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${accentColor}44 0%, transparent 70%)`,
        }}
      />

      {/* Secondary off-center glow for asymmetry */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 50% 80% at 30% 70%, ${accentColor}33 0%, transparent 60%)`,
        }}
      />

      {/* Noise texture overlay — inline SVG data URI for a subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
    </div>
  );
}
