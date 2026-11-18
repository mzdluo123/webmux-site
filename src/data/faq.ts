// FAQ copy. Sources (mzdluo123/webmux origin/main, checked 2026-11-03): docs/faq.md 常见问题,
// docs/usage/port-forwarding.md (v0.12.0, 2026-11-05), README.md, SECURITY.md, docs/overview.md, docs/deployment/{remote-access,windows-wsl}.md,
// docs/persistence.md, LICENSE (MIT). "No telemetry" checked by searching the Go/web sources.
import type { Lang } from "../lib/i18n";
import { localize } from "../lib/i18n";
import { PORT_FORWARD_DOC } from "./use-cases";
import { RELAY_CONSOLE_URL } from "../../site.config.mjs";

export interface FaqItem {
  /** ASCII anchor slug, stable across languages. */
  id: string;
  q: string;
  /** HTML; may contain <a> and <code>. */
  a: string;
}

const REPO = "https://github.com/mzdluo123/webmux";
const d = (path: string) => `/docs/${path}`;

function items(lang: Lang): Record<string, FaqItem> {
  const zh = lang === "zh-cn";
  const cn = zh ? "" : " (Chinese)";
  const list: FaqItem[] = zh
    ? [
        {
          id: "dev-server-preview",
          q: "在远程服务器上开发 Web 应用，怎么预览开发服务器？",
          a: `v0.12 起，WebMux 提供端口转发预览：会话里的开发服务器开始监听后，终端上方会提示端口，一键经 <code>/forward/{端口}/</code> 在浏览器打开，HMR WebSocket 照常工作，不需要新开端口或配置 SSH 端口转发。Vite、Next.js 等使用绝对路径的框架需改为“保留前缀”并设置 base（如 <code>pnpm vite --base /forward/5173/</code>）。只能转发服务器本机的端口。详见 <a href="${PORT_FORWARD_DOC}">端口转发预览</a> 与 <a href="${localize(lang, "/use-cases/")}#remote-web-dev">使用场景</a>。`,
        },
        {
          id: "edit-code",
          q: "能在浏览器里直接改代码吗？",
          a: `不能。代码面板是只读的：可以浏览文件、审阅 Git Diff、预览多种格式，并把 <code>路径:行号</code> 发给 agent，但没有编辑器，也不提供暂存、提交或推送界面。改代码交给 agent 或终端里的编辑器；需要完整浏览器编辑器时可以与 VS Code Remote 或 code-server 并用，见 <a href="${localize(lang, "/compare/")}">对比</a>。`,
        },
        {
          id: "sessions-after-restart",
          q: "重启服务后会话去哪了？",
          a: `会话、PTY 和缓冲只保存在内存中，服务重启即结束所有会话。这是有意的设计边界：WebMux 不使用数据库、不做守护进程分离，也不与 tmux 互通。只有显式登记的状态文件（仓库清单、启动配置、偏好等，见 <a href="${d("persistence/")}">持久化清单</a>）会持久保存，会话本身不会。例外是 <a href="${d("hybrid-sessions/")}">混合会话</a>：WebMux 记录它与 agent 会话的对应关系，重启后可从首页“可恢复”分组恢复，对话本身由 agent 保存。`,
        },
        {
          id: "command-not-found",
          q: "创建会话时找不到 claude / codex？",
          a: `systemd 和 launchd 不会加载你的交互 shell 配置。可在自定义启动配置中显式使用 <code>bash -ic 'exec opencode "$@"' opencode</code> 来加载 <code>~/.bashrc</code> 中的 PATH 和环境变量，或把程序目录加入服务的 <code>PATH</code>，参见 <a href="${d("deployment/services/#agent-的-path")}">agent 的 PATH</a>。`,
        },
        {
          id: "phone-access",
          q: "手机怎么访问？",
          a: `两台设备都能加入同一私网时，可用 <a href="${d("deployment/remote-access/#手机访问tailscale")}">Tailscale Serve 或 VPN 直连</a>，用防火墙限制访问接口。没有共享 VPN 时，可选默认关闭的官方 Relay：在本机“设置 → 管理官方 Relay”用获准的 GitHub 账号配对，按提示输入用户码授权，再开启“允许 Relay 公网访问”并确认风险。手机用同一账号登录<a href="${RELAY_CONSOLE_URL}">官方 Relay 控制台</a>，选择自己的在线主机，打开固定 HTTPS 入口，无需复制长期 Token。见<a href="${d("deployment/remote-access/#官方-relay")}">配对步骤</a>。`,
        },
        {
          id: "is-it-safe",
          q: "WebMux 安全吗？",
          a: `WebMux 以服务用户身份执行命令，不是沙箱，也没有多用户隔离。默认仅监听 <code>127.0.0.1:7681</code>，不要直接公开这个端口。可信 VPN 直连不需官方中转；通过 Cloudflare Tunnel 或 Tailscale Funnel 公开的 shell 要保护登录 Token。官方 Relay 则以 GitHub 所有者身份认证，需保留至少 43 字符的本机恢复 Token。Relay 终止 TLS，可接触转发内容和凭据，不是端到端加密。详见<a href="${localize(lang, "/security/")}">安全与部署建议</a>。`,
        },
        {
          id: "windows",
          q: "Windows 能用吗？",
          a: `能，但服务不原生运行在 Windows 上，而是运行在 WSL 2 发行版中。需要 Windows 10 22H2 及以上或 Windows 11，以及从 Microsoft Store 安装的 WSL 2；托盘程序负责安装 / 升级（安装版可开启自动更新）、启动、监控，并提供“允许局域网访问”开关与转发。安装托盘不需要管理员权限，仅在安装程序可选地添加防火墙规则时弹出一次管理员确认；<code>webmux.exe</code> 可在 PowerShell / Windows Terminal 中 <code>run</code> / <code>attach</code> WSL 里的会话。详见 <a href="${d("deployment/windows-wsl/")}">Windows（WSL）部署</a>。`,
        },
        {
          id: "license-and-cost",
          q: "收费吗？用什么许可？",
          a: `WebMux 是 MIT 许可的开源项目，不收费，源码在 <a href="${REPO}">GitHub</a>。它不代管模型密钥：Claude Code、Codex 等 CLI 使用服务用户自己的账号、订阅与配置，相关费用和条款由各 agent 厂商决定。`,
        },
        {
          id: "install",
          q: "怎么安装？",
          a: `Linux / macOS 可从 GitHub Releases 获取 <code>install.sh</code>：它识别系统与架构，使用 minisign 或支持 Ed25519 的 OpenSSL（可用时）验签发布清单，再核对二进制的 SHA-256。两种验签工具都不可用时，默认只信任从官方 GitHub 直取的清单。默认装到 <code>~/.local/bin/webmux</code>，不需要 root。安装命令、deb / rpm、Windows 安装程序和手动验签示例见<a href="${localize(lang, "/download/")}">下载与安装</a>。`,
        },
        {
          id: "data-and-telemetry",
          q: "我的数据去哪了？有遥测吗？",
          a: `PTY 和回放缓冲在宿主内存中；项目、设置、Relay 绑定和混合会话记录等状态保存在本机，见<a href="${d("persistence/")}">持久化清单</a>。WebMux 不记录终端输入输出。按 2026-11-03 对源码的检索，未发现使用统计代码。主动开启的功能可以向外发送数据：例如 Web Push 经浏览器厂商送达，官方 Relay 的运营者可接触经它转发的内容与凭据。`,
        },
        {
          id: "multi-user",
          q: "能给多人使用吗？",
          a: `不能当作多用户系统使用。直连使用共享 Token；官方 Relay 的 GitHub 登录只用于识别宿主所有者，不提供团队账号或权限隔离。命令都以服务用户身份运行。需要隔离时，请为每个人使用独立的系统用户和 WebMux 实例。`,
        },
        {
          id: "two-devices",
          q: "两台设备同时打开同一会话，布局互相影响？",
          a: `两端共享同一个 PTY，但只有控制端决定终端尺寸：先打开的设备控制，后打开的设备观察（按原网格显示、可平移）。在观察端输入或点击“接管控制”即可切换。`,
        },
        {
          id: "clipboard",
          q: "粘贴 / 复制没有权限？",
          a: `HTTP 不是浏览器安全上下文，Clipboard API 不可用。WebMux 会回退到文本框手动粘贴 / 复制；也可以通过 <code>tailscale serve</code> 或 Caddy 提供 HTTPS，见 <a href="${d("deployment/remote-access/#https")}">HTTPS</a>。`,
        },
        {
          id: "garbled-first-line",
          q: "重连后首行有少量乱码？",
          a: `缓冲按字节环形存储，最旧的数据可能从多字节字符或转义序列中间开始，属于设计允许范围。`,
        },
        {
          id: "forgot-token",
          q: "忘了 Token，或者浏览器提示需要登录？",
          a: `直连时，首次启动生成的 Token 在本机配置文件中，可用 <code>webmux status --json --reveal-token</code> 查看；不要把它分享给他人。若是官方 Relay 会话过期，请回到<a href="${RELAY_CONSOLE_URL}">控制台</a>用配对时的 GitHub 账号重新登录，不要在中转登录页输入本机恢复 Token。详见<a href="${d("deployment/configuration/")}">配置</a>。`,
        },
        {
          id: "sessions-after-upgrade",
          q: "升级后会话都没了？",
          a: `升级需要重启服务，重启会结束所有终端会话。升级前先让 agent 告一段落，见 <a href="${d("deployment/install-and-upgrade/#升级")}">升级</a>。`,
        },
      ]
    : [
        {
          id: "dev-server-preview",
          q: "How do I preview a dev server when building web apps on a remote server?",
          a: `Since v0.12, WebMux has port forwarding: when a dev server in a session starts listening, a banner offers the port and one click opens it at <code>/forward/{port}/</code>, with HMR WebSockets working and no new port or SSH tunnel to set up. Frameworks with absolute paths such as Vite or Next.js need “keep prefix” and a base (for example <code>pnpm vite --base /forward/5173/</code>). Only ports on the server itself can be forwarded. See <a href="${PORT_FORWARD_DOC}">port forwarding</a>${cn} and the <a href="${localize(lang, "/use-cases/")}#remote-web-dev">use case</a>.`,
        },
        {
          id: "edit-code",
          q: "Can I edit code in the browser?",
          a: `No. The code panel is read-only: browse files, review Git diffs, preview many formats and send <code>path:line</code> to the agent, but there is no editor and no stage, commit or push UI. Leave edits to the agent or an editor in the terminal, or pair WebMux with VS Code Remote or code-server for a full browser editor; see the <a href="${localize(lang, "/compare/")}">comparison</a>.`,
        },
        {
          id: "sessions-after-restart",
          q: "Where do my sessions go after the service restarts?",
          a: `Sessions, PTYs and buffers live only in memory, so restarting the service ends every session. This is a deliberate boundary: WebMux uses no database, does not detach into a separate daemon and does not interoperate with tmux. Only explicitly registered state files (repository list, launch configurations, preferences and so on; see the <a href="${d("persistence/")}">persistence list</a>${cn}) survive a restart. The exception is <a href="${d("hybrid-sessions/")}">hybrid sessions</a>${cn}: WebMux records which agent session they map to, so after a restart you can resume them from the “Resumable” group on the home screen; the agent itself keeps the conversation.`,
        },
        {
          id: "command-not-found",
          q: "Creating a session says claude / codex is not found?",
          a: `systemd and launchd do not load your interactive shell configuration. In a custom launch configuration, use <code>bash -ic 'exec opencode "$@"' opencode</code> to pick up the PATH and environment from <code>~/.bashrc</code>, or add the program's directory to the service <code>PATH</code>. See <a href="${d("deployment/services/#agent-的-path")}">agent PATH</a>${cn}.`,
        },
        {
          id: "phone-access",
          q: "How do I open it from my phone?",
          a: `If both devices can join the same private network, use <a href="${d("deployment/remote-access/#手机访问tailscale")}">Tailscale Serve or a direct VPN connection</a>${cn} and restrict the port to the VPN interface. Without a shared VPN, the official Relay is an opt-in alternative. Open the Relay manager in WebMux settings on the host, pair with an eligible GitHub account using the displayed code, then enable public Relay access and confirm the risk. On your phone, sign in to the <a href="${RELAY_CONSOLE_URL}">official Relay console</a> with that same account and select your online host to open its fixed HTTPS address. There is no long-lived token to copy to your phone. See the <a href="${d("deployment/remote-access/#官方-relay")}">pairing guide</a>${cn}.`,
        },
        {
          id: "is-it-safe",
          q: "Is WebMux safe?",
          a: `WebMux runs commands as the service user, without sandboxing or multi-user isolation. By default it listens only on <code>127.0.0.1:7681</code>; do not publish that port. A trusted VPN does not require the official Relay. A shell published through Cloudflare Tunnel or Tailscale Funnel depends on keeping the login token secret. The optional official Relay authenticates the owner through GitHub and requires a local recovery token of at least 43 characters. It terminates TLS and can access forwarded content and credentials; it is not end-to-end encrypted. See <a href="${localize(lang, "/security/")}">security and deployment</a>.`,
        },
        {
          id: "windows",
          q: "Does it work on Windows?",
          a: `Yes, but the service does not run natively on Windows: it runs inside a WSL 2 distribution. You need Windows 10 22H2 or later or Windows 11, plus WSL 2 from the Microsoft Store. The tray app installs and upgrades WebMux (the installed tray can auto-update), starts and monitors it, and offers an “allow LAN access” switch with forwarding. Installing the tray needs no administrator rights; the only prompt is one optional administrator confirmation when the installer adds a firewall rule. <code>webmux.exe</code> can <code>run</code> / <code>attach</code> WSL sessions from PowerShell or Windows Terminal. See <a href="${d("deployment/windows-wsl/")}">Windows (WSL) deployment</a>${cn}.`,
        },
        {
          id: "license-and-cost",
          q: "Does it cost anything? What is the license?",
          a: `WebMux is open source under the MIT license and free of charge; the source is on <a href="${REPO}">GitHub</a>. It does not manage model keys: Claude Code, Codex and the other CLIs use the service user's own accounts, subscriptions and configuration, so any costs and terms are set by the agent vendors.`,
        },
        {
          id: "install",
          q: "How do I install it?",
          a: `On Linux / macOS, get <code>install.sh</code> from GitHub Releases. It detects your platform, verifies the signed release manifest with minisign or Ed25519-capable OpenSSL when available, then checks the binary’s SHA-256. Without either verifier, by default only a manifest fetched directly from official GitHub is trusted. Installation defaults to <code>~/.local/bin/webmux</code> without root. See <a href="${localize(lang, "/download/")}">download and install</a> for commands, deb / rpm packages, Windows installers and a manual signature check.`,
        },
        {
          id: "data-and-telemetry",
          q: "Where does my data go? Is there telemetry?",
          a: `PTYs and replay buffers live in host memory. State such as projects, settings, Relay bindings and hybrid-session records stays on the host; see the <a href="${d("persistence/")}">persistence list</a>${cn}. WebMux does not log terminal input or output. A source review on 2026-11-03 found no usage-analytics code. Features you enable can send data externally: for example, Web Push uses browser vendors’ services, and the official Relay operator can access content and credentials forwarded through it.`,
        },
        {
          id: "multi-user",
          q: "Can several people share one instance?",
          a: `Not as a multi-user system. Direct access uses a shared token; official Relay uses GitHub to identify the host owner, not to provide team accounts or permission isolation. Every command runs as the service user. For isolation, give each person their own system user and WebMux instance.`,
        },
        {
          id: "two-devices",
          q: "Two devices open the same session and the layout keeps changing?",
          a: `Both share one PTY, but only the controlling device sets the terminal size: the first device to open the session controls it, later ones observe (showing the original grid, pannable). Type in the observer or click “Take control” to switch.`,
        },
        {
          id: "clipboard",
          q: "Paste / copy is not permitted?",
          a: `Plain HTTP is not a secure browser context, so the Clipboard API is unavailable. WebMux falls back to a text box for manual paste and copy; you can also serve HTTPS through <code>tailscale serve</code> or Caddy. See <a href="${d("deployment/remote-access/#https")}">HTTPS</a>${cn}.`,
        },
        {
          id: "garbled-first-line",
          q: "A few garbled characters on the first line after reconnecting?",
          a: `The buffer is a byte ring, so the oldest data can start in the middle of a multi-byte character or escape sequence. This is within the design's tolerance.`,
        },
        {
          id: "forgot-token",
          q: "Forgot the token, or the browser asks you to log in?",
          a: `For direct access, the token generated on first start is stored in your local configuration. Show it with <code>webmux status --json --reveal-token</code> and do not share it. If an official Relay session expires, sign back in to the <a href="${RELAY_CONSOLE_URL}">console</a> with the GitHub account used to pair the host; do not enter your local recovery token on the Relay sign-in page. See <a href="${d("deployment/configuration/")}">configuration</a>${cn}.`,
        },
        {
          id: "sessions-after-upgrade",
          q: "All sessions disappeared after an upgrade?",
          a: `Upgrading restarts the service, and a restart ends every terminal session. Let your agents reach a stopping point first; see <a href="${d("deployment/install-and-upgrade/#升级")}">upgrade</a>${cn}.`,
        },
      ];
  return Object.fromEntries(list.map((i) => [i.id, i]));
}

const ORDER = [
  "install",
  "phone-access",
  "dev-server-preview",
  "edit-code",
  "is-it-safe",
  "windows",
  "license-and-cost",
  "data-and-telemetry",
  "multi-user",
  "sessions-after-restart",
  "command-not-found",
  "two-devices",
  "clipboard",
  "garbled-first-line",
  "forgot-token",
  "sessions-after-upgrade",
];
const HOME = [
  "sessions-after-restart",
  "dev-server-preview",
  "phone-access",
  "is-it-safe",
  "windows",
  "license-and-cost",
];

export function allFaq(lang: Lang): FaqItem[] {
  const all = items(lang);
  return ORDER.map((id) => all[id]);
}

const ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
};
const plain = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&(lt|gt|amp|quot|#39);/g, (m) => ENTITIES[m]);

/** FAQPage JSON-LD whose text equals the visible text. */
export function faqJsonLd(list: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((i) => ({
      "@type": "Question",
      name: plain(i.q),
      acceptedAnswer: { "@type": "Answer", text: plain(i.a) },
    })),
  };
}

export function homeFaq(lang: Lang) {
  const all = items(lang);
  const list = HOME.map((id) => all[id]);
  return { items: list, jsonLd: faqJsonLd(list) };
}
