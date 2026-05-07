"use client";

import { useEffect, useRef } from "react";

const STUTTER: ReadonlyArray<readonly [number, number, boolean]> = [
  [1.0, 0, true],
  [0.2, 40, false],
  [0.95, 80, true],
  [0.1, 120, false],
  [0.7, 180, true],
  [0.0, 420, false],
];

const COOLDOWN_MS = 1200;

type BranchPath = { d: string; depth: number };

function buildBranch(
  startX: number,
  startY: number,
  initDir: number, // -1 = leftward, 1 = rightward
  width: number,
  height: number,
  depth: number,
  maxDepth: number,
): BranchPath[] {
  // Branch length scales down with depth: depth 1 ≈ 18% of height, depth 2 ≈ 9%.
  const lengthRatio = 0.18 / depth;
  const segCount = 3 + Math.floor(Math.random() * 3); // 3–5 segments per branch
  let x = startX;
  let y = startY;
  let direction = initDir;
  let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
  const out: BranchPath[] = [];

  // Branches drift mostly downward but at an angle (initDir biases horizontally).
  const totalDy = height * lengthRatio;
  const totalDxBias = width * lengthRatio * 0.6 * initDir;

  for (let i = 1; i <= segCount; i++) {
    const stepDy = totalDy / segCount;
    // Each segment swings horizontally with the alternating direction, plus a
    // small bias along the branch's overall direction.
    const swing = (0.03 + Math.random() * 0.05) * width * direction;
    x += swing + totalDxBias / segCount;
    y += stepDy;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    if (Math.random() > 0.2) direction *= -1;

    // Spawn a sub-branch off this vertex (lower probability at deeper levels).
    if (depth < maxDepth && i < segCount && Math.random() < 0.45 / depth) {
      const subDir = Math.random() < 0.5 ? -1 : 1;
      out.push(...buildBranch(x, y, subDir, width, height, depth + 1, maxDepth));
    }
  }
  out.push({ d, depth });
  return out;
}

function generateBoltPath(width: number, height: number) {
  const startX = width * (0.3 + Math.random() * 0.4);
  let x = startX;
  let y = 0;
  const segments = 14 + Math.floor(Math.random() * 5);
  let main = `M ${x.toFixed(1)} 0`;
  const branches: BranchPath[] = [];
  // Alternating zigzag: each segment swings hard in the opposite direction.
  let direction = Math.random() < 0.5 ? 1 : -1;
  let yProgress = 0;
  for (let i = 1; i <= segments; i++) {
    const sharpKink = Math.random() < 0.1;
    const swingMag = (0.06 + Math.random() * 0.16) * width * (sharpKink ? 1.6 : 1);
    x += swingMag * direction;
    const stepRatio = i === segments ? 1 - yProgress : (0.4 + Math.random() * 1.2) / segments;
    yProgress = Math.min(1, yProgress + stepRatio);
    y = height * yProgress;
    // Clamp horizontally so the bolt stays on-screen and doesn't pancake against walls.
    const minX = width * 0.08;
    const maxX = width * 0.92;
    let bouncedOffWall = false;
    if (x < minX) { x = minX; bouncedOffWall = true; direction = 1; }
    else if (x > maxX) { x = maxX; bouncedOffWall = true; direction = -1; }
    main += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    if (!bouncedOffWall && Math.random() > 0.18) direction *= -1;

    // Spawn a primary branch off this vertex. Higher probability than before so
    // multiple branches fork off the main bolt; each branch can spawn its own
    // sub-branches (depth-limited).
    if (Math.random() < 0.5 && i < segments - 1) {
      const branchDir = Math.random() < 0.5 ? -1 : 1;
      branches.push(...buildBranch(x, y, branchDir, width, height, 1, 2));
    }
  }
  return { main, branches };
}

export function LightningEffect() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function strike() {
      const overlay = overlayRef.current;
      const bolt = boltRef.current;
      if (!overlay || !bolt) return;
      if (busyRef.current) return;
      busyRef.current = true;
      window.setTimeout(() => {
        busyRef.current = false;
      }, COOLDOWN_MS);

      if (reduced) {
        overlay.style.transition = "opacity 0ms";
        overlay.style.opacity = "0.5";
        window.setTimeout(() => {
          overlay.style.transition = "opacity 220ms ease-out";
          overlay.style.opacity = "0";
        }, 60);
        return;
      }

      const body = document.body;

      STUTTER.forEach(([op, t, peak]) => {
        window.setTimeout(() => {
          overlay.style.transition = "opacity 30ms linear";
          overlay.style.opacity = String(op);
        }, t);
        if (peak) {
          window.setTimeout(() => {
            body.style.transition = "filter 40ms linear";
            body.style.filter = "contrast(1.25) saturate(0.65)";
          }, t);
          window.setTimeout(() => {
            body.style.filter = "";
          }, t + 60);
        }
      });
      window.setTimeout(() => {
        body.style.filter = "";
        body.style.transition = "";
      }, 500);

      // Bolt: drawn at peak 2 (t=80), held briefly, faded out by t≈300.
      // Light touch — group opacity 0.4, slim strokes, gentle glow.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const { main, branches } = generateBoltPath(w, h);
      const branchEls = branches
        .map((b) => {
          // Depth 1 = primary branch (medium thickness), depth 2 = sub-branch (thin & faint).
          const stroke = b.depth === 1 ? 1.3 : 0.8;
          const opacity = b.depth === 1 ? 0.7 : 0.45;
          return `<path d="${b.d}" stroke="white" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${opacity}"/>`;
        })
        .join("");
      bolt.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
          <defs>
            <filter id="lightningBoltGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#lightningBoltGlow)" opacity="0.4">
            <path d="${main}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            ${branchEls}
          </g>
        </svg>
      `;
      window.setTimeout(() => {
        bolt.style.transition = "opacity 0ms";
        bolt.style.opacity = "1";
      }, 80);
      window.setTimeout(() => {
        bolt.style.transition = "opacity 90ms ease-out";
        bolt.style.opacity = "0";
      }, 200);
      window.setTimeout(() => {
        bolt.innerHTML = "";
      }, 320);
    }

    function handler() {
      strike();
    }
    window.addEventListener("lightning:strike", handler);
    return () => window.removeEventListener("lightning:strike", handler);
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#ffffff",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "opacity",
        }}
      />
      <div
        ref={boltRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "opacity",
        }}
      />
    </>
  );
}
