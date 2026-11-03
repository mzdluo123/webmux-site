// Last-modified dates for sitemap <lastmod> and docs JSON-LD dateModified.
// Docs pages: commit date of their mirrored Markdown file (CI checks out full history).
// Release pages: GitHub publish date. Other pages get no date rather than a fake build time.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import releases from "../data/releases.json" with { type: "json" };

const DOCS_DIR = "src/content/docs/docs";
const cache = new Map();

/** @param {string} file */
function gitDate(file) {
  if (!cache.has(file)) {
    let date;
    try {
      date =
        execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
          encoding: "utf8",
        }).trim() || undefined;
    } catch {
      date = undefined;
    }
    cache.set(file, date);
  }
  return cache.get(file);
}

/**
 * @param {string} rel docs path without the /docs/ prefix or slashes, e.g. "usage/terminal"; "" for the index
 * @returns {string | undefined} ISO date
 */
export function docsLastmod(rel) {
  const base = rel ? `${DOCS_DIR}/${rel}` : `${DOCS_DIR}/index`;
  for (const file of [`${base}.md`, `${base}.mdx`, `${base}/index.md`]) {
    if (existsSync(file)) return gitDate(file);
  }
  return undefined;
}

const releaseDates = new Map(releases.releases.map((r) => [r.tag, r.publishedAt]));

/**
 * @param {string} pathname site path with trailing slash, e.g. "/en/changelog/v0.10.1/"
 * @returns {string | undefined} ISO date
 */
export function lastmodForPath(pathname) {
  const docs = pathname.match(/^\/docs\/(.*?)\/?$/);
  if (docs) return docsLastmod(docs[1]);
  const changelog = pathname.match(/^\/(?:en\/)?changelog\/(?:([^/]+)\/)?$/);
  if (changelog)
    return changelog[1] ? releaseDates.get(changelog[1]) : releases.latest?.publishedAt;
  return undefined;
}
