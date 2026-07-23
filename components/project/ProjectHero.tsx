"use client";

import Image from "next/image";
import { PLACEHOLDER, type Tone } from "./projectTokens";

// Scaled up 50% from the original 28px glyph / 48px hit area.
const GLYPH_PX = 42;
const HIT_PX = 64;

/**
 * Fills exactly one screen — never more, so nothing is cut off and the page
 * doesn't start mid-scroll.
 *
 * Height is `100svh` (small viewport height) minus the header. `svh` is the
 * height with mobile browser chrome *shown*, which is what stops iOS Safari
 * and Chrome Android from pushing the arrow below the fold when their
 * toolbars are expanded. A `100vh` fallback is declared first for older
 * browsers that don't understand `svh`.
 */
export default function ProjectHero({
  url,
  alt,
  tone = "image",
  targetId,
}: {
  url: string | null;
  alt: string;
  tone?: Tone;
  targetId: string;
}) {
  const scrollToContent = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    // `scroll-margin-top` on the target handles the fixed header offset, so
    // the title lands flush under it rather than beneath it.
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="pp-hero relative w-full overflow-hidden"
      style={{ background: url ? "transparent" : PLACEHOLDER[tone] }}
    >
      {url && <Image src={url} alt={alt} fill priority sizes="100vw" className="object-cover" />}

      <button
        type="button"
        onClick={scrollToContent}
        aria-label="Scroll to project details"
        className="pp-arrow absolute left-1/2 flex items-center justify-center transition-opacity hover:opacity-60"
        style={{
          width: HIT_PX,
          height: HIT_PX,
          bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          transform: "translateX(-50%)",
          color: url ? "#ffffff" : "#00000099",
        }}
      >
        <svg
          width={GLYPH_PX}
          height={GLYPH_PX}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          // A solid triangle reads at a glance where a thin chevron can get
          // lost against a busy photo.
          style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}
        >
          <path d="M12 17 3.5 7h17z" />
        </svg>
      </button>
    </section>
  );
}
