import type { Metadata } from "next";
import { photography } from "@/data/photography";
import { getPhotoSeries, PHOTO_DIR } from "@/lib/photography";
import { DEFAULT_THEME } from "@/data/projectContent/types";
import ProjectHeader from "@/components/project/ProjectHeader";
import PhotoGallery from "@/components/project/PhotoGallery";
import SiteFooter from "@/components/project/SiteFooter";
import {
  BODY_PX,
  CONTENT_MAX_PX,
  H1_PX,
  LEAD_PX,
  SECTION_GAP_PX,
} from "@/components/project/projectScale";

// A static segment, so it takes precedence over /work/[slug]. Photography is
// a body of work rather than a case study, so it gets its own template
// instead of being bent into the block system.

export const metadata: Metadata = {
  title: "Photography — Tyson Jiang",
  description: "Personal photography.",
};

export default async function PhotographyPage() {
  const theme = { ...DEFAULT_THEME, ...(photography.theme ?? {}) };
  const series = await getPhotoSeries(photography.targetRowHeight, CONTENT_MAX_PX);
  const isEmpty = series.length === 0;

  return (
    <div
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
      <ProjectHeader title={photography.title} />
      <div className="h-[72px]" />

      <article className="pt-16 md:pt-24">
        <header className="mx-auto px-6 md:px-10" style={{ maxWidth: CONTENT_MAX_PX }}>
          <h1 className="font-medium leading-[1.05] tracking-tight" style={{ fontSize: H1_PX }}>
            {photography.title}
          </h1>
          {photography.intro && (
            <p
              className="mt-6 leading-snug"
              style={{ fontSize: LEAD_PX, color: "var(--pp-muted)", maxWidth: "52ch" }}
            >
              {photography.intro}
            </p>
          )}
        </header>

        <div
          className="mx-auto px-6 md:px-10"
          style={{ maxWidth: CONTENT_MAX_PX, marginTop: SECTION_GAP_PX }}
        >
          {isEmpty ? (
            <div
              className="rounded-sm border border-dashed px-6 py-20 text-center"
              style={{ borderColor: "var(--pp-rule)" }}
            >
              <p style={{ fontSize: BODY_PX, color: "var(--pp-fg)" }}>No photos yet.</p>
              <p className="mt-3" style={{ fontSize: BODY_PX, color: "var(--pp-muted)" }}>
                Drop images into{" "}
                <code className="font-mono">public{PHOTO_DIR}</code> — or into
                subfolders there to group them into titled series.
              </p>
            </div>
          ) : (
            <PhotoGallery
              series={series}
              targetRowHeight={photography.targetRowHeight}
              notes={photography.notes}
            />
          )}
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
