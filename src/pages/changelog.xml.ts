// Atom 1.0 feed of GitHub Releases (pages.md#其他页面要点): one entry per release linking to its
// Chinese changelog page, with the rendered notes as escaped HTML content.
import type { APIRoute } from "astro";
import { renderReleaseNotes } from "../lib/release-notes";
import { latest, releases } from "../lib/releases";
import { REPO_URL, SITE_URL } from "../../site.config.mjs";

const abs = (p: string) => new URL(p, SITE_URL).href;
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = () => {
  const sorted = [...releases].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const updated = sorted[0]?.publishedAt ?? latest?.publishedAt ?? new Date(0).toISOString();
  const entries = sorted.map((r) => {
    const url = abs(`/changelog/${r.tag}/`);
    return `  <entry>
    <id>${esc(url)}</id>
    <title>${esc(`WebMux ${r.tag}`)}</title>
    <link rel="alternate" type="text/html" href="${esc(url)}"/>
    <link rel="related" type="text/html" href="${esc(r.url)}"/>
    <published>${esc(r.publishedAt)}</published>
    <updated>${esc(r.publishedAt)}</updated>
    <content type="html">${esc(renderReleaseNotes(r.body, 2))}</content>
  </entry>`;
  });
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-CN">
  <id>${esc(abs("/changelog/"))}</id>
  <title>WebMux 更新日志</title>
  <subtitle>WebMux 每个版本的发布说明</subtitle>
  <link rel="self" type="application/atom+xml" href="${esc(abs("/changelog.xml"))}"/>
  <link rel="alternate" type="text/html" href="${esc(abs("/changelog/"))}"/>
  <link rel="related" type="text/html" href="${esc(`${REPO_URL}/releases`)}"/>
  <updated>${esc(updated)}</updated>
  <author><name>mzdluo123</name><uri>https://github.com/mzdluo123</uri></author>
  <icon>${esc(abs("/favicon.svg"))}</icon>
${entries.join("\n")}
</feed>
`;
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
};
