"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { heroSlides } from "@/data/heroSlides";
import DjControls from "./DjControls";
import RotatingLabel from "./RotatingLabel";
import ProjectBrowser from "./ProjectBrowser";
import SiteNav from "./SiteNav";
import PageTitleBand from "./PageTitleBand";

const ROTATE_MS = 5000;
const TRANSITION_MS = 600;
const GLIDE_MS = 1800; // one continuous right-to-left pass through every photo
const GLIDE_OVERLAP_MS = 450; // start the grid's entrance this much before the glide visually settles, so it never pauses on the last photo
const GRID_TRANSITION_MS = 700; // the grid's own slide in/out, matching the hero photos' convention

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stage, setStage] = useState<"gallery" | "grid">(() =>
    searchParams.get("view") === "grid" ? "grid" : "gallery"
  );
  const [gliding, setGliding] = useState(false);
  const [glideStarted, setGlideStarted] = useState(false);
  const [gridEntering, setGridEntering] = useState(false);
  const [gridExiting, setGridExiting] = useState(false);
  const isFirstRender = useRef(true);

  const isLast = index === heroSlides.length - 1;

  // Hero fully covers the viewport itself (fixed inset-0 below), so the
  // document never needs to scroll while it's mounted — locking body scroll
  // here rules out the browser's own scrollbar flashing on during any of the
  // transform-heavy transitions above. Restored on unmount for other pages.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Shared "move on to the grid" trigger — used by the normal end-of-gallery
  // rotation, the manual next button, and the glide sequence. The grid
  // slides in from the right, same convention the hero photos use for
  // moving forward.
  const enterGrid = () => setGridEntering(true);

  useEffect(() => {
    if (!gridEntering) return;
    const timeout = setTimeout(() => {
      setStage("grid");
      setGridEntering(false);
      setGliding(false);
      setGlideStarted(false);
      setIndex(heroSlides.length - 1);
      setPrevIndex(heroSlides.length - 1);
      setDirection(1);
    }, GRID_TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [gridEntering]);

  // The reverse of enterGrid — the grid slides back out to the right while
  // the gallery (already showing the target photo underneath) is revealed.
  const leaveGrid = (targetIndex: number, targetDirection: 1 | -1) => {
    setDirection(targetDirection);
    setIndex(targetIndex);
    setPrevIndex(targetIndex);
    setGridExiting(true);
  };

  useEffect(() => {
    if (!gridExiting) return;
    const timeout = setTimeout(() => {
      setStage("gallery");
      setGridExiting(false);
    }, GRID_TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [gridExiting]);

  // The header's "Work" link points at /?view=grid. Rather than jump
  // straight there, glide through every photo in one continuous motion and
  // ease into the grid — same whether we're already on the home page (this
  // just updates the URL, no remount) or arriving fresh from another page
  // (handled by the lazy state above).
  useEffect(() => {
    if (searchParams.get("view") !== "grid") return;
    setStage("gallery");
    setGliding(true);
    router.replace("/", { scroll: false });
  }, [searchParams, router]);

  // Kick the glide off on the next frame, so the browser paints the strip at
  // its starting position before the transition to the end position begins —
  // otherwise there's nothing for the CSS transition to animate from.
  useEffect(() => {
    if (!gliding) {
      setGlideStarted(false);
      return;
    }
    const raf = requestAnimationFrame(() => setGlideStarted(true));
    return () => cancelAnimationFrame(raf);
  }, [gliding]);

  useEffect(() => {
    if (!gliding || !glideStarted) return;
    // Fire before the glide's own transition finishes, so the grid's
    // entrance overlaps its tail end instead of waiting for it to settle on
    // the last photo first.
    const timeout = setTimeout(enterGrid, Math.max(GLIDE_MS - GLIDE_OVERLAP_MS, 0));
    return () => clearTimeout(timeout);
  }, [gliding, glideStarted]);

  // Collapse the two-layer transition back to a single settled image
  // TRANSITION_MS after the index changes (normal browsing only — the glide
  // handles its own motion separately).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => setPrevIndex(index), TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    if (!isPlaying || stage !== "gallery" || gliding || gridEntering) return;

    const id = setInterval(() => {
      if (isLast) {
        enterGrid();
        return;
      }
      setDirection(1);
      setIndex((prev) => prev + 1);
    }, ROTATE_MS);

    return () => clearInterval(id);
  }, [isPlaying, stage, isLast, gliding, gridEntering]);

  const goNext = () => {
    if (gliding || gridEntering) return;
    if (isLast) {
      enterGrid();
      return;
    }
    setDirection(1);
    setIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    if (gliding || gridEntering || index === 0) return;
    setDirection(-1);
    setIndex((prev) => prev - 1);
  };

  const backToGallery = () => leaveGrid(heroSlides.length - 1, -1);
  const restartGallery = () => leaveGrid(0, 1);

  const current = heroSlides[index];

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-black">
      {(stage === "gallery" || gridExiting) && !gliding && (
        <section
          className="absolute inset-0 h-dvh w-full overflow-hidden transition-opacity ease-in-out"
          style={{ opacity: gridEntering ? 0 : 1, transitionDuration: `${GRID_TRANSITION_MS}ms` }}
        >
          <Image
            src={heroSlides[prevIndex].image}
            alt={heroSlides[prevIndex].label}
            fill
            priority
            className="object-cover"
          />

          {prevIndex !== index && (
            <Image
              key={index}
              src={current.image}
              alt={current.label}
              fill
              className={`object-cover ${
                direction === 1 ? "animate-slide-in-right" : "animate-slide-in-left"
              }`}
              style={{ animationDuration: `${TRANSITION_MS}ms` }}
            />
          )}

          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {/* Suppressed while the grid is sliding in — otherwise this section's
              fixed nav/controls briefly overlap the grid's own copies, since
              both sections are mounted at once during the handoff. */}
          {!gridEntering && (
            <>
              <SiteNav variant="onPhoto" onLogoClick={restartGallery} />

              <RotatingLabel
                index={index}
                prevIndex={prevIndex}
                direction={direction}
                transitionMs={TRANSITION_MS}
              />
              <DjControls
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying((p) => !p)}
                onNext={goNext}
                onPrev={goPrev}
                openHref={`/work/${current.projectSlug}`}
                prevDisabled={index === 0}
              />
            </>
          )}
        </section>
      )}

      {gliding && (
        // One continuous filmstrip pass, right to left, instead of the
        // discrete per-slide slide-and-settle used for normal browsing —
        // that stepped approach couldn't move fast enough to look smooth
        // without stuttering between steps.
        <section
          className="absolute inset-0 h-dvh w-full overflow-hidden transition-opacity ease-in-out"
          style={{ opacity: gridEntering ? 0 : 1, transitionDuration: `${GRID_TRANSITION_MS}ms` }}
        >
          <div
            className="absolute inset-0 flex h-dvh"
            style={{
              transform: `translateX(${glideStarted ? -(heroSlides.length - 1) * 100 : 0}vw)`,
              transition: `transform ${GLIDE_MS}ms cubic-bezier(0.19, 1, 0.22, 1)`,
            }}
          >
            {heroSlides.map((slide) => (
              <div key={slide.projectSlug} className="relative h-full shrink-0" style={{ width: "100vw" }}>
                <Image src={slide.image} alt={slide.label} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {(stage === "grid" || gridEntering || gridExiting) && (
        <section className="absolute inset-0 h-dvh w-full overflow-y-auto hide-scrollbar">
          {/* Nav/title-band/controls stay OUTSIDE the sliding wrapper below —
              a transform on an ancestor creates a new stacking context, which
              is what previously let the crate's z-index climb above these and
              bury both the title and the nav. They're position:fixed with
              explicit z-30, so they stay put and on top regardless of what
              the content underneath is doing. */}
          {/* Suppressed while sliding out — the gallery underneath shows its
              own nav as soon as it's revealed, so this copy would otherwise
              overlap it during the handoff. */}
          {!gridExiting && (
            <>
              <SiteNav variant="onPhoto" onLogoClick={restartGallery} />
              <PageTitleBand title="More Projects" />
              <DjControls
                isPlaying={false}
                onTogglePlay={() => {}}
                onPrev={backToGallery}
                onNext={restartGallery}
                openHref="#"
                disabled
                invert
                nextDisabled
              />
            </>
          )}

          <div
            className={`min-h-full bg-black ${
              gridEntering ? "animate-slide-in-right" : gridExiting ? "animate-slide-out-right" : ""
            }`}
            style={
              gridEntering || gridExiting
                ? { animationDuration: `${GRID_TRANSITION_MS}ms` }
                : undefined
            }
          >
            <ProjectBrowser />
          </div>
        </section>
      )}
    </div>
  );
}
