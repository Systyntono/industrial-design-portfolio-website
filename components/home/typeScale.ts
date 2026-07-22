// Golden-ratio type scale for project text (card + hover preview).
//
// TITLE_PX is the base — change that one number and every other size
// rescales proportionally, keeping the hierarchy intact.
//
// Why half-steps: stepping down by a full φ each time (title, title/φ,
// title/φ²) lands body text near 10px at this base, which stops being
// readable at paragraph length. Instead φ spans the two extremes —
// TITLE / BODY === φ exactly — and the subtitle sits at the geometric
// mean (√φ ≈ 1.272), giving three distinct but legible tiers.

export const PHI = 1.618;
const SQRT_PHI = Math.sqrt(PHI); // ≈ 1.272

export const TITLE_PX = 21; // base
export const SUBTITLE_PX = TITLE_PX / SQRT_PHI; // ≈ 20.4
export const BODY_PX = TITLE_PX / PHI; // ≈ 16.1
export const TAG_PX = BODY_PX / SQRT_PHI; // ≈ 12.6
