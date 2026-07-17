export default function About() {
  return (
    <main className="px-8 md:px-16 py-24 max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-12">
        About
      </h1>

      <div className="flex flex-col gap-6 text-lg text-zinc-500 leading-relaxed">
        <p>
          I'm an industrial designer focused on human-centered products and design for manufacturing.

          Currently based in Uxbridge and Ottawa, I work across furniture, medical devices,
          consumer products, branding and digital products.
        </p>
        <p>
          My process starts with research, sketching, rigourous prototyping for form and CMF,
          moving through rapid prototyping and iteration to get to a final
          form that's both manufacturable and genuinely nice to use.
        </p>
        <p>
          Open to opportunities
        </p>
        <p>
          Bachelors of Industrial Design
          <br />
          Carleton University
          <br />
          Expected Graduation: June 2029
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">
          Skills & Tools
        </h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          {["SolidWorks", "Plasticity", "Keyshot", "Fabrication", "Carpentry", "Sketching", "Vizcom", "Rapid Prototyping", "TouchDesigner"].map((tool) => (
            <li key={tool} className="px-3 py-1 border border-zinc-300 rounded-full">
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}