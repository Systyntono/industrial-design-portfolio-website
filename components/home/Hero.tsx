"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { heroSlides } from "@/data/heroSlides";
import DjControls from "./DjControls";
import RotatingLabel from "./RotatingLabel";
import ProjectBrowser from "./ProjectBrowser";
import AboutPanel from "./AboutPanel";
import ResumePanel from "./ResumePanel";
import ContactPanel from "./ContactPanel";
import SiteNav from "./SiteNav";
import PageTitleBand from "./PageTitleBand";

const ROTATE_MS = 5000;
const TRANSITION_MS = 600;
const PANEL_TRANSITION_MS = 700; // matches the hero photos' own transition convention

type Stage = "gallery" | "grid" | "about" | "resume" | "contact";
// Every stage after the photo gallery, in the order the forward button
// steps through them — mirrors the requested reading order (highlights,
// then More Projects, then About, Resume, Contact).
const PANEL_STAGES: Exclude<Stage, "gallery">[] = ["grid", "about", "resume", "contact"];
const STAGE_ORDER: Stage[] = ["gallery", ...PANEL_STAGES];

const PANEL_META: Record<
  Exclude<Stage, "gallery">,
  { render: () => React.ReactNode; title: string }
> = {
  grid: { render: () => <ProjectBrowser />, title: "More Projects" },
  about: { render: () => <AboutPanel />, title: "About" },
  resume: { render: () => <ResumePanel />, title: "Resume" },
  contact: { render: () => <ContactPanel />, title: "Contact" },
};

function stageFromParam(v: string | null): Exclude<Stage, "gallery"> | null {
  return v === "grid" || v === "about" || v === "resume" || v === "contact" ? v : null;
}

type Travel = { to: Stage; direction: 1 | -1 };

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stage, setStage] = useState<Stage>(() => stageFromParam(searchParams.get("view")) ?? "gallery");
  const [travel, setTravel] = useState<Travel | null>(null);
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

  // Settles whatever transition is in flight — same timing/handoff for every
  // stage pair, gallery included, so this is the one place that flips
  // `stage` once a slide finishes.
  useEffect(() => {
    if (!travel) return;
    const timeout = setTimeout(() => {
      setStage(travel.to);
      setTravel(null);
    }, PANEL_TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [travel]);

  // Step to the previous/next stage in STAGE_ORDER (DJ controls prev/next
  // once past the photo gallery). Gallery is always the "revealed base" —
  // stepping back into it slides the current panel away rather than sliding
  // gallery in, so its target photo needs to be set immediately, before the
  // panel starts moving, not after.
  const stepStage = (dir: 1 | -1) => {
    if (travel) return;
    const idx = STAGE_ORDER.indexOf(stage);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= STAGE_ORDER.length) return;
    const target = STAGE_ORDER[targetIdx];
    if (target === "gallery") {
      setIndex(heroSlides.length - 1);
      setPrevIndex(heroSlides.length - 1);
      setDirection(-1);
    }
    setTravel({ to: target, direction: dir });
  };

  // Logo click — always restarts the gallery from its first photo, from any
  // stage. Mechanically identical to stepping back into gallery (the current
  // panel slides away, revealing gallery beneath), just with a different
  // landing photo.
  const restartGallery = () => {
    if (travel) return;
    setIndex(0);
    setPrevIndex(0);
    setDirection(1);
    setTravel({ to: "gallery", direction: -1 });
  };

  // The header's Work/About/Resume/Contact links point at /?view=grid etc —
  // jump straight to that stage using the same transition as reaching the
  // end of the gallery normally. Works the same whether we're already on the
  // home page (this just updates the URL, no remount) or arriving fresh from
  // another page (handled by the lazy state above).
  useEffect(() => {
    const target = stageFromParam(searchParams.get("view"));
    if (!target) return;
    setStage("gallery");
    setTravel({ to: target, direction: 1 });
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
  // the timer from before the click. Scoped to the "gallery" stage only, so
  // auto-rotation never resumes once you've moved on to More Projects, About,
  // Resume, or Contact — those only advance on an explicit prev/next/jump.
  useEffect(() => {
    if (!isPlaying || stage !== "gallery" || travel) return;

    const id = setInterval(() => {
      if (isLast) {
        setTravel({ to: "grid", direction: 1 });
        return;
      }
      setDirection(1);
      setIndex((prev) => prev + 1);
    }, ROTATE_MS);

    return () => clearInterval(id);
  }, [isPlaying, stage, isLast, travel, index]);

  const goNext = () => {
    if (travel) return;
    if (isLast) {
      setTravel({ to: "grid", direction: 1 });
      return;
    }
    setDirection(1);
    setIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    if (travel || index === 0) return;
    setDirection(-1);
    setIndex((prev) => prev - 1);
  };

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
        } else if (!travel) {
          stepStage(-1);
        }
      } else if (e.key === "ArrowRight") {
        if (stage === "gallery") {
          goNext();
        } else if (!travel) {
          stepStage(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const current = heroSlides[index];

  // Gallery is the permanent base layer underneath every panel — mounted
  // whenever it's the settled stage, or the (always slide-away-to-reveal)
  // target of the current transition.
  const galleryMounted = stage === "gallery" || travel?.to === "gallery";
  const gallerySourceLeaving = !!travel && stage === "gallery"; // forward, into a panel
  const galleryFade = gallerySourceLeaving && travel!.direction === 1;
  const galleryShowsNav = !gallerySourceLeaving;

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-black">
      {galleryMounted && (
        <section
          className="absolute inset-0 h-dvh w-full overflow-hidden transition-opacity ease-in-out"
          style={{ opacity: galleryFade ? 0 : 1, transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
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

          {/* Suppressed while a panel is sliding in over the gallery —
              otherwise this section's fixed nav/controls briefly overlap the
              panel's own copies, since both sections are mounted at once
              during the handoff. */}
          {galleryShowsNav && (
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
                openImage={current.image}
                prevDisabled={index === 0}
              />
            </>
          )}
        </section>
      )}

      {PANEL_STAGES.map((panelStage) => {
        const mounted = stage === panelStage || travel?.to === panelStage;
        if (!mounted) return null;

        const isSource = !!travel && stage === panelStage;
        const isTarget = travel?.to === panelStage;
        const sourceFade = isSource && travel!.direction === 1;
        const showsNav = !isSource;

        const motionClass =
          isTarget && travel!.direction === 1
            ? "animate-slide-in-right"
            : isSource && travel!.direction === -1
              ? "animate-slide-out-right"
              : "";

        const meta = PANEL_META[panelStage];

        return (
          <section
            key={panelStage}
            className="absolute inset-0 h-dvh w-full overflow-y-auto hide-scrollbar transition-opacity ease-in-out"
            style={{ opacity: sourceFade ? 0 : 1, transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
          >
            {/* Nav/title-band/controls stay OUTSIDE the sliding wrapper below —
                a transform on an ancestor creates a new stacking context, which
                is what previously let the crate's z-index climb above these and
                bury both the title and the nav. They're position:fixed with
                explicit z-30, so they stay put and on top regardless of what
                the content underneath is doing. */}
            {showsNav && (
              <>
                <SiteNav variant="onPhoto" onLogoClick={restartGallery} />
                <PageTitleBand title={meta.title} />
                <DjControls
                  isPlaying={false}
                  onTogglePlay={() => {}}
                  onPrev={() => stepStage(-1)}
                  onNext={() => stepStage(1)}
                  openHref="#"
                  disabled
                  invert
                  nextDisabled={panelStage === "contact"}
                />
              </>
            )}

            <div
              className={`min-h-full bg-black ${motionClass}`}
              style={motionClass ? { animationDuration: `${PANEL_TRANSITION_MS}ms` } : undefined}
            >
              {meta.render()}
            </div>
          </section>
        );
      })}
    </div>
  );
}
