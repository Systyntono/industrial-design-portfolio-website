// Type + spacing scale for project case study pages.
//
// Same golden-ratio method as the home page's card scale
// (components/home/typeScale.ts), but anchored differently: there the
// title is the base, here BODY_PX is, because a case study is long-form
// reading. Body stays at a comfortable reading size and headings step UP
// by φ from it, so the largest display type is a consequence of legible
// body copy rather than the other way around.
//
// Change BODY_PX and the whole page rescales proportionally.

export const PHI = 1.618;
const SQRT_PHI = Math.sqrt(PHI); // ≈ 1.272

export const BODY_PX = 18; // base — long-form reading size

export const CAPTION_PX = BODY_PX / SQRT_PHI; // ≈ 14.2 — captions, meta labels
export const LEAD_PX = BODY_PX * SQRT_PHI; // ≈ 22.9 — intro / lead paragraphs
export const H3_PX = BODY_PX * SQRT_PHI; // ≈ 22.9 — small subheads
export const H2_PX = BODY_PX * PHI; // ≈ 29.1 — section headings
export const H1_PX = BODY_PX * PHI * PHI; // ≈ 47.1 — project title

// Vertical rhythm. Section gap is the dominant spacing unit; everything
// else is a φ step off it so the page breathes consistently.
export const SECTION_GAP_PX = 96; // between major blocks
export const BLOCK_GAP_PX = SECTION_GAP_PX / PHI; // ≈ 59 — inside a block
export const TIGHT_GAP_PX = BLOCK_GAP_PX / PHI; // ≈ 37 — heading → body

// Horizontal measure. Text is capped well below full width — long line
// lengths are the fastest way to make long-form copy unreadable.
export const TEXT_MAX_CH = 68; // characters per line for body copy
export const CONTENT_MAX_PX = 1440; // outer page content width
