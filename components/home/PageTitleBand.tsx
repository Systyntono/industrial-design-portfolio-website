"use client";

import { useBandLayout, BAND_THICKNESS } from "./useBandLayout";
import MarqueeText from "./MarqueeText";

type PageTitleBandProps = {
  title: string;
};

const GLYPH_HEIGHT = 80; // px — matches the play/pause button diameter (h-20)

export default function PageTitleBand({ title }: PageTitleBandProps) {
  const layout = useBandLayout();

  const innerTransform =
    layout.mode === "vertical"
      ? "translate(-50%, -50%) rotate(-90deg)"
      : "translate(-50%, -50%)";

  return (
    <div
      className="fixed overflow-hidden z-30"
      style={{ top: layout.top, left: layout.left, width: layout.width, height: layout.height }}
    >
      <div
        className="absolute top-1/2 left-1/2 overflow-hidden"
        style={{
          width: layout.bandLength,
          height: BAND_THICKNESS,
          transform: innerTransform,
        }}
      >
        <MarqueeText text={title} bandLength={layout.bandLength} fontSize={GLYPH_HEIGHT} />
      </div>
    </div>
  );
}
