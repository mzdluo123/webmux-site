// Internal link + anchor check over dist/ (stack.md#文档镜像 质量门禁, checklist 阶段 6).
// Every same-site href/src must resolve to a built file or a _redirects rule, and every
// #fragment must match an id on the target page. External URLs are not fetched.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
if (!existsSync(dist)) throw new Error("dist/ missing: run the build first");

const redirects = readFileSync(path.join(dist, "_redirects"), "utf8")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"))
  .map((l) => l.trim().split(/\s+/)[0]);

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const pages = new Map(); // url path → html
for (const file of walk(dist)) {
  if (!file.endsWith(".html")) continue;
  const rel = "/" + path.relative(dist, file).split(path.sep).join("/");
  pages.set(rel.replace(/index\.html$/, ""), readFileSync(file, "utf8"));
}

const idCache = new Map();
function idsOf(urlPath) {
  if (!idCache.has(urlPath)) {
    const html = pages.get(urlPath) ?? "";
    idCache.set(
      urlPath,
      new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decodeEntities(m[1]))),
    );
  }
  return idCache.get(urlPath);
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function resolve(urlPath) {
  if (pages.has(urlPath)) return urlPath;
  const file = path.join(dist, urlPath);
  if (existsSync(file) && statSync(file).isFile()) return urlPath;
  if (redirects.includes(urlPath)) return urlPath;
  return null;
}

const failures = [];
let checked = 0;
for (const [page, html] of pages) {
  const refs = [];
  for (const m of html.matchAll(
    /<(a|link|img|source|script)\b[^>]*?\s(href|src|srcset)="([^"]*)"/g,
  )) {
    if (m[2] === "srcset") refs.push(...m[3].split(",").map((s) => s.trim().split(/\s+/)[0]));
    else refs.push(m[3]);
  }
  for (const raw of refs) {
    const href = decodeEntities(raw);
    if (!href || /^(mailto:|tel:|data:|javascript:)/.test(href)) continue;
    let url;
    try {
      url = new URL(href, `https://site.invalid${page}`);
    } catch {
      failures.push(`${page}: unparsable ${href}`);
      continue;
    }
    if (url.host !== "site.invalid") continue;
    checked++;
    const target = decodeURIComponent(url.pathname);
    const found = resolve(target);
    if (!found) {
      failures.push(`${page}: broken ${href}`);
      continue;
    }
    if (url.hash && pages.has(found)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !idsOf(found).has(id)) failures.push(`${page}: missing anchor ${href}`);
    }
  }
}

if (failures.length) {
  console.error(
    `[links] ${failures.length} problems in ${pages.size} pages:\n  ${[...new Set(failures)].join("\n  ")}`,
  );
  process.exit(1);
}
console.log(
  `[links] ${checked} internal links across ${pages.size} pages resolve, anchors included`,
);
