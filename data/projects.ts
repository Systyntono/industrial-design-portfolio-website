export type Project = {
  slug: string;
  title: string;
  industry: string;
  year: number;
  image: string;
};

export const projects: Project[] = [
  { slug: "helmet(1)", title: "Helmet (1)", industry: "Consumer Electronics", year: 2025, image: "/images/hero/project-1.jpg" },
  { slug: "mx-switch", title: "MX Switch", industry: "Home Appliances", year: 2024, image: "/images/hero/project-2.png" },
  { slug: "goh", title: "GOH", industry: "Mobility", year: 2023, image: "/images/hero/project-3.png" },
  { slug: "gravity-bar", title: "Gravity Bar", industry: "Furniture", year: 2023, image: "/images/hero/project-4.jpg" },
  { slug: "l1-lamp", title: "L1 Lamp", industry: "Consumer Electronics", year: 2022, image: "/images/hero/project-5.jpg" },
  { slug: "photography", title: "Photography", industry: "Lighting", year: 2022, image: "/images/hero/photography.jpg" },
];