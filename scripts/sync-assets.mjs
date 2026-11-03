// Copies brand assets, fonts, licenses, homepage screenshots and agent icons from the same
// mzdluo123/webmux ref as the docs mirror (docs/website/stack.md#内容与资产同步).
// Alt text comes from the README so the site and GitHub describe screenshots identically.
import { createHash } from "node:crypto";
import sharp from "sharp";
import { listFiles, readFile } from "./lib/source.mjs";

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

/** Screenshots used by marketing pages; kept at their docs/images/ names. */
const SCREENSHOTS = [
  "hero.jpg",
  "desktop-overview.png",
  "mobile-overview.png",
  "mobile-omp.png",
  "mobile-chat.png",
  "desktop-diff.png",
  "desktop-chat.png",
  "desktop-terminal.png",
  "mobile-terminal.png",
  "mobile-diff.png",
  "terminal-splits/after-desktop-light.jpg",
  "terminal-splits/after-desktop-dark.jpg",
  "kitty-graphics/after-desktop-light.png",
  "kitty-graphics/after-desktop-dark.png",
  "file-explorer/after-desktop-light.png",
  "file-explorer/after-desktop-dark.png",
  "cli-agents/after-desktop-light.png",
  "cli-agents/after-desktop-dark.png",
];

/** Latin subsets only; CJK uses the system font stack (design.md#字体). */
const FONTS = [
  /^web\/public\/fonts\/inter-latin(-ext)?-[0-9a-f]+\.woff2$/,
  /^web\/public\/fonts\/maple-(400|700)-latin-[0-9a-f]+\.woff2$/,
];
const LICENSES = {
  "web/public/fonts/licenses/OFL-Inter.txt": "public/licenses/OFL-Inter.txt",
  "web/public/fonts/licenses/OFL-MapleMono.txt": "public/licenses/OFL-MapleMono.txt",
  "web/public/fonts/licenses/NOTICE.txt": "public/licenses/fonts-NOTICE.txt",
  "web/src/icons/lobehub/LICENSE": "public/licenses/lobe-icons-MIT.txt",
  LICENSE: "public/licenses/webmux-MIT.txt",
};

/** Alt text per screenshot from README `<img src="docs/images/…" alt="…">`. */
function readmeAlts(readme) {
  const alts = {};
  for (const m of readme.matchAll(/<img\s+[^>]*?src="docs\/images\/([^"]+)"[^>]*?alt="([^"]*)"/g))
    alts[m[1]] = m[2];
  // <picture> pairs: the dark <source> shares the light <img> alt.
  for (const m of readme.matchAll(
    /<source[^>]*srcset="docs\/images\/([^"]+)"[^>]*>\s*<img[^>]*src="docs\/images\/([^"]+)"[^>]*alt="([^"]*)"/g,
  )) {
    alts[m[1]] ??= m[3];
    alts[m[2]] ??= m[3];
  }
  return alts;
}

export async function syncAssets(repo, source) {
  const files = new Set(listFiles(repo, source.rev));
  const out = new Map();
  const manifest = [];
  const add = (from, to, buf = readFile(repo, source.rev, from)) => {
    out.set(to, buf);
    manifest.push({ source: from, dest: to, sha256: sha256(buf) });
    return buf;
  };

  add("docs/images/brand/webmux-logo-light.svg", "public/brand/webmux-logo-light.svg");
  add("docs/images/brand/webmux-logo-dark.svg", "public/brand/webmux-logo-dark.svg");
  const icon = add("web/public/icon.svg", "public/favicon.svg");
  // Product tokens are the single source for colors, radii and fonts (design.md#颜色令牌).
  add("web/src/design-tokens.css", "src/styles/design-tokens.css");
  const touch = await sharp(icon, { density: 384 }).resize(180, 180).png().toBuffer();
  out.set("public/apple-touch-icon.png", touch);
  out.set("src/assets/brand/icon.svg", icon);

  const fonts = {};
  for (const f of [...files].filter((f) => FONTS.some((re) => re.test(f))).sort()) {
    const name = f.split("/").pop();
    add(f, `public/fonts/${name}`);
    fonts[name.replace(/-[0-9a-f]+\.woff2$/, "")] = `/fonts/${name}`;
  }
  for (const key of ["inter-latin", "inter-latin-ext", "maple-400-latin", "maple-700-latin"]) {
    if (!fonts[key]) throw new Error(`font ${key} not found at ${source.ref}`);
  }
  for (const [from, to] of Object.entries(LICENSES)) add(from, to);

  const alts = readmeAlts(readFile(repo, source.rev, "README.md").toString("utf8"));
  const screenshots = {};
  for (const name of SCREENSHOTS) {
    const from = `docs/images/${name}`;
    if (!files.has(from)) throw new Error(`screenshot ${from} missing at ${source.ref}`);
    add(from, `src/assets/screenshots/${name}`);
    if (!alts[name]) throw new Error(`README has no alt text for ${from}`);
    screenshots[name] = alts[name];
  }

  const agentIcons = [...files]
    .filter((f) => /^web\/src\/icons\/lobehub\/[a-z]+\.svg$/.test(f))
    .sort();
  for (const f of agentIcons) add(f, `src/assets/agents/${f.split("/").pop()}`);

  out.set("src/data/fonts.json", `${JSON.stringify(fonts, null, 2)}\n`);
  out.set("src/data/screenshots.json", `${JSON.stringify(screenshots, null, 2)}\n`);
  out.set(
    "src/data/assets-manifest.json",
    `${JSON.stringify({ repo: "mzdluo123/webmux", ref: source.ref, commit: source.commit, files: manifest }, null, 2)}\n`,
  );
  return out;
}

export const ASSET_OUTPUT_ROOTS = [
  "public/brand",
  "public/fonts",
  "public/licenses",
  "src/assets/brand",
  "src/assets/screenshots",
  "src/assets/agents",
];
