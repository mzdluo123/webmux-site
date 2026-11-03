// Mirrors mzdluo123/webmux docs/ (plus SECURITY.md, CONTRIBUTING.md) into Starlight content.
// Rules: docs/website/stack.md#文档镜像 in the main repository.
//
// Output (all generated, never hand-edited):
//   src/content/docs/**          one Markdown page per mirrored source file, original body
//   public/docs/images/**        images referenced by mirrored pages, re-encoded as WebP
//   src/data/docs-sidebar.json   sidebar built from docs/README.md groups
//   src/data/docs-manifest.json  ref, commit, files + SHA-256, link targets for the remark plugin
//
// Link rewriting happens at build time in src/plugins/remark-webmux-docs.mjs; the body copied
// here is the source text minus its leading H1 (which becomes the frontmatter title).
import { createHash } from "node:crypto";
import { slug as githubSlug } from "github-slugger";
import sharp from "sharp";
import {
  contentPathFor,
  EXCLUDE_MARKER,
  imageUrlFor,
  isCandidateDoc,
  isExcluded,
  isImage,
  resolveRepoPath,
  slugFor,
  urlForSlug,
} from "./lib/docmap.mjs";
import { listFiles, readFile } from "./lib/source.mjs";

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

/** Plain text of a Markdown fragment, good enough for meta descriptions. */
function plainText(md) {
  return md
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(body) {
  const lines = body.split("\n");
  const para = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const t = line.trim();
    if (!t) {
      if (para.length) break;
      continue;
    }
    if (/^(#|\||>|<|[-*+] |\d+\. |!\[|```)/.test(t)) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  return plainText(para.join(" "));
}

function truncate(text, max) {
  const chars = [...text];
  if (chars.length <= max) return text;
  return `${chars
    .slice(0, max - 1)
    .join("")
    .trimEnd()}…`;
}

/** Link and image targets in Markdown and inline HTML. */
export function collectTargets(md) {
  const out = [];
  const noCode = md.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const m of noCode.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push(m[1]);
  for (const m of noCode.matchAll(/^\s*\[[^\]]+\]:\s*<?(\S+?)>?(?:\s|$)/gm)) out.push(m[1]);
  for (const m of noCode.matchAll(/\b(?:src|href)="([^"]+)"/g)) out.push(m[1]);
  for (const m of noCode.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const part of m[1].split(",")) out.push(part.trim().split(/\s+/)[0]);
  }
  return out;
}

function yamlString(s) {
  return JSON.stringify(s);
}

/** Sidebar groups from docs/README.md: `## Group` + nested bullet lists of links. */
function buildSidebar(readme, slugOf) {
  const groups = [];
  let group = null;
  for (const line of readme.split("\n")) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      group = { label: h[1], items: [] };
      groups.push(group);
      continue;
    }
    const li = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (!li || !group) continue;
    const depth = Math.floor(li[1].length / 2);
    // "代码规范：[Go](…)、[前端](…)" → "代码规范 · Go": bare link texts need their lead-in.
    const lead = li[2].match(/^([^[]+?)[：:]\s*\[/);
    for (const m of li[2].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
      const target = resolveRepoPath("docs/README.md", m[2]);
      const slug = target && slugOf.get(target);
      if (!slug) continue; // excluded or non-doc target: not part of the docs sidebar
      const label = lead ? `${lead[1].replace(/[*_`]/g, "")} · ${m[1]}` : m[1];
      group.items.push({ label, link: urlForSlug(slug), depth });
      if (depth > 0) break; // nested lines list sub-pages; inline extras stay off the sidebar
    }
  }
  // Groups whose every entry is excluded (e.g. "文档与 Agent 规则") disappear.
  return groups.filter((g) => g.items.length);
}

/**
 * @param {{dir: string}} repo
 * @param {{ref: string, rev: string, commit: string, release: string, fallback: boolean}} source
 * @returns {Promise<Map<string, Buffer|string>>} output path (repo-root relative) → content
 */
export async function syncDocs(repo, source) {
  const files = listFiles(repo, source.rev);
  const fileSet = new Set(files);
  const dirSet = new Set();
  for (const f of files) {
    const parts = f.split("/");
    for (let i = 1; i < parts.length; i++) dirSet.add(parts.slice(0, i).join("/"));
  }

  const pages = [];
  const skipped = [];
  for (const file of files.filter(isCandidateDoc).sort()) {
    if (isExcluded(file)) {
      skipped.push({ source: file, reason: "rule" });
      continue;
    }
    const raw = readFile(repo, source.rev, file).toString("utf8");
    if (EXCLUDE_MARKER.test(raw.split("\n").slice(0, 5).join("\n"))) {
      skipped.push({ source: file, reason: "marker" });
      continue;
    }
    pages.push({ file, raw });
  }

  const slugOf = new Map(pages.map((p) => [p.file, slugFor(p.file)]));
  const seen = new Map();
  for (const [file, slug] of slugOf) {
    if (seen.has(slug))
      throw new Error(`slug collision: ${seen.get(slug)} and ${file} → /${slug}/`);
    seen.set(slug, file);
  }

  const out = new Map();
  const linkTargets = {};
  const images = new Map();
  const missing = [];
  const manifestDocs = [];

  for (const { file, raw } of pages) {
    const text = raw.replace(/\r\n/g, "\n");
    const h1 = text.match(/^#\s+(.+?)\s*#*\s*$/m);
    if (!h1) throw new Error(`${file}: no H1 title`);
    const title = plainText(h1[1]);
    const body = text.replace(h1[0], "").replace(/^\s*\n/, "");
    const description = truncate(firstParagraph(body) || title, 150);

    for (const href of collectTargets(body)) {
      const target = resolveRepoPath(file, href);
      if (target === null || slugOf.has(target) || target === "README.md") continue;
      if (fileSet.has(target)) {
        if (isImage(target) && target.startsWith("docs/images/")) images.set(target, null);
        else linkTargets[target] = "blob";
      } else if (dirSet.has(target) || target === "") {
        linkTargets[target] = "tree";
      } else {
        missing.push(`${file} → ${href}`);
      }
    }

    const fm = [
      "---",
      `title: ${yamlString(title)}`,
      `description: ${yamlString(description)}`,
      ...(file in { "SECURITY.md": 1, "CONTRIBUTING.md": 1 } ? [`slug: ${slugOf.get(file)}`] : []),
      `sourcePath: ${yamlString(file)}`,
      "---",
      "",
    ].join("\n");
    out.set(`src/content/docs/${contentPathFor(file)}`, fm + body);
    // The H1 becomes the Starlight page title, so links to its anchor must drop the fragment.
    const titleAnchor = githubSlug(title);
    manifestDocs.push({
      source: file,
      url: urlForSlug(slugOf.get(file)),
      titleAnchor,
      sha256: sha256(raw),
    });
  }

  if (missing.length) {
    throw new Error(
      `links to paths that do not exist at ${source.ref}:\n  ${missing.join("\n  ")}`,
    );
  }

  const manifestImages = [];
  for (const img of [...images.keys()].sort()) {
    const buf = readFile(repo, source.rev, img);
    const dest = `public${imageUrlFor(img)}`;
    let data = buf;
    if (/\.(png|jpe?g)$/i.test(img)) {
      data = await sharp(buf)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    }
    out.set(dest, data);
    manifestImages.push({ source: img, url: imageUrlFor(img), sha256: sha256(buf) });
  }

  const readme = pages.find((p) => p.file === "docs/README.md");
  const sidebar = readme
    ? buildSidebar(readme.raw, slugOf)
    : [
        {
          label: "文档",
          items: manifestDocs.map((d) => ({ label: d.source, link: d.url, depth: 0 })),
        },
      ];

  out.set("src/data/docs-sidebar.json", `${JSON.stringify(sidebar, null, 2)}\n`);
  out.set(
    "src/data/docs-manifest.json",
    `${JSON.stringify(
      {
        repo: "mzdluo123/webmux",
        ref: source.ref,
        commit: source.commit,
        latestRelease: source.release,
        fallbackToMain: source.fallback,
        docs: manifestDocs,
        skipped,
        images: manifestImages,
        linkTargets: Object.fromEntries(Object.entries(linkTargets).sort()),
      },
      null,
      2,
    )}\n`,
  );
  return out;
}

export const DOCS_OUTPUT_ROOTS = ["src/content/docs", "public/docs"];
