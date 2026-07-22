import Image from "next/image";
import { getImageMeta } from "@/lib/imageMeta";
import { resolveSrc } from "@/data/projectContent";
import type { Media } from "@/data/projectContent/types";
import { CAPTION_PX } from "./projectScale";

type Props = Media & {
  slug: string;
  /** Responsive hint for the optimizer; matches the block's rendered width. */
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/** Parses "16/9" into a number for CSS aspect-ratio. Falls back to 4/3. */
function parseAspect(aspect?: string): number | null {
  if (!aspect) return null;
  const [w, h] = aspect.split("/").map((n) => Number(n.trim()));
  return w > 0 && h > 0 ? w / h : null;
}

// Renders one photo slot.
//
// Three cases, all handled here so no caller has to think about it:
//   - file exists, no forced aspect  -> laid out at its own proportions
//   - file exists, aspect given      -> cropped to that box
//   - file missing                   -> placeholder at the intended size
export default async function ProjectMedia({
  slug,
  src,
  alt = "",
  caption,
  aspect,
  sizes = "100vw",
  className = "",
  priority = false,
}: Props) {
  const url = resolveSrc(slug, src);
  const meta = url ? await getImageMeta(url) : null;
  const forced = parseAspect(aspect);

  let inner;

  if (!url || !meta) {
    // Nothing on disk yet — block out the space so the layout still reads.
    inner = (
      <div
        className="w-full flex items-center justify-center rounded-sm border border-dashed"
        style={{
          aspectRatio: forced ?? 4 / 3,
          borderColor: "var(--pp-rule)",
          background: "color-mix(in srgb, var(--pp-fg) 4%, transparent)",
        }}
      >
        <span
          className="px-3 text-center font-mono tracking-tight"
          style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
        >
          {src ?? "image"}
        </span>
      </div>
    );
  } else if (forced) {
    inner = (
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{ aspectRatio: forced }}
      >
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  } else {
    inner = (
      <Image
        src={url}
        alt={alt}
        width={meta.width}
        height={meta.height}
        sizes={sizes}
        priority={priority}
        className="w-full h-auto rounded-sm"
      />
    );
  }

  return (
    <figure className={className}>
      {inner}
      {caption && (
        <figcaption
          className="mt-3 leading-relaxed"
          style={{ fontSize: CAPTION_PX, color: "var(--pp-muted)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
