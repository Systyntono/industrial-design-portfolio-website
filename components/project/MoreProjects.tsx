import Image from "next/image";
import Link from "next/link";
import { heroSlides } from "@/data/heroSlides";
import { projects } from "@/data/projects";
import { Col, Grid, GridSection } from "./Grid";
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
    .filter(
      (item): item is { slide: (typeof heroSlides)[number]; project: (typeof projects)[number] } =>
        item.project !== undefined
    );

  if (items.length === 0) return null;

  return (
    <section style={{ marginTop: SPACE.section }}>
      <GridSection>
        <Col className="col-span-12">
          <h2 style={{ ...t.h2, color: "var(--pp-fg)" }}>More Projects</h2>
        </Col>

        <Col className="col-span-12">
          <Grid rowGap={SPACE.block}>
            {items.map(({ slide, project }) => (
              <Col key={slide.projectSlug} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Link href={`/work/${slide.projectSlug}`} className="group block">
                  <div
                    className="relative w-full overflow-hidden bg-black/5"
                    style={{ aspectRatio: "4 / 3", borderRadius: LAYOUT.radius }}
                  >
                    <Image
                      src={slide.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4" style={{ ...t.h3, color: "var(--pp-fg)" }}>
                    {project.title}
                  </p>
                  {project.subtitle && (
                    <p className="mt-1" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                      {project.subtitle}
                    </p>
                  )}
                </Link>
              </Col>
            ))}
          </Grid>
        </Col>
      </GridSection>
    </section>
  );
}
