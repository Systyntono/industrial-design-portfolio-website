const secondaryProjects = [
  { title: "Desk Lamp Study", category: "Furniture", slug: "desk-lamp-study" },
  { title: "Packaging Redesign", category: "Case Study", slug: "packaging-redesign" },
  { title: "Bike Rack Concept", category: "School Project", slug: "bike-rack-concept" },
  { title: "Kitchen Tool Set", category: "Furniture", slug: "kitchen-tool-set" },
];

export default function SecondaryProjects() {
  return (
    <section className="px-8 md:px-16 py-24">
      <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-8">
        More Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {secondaryProjects.map((project) => (
          <div key={project.slug}>
            <div className="aspect-square bg-zinc-100 mb-4" />
            <p className="text-sm text-zinc-500">{project.category}</p>
            <h3 className="text-lg font-medium">{project.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}