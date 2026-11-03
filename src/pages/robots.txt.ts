import type { APIRoute } from "astro";
import { SITE_URL } from "../../site.config.mjs";

// AI crawlers are allowed explicitly (seo.md#面向-ai-搜索与-agent): the site is public product
// documentation, and /llms.txt exists for them.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
];

export const GET: APIRoute = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "",
      ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /", ""]),
      `Sitemap: ${new URL("/sitemap-index.xml", SITE_URL).href}`,
      "",
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
