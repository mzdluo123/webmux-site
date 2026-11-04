// Per-agent alert sources and known limits for /agents/. Sources (origin/main, checked 2026-11-03):
// docs/cli-agents.md, docs/hybrid-sessions.md, docs/usage.md#需要你介入的提醒.
export const AGENTS_CHECKED = "2026-11-03";
/** Date upstream checked the preset commands against official docs (docs/cli-agents.md). */
export const COMMANDS_CHECKED = "2026-10-31";

interface Text {
  zh: string;
  en: string;
}

export const GENERIC_ALERTS: Text = {
  zh: "通用：取决于 CLI 是否输出 OSC 7501、Warp 结构化事件、OSC 9 / OSC 777 通知或响铃；WebMux 未单独记录该 CLI 的提醒配置",
  en: "Generic: depends on whether the CLI emits OSC 7501, Warp structured events, OSC 9 / OSC 777 notifications or BEL; WebMux documents no CLI-specific setup",
};

export const ALERTS: Record<string, Text> = {
  "claude-code": {
    zh: "2.1.295 及以上无需配置（OSC 7501）；2.1.141 至 2.1.294 需在 ~/.claude/settings.json 注册 hook",
    en: "2.1.295+ works without setup (OSC 7501); 2.1.141–2.1.294 needs a hook in ~/.claude/settings.json",
  },
  codex: {
    zh: "0.164.0 及以上无需配置（OSC 7501）；更早版本在 ~/.codex/config.toml 的 [tui] 设置 notifications = true",
    en: "0.164.0+ works without setup (OSC 7501); older versions need notifications = true under [tui] in ~/.codex/config.toml",
  },
  opencode: {
    zh: "按其源码，OpenCode 2.x 直接报告 OSC 7501，无需配置",
    en: "According to its source, OpenCode 2.x reports OSC 7501 directly; no setup needed",
  },
};

export const LIMITS: Record<string, Text[]> = {
  "claude-code": [
    {
      zh: "聊天端需要 Node.js 22 或更高版本和第三方连接器 claude-agent-acp；WebMux 不会自动安装，也不会用 npx 临时下载。",
      en: "The chat side needs Node.js 22 or later and the third-party connector claude-agent-acp; WebMux never installs it or fetches it with npx.",
    },
    {
      zh: "已验证基线为 Claude Code 2.1.316 与 claude-agent-acp 0.99.1（Linux 原生、API key / 第三方 provider）；npm 启动器、macOS 与订阅登录未在该基线中实测。",
      en: "Verified baseline: Claude Code 2.1.316 with claude-agent-acp 0.99.1 (native Linux, API key / third-party provider); the npm launcher, macOS and subscription login were not part of that baseline.",
    },
    {
      zh: "复用现有登录不等于授予其他分发形态的订阅使用权，请自行确认符合 Claude 订阅与服务条款；聊天端隐藏 /login 与 /logout。",
      en: "Reusing an existing login does not grant subscription rights for other distribution forms; confirm your use complies with Claude's subscription terms. The chat side hides /login and /logout.",
    },
    {
      zh: "不要在 WebMux 之外同时打开同一个 Claude Code 会话；外部写者可能漏检。",
      en: "Do not open the same Claude Code session outside WebMux at the same time; external writers may go undetected.",
    },
  ],
  codex: [
    {
      zh: "聊天端需要第三方适配器 codex-acp（需要 Node）：npm install -g @agentclientprotocol/codex-acp；WebMux 不会自动安装。",
      en: "The chat side needs the third-party adapter codex-acp (requires Node): npm install -g @agentclientprotocol/codex-acp; WebMux never installs it.",
    },
    {
      zh: "预置参数 --dangerously-bypass-approvals-and-sandbox 会自动批准工具调用并关闭 Codex 沙箱；需要逐次授权时在设置页移除。",
      en: "The preset --dangerously-bypass-approvals-and-sandbox auto-approves tool calls and turns off the Codex sandbox; remove it in settings if you want to approve each step.",
    },
    {
      zh: "已验证版本为 Codex CLI 0.165.0 与 codex-acp 2.3.0；Codex 拒绝打开被 Codex App、IDE 或外部终端占用的会话。",
      en: "Verified with Codex CLI 0.165.0 and codex-acp 2.3.0; Codex refuses to open a session held by the Codex app, an IDE or an outside terminal.",
    },
  ],
  "antigravity-cli": [
    {
      zh: "预置参数 --dangerously-skip-permissions 会自动批准工具调用；需要逐次授权时在设置页移除。",
      en: "The preset --dangerously-skip-permissions auto-approves tool calls; remove it in settings if you want to approve each step.",
    },
    {
      zh: "混合会话不能使用让两端看到不同会话库的参数 --project 与 --new-project；已验证版本为 Antigravity CLI 1.4.12。",
      en: "Hybrid sessions cannot use --project or --new-project, which make the two sides see different session stores; verified with Antigravity CLI 1.4.12.",
    },
    {
      zh: "旧版安装仍可能保留 Gemini CLI 配置（gemini --yolo），但 Gemini CLI 已停止为个人 Google 账号处理请求；新安装默认预置改为 Antigravity CLI。",
      en: "Older installs may still carry a Gemini CLI configuration (gemini --yolo), but Gemini CLI no longer serves personal Google accounts; fresh installs now preset Antigravity CLI instead.",
    },
  ],
  qoder: [
    {
      zh: "混合会话使用内置的 --acp 标志启动 ACP，无需额外连接器；预置参数 --dangerously-skip-permissions 会自动批准工具调用。",
      en: "Hybrid sessions start ACP with the built-in --acp flag, so no extra connector is needed; the preset --dangerously-skip-permissions auto-approves tool calls.",
    },
  ],
  qodercn: [
    {
      zh: "混合会话使用内置的 --acp 标志启动 ACP，无需额外连接器；预置参数 --dangerously-skip-permissions 会自动批准工具调用。",
      en: "Hybrid sessions start ACP with the built-in --acp flag, so no extra connector is needed; the preset --dangerously-skip-permissions auto-approves tool calls.",
    },
  ],
  "cursor-cli": [
    {
      zh: "命令是 agent，不是编辑器启动命令 cursor；旧 cursor-agent 命令也能自动匹配图标。",
      en: "The command is agent, not the editor launcher cursor; the old cursor-agent command also matches the icon.",
    },
  ],
  opencode: [
    {
      zh: "预置参数 --auto 会自动批准工具调用；混合会话中 TUI 以 --standalone 运行，看不到后台服务中其他客户端的实时事件。",
      en: "The preset --auto auto-approves tool calls; in hybrid sessions the TUI runs with --standalone and cannot see live events from other clients of a background server.",
    },
    {
      zh: "已验证版本为 OpenCode 2.1.4（2.2.0 参数相同）。",
      en: "Verified with OpenCode 2.1.4 (2.2.0 has the same arguments).",
    },
  ],
  "kimi-code-cli": [
    {
      zh: "对应当前 Kimi Code CLI，旧 Kimi CLI 用户应先按官方说明迁移。",
      en: "This is the current Kimi Code CLI; users of the old Kimi CLI should migrate first per the official docs.",
    },
  ],
};

export const TERMINAL_NOTE = {
  zh: "持久 PTY 终端：浏览器断线不会结束进程，可重新连接并回放缓冲；服务重启会结束会话。",
  en: "Persistent PTY terminal: a browser disconnect does not end the process, and you can reconnect and replay the buffer; a service restart ends the session.",
};
