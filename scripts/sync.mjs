// Entry point for the docs mirror and asset sync; both read the same mzdluo123/webmux ref.
//
//   node scripts/sync.mjs           resolve the ref (latest release, main fallback) and rewrite outputs
//   node scripts/sync.mjs --check   regenerate from the commit recorded in docs-manifest.json and fail
//                                   if committed outputs differ (manual edits, stale files)
//
// Env: WEBMUX_REF pins a ref; WEBMUX_SOURCE=<local clone> avoids cloning; GITHUB_TOKEN raises API quota.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { openSourceRepo, resolveRef, ROOT } from "./lib/source.mjs";
import { ASSET_OUTPUT_ROOTS, syncAssets } from "./sync-assets.mjs";
import { DOCS_OUTPUT_ROOTS, syncDocs } from "./sync-docs.mjs";

const check = process.argv.includes("--check");
const ROOTS = [...DOCS_OUTPUT_ROOTS, ...ASSET_OUTPUT_ROOTS];
// Re-encoded images are compared by presence only: their bytes depend on the libvips build.
const BYTES_UNSTABLE = /\.(webp)$|^public\/apple-touch-icon\.png$/;

function walk(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, base) : [path.relative(ROOT, p).split(path.sep).join("/")];
  });
}

const repo = openSourceRepo();
let source;
if (check) {
  const manifest = JSON.parse(readFileSync(path.join(ROOT, "src/data/docs-manifest.json"), "utf8"));
  source = {
    ref: manifest.ref,
    rev: manifest.commit,
    commit: manifest.commit,
    release: manifest.latestRelease,
    fallback: manifest.fallbackToMain,
  };
} else {
  source = await resolveRef(repo);
}
console.log(
  `[sync] ${source.ref} @ ${source.commit.slice(0, 12)} (latest release ${source.release})`,
);

const outputs = new Map([...(await syncDocs(repo, source)), ...(await syncAssets(repo, source))]);

if (check) {
  const problems = [];
  for (const [file, content] of outputs) {
    const abs = path.join(ROOT, file);
    if (!existsSync(abs)) problems.push(`missing ${file}`);
    else if (!BYTES_UNSTABLE.test(file) && !readFileSync(abs).equals(Buffer.from(content))) {
      problems.push(`differs ${file}`);
    }
  }
  for (const root of ROOTS) {
    for (const file of walk(path.join(ROOT, root)))
      if (!outputs.has(file)) problems.push(`stale ${file}`);
  }
  if (problems.length) {
    console.error(
      `[sync] mirror does not match ${source.ref}; run \`pnpm sync\`:\n  ${problems.join("\n  ")}`,
    );
    process.exit(1);
  }
  console.log(`[sync] ${outputs.size} generated files match`);
} else {
  for (const root of ROOTS) rmSync(path.join(ROOT, root), { recursive: true, force: true });
  for (const [file, content] of outputs) {
    const abs = path.join(ROOT, file);
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
  console.log(`[sync] wrote ${outputs.size} files`);
}
