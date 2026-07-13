export default function Contact() {
  return (
    <main className="px-8 md:px-16 py-24 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-12">
        Contact
      </h1>

      <p className="text-lg text-zinc-500 mb-12">
        Open to new opportunities and collaborations — feel free to reach out.
      </p>

      <div className="flex flex-col gap-4 text-lg">
        <a href="mailto:SystynWorks@gmail.com" className="hover:underline w-fit">
          SystynWorks@gmail.com
        </a>
        <a href="https://www.linkedin.com/in/tysonjiang/" target="_blank" className="hover:underline w-fit">
          LinkedIn
        </a>
        <a href="https://www.behance.net/tysonjiang" target="_blank" className="hover:underline w-fit">
          Behance
        </a>
      </div>
    </main>
  );
}