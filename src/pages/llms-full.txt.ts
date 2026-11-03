import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import manifest from "../data/docs-manifest.json";
import { SITE_URL } from "../../site.config.mjs";

// Every mirrored doc page as Markdown in one file, in manifest order (seo.md#面向-ai-搜索与-agent).
export const GET: APIRoute = async () => {
  const entries = new Map((await getCollection("docs")).map((e) => [e.data.sourcePath, e]));
  const parts = manifest.docs.map((d) => {
    const entry = entries.get(d.source);
    if (!entry) throw new Error(`mirrored doc missing from collection: ${d.source}`);
    return `# ${entry.data.title}\n\nURL: ${new URL(d.url, SITE_URL).href}\n\n${entry.body?.trim() ?? ""}\n`;
  });
  const head = `# WebMux documentation (mirrored from mzdluo123/webmux ${manifest.ref} @ ${manifest.commit.slice(0, 12)})\n\n`;
  return new Response(head + parts.join("\n---\n\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
