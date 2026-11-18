// Feature inventory for /features/, grouped as in strategy.md#价值主张与消息层级 (layer 3).
// Facts: mzdluo123/webmux docs/overview.md, docs/usage.md, docs/usage/*.md, docs/hybrid-sessions.md,
// docs/deployment/*.md. `since` marks the release that introduced a feature.
import type { Lang } from "../lib/i18n";
import { serverSizeMB } from "../lib/releases";
import { AGENTS, HYBRID_NAMES } from "./agents";

const SIZE = serverSizeMB() ?? 20;
import { PORT_FORWARD_DOC } from "./use-cases";

export interface Feature {
  title: string;
  body: string;
  href?: string;
  /** Release that introduced the feature, shown as a badge. */
  since?: string;
}

export interface FeatureGroup {
  id: string;
  title: string;
  items: Feature[];
}

// The session home images come from upstream PR #694's evidence commit
// 82503078788c0d6deb9a9519f4f7cda0938af0ff (sidebar-group-padding-conversation-desktop-{light,dark}.png).
export function workbenchShot(lang: Lang) {
  return {
    name: "workbench/desktop-light.png",
    dark: "workbench/desktop-dark.png",
    alt:
      lang === "zh-cn"
        ? "工作台会话主页：「待我处理」列在进行中的会话上方。"
        : "Workbench session home, with sessions that need attention above work in progress.",
  };
}

export function recent(lang: Lang) {
  const zh = lang === "zh-cn";
  return [
    {
      title: zh ? "先处理等你回复的会话" : "Answer the sessions waiting on you",
      body: zh
        ? "打开工作台，「待我处理」会列出提问、授权请求和错误。点行尾的「预览」看最近输出，再进入需要回复的会话；仍在运行的任务列在下方。"
        : "Open the workbench. “Needs attention” lists questions, approval requests and errors. Preview the latest output, then open the session that needs a reply. Work in progress stays below.",
      href: "/docs/usage/sessions/#会话队列",
      since: "v0.18.0",
      shot: workbenchShot(lang),
    },
    {
      title: zh
        ? "从本地项目或 GitHub 仓库开工"
        : "Start from a local project or GitHub repository",
      body: zh
        ? "点「新建会话」，先选项目。可以打开服务器上的普通文件夹，不必初始化 Git；也可以用服务器已登录的 gh 搜索并克隆 GitHub 仓库。Git 项目再选工作树，最后选择要运行的 agent 或 Shell。"
        : "In “New session”, choose the project first. Open a folder on the server without setting up Git, or use the server’s signed-in gh CLI to find and clone a GitHub repository. For Git projects, choose a worktree, then launch your agent or shell.",
      href: "/docs/usage/sessions/#新建会话",
      since: "v0.17.1",
      shot: {
        name: "project-picker/desktop-light-projects.png",
        dark: "project-picker/desktop-dark-projects.png",
        alt: zh
          ? "新建会话的项目列表，可按名称或路径搜索服务器上的项目。"
          : "The New session project list, with a field to search server projects by name or path.",
      },
    },
    {
      title: zh ? "换一个 agent 接着做" : "Hand the task to another agent",
      body: zh
        ? "在会话菜单选「更换 Agent…」，指定目标聊天，写下接下来要做的事。发送前可以查阅原文、修改任务并重新生成预览。目标 agent 收到的是这份上下文；它不会接管原进程，这与同一会话切换 TUI 和聊天视图不同。"
        : "Choose “Switch agent…” in the session menu, pick a target chat and describe what to do next. Inspect the source history, edit the task and regenerate the preview before sending. The target gets that context, not the running process. Switching between TUI and chat keeps you in the same session instead.",
      href: "/docs/hybrid-sessions/handoff/",
      since: "v0.15.0",
      shot: {
        name: "handoff/snapcompact-after-desktop-light.png",
        dark: "handoff/snapcompact-after-desktop-dark.png",
        alt: zh
          ? "交接预览显示归档页和当前任务，底部标明发送成功。"
          : "The handoff screen shows an archive page, the current task and a successful delivery.",
      },
    },
  ];
}

export function groups(lang: Lang): FeatureGroup[] {
  const zh = lang === "zh-cn";
  return zh
    ? [
        {
          id: "sessions",
          title: "会话与终端",
          items: [
            {
              title: "持久会话",
              body: "PTY 由服务端持有，断线后会话继续；短暂断线只续接缺失部分，否则回放每会话 2 MiB 的缓冲。",
              href: "/docs/architecture/",
            },
            {
              title: "先选项目，再创建会话",
              body: "从「新建会话」选择或添加项目。普通文件夹可直接运行；Git 项目可沿用已有工作树或新建一棵，再选择 agent 或 Shell。",
              href: "/docs/usage/sessions/#新建会话",
            },
            {
              title: "仓库初始化指令",
              body: "为仓库保存开场指令模板，支持 {{快捷指令}}、{{user}}、{{dir}} 与 {{webmux}} 占位符；快速开始或新建会话时可勾选随首条消息发送。",
              href: "/docs/usage/chat/#仓库初始化指令",
            },
            {
              title: "会话总览",
              body: "默认按处理顺序列出会话，可预览输出，或只看需要你介入的会话。要定位某个分支，切换到「按分支」，按仓库和工作树浏览。",
              href: "/docs/usage/sessions/#会话列表",
            },
            {
              title: "置顶与快速切换",
              body: "置顶正在跟进的会话并调整顺序；⌘K（macOS）或 Ctrl+Alt+K（Windows / Linux）跨仓库搜索并跳到任意会话，侧栏与结果共用同一置顶顺序。",
              href: "/docs/usage/sessions/#快速切换会话",
            },
            {
              title: "终端分屏",
              body: "左右 / 上下嵌套最多 8 个窗格，tmux 风格 Ctrl+B 前缀切换、放大与关闭；每个窗格有独立的草稿与代码面板。",
              href: "/docs/usage/terminal/#终端分屏",
            },
            {
              title: "草稿模式",
              body: "在多行输入框里组合引用与上传路径，一次性发送并确认送达；草稿与暂存区保存在本机。",
              href: "/docs/usage/terminal/#草稿模式",
            },
            {
              title: "查找与复制",
              body: "Ctrl+Shift+F 在保留的输出中查找，支持大小写、整词与正则；OSC 52 复制写入浏览器剪贴板。",
              href: "/docs/usage/terminal/#查找终端输出",
            },
            {
              title: "终端图形",
              body: "支持 Kitty 图形协议直接传输，omp 等程序可以在浏览器终端里显示 PNG 与 RGB(A) 图片。",
              href: "/docs/usage/terminal/#终端图形",
            },
            {
              title: "快捷指令",
              body: "保存最多 50 条常用命令或提示词，从终端菜单或软键栏一键发送。",
              href: "/docs/usage/terminal/",
            },
            {
              title: "原生终端附着",
              body: "webmux run / attach / ls / open 在本机终端里创建与接续会话，与浏览器共享同一个 PTY。",
              href: "/docs/usage/command-line/#启动与附着",
            },
          ],
        },
        {
          id: "agents",
          title: "Agent 协作",
          items: [
            {
              title: `${AGENTS.length} 款 CLI 预置`,
              body: `启用 launch 后可使用 ${AGENTS.map((a) => a.name).join("、")} 的配置；另有 Shell 与 omp，全部可编辑。`,
              href: "/docs/cli-agents/",
            },
            {
              title: "TUI ↔ 聊天互切",
              body: `${HYBRID_NAMES.length} 款 agent（含 omp）支持在原生 TUI 与聊天视图之间切换同一段对话。`,
              href: "/docs/hybrid-sessions/",
            },
            {
              title: "聊天视图",
              body: "消息、思考与工具调用按时间线展示；模型选项可搜索，输入框按 ↑ 召回发过的提示；选择模式与权限；圆环显示上下文用量；附件以 ACP 内容块直接发送。",
              href: "/docs/hybrid-sessions/#聊天视图",
            },
            {
              title: "多设备协作",
              body: "回合进行中的消息进入所有设备共享的队列，omp、Codex 与 Claude Code 支持插话；权限请求在所有设备同步。",
              href: "/docs/hybrid-sessions/#聊天视图",
            },
            {
              title: "需要你介入的提醒",
              body: "识别 OSC 7501、OSC 777、OSC 9 与 BEL，在总览、侧栏、标签页与手机推送中提示。",
              href: "/docs/usage/attention/",
            },
            {
              title: "归档与恢复",
              body: "聊天会话可停止并归档，服务重启后从所属 worktree 的“已归档”中恢复到聊天或终端。",
              href: "/docs/hybrid-sessions/#关闭中断与恢复",
            },
          ],
        },
        {
          id: "code",
          title: "代码与仓库",
          items: [
            {
              title: "Git worktree 管理",
              body: "登记已有仓库，从最近的分支与提交创建 worktree 并直接启动 agent，也可在已有主工作区或 worktree 中继续；删除前检查未提交改动与活跃会话。",
              href: "/docs/usage/worktrees/",
            },
            {
              title: "Diff 审阅",
              body: "未暂存、已暂存与未跟踪分组；并排 / 统一视图随宽度切换，支持查找、展开上下文与图片 Diff。",
              href: "/docs/usage/code/",
            },
            {
              title: "资源管理器",
              body: "右键上传、下载（目录打包 ZIP）、重命名、复制、移动和删除；从系统拖入文件即可上传。",
              href: "/docs/usage/code/",
            },
            {
              title: "多格式预览",
              body: "Markdown、图片、SVG、静态 HTML、CSV / TSV、JSON 与 PDF。",
              href: "/docs/usage/code/",
            },
            {
              title: "行引用",
              body: "选中代码行，把 路径:行号 引用或行级评论一键插入对话或草稿。",
              href: "/docs/usage/code/",
            },
            {
              title: "独立窗口",
              body: "把代码面板弹出为独立浏览器窗口，双屏对照终端与 Diff。",
              href: "/docs/usage/code/",
            },
            {
              title: "端口转发预览",
              body: "把会话里的开发服务器经 /forward/{端口}/ 转发到浏览器，自动检测监听端口。",
              href: PORT_FORWARD_DOC,
              since: "v0.12",
            },
          ],
        },
        {
          id: "devices",
          title: "多设备与平台",
          items: [
            {
              title: "移动端优先",
              body: "软键栏、触摸滚动、双指缩放、长按选词、虚拟键盘视口适配与锁定终端尺寸。",
              href: "/docs/usage/mobile/",
            },
            {
              title: "语音输入与触控手柄",
              body: "服务端配置语音识别后，聊天、快速开始与终端草稿可把识别文字插入输入框；软键栏可展开软键盘摇杆，支持按住连发与滑动切向。",
              href: "/docs/usage/mobile/",
            },
            {
              title: "PWA 与锁屏推送",
              body: "HTTPS 下可安装为应用，agent 等你回复时推送到锁屏；iOS 16.4+ 需添加到主屏幕。",
              href: "/docs/deployment/pwa-and-push/",
            },
            {
              title: "跨设备偏好",
              body: "主题、预览、代码阅读、快捷指令与会话置顶由服务端保存并同步；字号、凭据、草稿与侧栏折叠留在本机。",
              href: "/docs/usage/sessions/#跨设备偏好",
            },
            {
              title: "Windows（WSL 2）",
              body: "托盘程序安装、升级、监控 WSL 中的服务；webmux.exe 在 PowerShell 里 run / attach 会话。",
              href: "/docs/deployment/windows-wsl/",
            },
          ],
        },
        {
          id: "deploy",
          title: "部署与访问",
          items: [
            {
              title: "单二进制、零依赖",
              body: `前端嵌入 Go 二进制，约 ${SIZE} MB；空闲约 13 MB 内存；无需 root、tmux、数据库或 Node.js。`,
              href: "/docs/overview/",
            },
            {
              title: "用户级服务",
              body: "webmux service 管理 systemd --user / launchd；卸载时保留配置。",
              href: "/docs/deployment/services/",
            },
            {
              title: "官方 Relay",
              body: "不方便加入同一 VPN 时，可用 GitHub 配对主机并显式开启固定 HTTPS 入口。WSS 属于核心，不需额外功能；Relay 终止 TLS，需信任运营者。",
              href: "/docs/deployment/remote-access/#官方-relay",
            },
            {
              title: "Tailscale Serve / Funnel",
              body: "Serve 只在 tailnet 内提供 HTTPS；Funnel 才公开到互联网。选用 Tailscale 功能后可在设置中管理入口。",
              href: "/docs/tailscale/",
            },
            {
              title: "Cloudflare Tunnel",
              body: "Quick 或 Named Tunnel，自动下载并校验 cloudflared。",
              href: "/docs/cloudflare-tunnel/",
            },
            {
              title: "安全默认值",
              body: "默认只监听 127.0.0.1:7681，首次启动生成 256 位 Token，Origin 检查保护 API 与 WebSocket。",
              href: "/docs/security/",
            },
            {
              title: "更新通道",
              body: "正式版与开发版通道；deb / rpm 每日检查，Windows 安装版托盘自动更新，更新不会自动重启服务。",
              href: "/docs/deployment/updates/",
            },
          ],
        },
      ]
    : [
        {
          id: "sessions",
          title: "Sessions and terminal",
          items: [
            {
              title: "Persistent sessions",
              body: "The server holds the PTY and sessions keep running after disconnects; short drops resume the gap, otherwise the 2 MiB per-session buffer replays.",
              href: "/docs/architecture/",
            },
            {
              title: "Choose a project, then start a session",
              body: "Pick or add a project in “New session”. Run directly in a plain folder, or choose an existing or new worktree for a Git project. Then choose your agent or shell.",
              href: "/docs/usage/sessions/#新建会话",
            },
            {
              title: "Repository init instructions",
              body: "Save an opening instruction per repository with {{quick command}}, {{user}}, {{dir}} and {{webmux}} placeholders, and send it with the first message from Quick Start or the new-session dialog.",
              href: "/docs/usage/chat/#仓库初始化指令",
            },
            {
              title: "Session overview",
              body: "The queue puts sessions needing attention first. Preview their output or filter down to sessions that need you. To find work on a particular branch, switch the grouping to browse by repository and worktree.",
              href: "/docs/usage/sessions/#会话列表",
            },
            {
              title: "Pins and quick switching",
              body: "Pin the sessions you follow and reorder them; ⌘K on macOS or Ctrl+Alt+K on Windows / Linux searches and jumps to any session across repositories, sharing the same pinned order.",
              href: "/docs/usage/sessions/#快速切换会话",
            },
            {
              title: "Terminal splits",
              body: "Up to 8 nested panes with a tmux-style Ctrl+B prefix to move, zoom and close; each pane has its own draft and code panel.",
              href: "/docs/usage/terminal/#终端分屏",
            },
            {
              title: "Drafts",
              body: "Compose references and upload paths in a multi-line box and send them at once with delivery confirmation; drafts and stash stay on the device.",
              href: "/docs/usage/terminal/#草稿模式",
            },
            {
              title: "Find and copy",
              body: "Ctrl+Shift+F searches the kept output with case, whole-word and regex options; OSC 52 copies reach the browser clipboard.",
              href: "/docs/usage/terminal/#查找终端输出",
            },
            {
              title: "Terminal graphics",
              body: "Kitty graphics protocol direct transmission, so omp and others can show PNG and RGB(A) images in the browser terminal.",
              href: "/docs/usage/terminal/#终端图形",
            },
            {
              title: "Quick commands",
              body: "Save up to 50 commands or prompts and send them from the terminal menu or soft-key bar.",
              href: "/docs/usage/terminal/",
            },
            {
              title: "Native terminal attach",
              body: "webmux run / attach / ls / open create and resume sessions from your local terminal, sharing one PTY with the browser.",
              href: "/docs/usage/command-line/#启动与附着",
            },
          ],
        },
        {
          id: "agents",
          title: "Working with agents",
          items: [
            {
              title: `${AGENTS.length} CLI presets`,
              body: `Enable launch profiles for ${AGENTS.map((a) => a.name).join(", ")}. Shell and omp are additional profiles; all are editable.`,
              href: "/docs/cli-agents/",
            },
            {
              title: "TUI ↔ chat",
              body: `${HYBRID_NAMES.length} agents (including omp) can switch one conversation between the native TUI and chat view.`,
              href: "/docs/hybrid-sessions/",
            },
            {
              title: "Chat view",
              body: "Messages, thinking and tool calls on a timeline; searchable model options, ↑ prompt recall, mode and permission pickers; a context ring; attachments sent as ACP content blocks.",
              href: "/docs/hybrid-sessions/#聊天视图",
            },
            {
              title: "Multi-device collaboration",
              body: "Messages sent mid-turn join a queue shared by all devices, omp, Codex and Claude Code accept interjections, and permission prompts sync everywhere.",
              href: "/docs/hybrid-sessions/#聊天视图",
            },
            {
              title: "Attention alerts",
              body: "OSC 7501, OSC 777, OSC 9 and BEL are recognised and shown in the overview, sidebar, browser tab and phone push.",
              href: "/docs/usage/attention/",
            },
            {
              title: "Archive and resume",
              body: "Stop and archive chat sessions, then resume them to chat or terminal from their worktree's “Archived” section, even after a restart.",
              href: "/docs/hybrid-sessions/#关闭中断与恢复",
            },
          ],
        },
        {
          id: "code",
          title: "Code and repositories",
          items: [
            {
              title: "Git worktrees",
              body: "Register existing repositories, create worktrees from recent branches and commits and launch an agent in them, or continue in the main workspace or an existing worktree; removal checks for uncommitted work and live sessions.",
              href: "/docs/usage/worktrees/",
            },
            {
              title: "Diff review",
              body: "Unstaged, staged and untracked groups; split or unified by width, with find, context expansion and image diffs.",
              href: "/docs/usage/code/",
            },
            {
              title: "File explorer",
              body: "Upload, download (folders as ZIP), rename, copy, move and delete from the context menu; drag files in from your desktop.",
              href: "/docs/usage/code/",
            },
            {
              title: "File previews",
              body: "Markdown, images, SVG, static HTML, CSV / TSV, JSON and PDF.",
              href: "/docs/usage/code/",
            },
            {
              title: "Line references",
              body: "Select lines and insert a path:line reference or line comment into the chat or draft.",
              href: "/docs/usage/code/",
            },
            {
              title: "Pop-out window",
              body: "Pop the code panel into its own browser window for terminal and diff on two screens.",
              href: "/docs/usage/code/",
            },
            {
              title: "Port forwarding preview",
              body: "Forward dev servers in your sessions to the browser at /forward/{port}/, with listening ports detected automatically.",
              href: PORT_FORWARD_DOC,
              since: "v0.12",
            },
          ],
        },
        {
          id: "devices",
          title: "Devices and platforms",
          items: [
            {
              title: "Mobile first",
              body: "Soft-key bar, touch scrolling, pinch zoom, long-press selection, virtual-keyboard viewport handling and a locked terminal size.",
              href: "/docs/usage/mobile/",
            },
            {
              title: "Voice input and touch gamepad",
              body: "With a speech recognizer configured, chat, Quick Start and terminal drafts can insert recognized text; the soft-key bar can expand a touch gamepad with hold-to-repeat and slide-to-turn.",
              href: "/docs/usage/mobile/",
            },
            {
              title: "PWA and lock-screen push",
              body: "Install it as an app over HTTPS and get pushed when an agent waits for you; iOS 16.4+ needs Add to Home Screen.",
              href: "/docs/deployment/pwa-and-push/",
            },
            {
              title: "Preferences across devices",
              body: "Theme, previews, code reading, quick commands and session pins are stored on the server and synced; font size, credentials, drafts and sidebar folds stay local.",
              href: "/docs/usage/sessions/#跨设备偏好",
            },
            {
              title: "Windows (WSL 2)",
              body: "A tray app installs, upgrades and monitors the server in WSL; webmux.exe runs and attaches sessions from PowerShell.",
              href: "/en/windows/",
            },
          ],
        },
        {
          id: "deploy",
          title: "Deployment and access",
          items: [
            {
              title: "One binary, no dependencies",
              body: `Frontend embedded in a ~${SIZE} MB Go binary; about 13 MB of memory when idle; no root, tmux, database or Node.js.`,
              href: "/docs/overview/",
            },
            {
              title: "User services",
              body: "webmux service manages systemd --user / launchd; uninstalling keeps your configuration.",
              href: "/docs/deployment/services/",
            },
            {
              title: "Official Relay",
              body: "Without a shared VPN, pair the host with GitHub and explicitly enable its fixed HTTPS entry. WSS is built in; the Relay terminates TLS, so you must trust its operator.",
              href: "/docs/deployment/remote-access/#官方-relay",
            },
            {
              title: "Tailscale Serve / Funnel",
              body: "Serve provides HTTPS inside your tailnet; Funnel publishes it to the internet. Select the Tailscale feature to manage either in settings.",
              href: "/docs/tailscale/",
            },
            {
              title: "Cloudflare Tunnel",
              body: "Quick or Named tunnels, with cloudflared downloaded and verified for you.",
              href: "/docs/cloudflare-tunnel/",
            },
            {
              title: "Safe defaults",
              body: "Listens on 127.0.0.1:7681 only, generates a 256-bit token on first start, and checks Origin on the API and WebSockets.",
              href: "/en/security/",
            },
            {
              title: "Update channels",
              body: "Stable and dev channels; deb / rpm check daily, the installed Windows tray auto-updates, and updates never restart the service on their own.",
              href: "/docs/deployment/updates/",
            },
          ],
        },
      ];
}
