// Generates public/og/<id>-<lang>.png (1200 × 630) per design.md#logo-使用: deep-green
// background, mint product icon on the left, white title and one-line subtitle on the right.
// Run manually when page titles change (`node scripts/build-og.mjs`); outputs are committed so
// CI does not depend on CJK system fonts. Needs a CJK-capable system font (PingFang SC on
// macOS, Noto Sans CJK on Linux).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const PAGES = {
  default: {
    "zh-cn": ["WebMux", "在浏览器里持续运行的终端"],
    en: ["WebMux", "A terminal that keeps running in the browser"],
  },
  home: {
    "zh-cn": ["让 agent 在服务器上一直跑，", "你在任何设备上随时接管。"],
    en: ["Your agents keep running on the server.", "Pick them up from any device."],
  },
  download: {
    "zh-cn": ["下载与安装", "一键脚本、deb / rpm、Windows 托盘"],
    en: ["Download & install", "Script, deb / rpm, Windows tray"],
  },
  faq: {
    "zh-cn": ["常见问题", "会话、访问、安全与许可"],
    en: ["FAQ", "Sessions, access, safety, licensing"],
  },
  security: {
    "zh-cn": ["安全与部署建议", "仅本机、可信 VPN、受控隧道"],
    en: ["Security & deployment", "Local only, trusted VPN, controlled tunnel"],
  },
  compare: {
    "zh-cn": ["对比", "与 tmux、ttyd、mosh 等方案的事实对比"],
    en: ["Compare", "Facts next to tmux, ttyd, mosh and more"],
  },
  changelog: {
    "zh-cn": ["更新日志", "每个 Release 的变更说明"],
    en: ["Changelog", "What changed in each release"],
  },
  windows: {
    "zh-cn": ["Windows（WSL）", "托盘、安装程序与控制台客户端"],
    en: ["Windows (WSL)", "Tray, installer and console client"],
  },
  agents: {
    "zh-cn": ["支持的 CLI agent", "九款预置启动配置与混合会话"],
    en: ["Supported CLI agents", "Nine presets and hybrid sessions"],
  },
  licenses: {
    "zh-cn": ["许可与隐私", "MIT、字体与图标许可、无 Cookie"],
    en: ["Licenses & privacy", "MIT, font and icon licenses, no cookies"],
  },
  docs: {
    "zh-cn": ["WebMux 文档", "安装、部署、使用与架构"],
    en: ["WebMux docs", "Install, deploy, use, architecture"],
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const icon = readFileSync(new URL("../public/favicon.svg", import.meta.url));
const iconPng = await sharp(icon, { density: 300 }).resize(240, 240).png().toBuffer();
const font = `Inter, "PingFang SC", "Noto Sans CJK SC", "Hiragino Sans GB", sans-serif`;

mkdirSync(new URL("../public/og/", import.meta.url), { recursive: true });
for (const [id, langs] of Object.entries(PAGES)) {
  for (const [lang, [title, sub]] of Object.entries(langs)) {
    // Fit the title into the 700px text column: CJK glyphs ≈ 1em, Latin ≈ 0.55em.
    const em = [...title].reduce(
      (w, ch) => w + (/[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 1 : 0.55),
      0,
    );
    const size = Math.min(60, Math.floor(700 / em));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#111814"/>
  <rect x="0" y="626" width="1200" height="4" fill="#85d9a5"/>
  <text x="400" y="290" font-family='${font}' font-size="${size}" font-weight="700" fill="#eef2f0">${esc(title)}</text>
  <text x="400" y="365" font-family='${font}' font-size="30" fill="#a5b4ab">${esc(sub)}</text>
  <text x="400" y="470" font-family='${font}' font-size="24" fill="#85d9a5">WebMux</text>
</svg>`;
    const png = await sharp(Buffer.from(svg))
      .composite([{ input: iconPng, left: 100, top: 195 }])
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(new URL(`../public/og/${id}-${lang}.png`, import.meta.url), png);
  }
}
console.log(`[og] ${Object.keys(PAGES).length * 2} images`);
