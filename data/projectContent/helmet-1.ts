import type { ProjectContent } from "./types";

// Photos for this page live in: public/images/projects/helmet-1/
// Reference them by filename only — the folder is implied.

const content: ProjectContent = {
  // theme: { background: "#0f0f0f", text: "#f5f5f5" },  // uncomment for a dark page

  blocks: [
    { type: "hero", src: "Nothing Helmet 1.jpg", alt: "Helmet (1) on a neutral backdrop" },

    {
      type: "intro",
      items: [
        {
          label: "Goal",
          body: "E-scooter and e-bike riders skip helmets because the ones available read as sports equipment — bulky, loud, and out of place on a commute.",
        },
        {
          label: "Outcome",
          body: "Helmet (1), a commuter helmet built from Nothing's design language: a monochrome shell, dot-matrix embossing, an amber visor, and a denim strap.",
        },
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
      heading: "Borrowing a language",
      body: [
        "Nothing builds transparency and dot-matrix type into everything it makes. The question was whether that language could survive being moved onto a safety product, where the shell has to be opaque and the geometry is set by impact standards rather than styling.",
        "The answer was to keep the grammar and drop the literal transparency: monochrome surfaces, dot-matrix embossing as the only graphic, and one saturated accent doing all the work.",
      ],
    },

    { type: "image", src: "Nothing Helmet 12.jpg", alt: "Dot-matrix embossing on the shell" },

    {
      type: "text",
      heading: "Clay, then tools",
      body: "The shell was sculpted by hand in industrial clay so the surface transitions could be judged by eye and touch rather than on screen. The dot-matrix pattern was pressed in with 3D-printed stamps, which kept the grid consistent across a compound curve.",
    },

    {
      type: "gallery",
      items: [
        { src: "Nothing Helmet 13.jpg", alt: "Clay model in progress" },
        { src: "Nothing Helmet 14.jpg", alt: "3D-printed embossing tools" },
        { src: "Nothing Helmet 15.jpg", alt: "Test pulls of the visor" },
        { src: "Nothing Helmet 16.jpg", alt: "Strap detail" },
      ],
    },

    {
      type: "text",
      heading: "The visor",
      body: "The amber visor was thermoformed from acrylic over a printed buck. Amber was chosen over clear or smoke because it lifts contrast in the flat grey light most commuting happens in.",
    },

    { type: "image", src: "Nothing Helmet 12.png", alt: "Amber thermoformed visor", width: "full" },
  ],
};

export default content;
