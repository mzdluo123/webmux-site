// Build-time release data (docs/website/stack.md#构建期数据). Writes src/data/releases.json.
// On any API failure the committed copy is kept and the build continues with a warning;
// pages then mark the data as possibly stale (`fetched: false`).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REPO = "mzdluo123/webmux";
const OUT = fileURLToPath(new URL("../src/data/releases.json", import.meta.url));

const headers = { accept: "application/vnd.github+json", "user-agent": "webmux-site-build" };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    headers,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

const pickRelease = (r) => ({
  tag: r.tag_name,
  name: r.name || r.tag_name,
  publishedAt: r.published_at,
  prerelease: r.prerelease,
  url: r.html_url,
  body: r.body ?? "",
  assets: r.assets.map((a) => ({
    name: a.name,
    size: a.size,
    sha256: a.digest?.startsWith("sha256:") ? a.digest.slice(7) : null,
    url: a.browser_download_url,
  })),
});

try {
  const [latest, releases, repo] = await Promise.all([
    get("/releases/latest"),
    get("/releases?per_page=30"),
    get(""),
  ]);
  const data = {
    fetched: true,
    stars: repo.stargazers_count,
    latest: pickRelease(latest),
    releases: releases.filter((r) => !r.draft).map(pickRelease),
  };
  writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `[releases] ${data.latest.tag} (${data.releases.length} releases, ${data.stars} stars)`,
  );
} catch (err) {
  console.warn(`::warning::[releases] using committed fallback: ${err.message}`);
  const data = JSON.parse(readFileSync(OUT, "utf8"));
  if (data.fetched) writeFileSync(OUT, `${JSON.stringify({ ...data, fetched: false }, null, 2)}\n`);
}
