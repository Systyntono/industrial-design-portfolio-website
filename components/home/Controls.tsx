type DjControlsProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function DjControls({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}: DjControlsProps) {
  return (
    <div className="absolute bottom-16 left-8 md:left-16 flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          aria-label="Previous project"
          className="h-11 w-11 rounded-full bg-black text-white flex items-center justify-center"
        >
          ⏮
        </button>
        <button
          onClick={onNext}
          aria-label="Next project"
          className="h-11 w-11 rounded-full bg-black text-white flex items-center justify-center"
        >
          ⏭
        </button>
      </div>

      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
        className={`h-20 w-20 rounded-full bg-black text-white flex items-center justify-center transition-shadow ${
          isPlaying ? "shadow-[0_0_0_4px_rgba(245,158,11,0.8)]" : ""
        }`}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
}