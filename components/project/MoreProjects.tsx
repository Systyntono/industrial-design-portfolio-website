import Image from "next/image";
import Link from "next/link";
import { heroSlides } from "@/data/heroSlides";
import { projects } from "@/data/projects";
import { LAYOUT, SPACE, type as t } from "./projectTokens";

// The highlight reel from the home page gallery, minus whichever project the
// reader is already on.
export default function MoreProjects({ currentSlug }: { currentSlug: string }) {
  // Only slides that are also entries in the project library. Photography is
  // deliberately a hero slide without a library entry, so it drops out here
  // and is reached from the gallery instead.
  const items = heroSlides
    .filter((slide) => slide.projectSlug !== currentSlug)
    .map((slide) => ({
      slide,
      project: projects.find((p) => p.slug === slide.projectSlug),
    }))
    .filter((item): item is { slide: (typeof heroSlides)[number]; project: (typeof projects)[number] } =>
      item.project !== undefined
    );

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full"
      style={{ maxWidth: LAYOUT.contentMax, paddingLeft: SPACE.pagePad, paddingRight: SPACE.pagePad, marginTop: SPACE.section }}>
      <h2
        className="font-medium tracking-tight"
        style={{ ...t.h2, color: "var(--pp-fg)" }}
      >
        More Projects
      </h2>

      <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ slide, project }) => (
          <li key={slide.projectSlug}>
            <Link href={`/work/${slide.projectSlug}`} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-black/5">
                <Image
                  src={slide.image}
                  alt={project?.title ?? slide.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p
                className="mt-4 font-medium tracking-tight"
                style={{ ...t.h3, color: "var(--pp-fg)" }}
              >
                {project?.title ?? slide.label}
              </p>
              {project?.subtitle && (
                <p className="mt-1" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                  {project.subtitle}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
