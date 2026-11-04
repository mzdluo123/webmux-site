// Preset CLI agents, from mzdluo123/webmux docs/cli-agents.md (commands checked by upstream
// on 2026-10-31) and docs/hybrid-sessions.md. Icons: LobeHub monochrome SVGs (MIT), synced.
export interface Agent {
  slug: string;
  name: string;
  command: string;
  icon: string;
  /** Preset initial arguments; null when the preset adds none. */
  args: string | null;
  /** WebMux hybrid session (TUI ↔ chat) support. */
  hybrid: boolean;
  /** Third-party ACP connector required for the chat side. */
  connector?: string;
  docsUrl: string;
}

export const AGENTS: Agent[] = [
  {
    slug: "claude-code",
    name: "Claude Code",
    command: "claude",
    icon: "claudecode",
    args: "--dangerously-skip-permissions",
    hybrid: true,
    connector: "claude-agent-acp",
    docsUrl: "https://code.claude.com/docs/en/overview",
  },
  {
    slug: "codex",
    name: "Codex CLI",
    command: "codex",
    icon: "codex",
    args: "--dangerously-bypass-approvals-and-sandbox",
    hybrid: true,
    connector: "codex-acp",
    docsUrl: "https://developers.openai.com/codex/cli/",
  },
  {
    slug: "antigravity-cli",
    name: "Antigravity CLI",
    command: "agy",
    icon: "antigravity",
    args: "--dangerously-skip-permissions",
    hybrid: true,
    docsUrl: "https://antigravity.google/docs",
  },
  {
    slug: "cursor-cli",
    name: "Cursor CLI",
    command: "agent",
    icon: "cursor",
    args: null,
    hybrid: false,
    docsUrl: "https://cursor.com/docs/cli/overview",
  },
  {
    slug: "github-copilot-cli",
    name: "GitHub Copilot CLI",
    command: "copilot",
    icon: "githubcopilot",
    args: null,
    hybrid: false,
    docsUrl: "https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview",
  },
  {
    slug: "opencode",
    name: "OpenCode",
    command: "opencode",
    icon: "opencode",
    args: "--auto",
    hybrid: true,
    docsUrl: "https://opencode.ai/docs/",
  },
  {
    slug: "qwen-code",
    name: "Qwen Code",
    command: "qwen",
    icon: "qwen",
    args: null,
    hybrid: false,
    docsUrl: "https://github.com/QwenLM/qwen-code",
  },
  {
    slug: "kimi-code-cli",
    name: "Kimi Code CLI",
    command: "kimi",
    icon: "kimi",
    args: null,
    hybrid: false,
    docsUrl: "https://github.com/MoonshotAI/kimi-code",
  },
  {
    slug: "codebuddy-code",
    name: "CodeBuddy Code",
    command: "codebuddy",
    icon: "codebuddy",
    args: null,
    hybrid: false,
    docsUrl: "https://www.codebuddy.ai/docs/cli/quickstart",
  },
  {
    slug: "qoder",
    name: "Qoder",
    command: "qoder",
    icon: "qoder",
    args: "--dangerously-skip-permissions",
    hybrid: true,
    docsUrl: "https://github.com/qoder-ai/qodercli",
  },
  {
    slug: "qodercn",
    name: "QoderCN",
    command: "qodercn",
    icon: "qoder",
    args: "--dangerously-skip-permissions",
    hybrid: true,
    docsUrl: "https://qoder.cn",
  },
];

const icons = import.meta.glob<string>("../assets/agents/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

/** Inline monochrome SVG markup for an agent icon, decorative (aria-hidden). */
export function agentIcon(icon: string): string {
  const svg = icons[`../assets/agents/${icon}.svg`];
  if (!svg) throw new Error(`agent icon not synced: ${icon}`);
  return svg
    .replace(/<title>[^<]*<\/title>/, "")
    .replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
}
