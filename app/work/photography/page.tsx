import type { Metadata } from "next";
import { photography } from "@/data/photography";
import { getPhotoSeries, PHOTO_DIR } from "@/lib/photography";
import { DEFAULT_THEME } from "@/data/projectContent/types";
import SiteNav from "@/components/home/SiteNav";
import PhotoGallery from "@/components/project/PhotoGallery";
import SiteFooter from "@/components/project/SiteFooter";
import { Col, GridSection } from "@/components/project/Grid";
import { LAYOUT, SPACE, type as t } from "@/components/project/projectTokens";

// A static segment, so it takes precedence over /work/[slug]. Photography is
// a body of work rather than a case study, so it gets its own template
// instead of being bent into the block system.

export const metadata: Metadata = {
  title: "Photography — Tyson Jiang",
  description: "Personal photography.",
};

export default async function PhotographyPage() {
  const theme = { ...DEFAULT_THEME, ...(photography.theme ?? {}) };
  const series = await getPhotoSeries(photography.targetRowHeight, LAYOUT.contentMax);
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
      <SiteNav variant="onLight" hideOnScroll />
      <div style={{ height: "var(--pp-header-h)" }} />

      <article className="pt-16 md:pt-24">
        <GridSection>
          <Col className="col-span-12 md:col-span-8 lg:col-span-7">
            <h1 style={{ ...t.h1, color: "var(--pp-fg)" }}>{photography.title}</h1>
            {photography.intro && (
              <p className="mt-6" style={{ ...t.lead, color: "var(--pp-muted)" }}>
                {photography.intro}
              </p>
            )}
          </Col>
        </GridSection>

        <div
          className="mx-auto w-full"
          style={{
            maxWidth: LAYOUT.contentMax,
            paddingLeft: SPACE.pagePad,
            paddingRight: SPACE.pagePad,
            marginTop: SPACE.section,
          }}
        >
          {isEmpty ? (
            <div
              className="rounded-sm border border-dashed px-6 py-20 text-center"
              style={{ borderColor: "var(--pp-rule)" }}
            >
              <p style={{ ...t.body, color: "var(--pp-fg)" }}>No photos yet.</p>
              <p className="mt-3" style={{ ...t.body, color: "var(--pp-muted)" }}>
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
