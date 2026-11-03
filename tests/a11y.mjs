// Accessibility and layout gate (ux.md#测试清单): axe (WCAG 2.2 A/AA rules) on every built
// page, light theme at 1280px and dark theme at 390px; plus no horizontal overflow at 320px.
// Fails on serious or critical violations.
import AxeBuilder from "@axe-core/playwright";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { serve } from "./serve.mjs";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
function* pages(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* pages(p);
    else if (e.name === "index.html")
      yield "/" + path.relative(dist, dir).split(path.sep).join("/");
  }
}
const only = process.env.A11Y_ONLY ? new RegExp(process.env.A11Y_ONLY) : null;
const urls = [...pages(dist)]
  .map((p) => (p === "/" ? "/" : `${p}/`))
  .filter((u) => !only || only.test(u))
  .sort();

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const failures = [];
const runs = [
  { name: "light-1280", viewport: { width: 1280, height: 900 }, colorScheme: "light" },
  { name: "dark-390", viewport: { width: 390, height: 844 }, colorScheme: "dark" },
];

for (const run of runs) {
  const context = await browser.newContext({
    viewport: run.viewport,
    colorScheme: run.colorScheme,
  });
  const page = await context.newPage();
  for (const url of urls) {
    await page.goto(base + url, { waitUntil: "load" });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // Starlight's search button shows a keyboard hint (⌘K) next to its label; upstream component.
      .exclude("button[data-open-modal]")
      .analyze();
    for (const v of result.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    )) {
      failures.push(
        `${run.name} ${url}: ${v.id} (${v.impact}) ${v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(" "))
          .join(" | ")}`,
      );
    }
  }
  await context.close();
}

const narrow = await browser.newContext({ viewport: { width: 320, height: 700 } });
const page = await narrow.newPage();
for (const url of urls) {
  await page.goto(base + url, { waitUntil: "load" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) failures.push(`320px ${url}: horizontal overflow ${overflow}px`);
}
await browser.close();
server.close();

if (failures.length) {
  console.error(`[a11y] ${failures.length} problems:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`[a11y] ${urls.length} pages × ${runs.length} themes pass axe; no overflow at 320px`);
