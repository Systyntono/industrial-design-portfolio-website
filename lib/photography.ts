import fs from "node:fs/promises";
import path from "node:path";
import { getImageMeta } from "./imageMeta";

export const PHOTO_DIR = "/images/projects/photography";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export type Photo = {
  src: string;
  width: number;
  height: number;
  aspect: number;
};

export type PhotoSeries = {
  /** Folder name, or "" for loose files at the top level. */
  key: string;
  /** Display heading, derived from the folder name. Null for loose files. */
  title: string | null;
  /** Photos packed into justified rows. */
  rows: Photo[][];
};

/** "01-street-work" -> "Street Work". Leading sort prefixes are stripped. */
function titleFromFolder(name: string): string {
  return name
    .replace(/^[\d]+[-_.\s]*/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Sorts so "2.jpg" comes before "10.jpg", which plain string sort gets wrong. */
function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function readPhotos(dirAbs: string, dirUrl: string): Promise<Photo[]> {
  let names: string[];
  try {
    names = await fs.readdir(dirAbs);
  } catch {
    return [];
  }

  const files = names
    .filter((n) => IMAGE_EXT.has(path.extname(n).toLowerCase()))
    .sort(naturalSort);

  const photos = await Promise.all(
    files.map(async (name) => {
      const src = `${dirUrl}/${encodeURIComponent(name)}`;
      const meta = await getImageMeta(`${dirUrl}/${name}`);
      if (!meta) return null;
      return {
        src,
        width: meta.width,
        height: meta.height,
        aspect: meta.width / meta.height,
      };
    })
  );

  return photos.filter((p): p is Photo => p !== null);
}

/**
 * Packs photos into rows that each fill the full measure.
 *
 * Within a row every photo is given a flex weight equal to its aspect ratio,
 * so widths land in proportion to shape and every photo in the row ends up
 * the same height — portraits and landscapes sit together without either
 * being cropped or left stranded in dead space.
 *
 * `targetHeight` and `measure` only decide where rows break; the rendered
 * size is fluid, so this stays correct at any viewport width.
 */
function packRows(photos: Photo[], targetHeight: number, measure: number): Photo[][] {
  const rows: Photo[][] = [];
  let row: Photo[] = [];
  let aspectSum = 0;

  for (const photo of photos) {
    row.push(photo);
    aspectSum += photo.aspect;

    if (aspectSum * targetHeight >= measure) {
      rows.push(row);
      row = [];
      aspectSum = 0;
    }
  }

  if (row.length > 0) rows.push(row);
  return rows;
}

/** Total aspect of a row — the renderer caps width by this so a short final row doesn't blow up. */
export function rowAspectSum(row: Photo[]): number {
  return row.reduce((sum, p) => sum + p.aspect, 0);
}

/**
 * Reads the photography folder.
 *
 * Loose files at the top level become one untitled opening set. Each
 * subfolder becomes its own titled series, in folder-name order — so
 * numbering folders (01-, 02-) sequences the page.
 */
export async function getPhotoSeries(
  targetRowHeight: number,
  measure: number
): Promise<PhotoSeries[]> {
  const rootAbs = path.join(process.cwd(), "public", PHOTO_DIR.replace(/^\//, ""));

  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(rootAbs, { withFileTypes: true });
  } catch {
    return [];
  }

  const series: PhotoSeries[] = [];

  const loose = await readPhotos(rootAbs, PHOTO_DIR);
  if (loose.length > 0) {
    series.push({ key: "", title: null, rows: packRows(loose, targetRowHeight, measure) });
  }

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort(naturalSort);

  for (const folder of folders) {
    const photos = await readPhotos(
      path.join(rootAbs, folder),
      `${PHOTO_DIR}/${encodeURIComponent(folder)}`
    );
    if (photos.length === 0) continue;
    series.push({
      key: folder,
      title: titleFromFolder(folder),
      rows: packRows(photos, targetRowHeight, measure),
    });
  }

  return series;
}
