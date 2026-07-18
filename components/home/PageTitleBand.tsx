"use client";

import { useBandLayout, BAND_THICKNESS } from "./useBandLayout";
import MarqueeText from "./MarqueeText";

type PageTitleBandProps = {
  title: string;
};

const GLYPH_HEIGHT = 80; // px — matches the play/pause button diameter (h-20)

export default function PageTitleBand({ title }: PageTitleBandProps) {
  const layout = useBandLayout();

  // Vertical mode's band lives in the left margin, which scrollable content
  // already respects (via the same layout's left inset) — the band and the
  // content never occupy the same screen space, so staying position:fixed
  // there is safe. Horizontal mode places the band mid-screen instead
  // (there's no room for a vertical column), and a page below it scrolls
  // BENEATH that fixed position — no amount of top padding on the content
  // prevents it from eventually passing behind the band as the user scrolls,
  // since padding only affects where content starts, not where a fixed
  // element sits relative to it on every subsequent frame. Rather than fight
  // that, the caller (ProjectBrowser) renders its own in-flow heading for
  // this case, so this component simply steps aside.
  if (layout.mode === "horizontal") return null;

  const innerTransform = "translate(-50%, -50%) rotate(-90deg)";

  // z-[150] — matches SiteNav/DjControls: RecordCrate's pulled-out covers
  // use inline z-index up to ~60+n in the same root stacking context.
  return (
    <div
      className="fixed overflow-hidden z-[150]"
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
