"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type RecordCrateProps = {
  projects: Project[];
  pulledOutSlugs?: Set<string>;
  pullActive?: boolean;
  coverWidthClass?: string;
  onHoverChange?: (project: Project | null) => void;
};

const PEEK_RATIO = 0.22; // fraction of a cover's height left visible as a peek in the resting stack
const PULLED_RATIO = 0.55; // roomier spacing once pulled out, so they read as a clean list
const LANE_GAP = 56; // px between the resting stack and the pulled-out lane
const COLLAPSE_WIDTH = 1280; // below this, stack pulled-out records above instead of beside

// Every project stays mounted at all times, keyed by slug — pulling one out
// (or letting it settle back) is purely a transform change on the SAME
// element, which is what makes it slide rather than pop in/out.
export default function RecordCrate({
  projects,
  pulledOutSlugs = new Set(),
  pullActive = false,
  coverWidthClass = "w-full xl:w-1/2",
  onHoverChange,
}: RecordCrateProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [coverSize, setCoverSize] = useState({ width: 300, height: 270 });
  const [collapsed, setCollapsed] = useState(false);
  const firstCoverRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const check = () => setCollapsed(window.innerWidth < COLLAPSE_WIDTH);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Cover size is responsive (see coverWidthClass), so measure it live and
  // derive every spacing value from it rather than hardcoding pixels.
  useLayoutEffect(() => {
    const el = firstCoverRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setCoverSize({ width: rect.width, height: rect.height });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [coverWidthClass]);

  const { width: coverWidth, height: coverHeight } = coverSize;
  const peek = coverHeight * PEEK_RATIO;
  const overlap = coverHeight - peek;
  const pulledSpacing = coverHeight * PULLED_RATIO;
  const pullX = coverWidth + LANE_GAP;

  // Rank of each project within the pulled-out subset, in original order —
  // computed once per render rather than inline, since the hover-pop below
  // needs to look up the HOVERED item's rank too, not just the current one.
  const pulledRanks = useMemo(() => {
    let rank = -1;
    return projects.map((p) => {
      if (pullActive && pulledOutSlugs.has(p.slug)) {
        rank += 1;
        return rank;
      }
      return null;
    });
  }, [projects, pulledOutSlugs, pullActive]);
  const pulledCount = pulledRanks.filter((r) => r !== null).length;

  const hoveredIsPulledOut = hovered !== null ? pulledRanks[hovered] !== null : false;
  const showLaneLabels = pullActive && collapsed && pulledCount > 0;

  return (
    <div
      className="relative"
      style={
        pullActive && collapsed
          ? { marginTop: pulledCount * pulledSpacing + LANE_GAP }
          : undefined
      }
    >
      {showLaneLabels && (
        <>
          <p
            className="absolute text-xs uppercase tracking-widest text-white/50"
            style={{ top: -(pulledCount * pulledSpacing + LANE_GAP) - 28 }}
          >
            Results
          </p>
          <p className="absolute text-xs uppercase tracking-widest text-white/50" style={{ top: -28 }}>
            Gallery
          </p>
        </>
      )}
      {projects.map((p, i) => {
        const pulledRank = pulledRanks[i];
        const isPulledOut = pulledRank !== null;

        // mainY is this item's resting position in the main stack; targetY
        // is where it should actually end up. The transform only needs to
        // express the delta between the two, so the same element slides
        // smoothly between "resting" and "pulled out" instead of teleporting.
        const mainY = i * peek;
        let targetY = mainY;
        let deltaX = 0;
        if (isPulledOut) {
          if (collapsed) {
            // Narrow layout: pulled-out records stack ABOVE the library,
            // in their own compact column, rather than sliding sideways.
            targetY = (pulledRank - pulledCount) * pulledSpacing - LANE_GAP;
          } else {
            targetY = pulledRank * pulledSpacing;
            deltaX = pullX;
          }
        }
        const deltaY = targetY - mainY;

        const isHovered = i === hovered;
        const sameLane = hovered !== null && hoveredIsPulledOut === isPulledOut;
        let hoverNudge = 0;
        if (sameLane && !isHovered) {
          if (isPulledOut) {
            const hoveredRank = pulledRanks[hovered as number] as number;
            hoverNudge = (pulledRank as number) < hoveredRank ? -overlap : overlap;
          } else {
            hoverNudge = i < (hovered as number) ? -overlap : overlap;
          }
        }

        return (
          <div
            key={p.slug}
            onMouseEnter={() => {
              setHovered(i);
              onHoverChange?.(p);
            }}
            onMouseLeave={() => {
              if (hovered === i) {
                onHoverChange?.(null);
              }
              setHovered((h) => (h === i ? null : h));
            }}
            className="relative transition-transform duration-500 ease-in-out"
            style={{
              marginTop: i === 0 ? 0 : -overlap,
              transform: `translate(${deltaX}px, ${deltaY + hoverNudge}px)`,
              zIndex: isPulledOut ? 60 + (pulledRank as number) : isHovered ? projects.length + 10 : i,
            }}
          >
            <Link
              href={`/work/${p.slug}`}
              ref={i === 0 ? firstCoverRef : undefined}
              className={`relative block ${coverWidthClass} aspect-4/3 overflow-hidden rounded-md bg-zinc-900 shadow-xl shadow-black/60 transition-all duration-300 ease-out`}
              style={{
                transform: isHovered ? "scale(1.03)" : "scale(1)",
                opacity: pullActive && !isPulledOut ? 0.35 : 1,
              }}
            >
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </Link>

            {/* Collapsed layout has no room for a separate description
                column, so it attaches directly under the hovered cover. */}
            {collapsed && (
              <div
                className="mt-4 mb-6 max-w-xs transition-all duration-300 ease-out"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0)" : "translateY(-8px)",
                }}
              >
                <p className="font-medium text-white">{p.title}</p>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                  Add a short project description here.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full border border-white/30 text-xs text-white/70">
                    {p.industry}
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-white/30 text-xs text-white/70">
                    {p.year}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
