"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LAYOUT, SPACE } from "@/components/project/projectTokens";

type SiteNavProps = {
  variant?: "onPhoto" | "onLight";
  onLogoClick?: () => void;
  /**
   * Slide the bar away on scroll down and bring it back on scroll up. Used
   * on long pages; the gallery doesn't scroll, so it leaves this off.
   */
  hideOnScroll?: boolean;
};

const links = [
  { href: "/?view=grid", label: "Work" },
  { href: "/?view=about", label: "About" },
  { href: "/?view=resume", label: "Resume" },
  { href: "/?view=contact", label: "Contact" },
];

const MENU_TRANSITION_MS = 300;
// Ignore sub-pixel jitter and touch bounce, which would otherwise flicker
// the bar while the page is basically still.
const DELTA_THRESHOLD = 8;
const REVEAL_ZONE = 120;

export default function SiteNav({
  variant = "onPhoto",
  onLogoClick,
  hideOnScroll = false,
}: SiteNavProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const textColor = variant === "onPhoto" ? "text-white" : "text-zinc-900";

  useEffect(() => {
    if (!hideOnScroll) return;
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < REVEAL_ZONE) setHidden(false);
      else if (Math.abs(delta) > DELTA_THRESHOLD) setHidden(delta > 0);
      if (Math.abs(delta) > DELTA_THRESHOLD || y < REVEAL_ZONE) lastY.current = y;
      ticking.current = false;
    };

    // Coalesce scroll events to one update per frame. Without this a fast
    // flick on a phone fires far more handlers than there are frames to
    // paint, which is where scroll jank comes from.
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  // Closing the dropdown and starting the next page's transition at the same
  // instant reads as one abrupt cut. Playing the close first, then handing
  // off once the overlay is gone, reads as one continuous motion.
  const selectLink = (href: string) => {
    setMenuOpen(false);
    window.setTimeout(() => router.push(href), MENU_TRANSITION_MS);
  };

  return (
    <>
      {/* One fixed bar carrying both the wordmark and the links, so they
          align to the same 12-column measure as the page content. */}
      <div
        className="fixed inset-x-0 top-0 z-[150] transition-transform duration-300 ease-out"
        style={{
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          willChange: hideOnScroll ? "transform" : undefined,
          pointerEvents: "none",
        }}
      >
        <div
          className="mx-auto flex w-full items-center justify-between gap-4"
          style={{
            maxWidth: LAYOUT.contentMax,
            paddingLeft: SPACE.pagePad,
            paddingRight: SPACE.pagePad,
            height: "var(--pp-header-h)",
          }}
        >
          <Link
            href="/"
            id="site-logo"
            onClick={
              onLogoClick
                ? (e) => {
                    e.preventDefault();
                    onLogoClick();
                  }
                : undefined
            }
            className={`pointer-events-auto flex w-20 shrink-0 justify-between whitespace-nowrap text-sm font-semibold ${textColor}`}
          >
            <span>Tyson</span>
            <span>Jiang</span>
          </Link>

          {/* "Tyson Jiang" overflows its own w-20 box, and on narrow phones
              there isn't room between it and four inline links before they
              collide — swap to a toggle + centred dropdown below sm. */}
          <div className={`pointer-events-auto hidden shrink-0 gap-6 sm:flex ${textColor}`}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="transition-opacity hover:opacity-60">
                {l.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className={`pointer-events-auto relative z-[170] flex h-11 w-11 shrink-0 flex-col items-end justify-center gap-1.5 sm:hidden ${
              menuOpen ? "text-white" : textColor
            }`}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Always mounted so its open/close transition can play in both
          directions. z-[160] clears RecordCrate's pulled-out covers, which
          carry inline z-index up to ~60+n in the same stacking context. */}
      <div
        className={`fixed inset-0 z-[160] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all ease-in-out sm:hidden ${
          menuOpen ? "opacity-100 scale-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ transitionDuration: `${MENU_TRANSITION_MS}ms` }}
      >
        <nav className="flex flex-col items-center gap-6 text-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                selectLink(l.href);
              }}
              className="text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
