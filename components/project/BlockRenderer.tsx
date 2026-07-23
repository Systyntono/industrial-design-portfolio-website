import Image from "next/image";
import { resolveSrc } from "@/data/projectContent";
import type { Block, CaptionedMedia } from "@/data/projectContent/types";
import ProjectMedia, { MediaFrame, resolveMedia } from "./ProjectMedia";
import { LAYOUT, PLACEHOLDER, SPACE, type as t } from "./projectTokens";

// Centred page container. Everything except full-bleed media sits inside one.
function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full ${className}`}
      style={{
        maxWidth: LAYOUT.contentMax,
        paddingLeft: SPACE.pagePad,
        paddingRight: SPACE.pagePad,
      }}
    >
      {children}
    </div>
  );
}

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

/** Title + description under a photo, used by `columns` and `split`. */
function ItemText({ item }: { item: CaptionedMedia }) {
  if (!item.title && !item.body) return null;
  return (
    <div style={{ marginTop: SPACE.tight }}>
      {item.title && (
        <h3 style={{ ...t.h3, color: "var(--pp-fg)" }}>{item.title}</h3>
      )}
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

const COLUMN_CLASS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
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
        <Container>
          <h2 style={{ ...t.display, color: "var(--pp-fg)" }}>
            <span className="block">{block.number}</span>
            <span className="block">{block.title}</span>
          </h2>
        </Container>
      );

    // ── Wide colour bar, optionally with a background photo ───────────────
    case "band": {
      const tone = block.tone ?? "image";
      const url = resolveSrc(slug, block.src);
      const meta = url ? await resolveMedia(slug, { src: block.src }) : null;
      const hasPhoto = Boolean(meta?.url);

      return (
        <section
          className="relative w-full overflow-hidden"
          style={{
            background: hasPhoto ? "transparent" : PLACEHOLDER[tone],
            minHeight: block.minHeight ?? LAYOUT.bandMinHeight,
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

          <div
            className="relative flex items-center"
            style={{ minHeight: block.minHeight ?? LAYOUT.bandMinHeight }}
          >
            <Container>
              <div style={{ maxWidth: LAYOUT.textMax }}>
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
              </div>
            </Container>
          </div>
        </section>
      );
    }

    // ── Row of photos, each with a title + description ────────────────────
    case "columns": {
      const columns = block.columns ?? 3;
      const aspect = block.aspect ?? "4/5";
      const sizes = `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${Math.round(
        LAYOUT.contentMax / columns
      )}px`;

      return (
        <Container>
          <div
            className={`grid ${COLUMN_CLASS[columns] ?? COLUMN_CLASS[3]}`}
            style={{ gap: SPACE.gutter, rowGap: SPACE.block }}
          >
            {block.items.map(async (item, i) => {
              const resolved = await resolveMedia(slug, item, aspect);
              return (
                <div key={`${item.src ?? "slot"}-${i}`}>
                  <MediaFrame resolved={resolved} sizes={sizes} />
                  <ItemText item={item} />
                </div>
              );
            })}
          </div>
        </Container>
      );
    }

    // ── Dynamic gallery ───────────────────────────────────────────────────
    //
    // Photos keep their true proportions and pack into rows that fill the
    // width. Within a row each photo's width is proportional to its aspect
    // ratio, so every photo in that row resolves to the same height and
    // nothing gets cropped.
    //
    // This is done entirely in CSS (flex-wrap + flex-grow), not by computing
    // rows at build time — which means it reflows correctly at *any* screen
    // width, including on rotation, with no JavaScript and no layout shift.
    case "gallery": {
      const rowHeight = block.rowHeight ?? LAYOUT.galleryRowHeight;
      const resolved = await Promise.all(
        block.items.map((item) => resolveMedia(slug, item))
      );

      return (
        <Container>
          <div className="flex flex-wrap" style={{ gap: SPACE.gutter }}>
            {resolved.map((r, i) => (
              <figure
                key={`${r.label ?? "slot"}-${i}`}
                style={{
                  flexGrow: r.aspect,
                  flexBasis: 0,
                  // Forces a wrap before photos get too small to read.
                  minWidth: `min(${LAYOUT.galleryMinItem}px, 100%)`,
                  // Stops a short final row from blowing its photos up to
                  // full width — they cap at their natural size instead.
                  maxWidth: r.aspect * rowHeight,
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
      const aspect = block.aspect ?? "16/9";
      const videoUrl = resolveSrc(slug, block.video);

      if (videoUrl) {
        return (
          <Container>
            <video
              // playsInline + muted are what allow inline autoplay on iOS;
              // without them Safari opens the video fullscreen instead.
              playsInline
              muted
              loop
              autoPlay
              controls
              preload="metadata"
              className="w-full"
              style={{ aspectRatio: aspect, borderRadius: LAYOUT.radius, background: "#000" }}
            >
              <source src={videoUrl} />
            </video>
            {block.caption && (
              <p className="mt-3" style={{ ...t.caption, color: "var(--pp-muted)" }}>
                {block.caption}
              </p>
            )}
          </Container>
        );
      }

      return (
        <Container>
          <ProjectMedia
            slug={slug}
            media={{ src: block.src, alt: block.alt, caption: block.caption, tone: block.tone }}
            defaultAspect={aspect}
            sizes={`(max-width: 640px) 100vw, ${LAYOUT.contentMax}px`}
          />
        </Container>
      );
    }

    // ── Photo beside text, alternating sides ──────────────────────────────
    case "split": {
      const aspect = block.aspect ?? "4/3";
      const startRight = block.start === "right";
      const sizes = `(max-width: 768px) 100vw, ${Math.round(LAYOUT.contentMax * 0.618)}px`;

      return (
        <Container>
          <div className="flex flex-col" style={{ gap: SPACE.block }}>
            {block.items.map(async (item, i) => {
              const resolved = await resolveMedia(slug, item, aspect);
              const photoRight = startRight ? i % 2 === 0 : i % 2 === 1;

              return (
                <div
                  key={`${item.src ?? "slot"}-${i}`}
                  className="grid items-center md:grid-cols-[1.618fr_1fr]"
                  style={{ gap: SPACE.block }}
                >
                  <div
                    // Source order stays photo-then-text so it reads
                    // correctly stacked on a phone; only the desktop grid
                    // swaps sides.
                    className={photoRight ? "md:order-2" : "md:order-1"}
                  >
                    <MediaFrame resolved={resolved} sizes={sizes} />
                  </div>
                  <div className={photoRight ? "md:order-1" : "md:order-2"}>
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
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      );
    }

    // ── Prose ─────────────────────────────────────────────────────────────
    case "text":
      return (
        <Container>
          <div style={{ maxWidth: LAYOUT.textMax }}>
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
          </div>
        </Container>
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
        <Container>
          <ProjectMedia
            slug={slug}
            media={media}
            sizes={`(max-width: 640px) 100vw, ${LAYOUT.contentMax}px`}
          />
        </Container>
      );
    }

    case "quote":
      return (
        <Container>
          <blockquote style={{ maxWidth: LAYOUT.textMax }}>
            <p style={{ ...t.h2, color: "var(--pp-fg)" }}>{block.text}</p>
            {block.attribution && (
              <footer className="mt-4" style={{ ...t.label, color: "var(--pp-muted)" }}>
                {block.attribution}
              </footer>
            )}
          </blockquote>
        </Container>
      );

    case "spacer":
      return <div style={{ height: block.size ?? 64 }} />;

    default:
      return null;
  }
}
