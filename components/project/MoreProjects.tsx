import Image from "next/image";
import Link from "next/link";
import { heroSlides } from "@/data/heroSlides";
import { projects } from "@/data/projects";
import { BODY_PX, CAPTION_PX, H2_PX } from "./projectScale";

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
    <section className="mx-auto mt-32 max-w-[1440px] px-6 md:px-10">
      <h2
        className="font-medium tracking-tight"
        style={{ fontSize: H2_PX, color: "var(--pp-fg)" }}
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
                style={{ fontSize: BODY_PX, color: "var(--pp-fg)" }}
              >
                {project?.title ?? slide.label}
              </p>
              {project?.subtitle && (
                <p className="mt-1" style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}>
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
