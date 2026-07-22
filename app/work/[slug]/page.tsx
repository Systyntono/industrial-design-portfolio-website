import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { getProjectContent } from "@/data/projectContent";
import { DEFAULT_THEME } from "@/data/projectContent/types";
import BlockRenderer from "@/components/project/BlockRenderer";
import ProjectHeader from "@/components/project/ProjectHeader";
import MoreProjects from "@/components/project/MoreProjects";
import SiteFooter from "@/components/project/SiteFooter";
import {
  BODY_PX,
  CAPTION_PX,
  CONTENT_MAX_PX,
  H1_PX,
  LEAD_PX,
  SECTION_GAP_PX,
} from "@/components/project/projectScale";

type Params = { params: Promise<{ slug: string }> };

// Pre-renders every project at build time instead of on first request.
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

  // No case study written yet — fall back to the summary already in
  // data/projects.ts so the page is still worth landing on.
  const blocks = content?.blocks ?? [
    { type: "text" as const, body: project.description, lead: true },
  ];

  return (
    <div
      // Theme travels as CSS variables so every child (including the client
      // header) picks it up without prop drilling or a context provider.
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
      <ProjectHeader title={title} />

      {/* Clears the fixed header. */}
      <div className="h-[72px]" />

      <article className="pt-16 md:pt-24">
        <header className="mx-auto px-6 md:px-10" style={{ maxWidth: CONTENT_MAX_PX }}>
          <p
            className="uppercase tracking-[0.14em]"
            style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
          >
            {project.industries.join(" · ") || "Project"}
          </p>
          <h1
            className="mt-5 font-medium leading-[1.05] tracking-tight"
            style={{ fontSize: H1_PX }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4" style={{ fontSize: LEAD_PX, color: "var(--pp-muted)" }}>
              {subtitle}
            </p>
          )}
        </header>

        <div
          className="flex flex-col"
          style={{ gap: SECTION_GAP_PX, marginTop: SECTION_GAP_PX }}
        >
          {blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} slug={slug} isFirst={i === 0} />
          ))}
        </div>
      </article>

      <MoreProjects currentSlug={slug} />
      <SiteFooter />
    </div>
  );
}
