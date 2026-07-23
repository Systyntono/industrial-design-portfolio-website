import Image from "next/image";
import { resolveSrc } from "@/data/projectContent";
import type { Block, CaptionedMedia } from "@/data/projectContent/types";
import ProjectMedia, { MediaFrame, resolveMedia } from "./ProjectMedia";
import { Col, Container, Grid, GridSection } from "./Grid";
import { GRID, LAYOUT, PLACEHOLDER, SPACE, type as t } from "./projectTokens";

function Paragraphs({
  body,
  style,
}: {
  body?: string | string[];
  style?: React.CSSProperties;
}) {
  if (!body) return null;
  const items = Array.isArray(body) ? body : [body];
  return (
    <div className="flex flex-col" style={{ gap: "1em" }}>
      {items.map((p, i) => (
        <p key={i} style={style}>
          {p}
        </p>
      ))}
    </div>
  );
}

function ItemText({ item, gap }: { item: CaptionedMedia; gap?: string | number }) {
  if (!item.title && !item.body) return null;
  return (
    <div style={{ marginTop: gap ?? SPACE.tight }}>
      {item.title && <h3 style={{ ...t.h3, color: "var(--pp-fg)" }}>{item.title}</h3>}
      {item.body && (
        <p
          style={{
            ...t.body,
            color: "var(--pp-muted)",
            marginTop: item.title ? "0.5em" : 0,
          }}
        >
          {item.body}
        </p>
      )}
    </div>
  );
}

// Column spans per item count, so a row of photos always divides the 12
// columns evenly rather than leaving a ragged edge.
const COLUMN_SPAN: Record<number, string> = {
  2: "col-span-12 sm:col-span-6",
  3: "col-span-12 sm:col-span-6 lg:col-span-4",
  4: "col-span-6 lg:col-span-3",
};

export default async function BlockRenderer({
  block,
  slug,
}: {
  block: Block;
  slug: string;
}) {
  switch (block.type) {
    // ── 01 Process / 02 Final Design ──────────────────────────────────────
    case "section":
      return (
        <GridSection>
          <Col className="col-span-12">
            <h2 style={{ ...t.display, color: "var(--pp-fg)" }}>
              <span className="block">{block.number}</span>
              <span className="block">{block.title}</span>
            </h2>
          </Col>
        </GridSection>
      );

    // ── Wide colour bar ───────────────────────────────────────────────────
    // Runs edge to edge, but its text sits on the same 12 columns as
    // everything else so it stays aligned with the rest of the page.
    case "band": {
      const tone = block.tone ?? "image";
      const meta = block.src ? await resolveMedia(slug, { src: block.src }) : null;
      const hasPhoto = Boolean(meta?.url);
      const minHeight = block.minHeight ?? LAYOUT.bandMinHeight;

      return (
        <section
          className="relative flex w-full items-center overflow-hidden"
          style={{
            background: hasPhoto ? "transparent" : PLACEHOLDER[tone],
            minHeight,
            paddingTop: SPACE.block,
            paddingBottom: SPACE.block,
          }}
        >
          {hasPhoto && meta?.url && (
            <>
              <Image
                src={meta.url}
                alt={block.alt ?? ""}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: `rgba(0,0,0,${block.overlay ?? 0.25})` }}
              />
            </>
          )}

          <Container className="relative">
            <Grid>
              <Col className="col-span-12 md:col-span-7 lg:col-span-6">
                {block.heading && (
                  <h3
                    style={{
                      ...t.h2,
                      color: hasPhoto ? "#fff" : "#111",
                      marginBottom: block.body ? SPACE.tight : 0,
                    }}
                  >
                    {block.heading}
                  </h3>
                )}
                <Paragraphs
                  body={block.body}
                  style={{ ...t.lead, color: hasPhoto ? "#f5f5f5" : "#111" }}
                />
              </Col>
            </Grid>
          </Container>
        </section>
      );
    }

    // ── Row of photos with title + description ────────────────────────────
    case "columns": {
      const count = block.items.length;
      const span = COLUMN_SPAN[block.columns ?? (count as 2 | 3 | 4)] ?? COLUMN_SPAN[3];
      // Square by default — a consistent crop keeps a row of research shots
      // reading as one set rather than a ragged collage.
      const aspect = block.aspect ?? "1/1";
      const perRow = block.columns ?? count;
      const sizes = `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${Math.round(
        LAYOUT.contentMax / perRow
      )}px`;

      return (
        <GridSection>
          {block.items.map(async (item, i) => {
            const resolved = await resolveMedia(slug, item, aspect);
            return (
              <Col key={`${item.src ?? "slot"}-${i}`} className={span}>
                <MediaFrame resolved={resolved} sizes={sizes} />
                <ItemText item={item} />
              </Col>
            );
          })}
        </GridSection>
      );
    }

    // ── Dynamic gallery ───────────────────────────────────────────────────
    //
    // Photos keep their true proportions and pack into rows that fill the
    // full width. Within a row each photo's width is proportional to its
    // aspect ratio, so every photo in that row lands at the same height with
    // no cropping.
    //
    // Done in CSS (flex-wrap + flex-grow) rather than by computing rows at
    // build time, so it reflows correctly at any width and on rotation with
    // no JavaScript and no layout shift.
    case "gallery": {
      const rowHeight = block.rowHeight ?? LAYOUT.galleryRowHeight;
      const resolved = await Promise.all(block.items.map((item) => resolveMedia(slug, item)));

      return (
        <Container>
          <div className="flex flex-wrap" style={{ gap: GRID.gutter }}>
            {resolved.map((r, i) => (
              <figure
                key={`${r.label ?? "slot"}-${i}`}
                style={{
                  flexGrow: r.aspect,
                  flexBasis: 0,
                  // Wraps before photos get too small to read.
                  minWidth: `min(${LAYOUT.galleryMinItem}px, 100%)`,
                  // Headroom above the target height so a short final row
                  // still stretches to the right edge, without letting a
                  // lone trailing photo balloon to the full width.
                  maxWidth: r.aspect * rowHeight * LAYOUT.galleryMaxGrow,
                }}
              >
                <MediaFrame
                  resolved={r}
                  sizes={`(max-width: 640px) 100vw, ${Math.round(r.aspect * rowHeight)}px`}
                />
                {r.caption && (
                  <figcaption className="mt-2" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                    {r.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Container>
      );
    }

    // ── Video, or a large hero shot ───────────────────────────────────────
    case "feature": {
      const videoUrl = resolveSrc(slug, block.video);

      if (videoUrl) {
        return (
          <GridSection>
            <Col className="col-span-12">
              <video
                // playsInline + muted are what allow inline autoplay on iOS;
                // without them Safari takes the video fullscreen instead.
                playsInline
                muted
                loop
                autoPlay
                controls
                preload="metadata"
                className="w-full"
                style={{
                  aspectRatio: block.aspect ?? "16/9",
                  borderRadius: LAYOUT.radius,
                  background: "#000",
                }}
              >
                <source src={videoUrl} />
              </video>
              {block.caption && (
                <p className="mt-3" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                  {block.caption}
                </p>
              )}
            </Col>
          </GridSection>
        );
      }

      return (
        <GridSection>
          <Col className="col-span-12">
            <ProjectMedia
              slug={slug}
              media={{
                src: block.src,
                alt: block.alt,
                caption: block.caption,
                tone: block.tone,
                aspect: block.aspect,
              }}
              // Matches the video slot this block also serves, so a page
              // reads the same whether or not a video exists. Override per
              // block with `aspect` to keep a shot's own proportions.
              defaultAspect="16/9"
              sizes={`(max-width: 640px) 100vw, ${LAYOUT.contentMax}px`}
            />
          </Col>
        </GridSection>
      );
    }

    // ── Photo beside text, alternating sides ──────────────────────────────
    case "split": {
      const startRight = block.start === "right";
      const sizes = `(max-width: 768px) 100vw, ${Math.round(LAYOUT.contentMax / 2)}px`;

      return (
        <Container>
          <div className="flex flex-col" style={{ gap: SPACE.section }}>
            {block.items.map(async (item, i) => {
              // No default crop — photos keep their original aspect ratio.
              const resolved = await resolveMedia(slug, item, block.aspect);
              const photoRight = startRight ? i % 2 === 0 : i % 2 === 1;

              return (
                <Grid key={`${item.src ?? "slot"}-${i}`} className="items-center">
                  {/* Even 50/50 split: six columns each. */}
                  <Col
                    className={`col-span-12 md:col-span-6 ${photoRight ? "md:order-2" : "md:order-1"}`}
                  >
                    <MediaFrame resolved={resolved} sizes={sizes} />
                  </Col>
                  <Col
                    className={`col-span-12 md:col-span-6 ${photoRight ? "md:order-1" : "md:order-2"}`}
                  >
                    {item.title && <h3 style={{ ...t.h3, color: "var(--pp-fg)" }}>{item.title}</h3>}
                    {item.body && (
                      <p
                        style={{
                          ...t.body,
                          color: "var(--pp-muted)",
                          marginTop: item.title ? "0.6em" : 0,
                        }}
                      >
                        {item.body}
                      </p>
                    )}
                  </Col>
                </Grid>
              );
            })}
          </div>
        </Container>
      );
    }

    // ── Prose ─────────────────────────────────────────────────────────────
    case "text":
      return (
        <GridSection>
          <Col className="col-span-12 md:col-span-8 lg:col-span-7">
            {block.heading && (
              <h3 style={{ ...t.h2, color: "var(--pp-fg)", marginBottom: SPACE.tight }}>
                {block.heading}
              </h3>
            )}
            <Paragraphs
              body={block.body}
              style={{
                ...(block.lead ? t.lead : t.body),
                color: block.lead ? "var(--pp-fg)" : "var(--pp-muted)",
              }}
            />
          </Col>
        </GridSection>
      );

    // ── One photo ─────────────────────────────────────────────────────────
    case "image": {
      const media = {
        src: block.src,
        alt: block.alt,
        caption: block.caption,
        aspect: block.aspect,
        tone: block.tone,
      };

      if (block.full) {
        const resolved = await resolveMedia(slug, media);
        return (
          <figure className="w-full">
            <MediaFrame resolved={resolved} sizes="100vw" style={{ borderRadius: 0 }} />
            {resolved.caption && (
              <Container>
                <figcaption className="mt-3" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                  {resolved.caption}
                </figcaption>
              </Container>
            )}
          </figure>
        );
      }

      return (
        <GridSection>
          <Col className="col-span-12">
            <ProjectMedia
              slug={slug}
              media={media}
              sizes={`(max-width: 640px) 100vw, ${LAYOUT.contentMax}px`}
            />
          </Col>
        </GridSection>
      );
    }

    case "quote":
      return (
        <GridSection>
          <Col className="col-span-12 md:col-span-9 lg:col-span-8">
            <blockquote>
              <p style={{ ...t.h2, color: "var(--pp-fg)" }}>{block.text}</p>
              {block.attribution && (
                <footer className="mt-4" style={{ ...t.label, color: "var(--pp-muted)" }}>
                  {block.attribution}
                </footer>
              )}
            </blockquote>
          </Col>
        </GridSection>
      );

    case "spacer":
      return <div style={{ height: block.size ?? 64 }} />;

    default:
      return null;
  }
}
