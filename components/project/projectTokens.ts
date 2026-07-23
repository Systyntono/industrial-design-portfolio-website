import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// DESIGN TOKENS for project case study pages.
//
// Everything visual — fonts, sizes, weights, spacing, placeholder colours —
// is defined here and nowhere else. Change a value here and it updates
// everywhere on every project page.
// ---------------------------------------------------------------------------

export const PHI = 1.618;

// ── FLUID SIZING ───────────────────────────────────────────────────────────
// Returns a CSS clamp() that scales linearly between two viewport widths, so
// type and spacing adapt continuously instead of jumping at breakpoints.
// This is what keeps a 360px Android phone and a 27" monitor both looking
// deliberate without separate rules for each.
function fluid(minPx: number, maxPx: number, minVw = 360, maxVw = 1440): string {
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  return `clamp(${minPx}px, ${intercept.toFixed(2)}px + ${(slope * 100).toFixed(3)}vw, ${maxPx}px)`;
}

// ── FONTS ──────────────────────────────────────────────────────────────────
// Swap a family here to restyle the whole page. `display` is used for the
// big section numbers, `body` for everything else.
export const FONT = {
  display: "var(--font-inter), system-ui, -apple-system, sans-serif",
  body: "var(--font-inter), system-ui, -apple-system, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

export const WEIGHT = {
  display: 700,
  heading: 600,
  label: 500,
  body: 400,
};

export const TRACKING = {
  display: "-0.035em",
  heading: "-0.02em",
  label: "0.14em",
  body: "0",
};

export const LEADING = {
  display: 0.92,
  heading: 1.12,
  tight: 1.25,
  body: 1.6,
};

// ── TYPE SIZES ─────────────────────────────────────────────────────────────
export const SIZE = {
  display: fluid(56, 160), // "01 Process" — deliberately huge
  h1: fluid(34, 64), // project title
  h2: fluid(22, 34), // block headings
  h3: fluid(17, 22), // item titles
  lead: fluid(17, 22), // intro / issue / design copy
  body: fluid(15, 17),
  caption: fluid(12, 13.5),
  label: fluid(11, 12.5), // uppercase meta labels
};

// ── READY-MADE TEXT STYLES ─────────────────────────────────────────────────
// Spread these into a style prop: style={{ ...type.h2 }}
export const type = {
  display: {
    fontFamily: FONT.display,
    fontSize: SIZE.display,
    fontWeight: WEIGHT.display,
    letterSpacing: TRACKING.display,
    lineHeight: LEADING.display,
  },
  h1: {
    fontFamily: FONT.display,
    fontSize: SIZE.h1,
    fontWeight: WEIGHT.heading,
    letterSpacing: TRACKING.heading,
    lineHeight: LEADING.display,
  },
  h2: {
    fontFamily: FONT.display,
    fontSize: SIZE.h2,
    fontWeight: WEIGHT.heading,
    letterSpacing: TRACKING.heading,
    lineHeight: LEADING.heading,
  },
  h3: {
    fontFamily: FONT.body,
    fontSize: SIZE.h3,
    fontWeight: WEIGHT.label,
    letterSpacing: TRACKING.heading,
    lineHeight: LEADING.tight,
  },
  lead: {
    fontFamily: FONT.body,
    fontSize: SIZE.lead,
    fontWeight: WEIGHT.body,
    lineHeight: LEADING.tight,
  },
  body: {
    fontFamily: FONT.body,
    fontSize: SIZE.body,
    fontWeight: WEIGHT.body,
    lineHeight: LEADING.body,
  },
  caption: {
    fontFamily: FONT.body,
    fontSize: SIZE.caption,
    fontWeight: WEIGHT.body,
    lineHeight: LEADING.body,
  },
  label: {
    fontFamily: FONT.body,
    fontSize: SIZE.label,
    fontWeight: WEIGHT.label,
    letterSpacing: TRACKING.label,
    lineHeight: LEADING.body,
    textTransform: "uppercase",
  },
} satisfies Record<string, CSSProperties>;

// ── SPACING ────────────────────────────────────────────────────────────────
export const SPACE = {
  section: fluid(72, 144), // between major sections
  block: fluid(40, 72), // between blocks
  tight: fluid(14, 24), // heading → body
  gutter: fluid(8, 14), // between grid / gallery items
  pagePad: fluid(20, 40), // page side padding
};

// ── LAYOUT ─────────────────────────────────────────────────────────────────
export const LAYOUT = {
  contentMax: 1600, // px — outer content width
  textMax: "68ch", // reading measure for prose
  /**
   * Target height for a row of gallery photos on a wide screen. Rows reflow
   * fluidly, so this only sets the scale, not a hard row height.
   */
  galleryRowHeight: 560,
  /** Smallest a gallery photo may get before the row wraps. */
  galleryMinItem: 360,
  /**
   * How far past its target height a photo may grow so that a short final
   * row still reaches the right edge instead of stopping short. Stops a lone
   * trailing photo from ballooning to the full width.
   */
  galleryMaxGrow: 1.9,
  bandMinHeight: fluid(220, 380), // the wide colour bars
  radius: 2, // px — corner rounding on media
};

// ── 12-COLUMN GRID ─────────────────────────────────────────────────────────
// Every page aligns to the same 12 columns, with gutters set to 20% of a
// column width.
//
//   12 columns + 11 gutters = 100%
//   12c + 11(0.2c) = 14.2c = 100%   →   gutter = 0.2c = 100/71 %
//
// Expressing the gutter as a percentage rather than a fixed px value is what
// keeps the proportions identical at every window size and orientation.
export const GRID = {
  columns: 12,
  /** 20% of one column, as a percentage of the grid's own width. */
  gutter: "calc(100% / 71)",
};

// ── PLACEHOLDER COLOURS ────────────────────────────────────────────────────
// Shown where a photo hasn't been uploaded yet. These are the pink and
// yellow blocks from the mockup.
export const PLACEHOLDER = {
  image: "#FA9189",
  highlight: "#DCF06E",
} as const;

export type Tone = keyof typeof PLACEHOLDER;
