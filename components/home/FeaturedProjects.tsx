const featuredProjects = [
  { title: "Ergonomic Task Chair", category: "Furniture", slug: "ergonomic-task-chair" },
  { title: "Modular Wheelchair Concept", category: "Medical", slug: "wheelchair-concept" },
  { title: "Campus Wayfinding System", category: "UI/UX", slug: "wayfinding-system" },
];

export default function FeaturedProjects() {
  return (
    <section className="px-8 md:px-16 py-24">
      <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-8">
        Selected Work
      </h2>
      <div className="flex flex-col gap-16">
        {featuredProjects.map((project) => (
          <div key={project.slug} className="border-b border-zinc-200 pb-16">
            <div className="aspect-video bg-zinc-100 mb-6" />
            <p className="text-sm text-zinc-500">{project.category}</p>
            <h3 className="text-2xl md:text-4xl font-medium">{project.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}