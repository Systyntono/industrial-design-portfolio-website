export type Project = {
  slug: string;
  title: string;
  industries: string[];
  tools: string[];
  year: number;
  image: string;
  description: string;
};

export const projects: Project[] = [
  { slug: "helmet(1)", title: "Helmet (1)", industries: ["Electronics", "Safety Equipment"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-1.jpg", description: "Add a short project description here." },
  { slug: "mx-switch", title: "MX Switch", industries: ["Electronics"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-2.png", description: "Add a short project description here." },
  { slug: "goh", title: "GOH", industries: ["Branding"], tools: ["Add a tool or process"], year: 2025, image: "/images/hero/project-3.png", description: "Add a short project description here." },
  { slug: "gravity-bar", title: "Gravity Bar", industries: ["Furniture"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-4.jpg", description: "Add a short project description here." },
  { slug: "l1-lamp", title: "L1 Lamp", industries: ["Furniture", "Electronics"], tools: ["Add a tool or process"], year: 2025, image: "/images/hero/project-5.jpg", description: "Add a short project description here." },
  { slug: "photography", title: "Photography", industries: ["Photography"], tools: ["Add a tool or process"], year: 0, image: "/images/hero/photography.jpg", description: "Add a short project description here." },

  // Non-hero projects (not in the heroSlides array) can be added here as well, if desired.

  { slug: "ovis", title: "Ovis", industries: ["Tools"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-6.jpg", description: "Add a short project description here." },
  { slug: "sanctuary bench", title: "Sanctuary Bench", industries: ["Furniture"], tools: ["Add a tool or process"], year: 2025, image: "/images/hero/project-7.jpg", description: "Add a short project description here." },
  { slug: "rotnel toolbox", title: "Rotnel Toolbox", industries: ["Tools"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-8.jpg", description: "Add a short project description here." },
  { slug: "goh-w6rst", title: "GOH x W6rst", industries: ["Branding"], tools: ["Add a tool or process"], year: 2025, image: "/images/hero/project-6.jpg", description: "Add a short project description here." },
  { slug: "outlines", title: "Outlines Magazine", industries: ["Publishing"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-7.jpg", description: "Add a short project description here." },
  { slug: "gradus bag", title: "Gradus Bag", industries: ["Softgoods"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-8.jpg", description: "Add a short project description here." },
  { slug: "ambush", title: "Ambush", industries: ["Tools"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-6.jpg", description: "Add a short project description here." },
  { slug: "aloe-vera-rind", title: "Valorization of Aloe Vera Rind", industries: ["Tools"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-7.jpg", description: "Add a short project description here." },
  { slug: "wallace", title: "Wallace", industries: ["Furniture"], tools: ["Add a tool or process"], year: 2026, image: "/images/hero/project-8.jpg", description: "Add a short project description here." },
];