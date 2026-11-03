// Factual comparison (strategy.md#差异化与对比规则). WebMux facts: README.md, docs/overview.md,
// docs/usage.md, docs/hybrid-sessions.md. Third-party cells only claim what the cited official
// pages state; anything else is "unverified". Checked 2026-11-03.
import type { Lang } from "../lib/i18n";

export const CHECKED = "2026-11-03";

export type Verdict = "yes" | "no" | "partial" | "unverified";

export const VERDICT_LABEL: Record<Verdict, { zh: string; en: string }> = {
  yes: { zh: "是", en: "Yes" },
  no: { zh: "否", en: "No" },
  partial: { zh: "部分", en: "Partial" },
  unverified: { zh: "未核实", en: "Not verified" },
};

interface Cell {
  v: Verdict;
  zh: string;
  en: string;
}

export interface Dimension {
  id: string;
  zh: string;
  en: string;
  /** Shown in the home-page summary. */
  summary: boolean;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "persist",
    zh: "浏览器 / 客户端断开后会话继续",
    en: "Session survives client disconnect",
    summary: true,
  },
  {
    id: "replay",
    zh: "重连只补发缺失输出",
    en: "Reconnect resends only missing output",
    summary: false,
  },
  {
    id: "mobile",
    zh: "手机 TUI 适配（软键栏、触摸滚动）",
    en: "Mobile TUI support (soft keys, touch scroll)",
    summary: true,
  },
  {
    id: "alerts",
    zh: "agent 提问 / 授权推送到锁屏",
    en: "Agent question / permission alerts on lock screen",
    summary: true,
  },
  { id: "chat", zh: "聊天视图与 TUI 互切", en: "Switch between chat view and TUI", summary: true },
  {
    id: "light",
    zh: "单二进制，无需 root、数据库",
    en: "Single binary, no root or database",
    summary: true,
  },
  {
    id: "code",
    zh: "终端旁的代码、Diff 与 worktree",
    en: "Code, diff and worktrees beside the terminal",
    summary: false,
  },
];

export interface Tool {
  id: string;
  name: string;
  /** Shown in the home-page summary. */
  summary: boolean;
  sources: { label: string; url: string }[];
  cells: Record<string, Cell>;
}

const U = (zh = "官方文档未说明", en = "Not stated in official docs"): Cell => ({
  v: "unverified",
  zh,
  en,
});

export const WEBMUX: Tool = {
  id: "webmux",
  name: "WebMux",
  summary: true,
  sources: [{ label: "WebMux README", url: "https://github.com/mzdluo123/webmux#readme" }],
  cells: {
    persist: {
      v: "yes",
      zh: "PTY 由服务端持有；服务重启会结束会话",
      en: "Server holds the PTY; a service restart ends sessions",
    },
    replay: {
      v: "yes",
      zh: "短暂断线只续接缺失部分，否则回放缓冲",
      en: "Short drops resume the gap; otherwise the buffer replays",
    },
    mobile: {
      v: "yes",
      zh: "软键栏、触摸滚动、锁定终端尺寸",
      en: "Soft-key bar, touch scrolling, locked terminal size",
    },
    alerts: {
      v: "yes",
      zh: "取决于 CLI 发出的状态信号；推送需 HTTPS",
      en: "Depends on the CLI's status signals; push needs HTTPS",
    },
    chat: {
      v: "partial",
      zh: "Claude Code、Codex CLI、OpenCode、omp",
      en: "Claude Code, Codex CLI, OpenCode, omp",
    },
    light: {
      v: "yes",
      zh: "约 15 MB 静态二进制，无需 tmux",
      en: "~15 MB static binary, no tmux needed",
    },
    code: {
      v: "yes",
      zh: "资源管理器、Git Diff、worktree",
      en: "File explorer, Git diff, worktrees",
    },
  },
};

export const TOOLS: Tool[] = [
  {
    id: "ssh-tmux",
    name: "SSH + tmux",
    summary: true,
    sources: [
      { label: "tmux wiki", url: "https://github.com/tmux/tmux/wiki" },
      { label: "OpenSSH", url: "https://www.openssh.com/" },
    ],
    cells: {
      persist: {
        v: "yes",
        zh: "tmux 会话在 detach 后继续",
        en: "tmux sessions keep running after detach",
      },
      replay: {
        v: "no",
        zh: "重新 attach 时重绘当前屏幕",
        en: "Re-attaching redraws the current screen",
      },
      mobile: {
        v: "partial",
        zh: "取决于手机上的 SSH 客户端",
        en: "Depends on the phone's SSH client",
      },
      alerts: U(),
      chat: { v: "no", zh: "纯终端", en: "Terminal only" },
      light: {
        v: "partial",
        zh: "需要 sshd 与 tmux；tmux 无需 root",
        en: "Needs sshd and tmux; tmux needs no root",
      },
      code: { v: "no", zh: "需另开编辑器", en: "Use a separate editor" },
    },
  },
  {
    id: "ttyd",
    name: "ttyd / gotty",
    summary: true,
    sources: [
      { label: "ttyd README", url: "https://github.com/tsl0922/ttyd" },
      { label: "gotty README", url: "https://github.com/sorenisanerd/gotty" },
    ],
    cells: {
      persist: {
        v: "unverified",
        zh: "需自行配合 tmux；ttyd 有 --once 断开即退出",
        en: "Pair with tmux yourself; ttyd's --once exits on disconnect",
      },
      replay: U(),
      mobile: U(),
      alerts: U(),
      chat: { v: "no", zh: "纯终端", en: "Terminal only" },
      light: { v: "yes", zh: "单个可执行文件", en: "Single executable" },
      code: { v: "no", zh: "只共享终端", en: "Shares a terminal only" },
    },
  },
  {
    id: "mosh",
    name: "mosh",
    summary: true,
    sources: [{ label: "mosh.org", url: "https://mosh.org/" }],
    cells: {
      persist: {
        v: "partial",
        zh: "官方说明支持漫游与休眠后恢复连接",
        en: "Officially survives roaming and laptop sleep",
      },
      replay: { v: "partial", zh: "同步当前屏幕状态", en: "Synchronizes the current screen state" },
      mobile: U(),
      alerts: U(),
      chat: { v: "no", zh: "纯终端", en: "Terminal only" },
      light: {
        v: "partial",
        zh: "无特权代码、无守护进程；需 SSH 与 UDP 端口",
        en: "No privileged code or daemon; needs SSH and UDP ports",
      },
      code: { v: "no", zh: "纯终端", en: "Terminal only" },
    },
  },
  {
    id: "vscode-tunnels",
    name: "VS Code Remote Tunnels",
    summary: false,
    sources: [
      {
        label: "VS Code: Remote Tunnels",
        url: "https://code.visualstudio.com/docs/remote/tunnels",
      },
    ],
    cells: {
      persist: U(),
      replay: U(),
      mobile: U(),
      alerts: U(),
      chat: U(),
      light: {
        v: "partial",
        zh: "code CLI 单文件；需 GitHub 或 Microsoft 账号",
        en: "Single code CLI; needs a GitHub or Microsoft account",
      },
      code: { v: "yes", zh: "完整编辑器与源代码管理", en: "Full editor and source control" },
    },
  },
  {
    id: "code-server",
    name: "code-server",
    summary: false,
    sources: [{ label: "code-server docs", url: "https://coder.com/docs/code-server" }],
    cells: {
      persist: U(),
      replay: U(),
      mobile: U(),
      alerts: U(),
      chat: U(),
      light: U(),
      code: { v: "yes", zh: "浏览器中的 VS Code", en: "VS Code in the browser" },
    },
  },
];

export const t = (lang: Lang, o: { zh: string; en: string }) => (lang === "zh-cn" ? o.zh : o.en);
