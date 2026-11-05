export type Lang = "zh-cn" | "en";

export const HTML_LANG: Record<Lang, string> = { "zh-cn": "zh-CN", en: "en" };
export const OG_LOCALE: Record<Lang, string> = { "zh-cn": "zh_CN", en: "en_US" };

/** `/download/` → `/en/download/` for English; paths are locale-neutral and end with "/". */
export function localize(lang: Lang, path: string): string {
  return lang === "en" ? `/en${path}` : path;
}

/** Site chrome strings. Page copy lives next to each view. */
export const UI = {
  "zh-cn": {
    skip: "跳到主要内容",
    navLabel: "主导航",
    nav: {
      story: "它怎么工作",
      features: "功能",
      useCases: "使用场景",
      compare: "对比",
      install: "安装",
      docs: "文档",
      faq: "常见问题",
    },
    github: "GitHub",
    starsSuffix: " 个 star",
    installCta: "安装 WebMux",
    menu: "菜单",
    switchLang: "EN",
    switchLangLabel: "English version",
    theme: { label: "切换配色", light: "浅色", dark: "深色", auto: "跟随系统" },
    copy: "复制命令",
    copied: "已复制",
    copyFailed: "无法自动复制，请手动选中下方命令",
    footerLinks: { docs: "文档中心", changelog: "更新日志", security: "安全策略" },
    footerNote: "MIT 许可 · 开源项目，与 agent 厂商无隶属关系",
    footerNav: "站点地图",
    footerMore: {
      download: "下载与安装",
      features: "功能",
      useCases: "使用场景",
      compare: "对比",
      faq: "常见问题",
      windows: "Windows（WSL）",
      agents: "支持的 agent",
      licenses: "许可与隐私",
      issues: "Issues",
      vuln: "报告漏洞",
      contributing: "参与贡献",
    },
    disclaimer:
      "WebMux 是开源项目，与 Anthropic、OpenAI 等 agent 厂商无隶属关系；各商标归其所有者。",
    versionUnavailable: "版本信息暂不可用，请到 GitHub Releases 查看。",
    staleData: "版本信息来自缓存，可能不是最新版本。",
    breadcrumbHome: "首页",
    external: "（外部链接）",
  },
  en: {
    skip: "Skip to main content",
    navLabel: "Main",
    nav: {
      story: "How it works",
      features: "Features",
      useCases: "Use cases",
      compare: "Compare",
      install: "Install",
      docs: "Docs",
      faq: "FAQ",
    },
    github: "GitHub",
    starsSuffix: " stars",
    installCta: "Install WebMux",
    menu: "Menu",
    switchLang: "中文",
    switchLangLabel: "简体中文版",
    theme: { label: "Color theme", light: "Light", dark: "Dark", auto: "System" },
    copy: "Copy command",
    copied: "Copied",
    copyFailed: "Copy failed; select the command below manually",
    footerLinks: { docs: "Docs", changelog: "Changelog", security: "Security" },
    footerNote: "MIT licensed · Independent open-source project",
    footerNav: "Site map",
    footerMore: {
      download: "Download",
      features: "Features",
      useCases: "Use cases",
      compare: "Compare",
      faq: "FAQ",
      windows: "Windows (WSL)",
      agents: "Supported agents",
      licenses: "Licenses & privacy",
      issues: "Issues",
      vuln: "Report a vulnerability",
      contributing: "Contributing",
    },
    disclaimer:
      "WebMux is an independent open-source project, not affiliated with Anthropic, OpenAI or other agent vendors. Trademarks belong to their owners.",
    versionUnavailable: "Release information is unavailable. See GitHub Releases.",
    staleData: "Release information comes from a cached copy and may be out of date.",
    breadcrumbHome: "Home",
    external: " (external link)",
  },
} as const;
