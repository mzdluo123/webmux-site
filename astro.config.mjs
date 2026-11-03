// @ts-check
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sidebar from "./src/data/docs-sidebar.json" with { type: "json" };
import remarkWebmuxDocs from "./src/plugins/remark-webmux-docs.mjs";
import { SITE_URL } from "./site.config.mjs";

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  build: { format: "directory" },
  // Locale routing is explicit (src/pages/ and src/pages/en/); Astro's i18n option conflicts
  // with Starlight's locales, and the docs mirror is Chinese-only.
  markdown: {
    remarkPlugins: [remarkWebmuxDocs],
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: { $lib: fileURLToPath(new URL("./src/lib", import.meta.url)) } },
  },
  integrations: [
    svelte(),
    starlight({
      title: "WebMux 文档",
      defaultLocale: "root",
      locales: { root: { label: "简体中文", lang: "zh-CN" } },
      favicon: "/favicon.svg",
      disable404Route: true,
      pagefind: true,
      credits: false,
      customCss: ["./src/styles/docs.css"],
      head: [
        {
          tag: "meta",
          attrs: { property: "og:image", content: new URL("/og/docs-zh-cn.png", SITE_URL).href },
        },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
      ],
      components: {
        Head: "./src/components/starlight/Head.astro",
        Header: "./src/components/starlight/Header.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        Footer: "./src/components/starlight/Footer.astro",
      },
      sidebar: sidebar.map((group) => ({
        label: group.label,
        items: group.items.map((item) => ({
          label: item.label,
          link: item.link,
          attrs: item.depth > 0 ? { class: "sidebar-sub" } : {},
        })),
      })),
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      expressiveCode: {
        plugins: [
          {
            name: "focusable-code",
            hooks: {
              // Long code lines scroll horizontally; keep the scroll region keyboard-focusable.
              postprocessRenderedBlock: ({ renderData }) => {
                /** @param {import("hast").Element | import("hast").ElementContent} node */
                const visit = (node) => {
                  if (node.type !== "element") return;
                  if (node.tagName === "pre") node.properties.tabindex = "0";
                  for (const child of node.children) visit(child);
                };
                visit(renderData.blockAst);
              },
            },
          },
        ],
      },
    }),
    sitemap({
      i18n: { defaultLocale: "zh-cn", locales: { "zh-cn": "zh-CN", en: "en" } },
      filter: (page) => !page.includes("/404"),
    }),
  ],
});
