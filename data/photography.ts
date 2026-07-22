import type { ProjectTheme } from "./projectContent/types";

// ---------------------------------------------------------------------------
// Photography page settings.
//
// The photos themselves are NOT listed here — the page reads them straight
// out of the folder, so adding work is just dropping files in:
//
//   public/images/projects/photography/
//     01-street/            <- a subfolder becomes a titled series ("Street")
//       01.jpg
//       02.jpg
//     02-portraits/
//       ...
//
// Loose files sitting directly in photography/ become one untitled opening
// set. Number your folders and files to control the order.
//
// Series headings are derived from folder names ("01-street" -> "Street"),
// so renaming a folder renames the section. Use `notes` below only if you
// want a line of context under a heading.
// ---------------------------------------------------------------------------

export type PhotographySettings = {
  title: string;
  intro?: string;
  /** Optional line under a series heading, keyed by folder name. */
  notes?: Record<string, string>;
  /**
   * Roughly how tall a row of photos should be, in px, on a full-width
   * screen. Bigger = fewer, larger photos per row. This only decides where
   * rows break — the rendered size stays fluid.
   */
  targetRowHeight: number;
  /** Page colours. Defaults to the white page used everywhere else. */
  theme?: ProjectTheme;
};

export const photography: PhotographySettings = {
  title: "Photography",

  intro:
    "Personal work, shot mostly on foot. Cameras stay in the bag until something asks to be photographed.",

  targetRowHeight: 460,

  notes: {
    // "01-street": "Ottawa & Toronto, 2024–25",
  },

  // theme: { background: "#0f0f0f", text: "#f5f5f5", muted: "#a1a1a1", rule: "#2a2a2a" },
};
