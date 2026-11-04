// Resolves which ref of mzdluo123/webmux to mirror and materializes files from it.
//
// Ref rule (docs/website/stack.md#文档镜像): mirror the latest Release tag so docs match the
// download page. When that tag predates the docs hub (no docs/README.md), fall back to main;
// the next release that ships the hub switches back automatically. WEBMUX_REF overrides both.
//
// Source repo: WEBMUX_SOURCE=<path to a local clone> reuses an existing checkout (no network
// for git objects); otherwise a blobless bare clone is kept in .cache/webmux.git.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

export const REPO = "mzdluo123/webmux";
export const REPO_URL = `https://github.com/${REPO}`;
export const ROOT = path.resolve(import.meta.dirname, "../..");
const CACHE = path.join(ROOT, ".cache");

function git(repo, args, opts = {}) {
  return execFileSync("git", ["-C", repo, ...args], {
    encoding: opts.encoding ?? "utf8",
    maxBuffer: 512 * 1024 * 1024,
    stdio: ["ignore", "pipe", opts.quiet ? "ignore" : "inherit"],
  });
}

export function openSourceRepo() {
  const local = process.env.WEBMUX_SOURCE;
  if (local) {
    const dir = path.resolve(local);
    if (!existsSync(dir)) throw new Error(`WEBMUX_SOURCE does not exist: ${dir}`);
    return { dir, local: true };
  }
  const dir = path.join(CACHE, "webmux.git");
  mkdirSync(CACHE, { recursive: true });
  if (!existsSync(dir)) {
    execFileSync("git", ["clone", "--bare", "--filter=blob:none", `${REPO_URL}.git`, dir], {
      stdio: "inherit",
    });
  } else {
    // Tags are force-updated too: upstream has moved a release tag before, and a plain --tags
    // fetch then fails with "would clobber existing tag" on the cached clone.
    git(dir, [
      "fetch",
      "--prune",
      "origin",
      "+refs/heads/*:refs/heads/*",
      "+refs/tags/*:refs/tags/*",
    ]);
  }
  return { dir, local: false };
}

async function latestReleaseTag() {
  const headers = { accept: "application/vnd.github+json", "user-agent": "webmux-site-sync" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for releases/latest`);
  return (await res.json()).tag_name;
}

function hasPath(repo, rev, file) {
  try {
    git(repo, ["cat-file", "-e", `${rev}:${file}`], { quiet: true });
    return true;
  } catch {
    return false;
  }
}

function revFor(repo, ref) {
  // In a local working clone `main` may lag behind; prefer the remote-tracking branch.
  for (const candidate of [
    `refs/tags/${ref}`,
    `refs/remotes/origin/${ref}`,
    `refs/heads/${ref}`,
    ref,
  ]) {
    try {
      git(repo, ["rev-parse", "--verify", "--quiet", `${candidate}^{commit}`], { quiet: true });
      return candidate;
    } catch {
      // try the next form
    }
  }
  throw new Error(`ref ${ref} not found in ${repo}; fetch it first`);
}

/**
 * @returns {Promise<{ref: string, rev: string, commit: string, release: string, fallback: boolean}>}
 * ref: what the site shows ("v0.10.1" or "main"); release: latest release tag.
 */
export async function resolveRef(repo) {
  const release = await latestReleaseTag();
  const forced = process.env.WEBMUX_REF;
  let ref = forced || release;
  let rev = revFor(repo.dir, ref);
  let fallback = false;
  if (!forced && !hasPath(repo.dir, rev, "docs/README.md")) {
    console.warn(
      `[sync] ${release} has no docs/README.md; mirroring main until a release ships it`,
    );
    ref = "main";
    rev = revFor(repo.dir, ref);
    fallback = true;
  }
  const commit = git(repo.dir, ["rev-parse", `${rev}^{commit}`]).trim();
  return { ref, rev, commit, release, fallback };
}

export function listFiles(repo, rev) {
  return git(repo.dir, ["ls-tree", "-r", "--name-only", "-z", rev]).split("\0").filter(Boolean);
}

/** @returns {Buffer} */
export function readFile(repo, rev, file) {
  return git(repo.dir, ["show", `${rev}:${file}`], { encoding: "buffer" });
}

/** GitHub URL shown in "view / edit on GitHub" links; branches use the branch, tags the tag. */
export function blobUrl(ref, file) {
  return `${REPO_URL}/blob/${ref}/${file}`;
}
export function treeUrl(ref, dir) {
  return `${REPO_URL}/tree/${ref}/${dir}`;
}
