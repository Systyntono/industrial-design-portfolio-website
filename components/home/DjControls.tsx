"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

type DjControlsProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  openHref: string;
  disabled?: boolean;
  invert?: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

const SHORT_VIEWPORT_QUERY = "(max-height: 600px)";

const BTN_DIR = "/images/nav buttons";
const FRAME_MS = 70;

// The big buttons are 4-frame Illustrator exports: 1 = on, 2 = pressed
// (still on), 3 = pressed (off), 4 = off. Turning off steps 1→2→3→4 and
// turning on plays the same frames in reverse (4→3→2→1), per the design's
// intended press-through motion. Only the two intermediate pressed frames
// need scheduling — the endpoints are just the resting state on either side.
// Hover (or holding) shows the pressed variant of the current state.
function useStagedFrame(isOn: boolean, hovered: boolean): number {
  const [animFrame, setAnimFrame] = useState<number | null>(null);
  const prevOn = useRef(isOn);

  useEffect(() => {
    if (prevOn.current === isOn) return;
    prevOn.current = isOn;
    const seq = isOn ? [3, 2] : [2, 3];
    const ids = seq.map((f, i) => window.setTimeout(() => setAnimFrame(f), FRAME_MS * i));
    ids.push(window.setTimeout(() => setAnimFrame(null), FRAME_MS * seq.length));
    return () => ids.forEach(clearTimeout);
  }, [isOn]);

  if (animFrame !== null) return animFrame;
  if (hovered) return isOn ? 2 : 3;
  return isOn ? 1 : 4;
}

// All frames stay mounted, stacked, with only the current one visible — a
// bare src swap would flash blank the first time each frame loads.
function StagedImage({ base, frames, frame }: { base: string; frames: number[]; frame: number }) {
  return (
    <span className="relative block h-full w-full">
      {frames.map((f) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={f}
          src={`${BTN_DIR}/${base}-${f}.png`}
          alt=""
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain ${
            f === frame ? "" : "invisible"
          }`}
        />
      ))}
    </span>
  );
}

// Small skip buttons: frame 1 resting, frame 2 pressed/hovered.
function SkipButton({
  base,
  label,
  onClick,
  disabled,
}: {
  base: string;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`h-9 w-9 [@media(max-height:600px)]:h-7 [@media(max-height:600px)]:w-7 aspect-square ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      <StagedImage base={base} frames={[1, 2]} frame={hovered && !disabled ? 2 : 1} />
    </button>
  );
}

export default function DjControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  openHref,
  disabled = false,
  prevDisabled = false,
  nextDisabled = false,
}: DjControlsProps) {
  const [openHovered, setOpenHovered] = useState(false);
  const [ppHovered, setPpHovered] = useState(false);

  // Open reads as "on" whenever it's clickable; play/pause as "on" while
  // actually playing. Disabled instances (the panel stages) rest at the
  // off frame with no hover response.
  const openFrame = useStagedFrame(!disabled, openHovered && !disabled);
  const ppFrame = useStagedFrame(isPlaying && !disabled, ppHovered && !disabled);

  // In the compact short-viewport layout, the "Tyson Jiang" logo sits
  // directly above this column — matching its rendered width here keeps the
  // reserved left margin visually consistent between the header row and the
  // controls row, instead of the controls column being narrower and leaving
  // an inconsistent step in the left edge. Only tracked/applied in that one
  // layout — the normal column sizes itself to its buttons as before.
  const [isShortViewport, setIsShortViewport] = useState(false);
  const [logoWidth, setLogoWidth] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(SHORT_VIEWPORT_QUERY);
    const update = () => setIsShortViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (!isShortViewport) return;
    const el = document.getElementById("site-logo");
    if (!el) return;

    // The logo's own box is a fixed w-20 (80px), but "Tyson"/"Jiang" — the
    // last of its two justify-between spans — visually overflows past that
    // box rather than wrapping or shrinking. Measuring the box itself (via
    // el.getBoundingClientRect()) under-counts the text's true width, which
    // is what this column actually needs to line up with.
    const measure = () => {
      const spans = el.querySelectorAll("span");
      const lastSpan = spans[spans.length - 1];
      const rightEdge = (lastSpan ?? el).getBoundingClientRect().right;
      setLogoWidth(rightEdge - el.getBoundingClientRect().left);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isShortViewport]);

  // A landscape phone has ~350-430px of viewport height total — the normal
  // bottom-16 + h-20 circles (a 228px tall column) reach almost to the top
  // of the screen and collide with SiteNav/the title band. The
  // max-height:600px variant only matches that short-viewport case (regular
  // portrait phones and landscape tablets/desktop are all taller), so this
  // compacts just the one layout that actually needs it.
  // z-[150] — RecordCrate's pulled-out covers use inline z-index up to
  // ~60+n, which (with no intervening stacking context) compares directly
  // against this fixed element in the same root stacking context — scrolling
  // one up to the top of the viewport was covering these controls at z-30.
  return (
    <div
      id="dj-controls"
      className="fixed bottom-16 [@media(max-height:600px)]:bottom-4 left-8 md:left-16 flex flex-col items-center gap-4 [@media(max-height:600px)]:gap-2 z-[150]"
      style={isShortViewport && logoWidth ? { width: logoWidth } : undefined}
    >
      <div className="flex justify-between gap-2 w-20 [@media(max-height:600px)]:w-14">
        <SkipButton
          base="button-backward"
          label="Previous project"
          onClick={onPrev}
          disabled={prevDisabled}
        />
        <SkipButton
          base="button-forward"
          label="Next project"
          onClick={onNext}
          disabled={nextDisabled}
        />
      </div>

      {disabled ? (
        <span
          aria-disabled="true"
          className="h-20 w-20 [@media(max-height:600px)]:h-14 [@media(max-height:600px)]:w-14 cursor-not-allowed"
        >
          <StagedImage base="button-open" frames={[1, 2, 3, 4]} frame={openFrame} />
        </span>
      ) : (
        <Link
          href={openHref}
          aria-label="Open this project"
          onMouseEnter={() => setOpenHovered(true)}
          onMouseLeave={() => setOpenHovered(false)}
          className="block h-20 w-20 [@media(max-height:600px)]:h-14 [@media(max-height:600px)]:w-14"
        >
          <StagedImage base="button-open" frames={[1, 2, 3, 4]} frame={openFrame} />
        </Link>
      )}

      <button
        id="dj-play-button"
        onClick={disabled ? undefined : onTogglePlay}
        disabled={disabled}
        aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
        onMouseEnter={() => setPpHovered(true)}
        onMouseLeave={() => setPpHovered(false)}
        className={`h-20 w-20 [@media(max-height:600px)]:h-14 [@media(max-height:600px)]:w-14 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        <StagedImage base="button-pp" frames={[1, 2, 3, 4]} frame={ppFrame} />
      </button>
    </div>
  );
}
