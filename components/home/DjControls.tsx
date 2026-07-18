"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";

type DjControlsProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  openHref: string;
  disabled?: boolean;
  invert?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

const SHORT_VIEWPORT_QUERY = "(max-height: 600px)";

export default function DjControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  openHref,
  disabled = false,
  invert = false,
  prevDisabled = false,
  nextDisabled = false,
}: DjControlsProps) {
  const fill = invert ? "bg-white text-black" : "bg-black text-white";

  // In the compact short-viewport layout, the "Tyson Jiang" logo sits
  // directly above this column — matching its rendered width here keeps the
  // reserved left margin visually consistent between the header row and the
  // controls row, instead of the controls column being narrower and leaving
  // an inconsistent step in the left edge. Only tracked/applied in that one
  // layout — the normal column sizes itself to its buttons as before.
  const [isShortViewport, setIsShortViewport] = useState(false);
  const [logoWidth, setLogoWidth] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(SHORT_VIEWPORT_QUERY);
    const update = () => setIsShortViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (!isShortViewport) return;
    const el = document.getElementById("site-logo");
    if (!el) return;

    // The logo's own box is a fixed w-20 (80px), but "Tyson"/"Jiang" — the
    // last of its two justify-between spans — visually overflows past that
    // box rather than wrapping or shrinking. Measuring the box itself (via
    // el.getBoundingClientRect()) under-counts the text's true width, which
    // is what this column actually needs to line up with.
    const measure = () => {
      const spans = el.querySelectorAll("span");
      const lastSpan = spans[spans.length - 1];
      const rightEdge = (lastSpan ?? el).getBoundingClientRect().right;
      setLogoWidth(rightEdge - el.getBoundingClientRect().left);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isShortViewport]);

  // A landscape phone has ~350-430px of viewport height total — the normal
  // bottom-16 + h-20 circles (a 228px tall column) reach almost to the top
  // of the screen and collide with SiteNav/the title band. The
  // max-height:600px variant only matches that short-viewport case (regular
  // portrait phones and landscape tablets/desktop are all taller), so this
  // compacts just the one layout that actually needs it.
  // z-[150] — RecordCrate's pulled-out covers use inline z-index up to
  // ~60+n, which (with no intervening stacking context) compares directly
  // against this fixed element in the same root stacking context — scrolling
  // one up to the top of the viewport was covering these controls at z-30.
  return (
    <div
      id="dj-controls"
      className="fixed bottom-16 [@media(max-height:600px)]:bottom-4 left-8 md:left-16 flex flex-col items-center gap-4 [@media(max-height:600px)]:gap-2 z-[150]"
      style={isShortViewport && logoWidth ? { width: logoWidth } : undefined}
    >
      <div className="flex justify-between gap-2 w-20 [@media(max-height:600px)]:w-14">
        <button
          onClick={prevDisabled ? undefined : onPrev}
          disabled={prevDisabled}
          aria-label="Previous project"
          className={`h-9 w-9 [@media(max-height:600px)]:h-7 [@media(max-height:600px)]:w-7 aspect-square rounded-full flex items-center justify-center ${fill} ${
            prevDisabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          ⏮
        </button>
        <button
          onClick={nextDisabled ? undefined : onNext}
          disabled={nextDisabled}
          aria-label="Next project"
          className={`h-9 w-9 [@media(max-height:600px)]:h-7 [@media(max-height:600px)]:w-7 aspect-square rounded-full flex items-center justify-center ${fill} ${
            nextDisabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          ⏭
        </button>
      </div>

      {disabled ? (
        <span
          aria-disabled="true"
          className={`h-20 w-20 [@media(max-height:600px)]:h-14 [@media(max-height:600px)]:w-14 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center opacity-40 cursor-not-allowed ${fill}`}
        >
          Open
        </span>
      ) : (
        <Link
          href={openHref}
          aria-label="Open this project"
          className={`h-20 w-20 [@media(max-height:600px)]:h-14 [@media(max-height:600px)]:w-14 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center ${fill}`}
        >
          Open
        </Link>
      )}

      <button
        id="dj-play-button"
        onClick={disabled ? undefined : onTogglePlay}
        disabled={disabled}
        aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
        className={`h-20 w-20 [@media(max-height:600px)]:h-14 [@media(max-height:600px)]:w-14 rounded-full flex items-center justify-center transition-shadow ${fill} ${
          isPlaying ? "shadow-[0_0_0_4px_rgba(245,158,11,0.8)]" : ""
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
}
