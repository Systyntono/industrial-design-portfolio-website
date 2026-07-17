export type Project = {
  slug: string;
  title: string;
  industry: string;
  year: number;
  image: string;
};

export const projects: Project[] = [
  { slug: "jothing", title: "Jothing Helmet", industry: "Consumer Electronics", year: 2025, image: "/images/hero/project-1.jpg" },
  { slug: "aeris", title: "Aeris Air Purifier", industry: "Home Appliances", year: 2024, image: "/images/hero/project-2.jpg" },
  { slug: "voltic", title: "Voltic E-Bike", industry: "Mobility", year: 2023, image: "/images/hero/project-3.jpg" },
  { slug: "project-4", title: "Project 4", industry: "Furniture", year: 2023, image: "/images/hero/project-4.jpg" },
  { slug: "project-5", title: "Project 5", industry: "Consumer Electronics", year: 2022, image: "/images/hero/project-5.jpg" },
  { slug: "project-6", title: "Project 6", industry: "Lighting", year: 2022, image: "/images/hero/project-6.jpg" },
];