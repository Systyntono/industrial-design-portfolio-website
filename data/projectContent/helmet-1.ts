import type { ProjectContent } from "./types";

// Photos for this page live in: public/images/projects/helmet-1/
// Reference them by filename only — the folder is implied.

const content: ProjectContent = {
  // theme: { background: "#0f0f0f", text: "#f5f5f5" },  // uncomment for a dark page

  hero: { src: "Nothing Helmet 1.jpg", alt: "Helmet (1) on a neutral backdrop" },

  overview: {
    issue:
      "E-scooter and e-bike riders skip helmets because the ones available read as sports equipment — bulky, loud, and out of place on a commute.",
    design:
      "Helmet (1), a commuter helmet built from Nothing's design language: a monochrome shell, dot-matrix embossing, an amber visor, and a denim strap.",
    duration: "6 weeks",
    // awards: ["award-logo.svg"],
  },

  blocks: [
    { type: "section", number: "01", title: "Process" },

    {
      type: "band",
      heading: "Brief",
      body: "Take a brand that has never made safety equipment, and work out what it would build if it did.",
    },

    {
      type: "columns",
      columns: 3,
      items: [
        {
          src: "Nothing Helmet 13.jpg",
          title: "Language",
          body: "Nothing builds transparency and dot-matrix type into everything it makes.",
        },
        {
          src: "Nothing Helmet 14.jpg",
          title: "Constraint",
          body: "A helmet shell has to be opaque, and its geometry is set by impact standards.",
        },
        {
          src: "Nothing Helmet 15.jpg",
          title: "Resolution",
          body: "Keep the grammar, drop the literal transparency, let one accent do the work.",
        },
      ],
    },

    {
      type: "band",
      heading: "Requirements",
      body: "Half-shell coverage, a visor that lifts contrast in flat grey light, and a strap that doesn't read as sportswear.",
    },

    {
      type: "band",
      tone: "highlight",
      heading: "Insight",
      body: "The dot-matrix pattern had to be pressed, not printed — a graphic sits on a surface, but an emboss belongs to it.",
    },

    {
      type: "gallery",
      items: [
        { src: "Nothing Helmet 12.jpg", caption: "Embossing dies, third iteration" },
        { src: "Nothing Helmet 13.jpg" },
        { src: "Nothing Helmet 14.jpg" },
        { src: "Nothing Helmet 15.jpg" },
        { src: "Nothing Helmet 16.jpg" },
      ],
    },

    { type: "section", number: "02", title: "Final Design" },

    { type: "feature", src: "Nothing Helmet 12.png", alt: "Helmet (1), finished model" },

    {
      type: "split",
      items: [
        {
          src: "Nothing Helmet 12.jpg",
          title: "Shell",
          body: "Sculpted by hand in industrial clay so the surface transitions could be judged by eye and touch rather than on screen.",
        },
        {
          src: "Nothing Helmet 16.jpg",
          title: "Emboss",
          body: "Pressed with 3D-printed stamps, which held the grid consistent across a compound curve.",
        },
        {
          src: "Nothing Helmet 1.jpg",
          title: "Visor",
          body: "Thermoformed from amber acrylic over a printed buck. Amber over clear or smoke, because it lifts contrast in the flat grey light most commuting happens in.",
        },
      ],
    },

    {
      type: "gallery",
      items: [
        { src: "Nothing Helmet 1.jpg" },
        { src: "Nothing Helmet 12.png" },
        { src: "Nothing Helmet 16.jpg" },
      ],
    },
  ],
};

export default content;
