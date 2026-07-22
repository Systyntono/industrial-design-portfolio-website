import ProjectMedia from "./ProjectMedia";
import type { Block, Width } from "@/data/projectContent/types";
import {
  BODY_PX,
  CAPTION_PX,
  CONTENT_MAX_PX,
  H2_PX,
  H3_PX,
  LEAD_PX,
  TEXT_MAX_CH,
  TIGHT_GAP_PX,
} from "./projectScale";

// Horizontal placement. "full" deliberately gets no padding or max width so
// it runs edge to edge; everything else is centred inside the page measure.
function widthStyle(width: Width = "wide"): {
  className: string;
  style?: React.CSSProperties;
} {
  if (width === "full") return { className: "w-full" };
  if (width === "text") {
    return {
      className: "mx-auto px-6 md:px-10",
      style: { maxWidth: `${TEXT_MAX_CH}ch` },
    };
  }
  return {
    className: "mx-auto px-6 md:px-10",
    style: { maxWidth: CONTENT_MAX_PX },
  };
}

function Wrap({
  width,
  children,
}: {
  width?: Width;
  children: React.ReactNode;
}) {
  const { className, style } = widthStyle(width);
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/** Responsive hint for the image optimizer, matched to the block's width. */
function sizesFor(width: Width = "wide"): string {
  if (width === "full") return "100vw";
  if (width === "text") return "(max-width: 768px) 100vw, 700px";
  return `(max-width: 768px) 100vw, ${CONTENT_MAX_PX}px`;
}

const MASONRY_COLUMNS: Record<number, string> = {
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
  4: "columns-1 sm:columns-2 lg:columns-4",
};

const GRID_COLUMNS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default async function BlockRenderer({
  block,
  slug,
  isFirst = false,
}: {
  block: Block;
  slug: string;
  isFirst?: boolean;
}) {
  switch (block.type) {
    case "hero": {
      const width = block.width ?? "full";
      return (
        <Wrap width={width}>
          <ProjectMedia
            slug={slug}
            src={block.src}
            alt={block.alt}
            caption={block.caption}
            aspect={block.aspect}
            sizes={sizesFor(width)}
            priority={isFirst}
          />
        </Wrap>
      );
    }

    case "intro":
      return (
        <Wrap>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {block.items.map((item) => (
              <div key={item.label}>
                <p
                  className="uppercase tracking-[0.14em]"
                  style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
                >
                  {item.label}
                </p>
                <p
                  className="mt-4 leading-snug"
                  style={{ fontSize: LEAD_PX, color: "var(--pp-fg)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Wrap>
      );

    case "meta":
      return (
        <Wrap>
          <dl
            className="grid grid-cols-2 gap-x-8 gap-y-6 border-y py-8 md:grid-cols-4"
            style={{ borderColor: "var(--pp-rule)" }}
          >
            {block.items.map((item) => (
              <div key={item.label}>
                <dt
                  className="uppercase tracking-[0.14em]"
                  style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
                >
                  {item.label}
                </dt>
                <dd className="mt-2" style={{ fontSize: BODY_PX, color: "var(--pp-fg)" }}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Wrap>
      );

    case "text": {
      const paragraphs =
        block.body === undefined
          ? []
          : Array.isArray(block.body)
            ? block.body
            : [block.body];
      const size = block.lead ? LEAD_PX : BODY_PX;
      return (
        <Wrap width={block.width ?? "text"}>
          {block.heading && (
            <h2
              className="font-medium tracking-tight leading-tight"
              style={{ fontSize: H2_PX, color: "var(--pp-fg)" }}
            >
              {block.heading}
            </h2>
          )}
          {paragraphs.length > 0 && (
            <div
              className="flex flex-col"
              style={{
                marginTop: block.heading ? TIGHT_GAP_PX : 0,
                gap: "1.1em",
              }}
            >
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="leading-relaxed"
                  style={{ fontSize: size, color: "var(--pp-fg)" }}
                >
                  {p}
                </p>
              ))}
            </div>
          )}
        </Wrap>
      );
    }

    case "image": {
      const width = block.width ?? "wide";
      return (
        <Wrap width={width}>
          <ProjectMedia
            slug={slug}
            src={block.src}
            alt={block.alt}
            caption={block.caption}
            aspect={block.aspect}
            sizes={sizesFor(width)}
            priority={isFirst}
          />
        </Wrap>
      );
    }

    case "gallery": {
      const width = block.width ?? "wide";
      const columns = block.columns ?? 3;
      const layout = block.layout ?? "masonry";
      // Masonry sizing is per column, so the optimizer hint has to be too.
      const sizes =
        width === "full"
          ? `(max-width: 640px) 100vw, ${Math.round(100 / columns)}vw`
          : `(max-width: 640px) 100vw, ${Math.round(CONTENT_MAX_PX / columns)}px`;

      if (layout === "grid") {
        return (
          <Wrap width={width}>
            <div className={`grid gap-6 ${GRID_COLUMNS[columns] ?? GRID_COLUMNS[3]}`}>
              {block.items.map((item, i) => (
                <ProjectMedia
                  key={`${item.src ?? "slot"}-${i}`}
                  slug={slug}
                  {...item}
                  aspect={item.aspect ?? block.aspect ?? "4/3"}
                  sizes={sizes}
                />
              ))}
            </div>
          </Wrap>
        );
      }

      // Masonry: CSS columns let every photo keep its own proportions, so a
      // mixed set of portrait and landscape shots packs without cropping.
      return (
        <Wrap width={width}>
          <div className={`gap-6 ${MASONRY_COLUMNS[columns] ?? MASONRY_COLUMNS[3]}`}>
            {block.items.map((item, i) => (
              <ProjectMedia
                key={`${item.src ?? "slot"}-${i}`}
                slug={slug}
                {...item}
                sizes={sizes}
                className="mb-6 break-inside-avoid"
              />
            ))}
          </div>
        </Wrap>
      );
    }

    case "quote":
      return (
        <Wrap width="text">
          <blockquote>
            <p
              className="leading-snug tracking-tight"
              style={{ fontSize: H3_PX, color: "var(--pp-fg)" }}
            >
              {block.text}
            </p>
            {block.attribution && (
              <footer
                className="mt-4 uppercase tracking-[0.14em]"
                style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
              >
                {block.attribution}
              </footer>
            )}
          </blockquote>
        </Wrap>
      );

    case "spacer":
      return <div style={{ height: block.size ?? 80 }} />;

    default:
      return null;
  }
}
