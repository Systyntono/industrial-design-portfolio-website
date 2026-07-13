import Hero from "@/components/home/Hero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import SecondaryProjects from "@/components/home/SecondaryProjects";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <SecondaryProjects />
    </main>
  );
}