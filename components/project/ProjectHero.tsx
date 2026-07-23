"use client";

import Image from "next/image";
import { PLACEHOLDER, type as t, type Tone } from "./projectTokens";

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
    // the overview lands flush under it rather than beneath it.
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="pp-hero relative w-full overflow-hidden"
      style={{ background: url ? "transparent" : PLACEHOLDER[tone] }}
    >
      {url && (
        <Image
          src={url}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      <button
        type="button"
        onClick={scrollToContent}
        aria-label="Scroll to project details"
        className="pp-arrow absolute left-1/2 flex items-center justify-center rounded-full transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2"
        style={{
          // 44px is the minimum comfortable touch target on iOS and Android.
          width: 48,
          height: 48,
          bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          transform: "translateX(-50%)",
          color: url ? "#ffffff" : "#00000088",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
