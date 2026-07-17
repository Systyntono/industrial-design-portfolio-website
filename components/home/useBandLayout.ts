"use client";

import { useLayoutEffect, useState } from "react";

export const BAND_THICKNESS = 80; // matches the DJ control column width (w-20)
export const GAP = 56; // px — Tailwind spacing-14 (3.5rem), held constant on either side of the band
export const HORIZONTAL_THRESHOLD = 200; // px — below this available length, flip to the bottom horizontal layout

export type BandLayout = {
  mode: "vertical" | "horizontal";
  top: number;
  left: number;
  width: number;
  height: number;
  bandLength: number; // the length along the text's reading direction
};

const FALLBACK_LAYOUT: BandLayout = {
  mode: "vertical",
  top: 112,
  left: 32,
  width: BAND_THICKNESS,
  height: 300,
  bandLength: 300,
};

// Measures the actual logo and DJ-control positions on every resize, so a
// title band's gap on either side always stays exactly GAP, and the band
// itself fills whatever room is left between them — flipping to a horizontal
// strip beside the controls once vertical space runs out.
export function useBandLayout(): BandLayout {
  const [layout, setLayout] = useState<BandLayout>(FALLBACK_LAYOUT);

  useLayoutEffect(() => {
    const recalc = () => {
      const logoEl = document.getElementById("site-logo");
      const controlsEl = document.getElementById("dj-controls");
      const playButtonEl = document.getElementById("dj-play-button");
      if (!logoEl || !controlsEl) return;

      const logoRect = logoEl.getBoundingClientRect();
      const controlsRect = controlsEl.getBoundingClientRect();

      const verticalSpace = controlsRect.top - logoRect.bottom - GAP * 2;

      if (verticalSpace < HORIZONTAL_THRESHOLD) {
        const alignRect = playButtonEl?.getBoundingClientRect() ?? controlsRect;
        const horizontalSpace = Math.max(
          window.innerWidth - controlsRect.right - GAP * 2,
          0
        );
        setLayout({
          mode: "horizontal",
          left: controlsRect.right + GAP,
          top: alignRect.top + alignRect.height / 2 - BAND_THICKNESS / 2,
          width: horizontalSpace,
          height: BAND_THICKNESS,
          bandLength: horizontalSpace,
        });
      } else {
        setLayout({
          mode: "vertical",
          top: logoRect.bottom + GAP,
          left: logoRect.left,
          width: BAND_THICKNESS,
          height: verticalSpace,
          bandLength: verticalSpace,
        });
      }
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  return layout;
}
