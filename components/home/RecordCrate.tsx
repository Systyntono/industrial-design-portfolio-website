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
const LANE_GAP = 96; // px between the resting stack and the pulled-out lane
const COLLAPSE_WIDTH = 1280; // below this, results form a vertical list in place instead of a side lane
const STACK_DESCRIPTION_WIDTH = 768; // below this there isn't room for a 40%-wide side column of text, so the description drops below the cover instead
const LIST_GAP = 40; // px between rows in the collapsed results list
const LIST_TOP_OFFSET = 36; // px reserved above the collapsed results list for its label

// Every project stays mounted at all times, keyed by slug — pulling one out
// (or letting it settle back) is purely a transform/opacity change on the
// SAME element, which is what makes it slide rather than pop in/out. This
// holds for the collapsed results list too: matched records glide from their
// stack position up into list formation while non-matches fade in place.
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
  const [stackedDescription, setStackedDescription] = useState(false);
  const firstCoverRef = useRef<HTMLAnchorElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  useEffect(() => {
    const check = () => {
      setCollapsed(window.innerWidth < COLLAPSE_WIDTH);
      setStackedDescription(window.innerWidth < STACK_DESCRIPTION_WIDTH);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Below xl the passed coverWidthClass (built for wide-screen proportions)
  // falls through to full width, leaving no room beside it for the side
  // description — use a fixed 3/5 in collapsed mode instead, unless the
  // description has already dropped below the cover, in which case the
  // cover itself can take the full width. Same width across filter toggles
  // so covers never resize, only move.
  const effectiveCoverWidthClass = collapsed
    ? stackedDescription
      ? "w-full"
      : "w-3/5"
    : coverWidthClass;

  // Cover size is responsive, so measure it live and derive every spacing
  // value from it rather than hardcoding pixels.
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
  }, [effectiveCoverWidthClass]);

  // Same live-measurement approach for the description block, since it only
  // adds to a row's height when it's stacked below the cover (side-by-side
  // descriptions don't affect row height). Measured off the first item, same
  // as the cover — every row is assumed uniform, matching how peek/overlap
  // already treat coverHeight as constant across items.
  useLayoutEffect(() => {
    if (!stackedDescription) return;
    const el = descriptionRef.current;
    if (!el) return;

    const measure = () => setDescriptionHeight(el.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stackedDescription]);

  const { width: coverWidth, height: coverHeight } = coverSize;
  const peek = coverHeight * PEEK_RATIO;
  const overlap = coverHeight - peek;
  // Constant regardless of filter state, so toggling a filter never resizes
  // the gap between rows — only stackedDescription (a layout breakpoint)
  // changes how much room each row needs.
  const listSpacing = coverHeight + (stackedDescription ? descriptionHeight : 0) + LIST_GAP;
  // Pulled-out records are fully separated (no overlap) in both the wide
  // side lane and the collapsed list — listSpacing covers both cases.
  const pulledSpacing = listSpacing;
  const pullX = coverWidth + LANE_GAP;

  const collapsedList = collapsed && pullActive;

  // Rank of each project within the pulled-out subset, in original order —
  // computed once per render rather than inline, since the hover-pop below
  // needs to look up the HOVERED item's rank too, not just the current one.
  // On mobile (collapsed) with no filter active, every project counts as
  // "pulled out" so browsing always renders as a spaced list — the resting
  // peek/overlap stack depends on hover to browse, which touch screens
  // don't have, so it's desktop/pointer-only.
  const pulledRanks = useMemo(() => {
    let rank = -1;
    return projects.map((p) => {
      const inList = pullActive ? pulledOutSlugs.has(p.slug) : collapsed;
      if (inList) {
        rank += 1;
        return rank;
      }
      return null;
    });
  }, [projects, pulledOutSlugs, pullActive, collapsed]);
  const pulledCount = pulledRanks.filter((r) => r !== null).length;

  const hoveredIsPulledOut = hovered !== null ? pulledRanks[hovered] !== null : false;

  // Transforms don't contribute layout height, so when the pulled-out lane
  // (now fully separated, not overlapping) is taller than the underlying
  // peek stack, reserve the space explicitly or the page would cut it off.
  // pulledCount is only ever >0 when items are actually in list formation
  // (filtered matches, or the always-listed mobile browsing case), so this
  // condition doesn't need to separately check pullActive/collapsed.
  const pulledLaneHeight = pulledCount * pulledSpacing + (collapsed ? LIST_TOP_OFFSET : 0);

  return (
    <div className="relative" style={pulledCount > 0 ? { minHeight: pulledLaneHeight } : undefined}>
      {collapsed && (
        <p className="absolute top-0 text-xs uppercase tracking-widest text-white/50">
          Results
        </p>
      )}

      {projects.map((p, i) => {
        const pulledRank = pulledRanks[i];
        const isPulledOut = pulledRank !== null;
        const hiddenByFilter = collapsedList && !isPulledOut;

        // mainY is this item's resting position in the main stack; targetY
        // is where it should actually end up. The transform only needs to
        // express the delta between the two, so the same element slides
        // smoothly between "resting" and its filtered position instead of
        // teleporting.
        const mainY = i * peek;
        let targetY = mainY;
        let deltaX = 0;
        if (isPulledOut) {
          if (collapsed) {
            // Collapsed: matched records glide into a plain vertical list
            // at the top of the column; non-matches fade out in place.
            targetY = LIST_TOP_OFFSET + pulledRank * listSpacing;
          } else {
            targetY = pulledRank * pulledSpacing;
            deltaX = pullX;
          }
        }
        const deltaY = targetY - mainY;

        const isHovered = i === hovered;
        // Pulled-out records are fully separated now (no overlap in either
        // mode), so the clear-a-path nudge only applies within the resting
        // stack, where items still overlap each other.
        let hoverNudge = 0;
        if (!isPulledOut && hovered !== null && !hoveredIsPulledOut && !isHovered) {
          hoverNudge = i < (hovered as number) ? -overlap : overlap;
        }

        // Collapsed description: visible for every item currently in list
        // formation — every item when browsing unfiltered (isPulledOut is
        // true for all of them in that case), or just the matches while
        // filtering. listSpacing already reserves room for it unconditionally,
        // so this never re-introduces the text/row overlap.
        const showSideDescription = collapsed && isPulledOut;

        return (
          <div
            key={p.slug}
            onMouseEnter={() => {
              if (hiddenByFilter) return;
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
              pointerEvents: hiddenByFilter ? "none" : undefined,
            }}
          >
            <Link
              href={`/work/${p.slug}`}
              ref={i === 0 ? firstCoverRef : undefined}
              className={`relative block ${effectiveCoverWidthClass} aspect-square overflow-hidden rounded-md bg-zinc-900 shadow-xl shadow-black/60 transition-all duration-500 ease-out`}
              style={{
                transform: isHovered ? "scale(1.03)" : "scale(1)",
                opacity: hiddenByFilter ? 0 : pullActive && !isPulledOut ? 0.35 : 1,
              }}
            >
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </Link>

            {/* Description for collapsed mode. Absolutely positioned so it
                never occupies layout space — even at opacity 0, an in-flow
                element here would throw off every subsequent item's
                marginTop-based cascade position. Below STACK_DESCRIPTION_WIDTH
                there's no room for a 40%-wide side column without wrapped
                text overflowing into the row below, so it drops beneath the
                (now full-width) cover instead — listSpacing already reserves
                the extra height for this via descriptionHeight. Otherwise,
                left-[60%] starts the text right after the w-3/5 cover, and
                right-0 bounds it at the wrapper's own edge — the wrapper
                spans the full column, so left-full would place this at 100%
                of the COLUMN (fully off-screen), not at the cover's edge. */}
            {collapsed && (
              <div
                ref={i === 0 ? descriptionRef : undefined}
                className={`absolute transition-all duration-500 ease-out pointer-events-none ${
                  stackedDescription ? "left-0 right-0 pt-3" : "left-[60%] right-0 pl-4"
                }`}
                style={{
                  top: stackedDescription ? coverHeight : 0,
                  opacity: showSideDescription ? 1 : 0,
                  transform: showSideDescription
                    ? "translate(0, 0)"
                    : stackedDescription
                      ? "translateY(-8px)"
                      : "translateX(-8px)",
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
