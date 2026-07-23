import Image from "next/image";
import { getImageMeta } from "@/lib/imageMeta";
import { resolveSrc } from "@/data/projectContent";
import type { Media, Tone } from "@/data/projectContent/types";
import { LAYOUT, PLACEHOLDER, type as t } from "./projectTokens";

/** Parses "16/9" to a number. Returns null if absent or malformed. */
export function parseAspect(aspect?: string): number | null {
  if (!aspect) return null;
  const [w, h] = aspect.split("/").map((n) => Number(n.trim()));
  return w > 0 && h > 0 ? w / h : null;
}

export const FALLBACK_ASPECT = 4 / 3;

export type ResolvedMedia = {
  url: string | null;
  aspect: number;
  alt: string;
  caption?: string;
  tone: Tone;
  /** Filename, shown faintly on a placeholder so you know what to drop in. */
  label?: string;
};

/**
 * Works out everything a media slot needs before render: where the file is,
 * and what shape it is. A file that isn't on disk yet resolves to a
 * placeholder rather than failing, which is what lets a page be laid out
 * before the photos exist.
 */
export async function resolveMedia(
  slug: string,
  media: Media,
  defaultAspect?: string
): Promise<ResolvedMedia> {
  const url = resolveSrc(slug, media.src);
  const forced = parseAspect(media.aspect) ?? parseAspect(defaultAspect);
  const meta = url ? await getImageMeta(url) : null;

  return {
    url: meta ? url : null,
    aspect: forced ?? (meta ? meta.width / meta.height : FALLBACK_ASPECT),
    alt: media.alt ?? "",
    caption: media.caption,
    tone: media.tone ?? "image",
    label: media.src,
  };
}

/**
 * One media slot: a photo if it exists, otherwise a flat colour block of the
 * same size. Both paths render at the same aspect ratio, so uploading a
 * photo never shifts the layout around it.
 */
export function MediaFrame({
  resolved,
  sizes = "100vw",
  priority = false,
  className = "",
  style,
}: {
  resolved: ResolvedMedia;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { url, aspect, alt, tone, label } = resolved;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: aspect,
        borderRadius: LAYOUT.radius,
        background: url ? "transparent" : PLACEHOLDER[tone],
        ...style,
      }}
    >
      {url ? (
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        label && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-end justify-start p-3 opacity-45"
            style={{ ...t.caption, color: "#00000099", wordBreak: "break-all" }}
          >
            {label}
          </span>
        )
      )}
    </div>
  );
}

/** A media slot plus its caption. */
export default async function ProjectMedia({
  slug,
  media,
  defaultAspect,
  sizes,
  priority,
  className,
}: {
  slug: string;
  media: Media;
  defaultAspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const resolved = await resolveMedia(slug, media, defaultAspect);

  return (
    <figure className={className}>
      <MediaFrame resolved={resolved} sizes={sizes} priority={priority} />
      {resolved.caption && (
        <figcaption className="mt-3" style={{ ...t.caption, color: "var(--pp-muted)" }}>
          {resolved.caption}
        </figcaption>
      )}
    </figure>
  );
}
