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

export default function DjControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  openHref,
  disabled = false,
  invert = false,
  prevDisabled = false,
  nextDisabled = false,
}: DjControlsProps) {
  const fill = invert ? "bg-white text-black" : "bg-black text-white";

  return (
    <div
      id="dj-controls"
      className="fixed bottom-16 left-8 md:left-16 flex flex-col items-center gap-4 z-30"
    >
      <div className="flex justify-between gap-2 w-20">
        <button
          onClick={prevDisabled ? undefined : onPrev}
          disabled={prevDisabled}
          aria-label="Previous project"
          className={`h-9 w-9 aspect-square rounded-full flex items-center justify-center ${fill} ${
            prevDisabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          ⏮
        </button>
        <button
          onClick={nextDisabled ? undefined : onNext}
          disabled={nextDisabled}
          aria-label="Next project"
          className={`h-9 w-9 aspect-square rounded-full flex items-center justify-center ${fill} ${
            nextDisabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          ⏭
        </button>
      </div>

      {disabled ? (
        <span
          aria-disabled="true"
          className={`h-20 w-20 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center opacity-40 cursor-not-allowed ${fill}`}
        >
          Open
        </span>
      ) : (
        <Link
          href={openHref}
          aria-label="Open this project"
          className={`h-20 w-20 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center ${fill}`}
        >
          Open
        </Link>
      )}

      <button
        id="dj-play-button"
        onClick={disabled ? undefined : onTogglePlay}
        disabled={disabled}
        aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
        className={`h-20 w-20 rounded-full flex items-center justify-center transition-shadow ${fill} ${
          isPlaying ? "shadow-[0_0_0_4px_rgba(245,158,11,0.8)]" : ""
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
}
