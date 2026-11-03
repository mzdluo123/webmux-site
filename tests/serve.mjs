// Minimal static server over dist/ for browser tests (directory URLs → index.html, 404.html
// with status 404), mirroring the Workers assets config closely enough for a11y/Lighthouse.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".wasm": "application/wasm",
};

export function serve(port = 0) {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let file = path.join(dist, decodeURIComponent(url.pathname));
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    let status = 200;
    if (!file.startsWith(dist) || !existsSync(file)) {
      file = path.join(dist, "404.html");
      status = 404;
    }
    res.writeHead(status, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
    });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = await serve(Number(process.env.PORT ?? 4321));
  console.log(`serving dist on http://127.0.0.1:${server.address().port}`);
}
