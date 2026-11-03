// Release notes rendering for /changelog/ and the Atom feed (pages.md#其他页面要点): GitHub Release
// Markdown → HTML with marked, then sanitize-html keeps only the tags Markdown produces. Images are
// dropped, headings are demoted under the page's own heading, and links get rel="noopener".
import { Marked } from "marked";
import sanitizeHtml from "sanitize-html";

const markdown = new Marked({ gfm: true, breaks: false });

const TAGS = [
  "p",
  "a",
  "ul",
  "ol",
  "li",
  "code",
  "pre",
  "strong",
  "em",
  "del",
  "blockquote",
  "hr",
  "br",
  "h2",
  "h3",
  "h4",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

/**
 * Renders release Markdown. `top` is the level the notes' top headings (h1/h2) take: 3 on the
 * changelog list (under each release's h2), 2 on a release page (under its h1). Deeper headings
 * follow one level apart, capped at h4, so the page never skips a level.
 */
export function renderReleaseNotes(body: string, top: 2 | 3 = 3): string {
  const html = markdown.parse(body ?? "", { async: false });
  const heading = (level: number) => (_: string, attribs: Record<string, string>) => ({
    tagName: `h${Math.min(4, top + Math.max(0, level - 2))}`,
    attribs,
  });
  return sanitizeHtml(html, {
    allowedTags: TAGS,
    // Scrollable code blocks and tables must be keyboard-focusable (axe scrollable-region-focusable).
    allowedAttributes: { a: ["href", "rel"], pre: ["tabindex"], table: ["tabindex"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      h1: heading(1),
      h2: heading(2),
      h3: heading(3),
      h4: heading(4),
      h5: heading(5),
      h6: heading(6),
      a: (_, attribs) => ({ tagName: "a", attribs: { ...attribs, rel: "noopener" } }),
      pre: (_, attribs) => ({ tagName: "pre", attribs: { ...attribs, tabindex: "0" } }),
      table: (_, attribs) => ({ tagName: "table", attribs: { ...attribs, tabindex: "0" } }),
    },
  });
}

/** Plain-text summary of the notes (headings dropped) for meta descriptions, cut at `max` characters. */
export function releaseExcerpt(body: string, max: number): string {
  const html = markdown.parse(body ?? "", { async: false });
  const text = sanitizeHtml(html.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g, " "), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  const chars = [...text];
  return chars.length <= max
    ? text
    : `${chars
        .slice(0, max - 1)
        .join("")
        .trimEnd()}…`;
}

/** Tailwind descendant styles for rendered notes (no extra CSS files; design.md#内页). */
export const NOTES_CLASS = [
  "prose-link max-w-[760px] text-[16px] leading-[1.75] break-words",
  "[&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:leading-snug",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:leading-snug",
  "[&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:text-[16px] [&_h4]:font-semibold",
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:bg-terminal [&_pre]:p-3.5 [&_pre]:text-sm [&_pre]:text-terminal-foreground",
  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
  "[&_table]:my-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:text-sm",
  "[&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:px-2 [&_td]:py-1",
  "[&_hr]:my-6 [&_hr]:border-band-line [&>:first-child]:mt-0",
].join(" ");
