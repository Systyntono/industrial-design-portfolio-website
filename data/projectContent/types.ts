// ---------------------------------------------------------------------------
// Project case study content model
// ---------------------------------------------------------------------------
//
// A page is: a HERO, an OVERVIEW, then an ordered list of BLOCKS.
// To rearrange the page, reorder `blocks`. To add a section, insert a block.
// It's all plain data — no JSX, no CSS.
//
// PHOTOS
//   Put files in:    public/images/projects/<project-slug>/
//   Reference them:  { src: "hero.jpg" }        <- filename only
//
//   Any photo you haven't uploaded yet shows as a coloured block in exactly
//   the right position and size, so you can build the whole page first and
//   drop images in later. Nothing to change when you do — just add the file.
// ---------------------------------------------------------------------------

/** "image" = pink, "highlight" = yellow. Used for placeholders and colour bars. */
export type Tone = "image" | "highlight";

export type Media = {
  /** Filename inside the project's folder. Leave blank for a colour block. */
  src?: string;
  alt?: string;
  caption?: string;
  /** Force a crop, e.g. "16/9", "1/1", "4/5". Omit to use the photo's own shape. */
  aspect?: string;
  /** Placeholder colour while there's no photo. */
  tone?: Tone;
};

/** A photo with a title and description under it. */
export type CaptionedMedia = Media & {
  title?: string;
  body?: string;
};

export type Block =
  /**
   * A big numbered section heading — "01 Process", "02 Final Design".
   * Set in large bold display type.
   */
  | { type: "section"; number: string; title: string }

  /**
   * A full-width colour bar. Either a flat colour block with text on it, or
   * a subtle background photo with text over it (add `src`).
   */
  | {
      type: "band";
      tone?: Tone;
      heading?: string;
      body?: string | string[];
      src?: string;
      alt?: string;
      /** 0–1. How much to dim a background photo so text stays readable. */
      overlay?: number;
      minHeight?: string;
    }

  /**
   * A row of photos, each with a title and description underneath.
   * Collapses to fewer columns on smaller screens automatically.
   */
  | {
      type: "columns";
      items: CaptionedMedia[];
      columns?: 2 | 3 | 4;
      /** Shared crop for the photos. Default "4/5". */
      aspect?: string;
    }

  /**
   * A dynamic photo gallery. Photos keep their own proportions and pack into
   * rows that fill the width — portrait and landscape shots sit together
   * without cropping. Rows reflow as the screen narrows.
   */
  | {
      type: "gallery";
      items: Media[];
      /** Row scale on a wide screen. Bigger = fewer, larger photos per row. */
      rowHeight?: number;
    }

  /**
   * A single large piece — the "video if available, otherwise a hero shot".
   * Set `video` to an .mp4 filename to play a video instead of an image.
   */
  | {
      type: "feature";
      src?: string;
      video?: string;
      alt?: string;
      caption?: string;
      /** Default "16/9". */
      aspect?: string;
      tone?: Tone;
    }

  /**
   * Photo beside text, alternating sides down the page (photo left, then
   * photo right, then left…). Stacks vertically on phones.
   */
  | {
      type: "split";
      items: CaptionedMedia[];
      /** Which side the first photo sits on. Default "left". */
      start?: "left" | "right";
      /** Default "4/3". */
      aspect?: string;
    }

  /** Plain prose. `body` takes one string or an array of paragraphs. */
  | {
      type: "text";
      heading?: string;
      body?: string | string[];
      /** Wider type, for an opening statement. */
      lead?: boolean;
    }

  /** One photo on its own. */
  | ({ type: "image"; full?: boolean } & Media)

  /** Pull quote. */
  | { type: "quote"; text: string; attribution?: string }

  /** Manual breathing room, in px. */
  | { type: "spacer"; size?: number };

/** An award logo. A plain string is treated as a filename. */
export type Award =
  | string
  | {
      src: string;
      alt?: string;
      /** Optional link out to the award or competition. */
      href?: string;
    };

/** The two-column block under the hero. */
export type Overview = {
  /** Problem statement. */
  issue?: string;
  /** What you made in response. */
  design?: string;
  /** e.g. "6 weeks". Shown in the left column. */
  duration?: string;
  /**
   * Award logos. Drop the files in the project's folder (an `awards/`
   * subfolder works too) and list the filenames:
   *   awards: ["red-dot.svg", "idsa.png"]
   */
  awards?: Award[];
  /** Extra facts for the left column, beyond the automatic ones. */
  facts?: { label: string; value: string }[];
};

/** Page colours. Defaults to a white page with near-black text. */
export type ProjectTheme = {
  background?: string;
  text?: string;
  /** Secondary text: captions, meta labels. */
  muted?: string;
  /** Hairlines and dividers. */
  rule?: string;
};

export type ProjectContent = {
  /** Overrides the title/subtitle from data/projects.ts if set. */
  title?: string;
  subtitle?: string;
  /** Fills the window on load. Leave `src` blank for a colour block. */
  hero?: { src?: string; alt?: string; tone?: Tone };
  overview?: Overview;
  theme?: ProjectTheme;
  blocks: Block[];
};

export const DEFAULT_THEME: Required<ProjectTheme> = {
  background: "#ffffff",
  text: "#111111",
  muted: "#6b6b6b",
  rule: "#e5e5e5",
};
