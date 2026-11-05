// FAQ copy. Sources (mzdluo123/webmux origin/main, checked 2026-11-03): docs/faq.md 常见问题,
// docs/usage/port-forwarding.md (main, 2026-11-05), README.md, SECURITY.md, docs/overview.md, docs/deployment/{remote-access,windows-wsl}.md,
// docs/persistence.md, LICENSE (MIT). "No telemetry" checked by searching the Go/web sources.
import type { Lang } from "../lib/i18n";
import { localize } from "../lib/i18n";
import { PORT_FORWARD_DOC } from "./use-cases";

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
          a: `开发版起，WebMux 提供端口转发预览：会话里的开发服务器开始监听后，终端上方会提示端口，一键经 <code>/forward/{端口}/</code> 在浏览器打开，HMR WebSocket 照常工作，不需要新开端口或配置 SSH 端口转发。Vite、Next.js 等使用绝对路径的框架需改为“保留前缀”并设置 base（如 <code>pnpm vite --base /forward/5173/</code>）。只能转发服务器本机的端口。该功能将随下一个正式版发布，详见 <a href="${PORT_FORWARD_DOC}">端口转发预览</a> 与 <a href="${localize(lang, "/use-cases/")}#remote-web-dev">使用场景</a>。`,
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
          a: `推荐在服务器和手机上安装 Tailscale 并加入同一网络，在配置中设置 <code>[tailscale] mode = "serve"</code>，手机打开 <code>https://&lt;节点&gt;.ts.net/</code>；也可以把监听地址设为服务器的 Tailscale / WireGuard 地址，并输入一次 token。防火墙应只允许可信 VPN 接口访问该端口。HTTPS 地址还可以安装为应用并接收锁屏推送。详见 <a href="${d("deployment/remote-access/#手机访问tailscale")}">手机访问</a>。`,
        },
        {
          id: "is-it-safe",
          q: "WebMux 安全吗？",
          a: `WebMux 以启动服务的系统用户身份执行任意命令，等同于把一个 shell 暴露到网络上；它不是进程沙箱，也不提供多用户隔离。安全依赖网络隔离：默认只监听本机 <code>127.0.0.1:7681</code>，需要远程访问时开启 Tailscale Serve，或绑定 Tailscale / WireGuard 等可信 VPN，并使用随机 token（首次启动会生成 256 位 Token）。不要直接暴露到公网；确需公网访问时只用受控隧道，此时 Token 是唯一入口屏障。详见 <a href="${localize(lang, "/security/")}">安全与部署建议</a>。`,
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
          a: `Linux / macOS 可运行 <code>curl -fsSL https://github.com/mzdluo123/webmux/releases/latest/download/install.sh | sh</code>，脚本自动识别架构并校验 SHA-256，安装到 <code>~/.local/bin/webmux</code>，不需要 root。也可以使用 deb / rpm 安装包、手动下载、Windows 安装程序或从源码构建，见 <a href="${localize(lang, "/download/")}">下载与安装</a> 与 <a href="${d("deployment/install-and-upgrade/")}">安装与升级</a>。`,
        },
        {
          id: "data-and-telemetry",
          q: "我的数据去哪了？有遥测吗？",
          a: `会话只在内存中；状态目录只保存显式登记的 JSON 文件（仓库清单、启动配置、偏好、推送、隧道与 Tailscale 设置、混合会话记录），见 <a href="${d("persistence/")}">持久化清单</a>。终端输入输出不会写入日志，配置接口不返回 token。按 2026-11-03 对源码的检索，WebMux 不包含遥测或使用统计代码；对外连接只发生在你启用的功能中，例如下载 cloudflared、隧道与手机推送。`,
        },
        {
          id: "multi-user",
          q: "能给多人使用吗？",
          a: `不能当作多用户系统使用。WebMux 只有一个共享 token，所有命令以启动服务的系统用户身份运行，不提供多用户隔离。拿到 token 的人与你拥有同样的 shell 权限；需要隔离时请为每个人使用独立的系统用户和独立的 WebMux 实例。`,
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
          a: `首次启动生成的 token 持久化在配置文件中，可用 <code>webmux status --json --reveal-token</code> 查看，或用 <code>webmux config path</code> 找到配置文件。详见 <a href="${d("deployment/configuration/")}">配置</a>。`,
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
          a: `Dev builds add port forwarding: when a dev server in a session starts listening, a banner offers the port and one click opens it at <code>/forward/{port}/</code>, with HMR WebSockets working and no new port or SSH tunnel to set up. Frameworks with absolute paths such as Vite or Next.js need “keep prefix” and a base (for example <code>pnpm vite --base /forward/5173/</code>). Only ports on the server itself can be forwarded. It ships in the next stable release; see <a href="${PORT_FORWARD_DOC}">port forwarding</a>${cn} and the <a href="${localize(lang, "/use-cases/")}#remote-web-dev">use case</a>.`,
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
          a: `The recommended route: install Tailscale on the server and the phone, join the same tailnet, set <code>[tailscale] mode = "serve"</code> and open <code>https://&lt;node&gt;.ts.net/</code> on the phone. Alternatively, listen on the server's Tailscale / WireGuard address and enter the token once. Your firewall should only allow the trusted VPN interface to reach the port. An HTTPS address can also be installed as an app and receive lock-screen notifications. See <a href="${d("deployment/remote-access/#手机访问tailscale")}">phone access</a>${cn}.`,
        },
        {
          id: "is-it-safe",
          q: "Is WebMux safe?",
          a: `WebMux runs arbitrary commands as the user who started the service, which amounts to exposing a shell to the network. It is not a process sandbox and offers no multi-user isolation. Safety relies on network isolation: by default it listens on <code>127.0.0.1:7681</code> only; for remote use turn on Tailscale Serve or bind to a trusted VPN such as Tailscale or WireGuard, and use a random token (the first start generates a 256-bit one). Do not expose it directly to the internet; if you must, use a controlled tunnel only, and accept that the token is then the only barrier. See <a href="${localize(lang, "/security/")}">security and deployment</a>.`,
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
          a: `On Linux or macOS, run <code>curl -fsSL https://github.com/mzdluo123/webmux/releases/latest/download/install.sh | sh</code>. The script detects your architecture, verifies the SHA-256 and installs to <code>~/.local/bin/webmux</code> without root. deb / rpm packages, manual downloads, a Windows installer and source builds are also available; see <a href="${localize(lang, "/download/")}">download and install</a> and <a href="${d("deployment/install-and-upgrade/")}">install and upgrade</a>${cn}.`,
        },
        {
          id: "data-and-telemetry",
          q: "Where does my data go? Is there telemetry?",
          a: `Sessions live only in memory; the state directory holds only explicitly registered JSON files (repository list, launch configurations, preferences, push, tunnel and Tailscale settings, hybrid-session records); see the <a href="${d("persistence/")}">persistence list</a>${cn}. Terminal input and output are never logged, and the configuration API never returns the token. A search of the source on 2026-11-03 found no telemetry or usage-analytics code; outbound connections happen only for features you enable, such as downloading cloudflared, tunnels and push notifications.`,
        },
        {
          id: "multi-user",
          q: "Can several people share one instance?",
          a: `Not as a multi-user system. WebMux has a single shared token, every command runs as the user who started the service, and there is no multi-user isolation. Anyone holding the token has the same shell access as you; if you need isolation, give each person their own system user and their own WebMux instance.`,
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
          a: `The token generated on first start is stored in the configuration file. Show it with <code>webmux status --json --reveal-token</code>, or find the file with <code>webmux config path</code>. See <a href="${d("deployment/configuration/")}">configuration</a>${cn}.`,
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
