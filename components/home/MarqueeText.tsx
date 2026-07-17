"use client";

import { useLayoutEffect, useRef, useState } from "react";

const SPEED_PX_PER_SEC = 50; // slow, steady scroll speed
const GAP_PX = 64; // spacing between repeated copies while looping

type MarqueeTextProps = {
  text: string;
  bandLength: number;
  fontSize: number;
  enterClass?: string;
  enterDurationMs?: number;
};

// Renders text once if it fits the available band; if it overflows, renders
// it twice back-to-back and loops it continuously via a CSS animation, which
// (being `infinite`) starts playing on its own the moment it mounts — no
// interaction needed to trigger it.
//
// The overflow check runs via useLayoutEffect, which resolves before the
// browser's first paint, so the static-vs-looping choice is already final
// by the time anything is visible — there's no later swap between the two
// to cause a stutter. The entrance animation (if any) is applied to the
// OUTER wrapper as a plain CSS animation running in parallel, rather than
// gating which inner structure renders — so the marquee (if it's overflowing)
// is already looping underneath the entrance motion from frame one.
export default function MarqueeText({
  text,
  bandLength,
  fontSize,
  enterClass,
  enterDurationMs = 0,
}: MarqueeTextProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const width = el.scrollWidth;
    setContentWidth(width);
    setOverflowing(width > bandLength);
  }, [text, bandLength]);

  const duration = contentWidth > 0 ? (contentWidth + GAP_PX) / SPEED_PX_PER_SEC : 0;

  const textClass = "leading-none font-light tracking-widest text-white/90 uppercase";

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${enterClass ?? ""}`}
      style={enterClass ? { animationDuration: `${enterDurationMs}ms` } : undefined}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className={`invisible absolute whitespace-nowrap ${textClass}`}
        style={{ fontSize }}
      >
        {text}
      </span>

      {overflowing ? (
        <div
          className={`flex items-center h-full whitespace-nowrap animate-marquee-continuous ${textClass}`}
          style={{ animationDuration: `${duration}s` }}
        >
          <span style={{ fontSize, paddingRight: GAP_PX }}>{text}</span>
          <span style={{ fontSize, paddingRight: GAP_PX }} aria-hidden="true">
            {text}
          </span>
        </div>
      ) : (
        <p className={`absolute inset-0 flex items-center whitespace-nowrap ${textClass}`} style={{ fontSize }}>
          {text}
        </p>
      )}
    </div>
  );
}
