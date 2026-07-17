"use client";

import { heroSlides } from "@/data/heroSlides";
import { useBandLayout, BAND_THICKNESS } from "./useBandLayout";
import MarqueeText from "./MarqueeText";

type RotatingLabelProps = {
  index: number;
  prevIndex: number;
  direction: 1 | -1;
  transitionMs: number;
};

const GLYPH_HEIGHT = 80; // px — matches the play/pause button diameter (h-20)

export default function RotatingLabel({
  index,
  prevIndex,
  direction,
  transitionMs,
}: RotatingLabelProps) {
  const isTransitioning = prevIndex !== index;

  const inClass = direction === 1 ? "animate-label-in" : "animate-label-in-reverse";
  const outClass = direction === 1 ? "animate-label-out" : "animate-label-out-reverse";

  const layout = useBandLayout();

  const innerTransform =
    layout.mode === "vertical"
      ? "translate(-50%, -50%) rotate(-90deg)"
      : "translate(-50%, -50%)";

  return (
    <div
      className="fixed overflow-hidden  z-30"
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
        {isTransitioning && (
          <p
            key={`out-${prevIndex}`}
            className={`absolute inset-0 flex items-center whitespace-nowrap leading-none font-light tracking-widest text-white/90 uppercase ${outClass}`}
            style={{ animationDuration: `${transitionMs}ms`, fontSize: GLYPH_HEIGHT }}
          >
            {heroSlides[prevIndex].label}
          </p>
        )}

        {/* Same component the whole time a slide is current — the entrance
            animation and the settled/marquee state live in one element, so
            there's no hand-off between two different DOM trees to "snap". */}
        <MarqueeText
          key={index}
          text={heroSlides[index].label}
          bandLength={layout.bandLength}
          fontSize={GLYPH_HEIGHT}
          enterClass={inClass}
          enterDurationMs={transitionMs}
        />
      </div>
    </div>
  );
}
