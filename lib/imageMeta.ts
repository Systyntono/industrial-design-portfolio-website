import fs from "node:fs/promises";
import path from "node:path";

export type ImageMeta = { width: number; height: number };

// Cached only in production — in dev the whole point is that you can drop a
// new photo into a project folder and see it on the next refresh, which a
// warm cache would hide.
const cache = new Map<string, ImageMeta | null>();
const shouldCache = process.env.NODE_ENV === "production";

// Reads a public/ image's real pixel dimensions at render time, so image
// blocks can lay out at the photo's own aspect ratio instead of forcing
// every slot into a hardcoded shape.
//
// Returns null when the file isn't there yet — callers treat that as "this
// slot is still empty" and draw a placeholder, which is what makes a
// content file you've written ahead of the photography render sensibly.
export async function getImageMeta(publicSrc: string): Promise<ImageMeta | null> {
  if (shouldCache && cache.has(publicSrc)) return cache.get(publicSrc)!;

  let result: ImageMeta | null = null;
  try {
    // publicSrc is a URL path ("/images/projects/x/y.jpg"); decode it back
    // to a filesystem name so folders/files containing spaces resolve.
    const relative = decodeURIComponent(publicSrc).replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", relative);
    const buffer = await fs.readFile(filePath);
    const sharp = (await import("sharp")).default;
    const { width, height } = await sharp(buffer).metadata();
    if (width && height) result = { width, height };
  } catch {
    // Missing file, unreadable format, or sharp unavailable — all mean the
    // same thing to the caller: lay this slot out as a placeholder.
    result = null;
  }

  if (shouldCache) cache.set(publicSrc, result);
  return result;
}
