"use client";

import { useEffect, useState } from "react";

// Total animation length. Kept short — an entrance that outstays its welcome
// is worse than none.
const DURATION_MS = 1150;

/**
 * The circle-wipe entrance.
 *
 * The project's hero image drops in from above as a circle, settles in the
 * centre, then expands to fill the window and hands off to the page beneath.
 *
 * It's an overlay on the project page rather than a shared element animated
 * across a route change: the App Router unmounts the old page before the new
 * one paints, so there is no moment where both exist to tween between. The
 * overlay shows the same hero image the page underneath opens with, so the
 * hand-off is invisible.
 */
export default function ProjectEntrance({ url }: { url: string | null }) {
  // Starts null so the server and the first client render agree — reading
  // matchMedia during render would desync hydration.
  const [play, setPlay] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPlay(false);
      return;
    }
    setPlay(true);
    const timer = window.setTimeout(() => setPlay(false), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!play || !url) return null;

  return (
    <div
      className="pp-entrance"
      aria-hidden
      style={{
        backgroundImage: `url("${encodeURI(url)}")`,
        animationDuration: `${DURATION_MS}ms`,
      }}
    />
  );
}
