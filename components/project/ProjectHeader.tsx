"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LAYOUT, SPACE, type as t } from "./projectTokens";

const links = [
  { href: "/?view=grid", label: "Work" },
  { href: "/?view=about", label: "About" },
  { href: "/?view=resume", label: "Resume" },
  { href: "/?view=contact", label: "Contact" },
];

// Ignore sub-pixel jitter and trackpad/touch bounce, which would otherwise
// flicker the bar between hidden and shown while the page is basically still.
const DELTA_THRESHOLD = 8;
// Never hide over the first screenful — there's nothing to reclaim at the top
// and it just reads as the header falling off.
const REVEAL_ZONE = 120;

export default function ProjectHeader({ title }: { title?: string }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < REVEAL_ZONE) {
        setHidden(false);
      } else if (Math.abs(delta) > DELTA_THRESHOLD) {
        setHidden(delta > 0); // down hides, up reveals
      }

      if (Math.abs(delta) > DELTA_THRESHOLD || y < REVEAL_ZONE) {
        lastY.current = y;
      }
      ticking.current = false;
    };

    // Coalesce scroll events into one update per frame. Without this, a fast
    // flick on a phone fires far more handlers than there are frames to
    // paint, which is where scroll jank comes from.
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out"
      style={{
        height: "var(--pp-header-h)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        background: "var(--pp-bg)",
        borderBottom: "1px solid var(--pp-rule)",
        // Avoids repainting the whole page on each show/hide.
        willChange: "transform",
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between gap-4"
        style={{
          maxWidth: LAYOUT.contentMax,
          paddingLeft: SPACE.pagePad,
          paddingRight: SPACE.pagePad,
        }}
      >
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight"
          style={{ ...t.caption, color: "var(--pp-fg)" }}
        >
          Tyson Jiang
        </Link>

        {title && (
          <span
            className="hidden min-w-0 flex-1 truncate px-4 text-center lg:block"
            style={{ ...t.caption, color: "var(--pp-muted)" }}
          >
            {title}
          </span>
        )}

        <nav className="flex shrink-0 items-center gap-4 sm:gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-opacity hover:opacity-60"
              style={{ ...t.caption, color: "var(--pp-fg)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
