// Factual comparison (strategy.md#差异化与对比规则). WebMux facts: README.md, docs/overview.md,
// docs/usage.md, docs/hybrid-sessions.md. Third-party cells only claim what the cited official
// pages state; anything else is "unverified". Checked 2026-11-05.
// WebMux cells marked "开发版 / dev builds" describe features on main and the dev channel that
// have not shipped in a stable release yet (docs/usage/port-forwarding.md).
import type { Lang } from "../lib/i18n";
import { serverSizeMB } from "../lib/releases";

const SIZE = serverSizeMB() ?? 20;

export const CHECKED = "2026-11-05";

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
  {
    id: "ports",
    zh: "经同一地址访问开发服务器端口",
    en: "Reach dev-server ports through the same address",
    summary: false,
  },
  {
    id: "selfhost",
    zh: "自托管，不经第三方中转",
    en: "Self-hosted, no third-party relay",
    summary: true,
  },
  { id: "anyagent", zh: "适用任意 CLI agent", en: "Works with any CLI agent", summary: false },
  { id: "license", zh: "开源许可", en: "Open-source license", summary: false },
];

export type GroupId = "terminal" | "agent" | "editor";

export const GROUPS: { id: GroupId; zh: string; en: string; leadZh: string; leadEn: string }[] = [
  {
    id: "terminal",
    zh: "终端与远程 shell",
    en: "Terminals and remote shells",
    leadZh: "让 shell 在远端持续运行、在浏览器或手机上接入的通用方案。",
    leadEn:
      "General tools that keep a shell running remotely and reach it from a browser or phone.",
  },
  {
    id: "agent",
    zh: "遥控 coding agent",
    en: "Remote control for coding agents",
    leadZh: "专为离开电脑后继续指挥 agent 而做的 App、厂商功能与云端服务。",
    leadEn:
      "Apps, vendor features and cloud services built for steering agents away from your desk.",
  },
  {
    id: "editor",
    zh: "浏览器 / 远程编辑器",
    en: "Browser and remote editors",
    leadZh: "以完整编辑器为中心的远程开发方案。",
    leadEn: "Remote development built around a full editor.",
  },
];

export interface Tool {
  id: string;
  name: string;
  /** Shown in the home-page summary. */
  summary: boolean;
  /** One-line category shown under the name, e.g. "terminal multiplexer". */
  kind: { zh: string; en: string };
  /** Table the tool appears in on /compare/ (WebMux appears in every table). */
  group?: GroupId;
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
  kind: { zh: "自托管 Web 终端，为 CLI agent 设计", en: "Self-hosted web terminal for CLI agents" },
  summary: true,
  sources: [
    { label: "WebMux README", url: "https://github.com/mzdluo123/webmux#readme" },
    {
      label: "端口转发预览（开发版）",
      url: "https://github.com/mzdluo123/webmux/blob/main/docs/usage/port-forwarding.md",
    },
  ],
  cells: {
    persist: {
      v: "yes",
      zh: "PTY 由服务端持有；服务重启会结束终端会话",
      en: "Server holds the PTY; a service restart ends terminal sessions",
    },
    replay: {
      v: "yes",
      zh: "短暂断线只续接缺失部分，否则回放缓冲",
      en: "Short drops resume the gap; otherwise the buffer replays",
    },
    mobile: {
      v: "yes",
      zh: "软键栏、触摸滚动、双指缩放、锁定终端尺寸",
      en: "Soft-key bar, touch scrolling, pinch zoom, locked terminal size",
    },
    alerts: {
      v: "yes",
      zh: "取决于 CLI 发出的状态信号；推送需 HTTPS",
      en: "Depends on the CLI's status signals; push needs HTTPS",
    },
    chat: {
      v: "partial",
      zh: "七款：Claude Code、Codex CLI、OpenCode、omp、Antigravity、Qoder、QoderCN",
      en: "Seven: Claude Code, Codex CLI, OpenCode, omp, Antigravity, Qoder, QoderCN",
    },
    light: {
      v: "yes",
      zh: `约 ${SIZE} MB 静态二进制，无需 tmux`,
      en: `~${SIZE} MB static binary, no tmux needed`,
    },
    code: {
      v: "yes",
      zh: "资源管理器、Git Diff、多格式预览、worktree；只读，不含编辑器",
      en: "File explorer, Git diff, previews, worktrees; read-only, no editor",
    },
    ports: {
      v: "yes",
      zh: "开发版：/forward/{端口}/ 转发本机端口，自动检测监听，HMR 可用",
      en: "Dev builds: /forward/{port}/ for local ports, auto-detected, HMR works",
    },
    selfhost: {
      v: "yes",
      zh: "服务运行在你的机器上；Web Push 经浏览器厂商推送服务",
      en: "Runs on your machine; Web Push goes via browser push services",
    },
    anyagent: {
      v: "yes",
      zh: "任意 CLI 可在终端运行；提醒依赖其信号，聊天视图限上述七款",
      en: "Any CLI runs in the terminal; alerts depend on its signals, chat view limited to seven",
    },
    license: { v: "yes", zh: "MIT", en: "MIT" },
  },
};

export const TOOLS: Tool[] = [
  {
    id: "ssh-tmux",
    group: "terminal",
    name: "SSH + tmux",
    kind: { zh: "终端复用器", en: "Terminal multiplexer" },
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
      ports: U(
        "官方页面未说明；SSH 端口转发需另行配置",
        "Not stated on these pages; SSH port forwarding is set up separately",
      ),
      selfhost: { v: "yes", zh: "直连你自己的服务器", en: "Direct to your own server" },
      anyagent: { v: "yes", zh: "任意终端程序", en: "Any terminal program" },
      license: { v: "yes", zh: "tmux 为 ISC 许可", en: "tmux is ISC-licensed" },
    },
  },
  {
    id: "ttyd",
    group: "terminal",
    name: "ttyd / gotty",
    kind: { zh: "把命令分享到浏览器", en: "Share a command in the browser" },
    summary: true,
    sources: [
      { label: "ttyd README", url: "https://github.com/tsl0922/ttyd" },
      { label: "gotty README", url: "https://github.com/sorenisanerd/gotty" },
    ],
    cells: {
      persist: {
        v: "unverified",
        zh: "gotty 通常每个新客户端启动新进程，官方建议配合 tmux；两者 --once 断开即退出",
        en: "gotty normally starts a process per client and suggests tmux; both have --once (exit on disconnect)",
      },
      replay: U(),
      mobile: U(),
      alerts: U(),
      chat: { v: "no", zh: "纯终端", en: "Terminal only" },
      light: {
        v: "yes",
        zh: "单个可执行文件；默认只读，需 ttyd -W / gotty -w 才能输入",
        en: "Single executable; read-only by default, ttyd -W / gotty -w to allow input",
      },
      code: { v: "no", zh: "只共享终端", en: "Shares a terminal only" },
      ports: U(),
      selfhost: { v: "yes", zh: "运行在你自己的机器上", en: "Runs on your own machine" },
      anyagent: { v: "yes", zh: "可运行任意命令", en: "Runs any command" },
      license: { v: "yes", zh: "均为 MIT", en: "Both MIT" },
    },
  },
  {
    id: "mosh",
    group: "terminal",
    name: "mosh",
    kind: { zh: "适应漫游的远程 shell", en: "Roaming-friendly remote shell" },
    summary: false,
    sources: [{ label: "mosh.org", url: "https://mosh.org/" }],
    cells: {
      persist: {
        v: "partial",
        zh: "官方说明支持漫游与休眠后恢复连接",
        en: "Officially survives roaming and laptop sleep",
      },
      replay: {
        v: "partial",
        zh: "只同步可见屏幕，回滚历史可能不全",
        en: "Syncs only the visible screen; scrollback may be incomplete",
      },
      mobile: {
        v: "partial",
        zh: "官方列出 Android、iOS 客户端（JuiceSSH、Termux、Blink）；适配取决于客户端",
        en: "Lists Android / iOS clients (JuiceSSH, Termux, Blink); depends on the client",
      },
      alerts: U(),
      chat: { v: "no", zh: "纯终端", en: "Terminal only" },
      light: {
        v: "partial",
        zh: "无特权代码、无守护进程；需 SSH 与 UDP 端口",
        en: "No privileged code or daemon; needs SSH and UDP ports",
      },
      code: { v: "no", zh: "纯终端", en: "Terminal only" },
      ports: U(),
      selfhost: { v: "yes", zh: "直连你自己的服务器", en: "Direct to your own server" },
      anyagent: { v: "yes", zh: "任意终端程序", en: "Any terminal program" },
      license: { v: "yes", zh: "GPL-3.0", en: "GPL-3.0" },
    },
  },
  {
    id: "zellij-web",
    group: "terminal",
    name: "Zellij web client",
    kind: { zh: "终端复用器自带的 Web 客户端", en: "A multiplexer's built-in web client" },
    summary: false,
    sources: [
      { label: "Zellij: Web client", url: "https://zellij.dev/documentation/web-client.html" },
      { label: "Zellij releases", url: "https://github.com/zellij-org/zellij/releases" },
    ],
    cells: {
      persist: {
        v: "yes",
        zh: "会话 URL 可附着已有会话，或复活已退出的会话",
        en: "Session URL attaches to a running session or resurrects an exited one",
      },
      replay: U(),
      mobile: {
        v: "yes",
        zh: "v0.45.0 起自动切换移动界面：触摸滚动、屏幕键盘",
        en: "Since v0.45.0, a mobile UI with touch scrolling and on-screen keys",
      },
      alerts: U(),
      chat: { v: "no", zh: "纯终端", en: "Terminal only" },
      light: {
        v: "partial",
        zh: "预编译二进制；监听非 127.0.0.1 时必须配置 HTTPS 证书",
        en: "Prebuilt binary; HTTPS certificate required when not on 127.0.0.1",
      },
      code: { v: "no", zh: "纯终端", en: "Terminal only" },
      ports: U(),
      selfhost: {
        v: "yes",
        zh: "内置 Web 服务器，登录令牌哈希存于本地",
        en: "Built-in web server; login tokens hashed locally",
      },
      anyagent: { v: "yes", zh: "任意终端程序", en: "Any terminal program" },
      license: { v: "yes", zh: "MIT", en: "MIT" },
    },
  },
  {
    id: "sshx",
    group: "terminal",
    name: "sshx",
    kind: { zh: "协作式终端分享", en: "Collaborative terminal sharing" },
    summary: false,
    sources: [{ label: "sshx README", url: "https://github.com/ekzhang/sshx" }],
    cells: {
      persist: U(),
      replay: U(),
      mobile: U(),
      alerts: U(),
      chat: { v: "no", zh: "纯终端（多人协作）", en: "Terminal only (collaborative)" },
      light: {
        v: "partial",
        zh: "单二进制，但依赖 sshx.io 托管服务器",
        en: "Single binary, but depends on the hosted sshx.io servers",
      },
      code: { v: "no", zh: "只共享终端", en: "Shares a terminal only" },
      ports: U(),
      selfhost: {
        v: "no",
        zh: "官方暂不支持自托管；端到端加密",
        en: "Self-hosting not supported; end-to-end encrypted",
      },
      anyagent: { v: "yes", zh: "任意终端程序", en: "Any terminal program" },
      license: { v: "yes", zh: "MIT", en: "MIT" },
    },
  },
  {
    id: "happy",
    group: "agent",
    name: "Happy",
    kind: { zh: "手机 App 遥控 agent", en: "Phone app for remote agents" },
    summary: true,
    sources: [
      { label: "Happy README", url: "https://github.com/slopus/happy" },
      { label: "Happy: How it works", url: "https://happy.engineering/docs/how-it-works/" },
      { label: "Happy: Features", url: "https://happy.engineering/docs/features/" },
      { label: "Happy: Self-hosting", url: "https://happy.engineering/docs/guides/self-hosting/" },
    ],
    cells: {
      persist: {
        v: "yes",
        zh: "电脑上的 CLI 持续运行并同步；关闭 CLI 即结束",
        en: "The CLI on your computer keeps running and syncing; closing it ends the session",
      },
      replay: {
        v: "partial",
        zh: "手机恢复联网后补收错过的消息（不是终端输出）",
        en: "Phone catches up on missed messages when back online (not terminal output)",
      },
      mobile: U(
        "官方描述的是原生手机 App，未说明终端 TUI 适配",
        "Docs describe a native phone app; terminal TUI support not stated",
      ),
      alerts: {
        v: "yes",
        zh: "完成、权限请求、需澄清时推送；手机上可允许 / 拒绝",
        en: "Pushes on completion, permission requests and questions; Allow / Deny on the phone",
      },
      chat: {
        v: "partial",
        zh: "手机 App 显示对话；未说明与 TUI 互切",
        en: "Phone app shows the conversation; TUI switching not stated",
      },
      light: {
        v: "partial",
        zh: "npm 全局安装 CLI + 手机 App；默认经 Happy 公共中转",
        en: "Global npm CLI plus phone app; uses Happy's public relay by default",
      },
      code: U(),
      ports: U(),
      selfhost: {
        v: "partial",
        zh: "中转可用 Docker 自托管，内容端到端加密；推送经 Expo",
        en: "Relay self-hostable with Docker, end-to-end encrypted; pushes go via Expo",
      },
      anyagent: {
        v: "partial",
        zh: "Claude Code、Codex、OpenCode、Gemini 等及 ACP agent",
        en: "Claude Code, Codex, OpenCode, Gemini and ACP agents",
      },
      license: { v: "yes", zh: "MIT", en: "MIT" },
    },
  },
  {
    id: "claude-rc",
    group: "agent",
    name: "Claude Code Remote Control",
    kind: { zh: "厂商自带的远程接续", en: "Vendor's built-in remote handoff" },
    summary: true,
    sources: [
      {
        label: "Claude Code: Remote Control",
        url: "https://code.claude.com/docs/en/remote-control",
      },
    ],
    cells: {
      persist: {
        v: "yes",
        zh: "会话在本机运行，本机 claude 进程须保持运行；远程主机上官方建议配合 tmux",
        en: "Runs locally; the local claude process must stay up (docs suggest tmux on remote hosts)",
      },
      replay: {
        v: "partial",
        zh: "对话记录存于 Anthropic 服务器，断网重连后同步对话",
        en: "Transcript stored on Anthropic servers; the conversation resyncs after drops",
      },
      mobile: {
        v: "no",
        zh: "手机上是 Claude App 的对话界面，不是终端",
        en: "Phone uses the Claude app's conversation UI, not a terminal",
      },
      alerts: {
        v: "yes",
        zh: "开启后推送权限提示与提问",
        en: "Pushes permission prompts and questions when enabled",
      },
      chat: {
        v: "yes",
        zh: "终端 TUI 与 claude.ai/code、Claude App 同步同一对话",
        en: "Terminal TUI, claude.ai/code and the Claude app share one conversation",
      },
      light: {
        v: "partial",
        zh: "Claude Code 内置；需付费订阅，不支持 API key",
        en: "Built into Claude Code; needs a paid plan, API keys not supported",
      },
      code: U(),
      ports: U(),
      selfhost: {
        v: "partial",
        zh: "执行与文件留在本机；消息经 Anthropic 服务器中转",
        en: "Execution and files stay local; messages are relayed by Anthropic",
      },
      anyagent: { v: "no", zh: "仅 Claude Code", en: "Claude Code only" },
      license: { v: "no", zh: "专有许可", en: "Proprietary" },
    },
  },
  {
    id: "codex-cloud",
    group: "agent",
    name: "OpenAI Codex cloud",
    kind: { zh: "云端托管 agent", en: "Hosted cloud agent" },
    summary: false,
    sources: [
      { label: "Codex cloud docs", url: "https://learn.chatgpt.com/docs/cloud" },
      {
        label: "Using Codex with your ChatGPT plan",
        url: "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan",
      },
    ],
    cells: {
      persist: {
        v: "yes",
        zh: "任务在云端工作区运行，电脑休眠也继续",
        en: "Tasks run in a cloud workspace, even while your computer sleeps",
      },
      replay: U(),
      mobile: {
        v: "no",
        zh: "ChatGPT 手机 App 可发起与查看任务，不提供终端",
        en: "ChatGPT mobile app starts and checks tasks; no terminal",
      },
      alerts: U(),
      chat: {
        v: "no",
        zh: "云端任务为对话界面，没有可切换的 TUI",
        en: "Cloud tasks are chat-style; no TUI to switch to",
      },
      light: {
        v: "no",
        zh: "托管服务；需符合条件的 ChatGPT 套餐",
        en: "Hosted service; needs an eligible ChatGPT plan",
      },
      code: {
        v: "partial",
        zh: "查看改动、提交或开 PR；代码不在你的机器上",
        en: "Inspect changes, commit or open a PR; code is not on your machine",
      },
      ports: U(),
      selfhost: { v: "no", zh: "代码在云端运行", en: "Code runs in the cloud" },
      anyagent: { v: "no", zh: "仅 Codex", en: "Codex only" },
      license: {
        v: "partial",
        zh: "Codex CLI 为 Apache-2.0；云端服务未说明",
        en: "Codex CLI is Apache-2.0; the cloud service is not stated",
      },
    },
  },
  {
    id: "vscode-tunnels",
    group: "editor",
    name: "VS Code Remote Tunnels",
    kind: { zh: "远程完整编辑器", en: "Full remote editor" },
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
      ports: U(
        "本页未说明，端口转发另见 VS Code 文档",
        "Not on this page; see VS Code's port forwarding docs",
      ),
      selfhost: {
        v: "no",
        zh: "经 Microsoft dev tunnels 服务中转",
        en: "Relayed through the Microsoft dev tunnels service",
      },
      anyagent: U(),
      license: U(),
    },
  },
  {
    id: "code-server",
    group: "editor",
    name: "code-server",
    kind: { zh: "浏览器中的 VS Code", en: "VS Code in the browser" },
    summary: false,
    sources: [
      { label: "code-server docs", url: "https://coder.com/docs/code-server" },
      {
        label: "code-server: Accessing web services",
        url: "https://coder.com/docs/code-server/guide#accessing-web-services",
      },
    ],
    cells: {
      persist: U(),
      replay: U(),
      mobile: U(),
      alerts: U(),
      chat: U(),
      light: U(
        "官方要求 Linux、WebSockets、1 GB 内存、2 vCPU；未说明是否单二进制",
        "Docs require Linux, WebSockets, 1 GB RAM, 2 vCPUs; single binary not stated",
      ),
      code: { v: "yes", zh: "浏览器中的 VS Code", en: "VS Code in the browser" },
      ports: {
        v: "yes",
        zh: "/proxy/{端口}/ 或 /absproxy/，也可按子域名",
        en: "/proxy/{port}/ or /absproxy/, or per-port subdomains",
      },
      selfhost: { v: "yes", zh: "部署在你自己的机器上", en: "Deployed on your own machine" },
      anyagent: U(),
      license: { v: "yes", zh: "MIT", en: "MIT" },
    },
  },
];

export const t = (lang: Lang, o: { zh: string; en: string }) => (lang === "zh-cn" ? o.zh : o.en);
