"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const DURATION_MS = 1500;
// Kept over the covered screen a beat past the navigation so the incoming
// page has painted before the overlay lifts, avoiding a blank flash.
const REVEAL_DELAY_MS = 180;

type Ctx = {
  /** Play the paint-drop, then navigate to href once it covers the screen. */
  go: (href: string, heroUrl: string | null) => void;
};

const DropContext = createContext<Ctx | null>(null);

export function useDropTransition(): Ctx {
  const ctx = useContext(DropContext);
  // Falls back to a plain push when used outside the provider, so a link
  // never breaks just because the provider isn't mounted.
  const router = useRouter();
  return ctx ?? { go: (href) => router.push(href) };
}

export default function DropTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const go = useCallback(
    (href: string, url: string | null) => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // No image to drop, or motion is unwanted — just navigate.
      if (!url || reduced) {
        router.push(href);
        return;
      }

      timers.current.forEach(clearTimeout);
      timers.current = [];
      setHeroUrl(url);

      // Navigate once the fill covers the screen: the swap happens hidden
      // under the overlay, so the old page → new page change is never seen.
      timers.current.push(window.setTimeout(() => router.push(href), DURATION_MS));
      // Then lift the overlay a beat later, revealing the settled new page.
      timers.current.push(
        window.setTimeout(() => setHeroUrl(null), DURATION_MS + REVEAL_DELAY_MS)
      );
    },
    [router]
  );

  return (
    <DropContext.Provider value={{ go }}>
      {children}
      {heroUrl && (
        <div
          className="pp-drop"
          aria-hidden
          style={{
            backgroundImage: `url("${encodeURI(heroUrl)}")`,
            // Exposed so the value stays in one place with the JS timing.
            ["--pp-drop-ms" as string]: `${DURATION_MS}ms`,
          }}
        />
      )}
    </DropContext.Provider>
  );
}
