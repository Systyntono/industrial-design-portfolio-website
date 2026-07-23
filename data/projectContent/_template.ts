import type { ProjectContent } from "./types";

// ---------------------------------------------------------------------------
// TEMPLATE — copy this to start a new case study.
//
//   1. Copy to        data/projectContent/<project-slug>.ts
//                     (slug must match the one in data/projects.ts)
//   2. Register it in data/projectContent/index.ts
//   3. Make folder    public/images/projects/<project-slug>/
//      and drop photos in. Reference them by filename below.
//
// Reorder the page by reordering `blocks`. Delete what you don't want.
// Every photo you haven't uploaded yet shows as a coloured block in the
// right place, so the page reads properly before the shoot.
// ---------------------------------------------------------------------------

const content: ProjectContent = {
  // Per-page colours. Delete to keep the default white page.
  // theme: { background: "#0f0f0f", text: "#f5f5f5", muted: "#a1a1a1", rule: "#2a2a2a" },

  // Fills the window on load. Leave src blank for a colour block.
  hero: { src: "hero.jpg", alt: "" },

  overview: {
    issue: "The problem, in a sentence or two.",
    design: "What you made in response, in a sentence or two.",
    duration: "6 weeks",

    // Award logos — drop the files in the project folder (or an awards/
    // subfolder) and list the filenames.
    // awards: ["red-dot.svg", { src: "idsa.png", alt: "IDSA", href: "https://…" }],

    // Extra facts for the left column. Industry, year, team and tools are
    // pulled from data/projects.ts automatically — no need to repeat them.
    // facts: [{ label: "Partner", value: "…" }],
  },

  blocks: [
    { type: "section", number: "01", title: "Process" },

    // Wide colour bar. Add `src` to use a photo as a subtle background
    // instead, and `tone: "highlight"` for the yellow one.
    { type: "band", heading: "Brief", body: "What you were asked to do." },

    // A row of photos, each with a title and description underneath.
    {
      type: "columns",
      columns: 3,
      items: [
        { src: "research-01.jpg", title: "Title", body: "Description." },
        { src: "research-02.jpg", title: "Title", body: "Description." },
        { src: "research-03.jpg", title: "Title", body: "Description." },
      ],
    },

    { type: "band", heading: "Requirements", body: "What the design had to do." },

    { type: "band", tone: "highlight", heading: "Insight", body: "The turning point." },

    // Photos keep their own proportions and pack into rows that fill the
    // width. Add or remove items freely — the layout adapts.
    {
      type: "gallery",
      items: [
        { src: "process-01.jpg" },
        { src: "process-02.jpg" },
        { src: "process-03.jpg" },
        { src: "process-04.jpg" },
      ],
    },

    { type: "section", number: "02", title: "Final Design" },

    // A video if you have one (drop an .mp4 in the folder and set `video`),
    // otherwise a large hero shot.
    { type: "feature", src: "final-hero.jpg", alt: "" },

    // Photo beside text, alternating sides down the page.
    {
      type: "split",
      items: [
        { src: "detail-01.jpg", title: "Title", body: "Description." },
        { src: "detail-02.jpg", title: "Title", body: "Description." },
        { src: "detail-03.jpg", title: "Title", body: "Description." },
      ],
    },

    {
      type: "gallery",
      items: [{ src: "final-01.jpg" }, { src: "final-02.jpg" }, { src: "final-03.jpg" }],
    },

    // Other blocks available:
    // { type: "text", heading: "Heading", body: ["Paragraph one.", "Paragraph two."] },
    // { type: "image", src: "wide.jpg", full: true },
    // { type: "quote", text: "A line worth pulling out.", attribution: "Source" },
    // { type: "spacer", size: 120 },
  ],
};

export default content;
