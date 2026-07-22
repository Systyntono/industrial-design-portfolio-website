// ---------------------------------------------------------------------------
// Project case study content model
// ---------------------------------------------------------------------------
//
// A case study page is just an ordered list of blocks. To rearrange the page,
// reorder the array — nothing else needs to change. To add a section, insert a
// block. Every block is plain data, so no JSX or CSS is involved in editing a
// project.
//
// PHOTOS
// Drop image files in:      public/images/projects/<project-slug>/
// Reference them by name:   { type: "image", src: "hero.jpg" }
// The folder is implied by the project, so you never type the full path.
// (A src starting with "/" is used verbatim, for the rare shared image.)
//
// A referenced file that doesn't exist yet renders as a labelled placeholder
// in the right spot and at the right size, so you can lay out a page before
// the photography is done.
// ---------------------------------------------------------------------------

/** A single photo slot. `src` is a filename inside the project's image folder. */
export type Media = {
  src?: string;
  alt?: string;
  caption?: string;
  /**
   * Force a crop, e.g. "16/9", "4/3", "1/1", "3/4".
   * Omit to use the photo's own proportions — which is what makes grids
   * adapt to whatever mix of portrait and landscape shots you give them.
   */
  aspect?: string;
};

/** How wide a block sits on the page. */
export type Width =
  | "text" // narrow reading column
  | "wide" // wider than text, still inset from the edges
  | "full"; // edge to edge

export type Block =
  /** Big opening image. Usually the first block. */
  | ({ type: "hero" } & Media & { width?: Width })

  /**
   * The short "here's the situation / here's what I made" pair at the top,
   * shown side by side on desktop and stacked on mobile.
   */
  | {
      type: "intro";
      items: { label: string; body: string }[];
    }

  /** Horizontal strip of project facts: role, year, team, partner, etc. */
  | {
      type: "meta";
      items: { label: string; value: string }[];
    }

  /** Prose. `body` takes one string or an array of paragraphs. */
  | {
      type: "text";
      heading?: string;
      body?: string | string[];
      width?: Width;
      /** Larger type, for an opening statement. */
      lead?: boolean;
    }

  /** One photo. */
  | ({ type: "image" } & Media & { width?: Width })

  /**
   * Several photos together.
   *
   * layout "masonry" (default) keeps every photo's own proportions and packs
   * them into columns — best when the shots are a mix of shapes.
   * layout "grid" crops them all to a shared `aspect` for a tidy matrix.
   */
  | {
      type: "gallery";
      items: Media[];
      columns?: 2 | 3 | 4;
      layout?: "masonry" | "grid";
      /** Shared crop for layout "grid". Ignored by masonry. */
      aspect?: string;
      width?: Width;
    }

  /** Pull quote. */
  | {
      type: "quote";
      text: string;
      attribution?: string;
    }

  /** Manual breathing room, in px, when the default rhythm isn't right. */
  | { type: "spacer"; size?: number };

/** Page colours. Defaults to a white page with near-black text. */
export type ProjectTheme = {
  background?: string;
  text?: string;
  /** Secondary text: captions, meta labels, footer. */
  muted?: string;
  /** Hairlines and dividers. */
  rule?: string;
};

export type ProjectContent = {
  /** Overrides the title/subtitle from data/projects.ts if set. */
  title?: string;
  subtitle?: string;
  theme?: ProjectTheme;
  blocks: Block[];
};

export const DEFAULT_THEME: Required<ProjectTheme> = {
  background: "#ffffff",
  text: "#111111",
  muted: "#6b6b6b",
  rule: "#e5e5e5",
};
