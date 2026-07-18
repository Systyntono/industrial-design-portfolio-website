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
  // rotation, the manual next button, and the Work-button jump. The grid
  // slides in from the right — the exact same animate-slide-in-right
  // treatment used for a normal forward photo transition.
  const enterGrid = () => setGridEntering(true);

  useEffect(() => {
    if (!gridEntering) return;
    const timeout = setTimeout(() => {
      setStage("grid");
      setGridEntering(false);
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

  // The header's "Work" link points at /?view=grid — jump straight to the
  // grid using the exact same transition as reaching the end of the gallery
  // normally, rather than a bespoke animation. Works the same whether we're
  // already on the home page (this just updates the URL, no remount) or
  // arriving fresh from another page (handled by the lazy state above).
  useEffect(() => {
    if (searchParams.get("view") !== "grid") return;
    setStage("gallery");
    enterGrid();
    router.replace("/", { scroll: false });
  }, [searchParams, router]);

  // Collapse the two-layer transition back to a single settled image
  // TRANSITION_MS after the index changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => setPrevIndex(index), TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [index]);

  // Depends on `index` so a manual prev/next resets the countdown to a full
  // ROTATE_MS, instead of the auto-advance firing on whatever was left of
  // the timer from before the click.
  useEffect(() => {
    if (!isPlaying || stage !== "gallery" || gridEntering) return;

    const id = setInterval(() => {
      if (isLast) {
        enterGrid();
        return;
      }
      setDirection(1);
      setIndex((prev) => prev + 1);
    }, ROTATE_MS);

    return () => clearInterval(id);
  }, [isPlaying, stage, isLast, gridEntering, index]);

  const goNext = () => {
    if (gridEntering) return;
    if (isLast) {
      enterGrid();
      return;
    }
    setDirection(1);
    setIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    if (gridEntering || index === 0) return;
    setDirection(-1);
    setIndex((prev) => prev - 1);
  };

  const backToGallery = () => leaveGrid(heroSlides.length - 1, -1);
  const restartGallery = () => leaveGrid(0, 1);

  // Left/right arrow keys mirror the prev/next controls. Skipped while
  // typing in a text field (the More Projects search bar) so arrow keys
  // there just move the text cursor, as expected.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "ArrowLeft") {
        if (stage === "gallery") {
          goPrev();
        } else if (stage === "grid" && !gridExiting && !gridEntering) {
          backToGallery();
        }
      } else if (e.key === "ArrowRight") {
        if (stage === "gallery") {
          goNext();
        }
        // Grid stage's "next" is disabled (mirrors DjControls' nextDisabled),
        // so ArrowRight intentionally does nothing there.
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const current = heroSlides[index];

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-black">
      {(stage === "gallery" || gridExiting) && (
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
