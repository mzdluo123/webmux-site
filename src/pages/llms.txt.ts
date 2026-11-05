import type { APIRoute } from "astro";
import sidebar from "../data/docs-sidebar.json";
import { latest } from "../lib/releases";
import { INSTALL_URL, REPO_URL, SITE_URL } from "../../site.config.mjs";

// Plain-text product summary for LLMs and agents (seo.md#面向-ai-搜索与-agent, features.md#9-llmstxt).
// Facts mirror the home page; the version comes from build-time release data.
const abs = (p: string) => new URL(p, SITE_URL).href;

export const GET: APIRoute = () => {
  const docs = sidebar.flatMap((g) => [
    `\n### ${g.label}\n`,
    ...g.items.map((i) => `- [${i.label}](${abs(i.link)})`),
  ]);
  const body = `# WebMux

> A terminal that keeps running in the browser, built for driving CLI agents such as Claude Code and Codex remotely. 在浏览器里持续运行的终端，为远程遥控 Claude Code、Codex 等 CLI agent 而生。

Sessions live on the server; browsers, phones and local terminals attach to them. One binary for Linux and macOS (amd64 / arm64); Windows through WSL 2 with a tray app. No root, tmux, database or Node runtime needed. MIT licensed.
${latest ? `\nLatest release: ${latest.tag} (${latest.publishedAt.slice(0, 10)}), ${latest.url}\n` : ""}
## Install

\`\`\`sh
curl -fsSL ${INSTALL_URL} | sh
webmux
\`\`\`

Then open http://127.0.0.1:7681 and click “New session”. Downloads and checksums: ${abs("/download/")}

## Safety boundary

- WebMux exposes a shell to the network as the current user; it listens on 127.0.0.1:7681 only by default.
- To reach it from other devices use a trusted VPN (Tailscale / WireGuard) or Tailscale Serve, and restrict interfaces with a firewall.
- Do not expose it to the public internet unless you use the tunnel mode and accept that the token is the only barrier.
- It is not a process sandbox. Restarting the service ends all terminal sessions.
- Security model: ${abs("/security/")}

## Links

- Home: ${abs("/")} (English: ${abs("/en/")})
- Features: ${abs("/features/")}
- Use cases (remote web development, agents from your phone, parallel worktrees…): ${abs("/use-cases/")}
- Comparison with tmux, ttyd, mosh, Zellij, sshx, Happy, Claude Code Remote Control, Codex cloud, VS Code Tunnels, code-server: ${abs("/compare/")}
- FAQ: ${abs("/faq/")}
- Supported agents: ${abs("/agents/")}
- Changelog: ${abs("/changelog/")}
- Source: ${REPO_URL}
- Full docs as one file: ${abs("/llms-full.txt")}

## Documentation (Chinese)
${docs.join("\n")}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
