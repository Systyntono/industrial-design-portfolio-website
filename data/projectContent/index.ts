import type { ProjectContent } from "./types";
import helmet1 from "./helmet-1";

// ---------------------------------------------------------------------------
// Registry of case study pages.
//
// To add one: create data/projectContent/<slug>.ts (copy _template.ts),
// import it above, and add a line here. The key must match the project's
// slug in data/projects.ts.
//
// A project with no entry here still gets a page — it just falls back to the
// title, subtitle and description already in data/projects.ts, so nothing
// 404s while you're still writing case studies.
// ---------------------------------------------------------------------------

const registry: Record<string, ProjectContent> = {
  "helmet-1": helmet1,
};

export function getProjectContent(slug: string): ProjectContent | null {
  return registry[slug] ?? null;
}

/** Public path of a project's image folder. */
export function projectImageDir(slug: string): string {
  return `/images/projects/${slug}`;
}

/**
 * Resolves a block's `src` to a public URL. Bare filenames resolve inside the
 * project's own folder; a leading "/" means the path is already absolute.
 */
export function resolveSrc(slug: string, src?: string): string | null {
  if (!src) return null;
  if (src.startsWith("/")) return src;
  return `${projectImageDir(slug)}/${src}`;
}
