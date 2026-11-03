import data from "../data/releases.json";
import type { Lang } from "./i18n";

export interface Asset {
  name: string;
  size: number;
  sha256: string | null;
  url: string;
}
export interface Release {
  tag: string;
  name: string;
  publishedAt: string;
  prerelease: boolean;
  url: string;
  body: string;
  assets: Asset[];
}

export const releases = data.releases as Release[];
export const latest = data.latest as Release | undefined;
/** False when the build used the committed fallback copy (API unreachable). */
export const releaseDataFresh = data.fetched === true;
export const stars: number | undefined = data.stars;

export const version = latest?.tag.replace(/^v/, "");

export function formatDate(iso: string, lang: Lang): string {
  return new Date(iso)
    .toLocaleDateString(lang === "en" ? "en-CA" : "zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Shanghai",
    })
    .replace(/\//g, "-");
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
}

/** "约 20 MB" style figure for copy: decimal MB of the Linux amd64 server binary. */
export function serverSizeMB(): number | undefined {
  const a = latest?.assets.find((x) => x.name === "webmux-linux-amd64");
  return a ? Math.round(a.size / 1_000_000) : undefined;
}

type GroupId = "server" | "windows" | "installer" | "packages" | "scripts" | "other";

interface GroupRule {
  id: GroupId;
  match: RegExp;
}
/** Asset name patterns (stack.md#构建期数据); first match wins, unknown names go to "other". */
const RULES: GroupRule[] = [
  { id: "server", match: /^webmux-(linux|darwin)-(amd64|arm64)$/ },
  { id: "installer", match: /^webmux-setup-windows-(amd64|arm64)\.exe$/ },
  { id: "windows", match: /^webmux-(tray-)?windows-(amd64|arm64)\.exe$/ },
  { id: "packages", match: /\.(deb|rpm)$/ },
  { id: "scripts", match: /^(install\.sh|SHA256SUMS)$/ },
];

const ARCH: Record<string, { zh: string; en: string }> = {
  amd64: { zh: "x86-64", en: "x86-64" },
  x86_64: { zh: "x86-64", en: "x86-64" },
  arm64: { zh: "ARM64", en: "ARM64" },
  aarch64: { zh: "ARM64", en: "ARM64" },
};

export function describeAsset(name: string, lang: Lang): string {
  const zh = lang !== "en";
  const arch = (k: string | undefined) => (k && ARCH[k] ? ARCH[k][zh ? "zh" : "en"] : "");
  let m = name.match(/^webmux-(linux|darwin)-(amd64|arm64)$/);
  if (m) {
    if (m[1] === "linux") return `Linux · ${arch(m[2])}`;
    return `macOS · ${m[2] === "arm64" ? "Apple Silicon" : "Intel"}`;
  }
  m = name.match(/^webmux-setup-windows-(amd64|arm64)\.exe$/);
  if (m) return `${zh ? "Windows 安装程序" : "Windows installer"} · ${arch(m[1])}`;
  m = name.match(/^webmux-tray-windows-(amd64|arm64)\.exe$/);
  if (m) return `${zh ? "Windows 托盘" : "Windows tray"} · ${arch(m[1])}`;
  m = name.match(/^webmux-windows-(amd64|arm64)\.exe$/);
  if (m) return `${zh ? "控制台客户端" : "Console client"} · ${arch(m[1])}`;
  m = name.match(/_(amd64|arm64)\.deb$/);
  if (m) return `Debian / Ubuntu · ${arch(m[1])}`;
  m = name.match(/\.(x86_64|aarch64)\.rpm$/);
  if (m) return `Fedora / RHEL · ${arch(m[1])}`;
  if (name === "install.sh") return zh ? "安装脚本" : "Install script";
  if (name === "SHA256SUMS") return zh ? "全部资产的摘要" : "Checksums for all assets";
  return zh ? "其他" : "Other";
}

export const GROUP_LABELS: Record<GroupId, { zh: string; en: string }> = {
  server: { zh: "服务端", en: "Server" },
  installer: {
    zh: "Windows 安装程序（服务端运行在 WSL 2）",
    en: "Windows installer (server runs in WSL 2)",
  },
  windows: {
    zh: "Windows（托盘与控制台客户端，服务端运行在 WSL 2）",
    en: "Windows (tray and console client; server runs in WSL 2)",
  },
  packages: { zh: "Linux 安装包（deb / rpm）", en: "Linux packages (deb / rpm)" },
  scripts: { zh: "校验与脚本", en: "Checksums and script" },
  other: { zh: "其他", en: "Other" },
};

export function groupAssets(release: Release | undefined) {
  const groups = new Map<GroupId, Asset[]>();
  for (const asset of release?.assets ?? []) {
    const id = RULES.find((r) => r.match.test(asset.name))?.id ?? "other";
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id)!.push(asset);
  }
  const order: GroupId[] = ["server", "installer", "windows", "packages", "scripts", "other"];
  return order.filter((id) => groups.has(id)).map((id) => ({ id, assets: groups.get(id)! }));
}

export function findAsset(pattern: RegExp): Asset | undefined {
  return latest?.assets.find((a) => pattern.test(a.name));
}
