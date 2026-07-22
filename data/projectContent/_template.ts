import type { ProjectContent } from "./types";

// ---------------------------------------------------------------------------
// TEMPLATE — copy this file to start a new case study.
//
//   1. Copy to  data/projectContent/<project-slug>.ts
//      (the slug must match the one in data/projects.ts)
//   2. Register it in  data/projectContent/index.ts
//   3. Make the folder  public/images/projects/<project-slug>/
//      and drop photos in. Reference them by filename below.
//
// Reorder the page by reordering `blocks`. Delete blocks you don't want.
// Any photo you haven't shot yet shows as a placeholder in the right spot.
// ---------------------------------------------------------------------------

const content: ProjectContent = {
  // Per-page colours. Delete to keep the default white page.
  // theme: { background: "#0f0f0f", text: "#f5f5f5", muted: "#a1a1a1", rule: "#2a2a2a" },

  blocks: [
    { type: "hero", src: "hero.jpg", alt: "" },

    {
      type: "intro",
      items: [
        { label: "Goal", body: "The problem, in a sentence or two." },
        { label: "Outcome", body: "What you made, in a sentence or two." },
      ],
    },

    {
      type: "meta",
      items: [
        { label: "Type", value: "Studio Project" },
        { label: "Year", value: "2026" },
        { label: "Role", value: "Industrial Design" },
        { label: "School", value: "Carleton University" },
      ],
    },

    {
      type: "text",
      heading: "Section heading",
      body: [
        "First paragraph.",
        "Second paragraph — pass an array for multiple, or a plain string for one.",
      ],
    },

    // A single photo. Add width: "full" to run it edge to edge,
    // or aspect: "16/9" to crop it.
    { type: "image", src: "detail.jpg", alt: "", caption: "Optional caption." },

    // Several photos. Default layout keeps each photo's own proportions and
    // packs them into columns, so mixed portrait/landscape sets still sit
    // together neatly. Use layout: "grid" with an aspect for a tidy matrix.
    {
      type: "gallery",
      items: [
        { src: "process-01.jpg", alt: "" },
        { src: "process-02.jpg", alt: "" },
        { src: "process-03.jpg", alt: "" },
      ],
    },

    // { type: "quote", text: "A line worth pulling out.", attribution: "Source" },
    // { type: "spacer", size: 120 },
  ],
};

export default content;
