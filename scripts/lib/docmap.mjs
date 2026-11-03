// Mapping rules shared by sync-docs.mjs (sync time) and the remark plugin (build time).
// Source paths are repository-relative POSIX paths of mzdluo123/webmux.
import path from "node:path";

/** Root files mirrored under /docs/. README.md is not a doc page: links to it go to the home page. */
export const ROOT_DOCS = {
  "SECURITY.md": "docs/security",
  "CONTRIBUTING.md": "docs/contributing",
};

/** Low-value or agent-facing pages: excluded by rule, not by hand (stack.md#文档镜像). */
const EXCLUDE = [
  /^docs\/agent-rules\.md$/,
  /^docs\/agent-rules\//,
  /^docs\/doc-governance\.md$/,
  /^docs\/user-stories\/verification-log-[^/]*\.md$/,
];

export const EXCLUDE_MARKER = /<!--\s*site:\s*exclude\s*-->/;

export function isCandidateDoc(file) {
  if (file in ROOT_DOCS) return true;
  return file.startsWith("docs/") && file.endsWith(".md") && !file.startsWith("docs/images/");
}

export function isExcluded(file) {
  return EXCLUDE.some((re) => re.test(file));
}

/** Starlight slug (no leading/trailing slash) for a mirrored source file. */
export function slugFor(file) {
  if (file in ROOT_DOCS) return ROOT_DOCS[file];
  if (file === "docs/README.md") return "docs";
  return file.replace(/\.md$/, "").replace(/\/README$/, "");
}

/** Site URL path for a slug, trailing slash style (seo.md#技术基础). */
export function urlForSlug(slug) {
  return `/${slug}/`;
}

/** File inside src/content/docs that holds the mirrored page. */
export function contentPathFor(file) {
  if (file in ROOT_DOCS) return `${ROOT_DOCS[file]}.md`;
  if (file === "docs/README.md") return "docs/index.md";
  // Nested READMEs are directory index pages; Starlight would otherwise slug them as …/readme.
  return file.replace(/\/README\.md$/, "/index.md");
}

/** Mirrored images live in public/ under the same repo path, converted to WebP. */
export function imageUrlFor(file) {
  return `/${file.replace(/\.(png|jpe?g)$/i, ".webp")}`;
}

export function isImage(file) {
  return /\.(png|jpe?g|gif|svg|webp)$/i.test(file);
}

/** Resolve a link target written in `fromFile` to a repository path (posix), or null if external. */
export function resolveRepoPath(fromFile, href) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//") || href.startsWith("#"))
    return null;
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;
  const joined = clean.startsWith("/")
    ? clean.slice(1)
    : path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), clean));
  return decodeURI(joined).replace(/\/$/, "");
}
