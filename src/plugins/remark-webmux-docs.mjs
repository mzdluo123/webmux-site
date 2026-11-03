// Build-time rewriting for the mirrored docs (docs/website/stack.md#文档镜像):
// - relative links → site URLs per the path rules in scripts/lib/docmap.mjs; anchors kept as-is
//   (Astro's heading ids use github-slugger, the same algorithm GitHub and docguard use);
// - links to files that are not mirrored → GitHub at the mirrored ref;
// - images (Markdown and inline <img>/<source>) → the WebP copies in public/docs/images;
// - GitHub alerts (> [!WARNING]) → Starlight asides.
// Any relative link it cannot map throws, failing the build instead of shipping a 404.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { imageUrlFor, resolveRepoPath, slugFor, urlForSlug } from "../../scripts/lib/docmap.mjs";

const REPO_URL = "https://github.com/mzdluo123/webmux";
const manifestPath = fileURLToPath(new URL("../data/docs-manifest.json", import.meta.url));

const ALERTS = {
  NOTE: ["note", "说明"],
  TIP: ["tip", "提示"],
  IMPORTANT: ["note", "重要"],
  WARNING: ["caution", "警告"],
  CAUTION: ["danger", "注意"],
};

function loadManifest() {
  const m = JSON.parse(readFileSync(manifestPath, "utf8"));
  return {
    ref: m.ref,
    mirrored: new Set(m.docs.map((d) => d.source)),
    titleAnchors: new Map(m.docs.map((d) => [d.source, d.titleAnchor])),
    images: new Set(m.images.map((i) => i.source)),
    targets: m.linkTargets,
  };
}

export function rewriteHref(manifest, fromFile, href) {
  const hashAt = href.indexOf("#");
  const anchor = hashAt >= 0 ? href.slice(hashAt) : "";
  const target = resolveRepoPath(fromFile, href);
  if (target === null) return href;
  if (manifest.mirrored.has(target)) {
    // The source H1 is rendered as the page title (id "_top"), not as a heading anchor.
    const toTitle = decodeURIComponent(anchor.slice(1)) === manifest.titleAnchors.get(target);
    return urlForSlug(slugFor(target)) + (toTitle ? "" : anchor);
  }
  if (target === "README.md") return "/";
  if (manifest.images.has(target)) return imageUrlFor(target);
  const kind = manifest.targets[target];
  if (kind) return `${REPO_URL}/${kind}/${manifest.ref}/${target}${anchor}`;
  throw new Error(`[docs mirror] ${fromFile}: unmapped link "${href}" (resolved to "${target}")`);
}

function rewriteHtml(manifest, fromFile, html) {
  return html
    .replace(
      /\b(src|href)="([^"]+)"/g,
      (_, attr, v) => `${attr}="${rewriteHref(manifest, fromFile, v)}"`,
    )
    .replace(
      /\bsrcset="([^"]+)"/g,
      (_, v) =>
        `srcset="${v
          .split(",")
          .map((part) => {
            const [url, ...desc] = part.trim().split(/\s+/);
            return [rewriteHref(manifest, fromFile, url), ...desc].join(" ");
          })
          .join(", ")}"`,
    );
}

function convertAlert(node) {
  const para = node.children[0];
  const first = para?.type === "paragraph" ? para.children[0] : null;
  const m =
    first?.type === "text" && first.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
  if (!m) return;
  const [variant, title] = ALERTS[m[1]];
  first.value = first.value.slice(m[0].length);
  if (!first.value) para.children.shift();
  if (para.children[0]?.type === "break") para.children.shift();
  const body = para.children.length ? node.children : node.children.slice(1);
  node.data = {
    hName: "aside",
    hProperties: {
      "aria-label": title,
      className: ["starlight-aside", `starlight-aside--${variant}`],
    },
  };
  node.children = [
    {
      type: "paragraph",
      data: { hProperties: { className: ["starlight-aside__title"], "aria-hidden": "true" } },
      children: [{ type: "text", value: title }],
    },
    {
      type: "webmuxAsideContent",
      data: { hName: "div", hProperties: { className: ["starlight-aside__content"] } },
      children: body,
    },
  ];
}

function walk(node, fn) {
  fn(node);
  if (node.children) for (const child of node.children) walk(child, fn);
}

// GFM task items render a bare disabled <input>; give it an accessible name (WCAG 4.1.2).
function labelTaskItem(node) {
  const state = node.checked ? "已勾选的检查项" : "未勾选的检查项";
  const input = `<input type="checkbox" disabled${node.checked ? " checked" : ""} aria-label="${state}"> `;
  node.checked = null;
  node.data = { ...node.data, hProperties: { className: ["task-list-item"] } };
  const first = node.children[0];
  if (first?.type === "paragraph") first.children.unshift({ type: "html", value: input });
  else node.children.unshift({ type: "html", value: input });
}

export default function remarkWebmuxDocs() {
  let manifest;
  return (tree, file) => {
    const sourcePath = file.data?.astro?.frontmatter?.sourcePath;
    if (!sourcePath) return;
    manifest ??= loadManifest();
    walk(tree, (node) => {
      if (
        (node.type === "link" || node.type === "image" || node.type === "definition") &&
        node.url
      ) {
        node.url = rewriteHref(manifest, sourcePath, node.url);
      } else if (node.type === "html") {
        node.value = rewriteHtml(manifest, sourcePath, node.value);
      } else if (node.type === "blockquote") {
        convertAlert(node);
      } else if (node.type === "listItem" && typeof node.checked === "boolean") {
        labelTaskItem(node);
      } else if (node.type === "table") {
        // Starlight lets wide tables scroll; scroll regions must be keyboard-focusable.
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, tabIndex: 0 } };
      }
    });
  };
}
