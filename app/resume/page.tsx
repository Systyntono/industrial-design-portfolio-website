export default function Resume() {
  return (
    <main className="px-8 md:px-16 py-24 max-w-3xl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Resume
        </h1>
        <a
          href="/resume.pdf"
          download
          className="px-4 py-2 border border-zinc-300 rounded-full text-sm"
        >
          Download PDF
        </a>
      </div>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">
          Education
        </h2>
        <p className="text-lg">Bachelor of Industrial Design — Carleton University</p>
        <p className="text-zinc-500">Expected Graduation: June 2029</p>
      </section>

      <section className="mb-12">
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
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">
          Experience
        </h2>
        <p className="text-zinc-500">Add your work history here.</p>
      </section>
    </main>
  );
}