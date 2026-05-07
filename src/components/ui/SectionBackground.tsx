/**
 * Full-bleed SVG shape used as a section background.
 *
 * Figma exports its irregular section-background shapes (tilted rectangles,
 * torn edges, scribbles) as SVGs that live in `/public/images/backgrounds/`.
 * Those files typically also contain the section's text as baked-in vector
 * glyphs, which we don't want — we render copy from React so it stays
 * editable. So for each section we inline just the FIRST path (the bg shape)
 * from the export and use this component to render it.
 *
 * Usage:
 *   <section className="relative overflow-hidden">
 *     <SectionBackground
 *       path="M560 20.4636L-24.5 0L-89 412 …Z"
 *       fill="#e7e6f2"
 *       viewBox="0 0 1440 412"
 *     />
 *     <div className="relative z-10">…content…</div>
 *   </section>
 *
 * The `preserveAspectRatio="none"` stretches the shape to any section
 * dimensions. Parent section should have `overflow: hidden` to clip any
 * parts of the path that extend beyond the viewBox (Figma exports often do).
 */
interface Props {
  /** The raw `d` attribute of the path — copy from the first `<path>` in the SVG export. */
  path: string;
  /** Fill color for the shape (e.g. `#e7e6f2`). */
  fill: string;
  /** ViewBox from the exported SVG, e.g. `"0 0 1440 412"`. */
  viewBox: string;
  /** Optional className override for positioning tweaks. */
  className?: string;
}

export function SectionBackground({ path, fill, viewBox, className }: Props) {
  return (
    <svg
      aria-hidden
      className={
        className ??
        "pointer-events-none absolute inset-0 w-full h-full z-0"
      }
      viewBox={viewBox}
      preserveAspectRatio="none"
    >
      <path d={path} fill={fill} />
    </svg>
  );
}
