"""
Cut a sheet of accent shapes (transparent silhouette PNG) into individual files.

Strategy:
  - Read the alpha channel and threshold to binary.
  - Dilate slightly so that disconnected ink pieces of one shape (e.g. spikes
    of a star) merge into a single component.
  - Label connected components.
  - For each component, crop the ORIGINAL image (full alpha, no dilation) by
    its bounding box and save as a transparent PNG.

Output is written to public/images/accents/raw-N.png with N as a zero-padded
sequential index. We later rename to descriptive labels by hand.
"""
import os
import sys
from PIL import Image
import numpy as np
from scipy import ndimage

SRC = "/Users/shaidavis/Documents/Work/Startle Labs/Branding/Website Rebuild 2026/StartleLabs Website Code/public/images/icons/Untitled_Artwork-2.png"
OUT_DIR = "/Users/shaidavis/Documents/Work/Startle Labs/Branding/Website Rebuild 2026/StartleLabs Website Code/public/images/accents"

# How aggressive the merge dilation is. Bigger = more shapes merged into one
# component (good for stars/bursts where spikes are isolated). Too big and
# adjacent unrelated shapes glob together.
DILATE_RADIUS = 14

# Skip components smaller than this (noise dots, dust).
MIN_AREA = 400  # pixels (in 2048x2048 sheet)

# Skip components whose bbox is huge — they're probably the whole canvas.
MAX_DIM_FRACTION = 0.95


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)

    img = Image.open(SRC).convert("RGBA")
    arr = np.array(img)
    alpha = arr[:, :, 3]

    # Threshold: anything with meaningful alpha is "ink".
    binary = alpha > 32

    # Dilate so close ink fragments merge.
    structure = np.ones((DILATE_RADIUS * 2 + 1, DILATE_RADIUS * 2 + 1))
    dilated = ndimage.binary_dilation(binary, structure=structure)

    # Label connected components on the dilated mask.
    labels, n = ndimage.label(dilated)
    print(f"found {n} raw components", file=sys.stderr)

    h, w = binary.shape
    saved = 0
    bboxes = []

    for label in range(1, n + 1):
        ys, xs = np.where(labels == label)
        if len(ys) < MIN_AREA:
            continue
        y0, y1 = int(ys.min()), int(ys.max())
        x0, x1 = int(xs.min()), int(xs.max())
        bw, bh = x1 - x0 + 1, y1 - y0 + 1
        if bw > w * MAX_DIM_FRACTION and bh > h * MAX_DIM_FRACTION:
            continue
        bboxes.append((x0, y0, bw, bh, label))

    # Sort top-to-bottom, then left-to-right so filenames are stable across runs
    # — we go in row bands of 200px so shapes on the same visual row stay
    # together regardless of small y-coordinate jitter.
    bboxes.sort(key=lambda b: (b[1] // 200, b[0]))

    for i, (x0, y0, bw, bh, label) in enumerate(bboxes, start=1):
        # Crop using the original image so we keep the soft texture in the
        # alpha channel — the dilation was only for grouping.
        # Pad a little so antialiased edges aren't clipped.
        pad = 8
        x0p = max(0, x0 - pad)
        y0p = max(0, y0 - pad)
        x1p = min(w, x0 + bw + pad)
        y1p = min(h, y0 + bh + pad)
        crop = img.crop((x0p, y0p, x1p, y1p))

        out_path = os.path.join(OUT_DIR, f"raw-{i:02d}.png")
        crop.save(out_path)
        saved += 1
        print(f"  raw-{i:02d}.png  bbox=({x0},{y0},{bw}x{bh})", file=sys.stderr)

    print(f"saved {saved} shapes to {OUT_DIR}", file=sys.stderr)


if __name__ == "__main__":
    main()
