// Renders dist/_headers from config/headers.template. The CSP allows inline scripts only by
// hash: every inline <script> in the built HTML (Astro islands, Starlight, theme pre-paint) is
// hashed here, so the policy stays strict without hand-maintained hashes.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");

function* htmlFiles(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const hashes = new Set();
let beacon = false;
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] ?? "";
    if (/\ssrc=/.test(attrs)) {
      if (attrs.includes("static.cloudflareinsights.com")) beacon = true;
      continue;
    }
    if (/type="application\/(ld\+)?json"/.test(attrs)) continue; // data blocks are not executed
    hashes.add(`'sha256-${createHash("sha256").update(m[2]).digest("base64")}'`);
  }
}

const scriptSrc = [
  ...[...hashes].sort(),
  ...(beacon ? ["https://static.cloudflareinsights.com"] : []),
].join(" ");
const connectSrc = beacon ? "https://cloudflareinsights.com" : "";
const template = readFileSync(path.join(root, "config/headers.template"), "utf8");
const rendered = template
  .split("\n")
  .filter((line) => !line.startsWith("#"))
  .join("\n")
  .replace("{{SCRIPT_SRC}}", scriptSrc)
  .replace("{{CONNECT_SRC}}", connectSrc)
  .replace(/ +;/g, ";");
for (const line of rendered.split("\n")) {
  if (line.length > 2000)
    throw new Error(`_headers line exceeds Cloudflare's 2000-character limit (${line.length})`);
}
writeFileSync(path.join(dist, "_headers"), rendered.trimStart());
console.log(
  `[postbuild] _headers: ${hashes.size} inline script hashes${beacon ? ", analytics beacon" : ""}`,
);
