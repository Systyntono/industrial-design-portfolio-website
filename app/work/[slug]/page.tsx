import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { getProjectContent } from "@/data/projectContent";
import { DEFAULT_THEME } from "@/data/projectContent/types";
import { resolveMedia } from "@/components/project/ProjectMedia";
import BlockRenderer from "@/components/project/BlockRenderer";
import SiteNav from "@/components/home/SiteNav";
import ProjectHero from "@/components/project/ProjectHero";
import ProjectEntrance from "@/components/project/ProjectEntrance";
import ProjectOverview from "@/components/project/ProjectOverview";
import MoreProjects from "@/components/project/MoreProjects";
import SiteFooter from "@/components/project/SiteFooter";
import { SPACE } from "@/components/project/projectTokens";

type Params = { params: Promise<{ slug: string }> };

const OVERVIEW_ID = "project-overview";

// Pre-renders every project at build time rather than per request.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Tyson Jiang" };
  return {
    title: `${project.title} — Tyson Jiang`,
    description: project.subtitle || project.description,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const content = getProjectContent(slug);
  const theme = { ...DEFAULT_THEME, ...(content?.theme ?? {}) };

  const title = content?.title ?? project.title;
  const subtitle = content?.subtitle ?? project.subtitle;

  // Resolved on the server so the hero shows a colour block, with no flash
  // of empty space, when the photo isn't uploaded yet.
  const hero = await resolveMedia(slug, {
    src: content?.hero?.src,
    alt: content?.hero?.alt ?? title,
    tone: content?.hero?.tone,
  });

  // No case study written yet — fall back to the summary from
  // data/projects.ts so the page is still worth landing on.
  const blocks = content?.blocks ?? [
    { type: "text" as const, body: project.description, lead: true },
  ];

  return (
    <div
      // Theme travels as CSS variables so every child — including the client
      // header and hero — picks it up without prop drilling.
      style={
        {
          "--pp-bg": theme.background,
          "--pp-fg": theme.text,
          "--pp-muted": theme.muted,
          "--pp-rule": theme.rule,
          background: "var(--pp-bg)",
          color: "var(--pp-fg)",
        } as React.CSSProperties
      }
      className="min-h-screen"
    >
      <ProjectEntrance url={hero.url} />

      {/* Same header as the gallery, in its dark-on-light variant. It hides
          on scroll here because, unlike the gallery, this page is long and
          the bar has no backdrop to sit on. */}
      <SiteNav variant="onLight" hideOnScroll />

      {/* Occupies the fixed header's height, so header + hero come to
          exactly one screen. */}
      <div style={{ height: "var(--pp-header-h)" }} />

      <ProjectHero url={hero.url} alt={hero.alt} tone={hero.tone} targetId={OVERVIEW_ID} />

      <ProjectOverview
        id={OVERVIEW_ID}
        project={project}
        overview={content?.overview}
        title={title}
        subtitle={subtitle}
      />

      <div style={{ paddingTop: SPACE.section }}>
        {blocks.map((block, i) => {
          // Adjacent colour bars butt directly against each other — a gap
          // between them would read as a mistake rather than as rhythm.
          const prev = blocks[i - 1];
          const bandRun = i > 0 && block.type === "band" && prev?.type === "band";
          return (
            <div key={i} style={{ marginTop: i === 0 ? 0 : bandRun ? 0 : SPACE.section }}>
              <BlockRenderer block={block} slug={slug} />
            </div>
          );
        })}
      </div>

      <MoreProjects currentSlug={slug} />
      <SiteFooter />
    </div>
  );
}
