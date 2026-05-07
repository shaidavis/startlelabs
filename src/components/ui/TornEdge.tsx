import { useId } from "react";

const VIEW_W = 1440;
const DEFAULT_H = 40;

const VARIANTS: string[] = [
  "M0,40 L0,22 L40,8 L95,24 L160,6 L230,26 L300,10 L380,30 L460,12 L540,28 L620,8 L710,24 L800,14 L890,30 L980,10 L1060,26 L1140,14 L1220,30 L1300,10 L1380,22 L1440,14 L1440,40 Z",
  "M0,40 L0,18 L30,10 L70,24 L110,14 L150,26 L195,12 L240,22 L285,16 L330,28 L380,10 L430,22 L480,14 L530,26 L580,12 L630,22 L680,16 L735,26 L790,14 L850,24 L905,12 L960,26 L1015,16 L1070,24 L1130,10 L1190,22 L1250,14 L1310,26 L1370,12 L1440,20 L1440,40 Z",
  "M0,40 L0,30 L25,8 L75,32 L140,6 L200,28 L270,12 L340,34 L410,8 L480,30 L560,14 L630,36 L700,10 L780,32 L860,14 L930,38 L1000,6 L1080,28 L1150,16 L1230,32 L1300,10 L1370,28 L1440,16 L1440,40 Z",
  "M0,40 L0,24 L50,14 L120,22 L200,10 L260,28 L320,14 L400,20 L470,8 L540,26 L610,16 L690,28 L770,12 L850,22 L920,14 L1000,28 L1080,12 L1150,24 L1220,14 L1300,26 L1370,16 L1440,22 L1440,40 Z",
];

export interface TornEdgeProps {
  color: string;
  variant?: 1 | 2 | 3 | 4;
  height?: number;
  pointing?: "up" | "down";
  customPath?: string;
  viewBoxHeight?: number;
  /**
   * When true, overlays the HeroGrunge texture on the torn shape using the
   * same `overlay` blend mode as the adjacent section body. The grunge is
   * clipped to the exact torn path so the texture fills right up to the
   * jagged edge without bleeding into neighboring sections.
   */
  grunge?: boolean;
}

export function TornEdge({
  color,
  variant = 1,
  height,
  pointing = "up",
  customPath,
  viewBoxHeight,
  grunge = false,
}: TornEdgeProps) {
  const uid = useId();
  const clipId = `torn-clip-${uid.replace(/:/g, "")}`;

  const pathD = customPath ?? VARIANTS[(variant - 1) % VARIANTS.length];
  const vbH = customPath ? (viewBoxHeight ?? DEFAULT_H) : DEFAULT_H;
  const renderedH = height ?? vbH;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 right-0 w-full z-[1]"
      style={{
        height: `${renderedH}px`,
        top: `-${renderedH}px`,
        transform: pointing === "down" ? "scaleY(-1)" : undefined,
      }}
      viewBox={`0 0 ${VIEW_W} ${vbH}`}
      preserveAspectRatio="none"
    >
      {grunge && (
        <defs>
          <clipPath id={clipId}>
            <path d={pathD} />
          </clipPath>
        </defs>
      )}
      <path d={pathD} fill={color} />
      {grunge && (
        <image
          href="/images/backgrounds/HeroGrunge.png"
          x="0"
          y="0"
          width={VIEW_W}
          height={vbH}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
          style={{ mixBlendMode: "overlay" as const }}
        />
      )}
    </svg>
  );
}
