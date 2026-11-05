// Feature inventory for /features/, grouped as in strategy.md#价值主张与消息层级 (layer 3).
// Facts: mzdluo123/webmux docs/overview.md, docs/usage.md, docs/usage/*.md, docs/hybrid-sessions.md,
// docs/deployment/*.md, checked 2026-11-05 at v0.12.0. `since` marks features new in that release.
import type { Lang } from "../lib/i18n";
import { serverSizeMB } from "../lib/releases";

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

export function recent(lang: Lang): Feature[] {
  return lang === "zh-cn"
    ? [
        {
          title: "端口转发预览",
          body: "会话里的开发服务器开始监听后，终端上方 3 秒内提示端口，一键经 /forward/{端口}/ 在浏览器预览；HMR、SSE 与 WebSocket 直通，不新开端口。",
          href: PORT_FORWARD_DOC,
          since: "v0.12",
        },
        {
          title: "聊天模式、工作台模式与快速开始",
          body: "侧栏可在“按最近活动列出全部聊天”与“仓库 → worktree → 会话”树之间切换；快速开始选仓库、分支与 agent，自动新建 worktree 并从聊天或终端开工。",
          href: "/docs/usage/#侧栏与两种模式",
          since: "v0.12",
        },
        {
          title: "更醒目的提醒",
          body: "需要回答、等待授权与出错改为红色标记；页面右上角弹出提示，不需要通知权限或 HTTPS。",
          href: "/docs/usage/attention/",
          since: "v0.12",
        },
        {
          title: "仓库初始化指令",
          body: "为每个仓库保存一段开场指令模板，支持 {{快捷指令}}、{{user}} 与 {{dir}} 占位符，新会话可选择自动发送。",
          href: "/docs/usage/#3-用户指令与初始化指令可选",
          since: "v0.12",
        },
        {
          title: "聊天体验改进",
          body: "附件与消息显示图片缩略图；代码位置链接直接在代码浏览器打开；快捷指令按钮移到发送键旁；聊天端 agent 不再空闲休眠。",
          href: "/docs/hybrid-sessions/#聊天视图",
          since: "v0.12",
        },
        {
          title: "新建会话重新设计",
          body: "单页对话框按“位置 / 运行 / 用户指令”组织，可搜索已有分支、从最近 50 个提交中选起点，混合 agent 记住从终端还是聊天开始。",
          href: "/docs/usage/#新建会话",
        },
        {
          title: "更多 agent 支持混合会话",
          body: "Claude Code、Antigravity CLI、Qoder 与 QoderCN 加入 TUI ↔ 聊天互切，现在共七款。",
          href: "/docs/hybrid-sessions/",
        },
        {
          title: "安装包与自动更新",
          body: "deb / rpm 安装包附带 systemd 用户服务；Windows 安装程序；正式版与开发版通道，签名发布与自动更新检查。",
          href: "/docs/deployment/updates/",
        },
      ]
    : [
        {
          title: "Port forwarding preview",
          body: "When a dev server in a session starts listening, a banner offers the port within 3 seconds; one click previews it at /forward/{port}/. HMR, SSE and WebSockets pass through, and no new port is opened.",
          href: PORT_FORWARD_DOC,
          since: "v0.12",
        },
        {
          title: "Chat mode, workbench mode and Quick Start",
          body: "The sidebar switches between all chats by recent activity and a repository → worktree → session tree. Quick Start picks a repository, branch and agent, creates a worktree and starts in chat or terminal.",
          href: "/docs/usage/#侧栏与两种模式",
          since: "v0.12",
        },
        {
          title: "Louder alerts",
          body: "Needs-answer, awaiting-permission and error states turn red, and a toast appears at the top right with no notification permission or HTTPS needed.",
          href: "/docs/usage/attention/",
          since: "v0.12",
        },
        {
          title: "Repository init instructions",
          body: "Save an opening instruction per repository with {{quick command}}, {{user}} and {{dir}} placeholders, and send it automatically when a session starts.",
          href: "/docs/usage/#3-用户指令与初始化指令可选",
          since: "v0.12",
        },
        {
          title: "A better chat view",
          body: "Image thumbnails for attachments and messages, code-location links that open the code browser, quick commands beside Send, and no idle sleep for chat-side agents.",
          href: "/docs/hybrid-sessions/#聊天视图",
          since: "v0.12",
        },
        {
          title: "New session, redesigned",
          body: "One page organised as Location / Run / User instruction, with branch search, a start commit from the last 50, and a remembered terminal-or-chat start per hybrid agent.",
          href: "/docs/usage/#新建会话",
        },
        {
          title: "More hybrid agents",
          body: "Claude Code, Antigravity CLI, Qoder and QoderCN joined TUI ↔ chat switching, seven agents in total.",
          href: "/docs/hybrid-sessions/",
        },
        {
          title: "Packages and auto-update",
          body: "deb / rpm packages with a systemd user service, a Windows installer, stable and dev channels, signed releases and update checks.",
          href: "/docs/deployment/updates/",
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
              title: "会话总览",
              body: "按仓库与 worktree 分组，实时显示标题、状态（运行中 / 可能在等你 / 空闲 / 已退出）与屏幕预览，可搜索与按状态筛选。",
              href: "/docs/usage/#会话列表",
            },
            {
              title: "终端分屏",
              body: "左右 / 上下嵌套最多 8 个窗格，tmux 风格 Ctrl+B 前缀切换、放大与关闭；每个窗格有独立的草稿与代码面板。",
              href: "/docs/usage/terminal/#终端分屏",
            },
            {
              title: "草稿模式",
              body: "在多行输入框里组合引用与上传路径，一次性发送并确认送达；草稿与暂存区保存在本机。",
              href: "/docs/usage/#草稿模式",
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
              href: "/docs/usage/#从终端启动与附着",
            },
          ],
        },
        {
          id: "agents",
          title: "Agent 协作",
          items: [
            {
              title: "十一款 CLI 预置",
              body: "Claude Code、Codex CLI、Antigravity、Cursor、Copilot、OpenCode、Qwen、Kimi、CodeBuddy、Qoder、QoderCN，外加 Shell 与 omp；全部可编辑。",
              href: "/docs/cli-agents/",
            },
            {
              title: "TUI ↔ 聊天互切",
              body: "七款 agent 的同一段对话可在原生 TUI 与 ACP 聊天视图之间切换，历史由 agent 自己保存。",
              href: "/docs/hybrid-sessions/",
            },
            {
              title: "聊天视图",
              body: "消息、思考与工具调用按时间线展示；选择模型、模式与权限；圆环显示上下文用量；附件以 ACP 内容块直接发送。",
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
              href: "/docs/usage/#需要你介入的提醒",
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
              body: "登记已有仓库，从最近的分支与提交创建 worktree 并直接启动 agent；删除前检查未提交改动与活跃会话。",
              href: "/docs/usage/worktrees/",
            },
            {
              title: "Diff 审阅",
              body: "未暂存、已暂存与未跟踪分组；并排 / 统一视图随宽度切换，支持查找、展开上下文与图片 Diff。",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "资源管理器",
              body: "右键上传、下载（目录打包 ZIP）、重命名、复制、移动和删除；从系统拖入文件即可上传。",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "多格式预览",
              body: "Markdown、图片、SVG、静态 HTML、CSV / TSV、JSON 与 PDF。",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "行引用",
              body: "选中代码行，把 路径:行号 引用或行级评论一键插入对话或草稿。",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "独立窗口",
              body: "把代码面板弹出为独立浏览器窗口，双屏对照终端与 Diff。",
              href: "/docs/usage/#代码工作区",
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
              title: "PWA 与锁屏推送",
              body: "HTTPS 下可安装为应用，agent 等你回复时推送到锁屏；iOS 16.4+ 需添加到主屏幕。",
              href: "/docs/deployment/pwa-and-push/",
            },
            {
              title: "跨设备偏好",
              body: "主题、预览、代码阅读与快捷指令由服务端保存并同步；字号、凭据与草稿留在本机。",
              href: "/docs/usage/#跨设备偏好",
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
              title: "Tailscale Serve / Funnel",
              body: "在设置页托管 Tailscale，获得 HTTPS 地址，无需重启。",
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
              title: "Session overview",
              body: "Grouped by repository and worktree with live title, status (running / may be waiting / idle / exited) and screen preview; search and status filters.",
              href: "/docs/usage/#会话列表",
            },
            {
              title: "Terminal splits",
              body: "Up to 8 nested panes with a tmux-style Ctrl+B prefix to move, zoom and close; each pane has its own draft and code panel.",
              href: "/docs/usage/terminal/#终端分屏",
            },
            {
              title: "Drafts",
              body: "Compose references and upload paths in a multi-line box and send them at once with delivery confirmation; drafts and stash stay on the device.",
              href: "/docs/usage/#草稿模式",
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
              href: "/docs/usage/#从终端启动与附着",
            },
          ],
        },
        {
          id: "agents",
          title: "Working with agents",
          items: [
            {
              title: "Eleven CLIs preconfigured",
              body: "Claude Code, Codex CLI, Antigravity, Cursor, Copilot, OpenCode, Qwen, Kimi, CodeBuddy, Qoder and QoderCN, plus Shell and omp; all editable.",
              href: "/docs/cli-agents/",
            },
            {
              title: "TUI ↔ chat",
              body: "Seven agents switch one conversation between the native TUI and an ACP chat view; the agent keeps the history.",
              href: "/docs/hybrid-sessions/",
            },
            {
              title: "Chat view",
              body: "Messages, thinking and tool calls on a timeline; model, mode and permission pickers; a context ring; attachments sent as ACP content blocks.",
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
              href: "/docs/usage/#需要你介入的提醒",
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
              body: "Register existing repositories, create worktrees from recent branches and commits and launch an agent in them; removal checks for uncommitted work and live sessions.",
              href: "/docs/usage/worktrees/",
            },
            {
              title: "Diff review",
              body: "Unstaged, staged and untracked groups; split or unified by width, with find, context expansion and image diffs.",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "File explorer",
              body: "Upload, download (folders as ZIP), rename, copy, move and delete from the context menu; drag files in from your desktop.",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "File previews",
              body: "Markdown, images, SVG, static HTML, CSV / TSV, JSON and PDF.",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "Line references",
              body: "Select lines and insert a path:line reference or line comment into the chat or draft.",
              href: "/docs/usage/#代码工作区",
            },
            {
              title: "Pop-out window",
              body: "Pop the code panel into its own browser window for terminal and diff on two screens.",
              href: "/docs/usage/#代码工作区",
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
              title: "PWA and lock-screen push",
              body: "Install it as an app over HTTPS and get pushed when an agent waits for you; iOS 16.4+ needs Add to Home Screen.",
              href: "/docs/deployment/pwa-and-push/",
            },
            {
              title: "Preferences across devices",
              body: "Theme, previews, code reading and quick commands are stored on the server and synced; font size, credentials and drafts stay local.",
              href: "/docs/usage/#跨设备偏好",
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
              title: "Tailscale Serve / Funnel",
              body: "Managed from the settings page for an HTTPS address, no restart needed.",
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
