"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CAPTION_PX } from "./projectScale";

const links = [
  { href: "/?view=grid", label: "Work" },
  { href: "/?view=about", label: "About" },
  { href: "/?view=resume", label: "Resume" },
  { href: "/?view=contact", label: "Contact" },
];

// Ignore sub-pixel jitter and trackpad bounce, which would otherwise make the
// bar flicker between hidden and shown while the page is basically still.
const DELTA_THRESHOLD = 8;
// Never hide the bar over the first screenful — at the top of a page there's
// nothing to reclaim and it just reads as the header falling off.
const REVEAL_ZONE = 120;

export default function ProjectHeader({ title }: { title?: string }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < REVEAL_ZONE) {
        setHidden(false);
      } else if (Math.abs(delta) > DELTA_THRESHOLD) {
        setHidden(delta > 0); // scrolling down hides, up reveals
      }

      if (Math.abs(delta) > DELTA_THRESHOLD || y < REVEAL_ZONE) {
        lastY.current = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        background: "var(--pp-bg)",
        borderBottom: "1px solid var(--pp-rule)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="font-semibold tracking-tight"
          style={{ fontSize: CAPTION_PX, color: "var(--pp-fg)" }}
        >
          Tyson Jiang
        </Link>

        {title && (
          <span
            className="hidden truncate px-6 md:block"
            style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
          >
            {title}
          </span>
        )}

        <nav className="flex gap-5 md:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-opacity hover:opacity-60"
              style={{ fontSize: CAPTION_PX, color: "var(--pp-fg)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
