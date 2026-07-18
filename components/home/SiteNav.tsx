"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SiteNavProps = {
  variant?: "onPhoto" | "onLight";
  onLogoClick?: () => void;
};

const links = [
  { href: "/?view=grid", label: "Work" },
  { href: "/?view=about", label: "About" },
  { href: "/?view=resume", label: "Resume" },
  { href: "/?view=contact", label: "Contact" },
];

const MENU_TRANSITION_MS = 300;

export default function SiteNav({ variant = "onPhoto", onLogoClick }: SiteNavProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const textColor = variant === "onPhoto" ? "text-white" : "text-zinc-900";

  // Closing the dropdown and starting the gallery's slide-in at the same
  // instant reads as one abrupt cut. Playing the dropdown's close transition
  // first, then handing off to the gallery once the overlay is actually
  // gone, reads as one continuous motion instead of two colliding ones.
  const selectLink = (href: string) => {
    setMenuOpen(false);
    window.setTimeout(() => {
      router.push(href);
    }, MENU_TRANSITION_MS);
  };

  return (
    <>
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
        className={`fixed top-6 left-8 md:left-16 w-20 flex justify-between whitespace-nowrap text-sm font-semibold z-[150] ${textColor}`}
      >
        <span>Tyson</span>
        <span>Jiang</span>
      </Link>

      {/* "Tyson Jiang" overflows its own w-20 box, and on narrow phones
          there isn't enough room between it and four inline links before
          they collide — swap to a toggle + centered dropdown below sm. */}
      <div className={`hidden sm:flex fixed top-6 right-8 md:right-16 gap-6 z-[150] ${textColor}`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        className={`sm:hidden fixed top-6 right-8 z-[170] flex flex-col justify-center gap-1.5 w-6 h-6 ${
          menuOpen ? "text-white" : textColor
        }`}
      >
        <span
          className={`block h-px w-full bg-current transition-transform duration-300 ${
            menuOpen ? "translate-y-[3.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-full bg-current transition-transform duration-300 ${
            menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Always mounted (not conditionally rendered) so its own open/close
          transition can actually play in both directions — opacity/scale
          driven by menuOpen, same pattern RecordCrate uses for its
          transforms. pointer-events-none while closed keeps it from
          intercepting clicks it's not visibly there for.
          z-[160] — above the persistent nav/controls (z-[150], themselves
          raised above RecordCrate's pulled-out covers, which use inline
          z-index up to ~60+n with no intervening stacking context) so the
          overlay covers the "Tyson Jiang" logo too while open, not just the
          content behind it. */}
      <div
        className={`sm:hidden fixed inset-0 z-[160] bg-black/90 backdrop-blur-sm flex items-center justify-center transition-all ease-in-out ${
          menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
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
