// Use-case copy for /use-cases/ and the home-page teaser. Facts come from mzdluo123/webmux
// (checked 2026-11-05 at main): docs/overview.md, docs/usage.md, docs/usage/{terminal,worktrees,
// mobile,attention,port-forwarding}.md, docs/hybrid-sessions.md, docs/deployment/*.md.
import type { Lang } from "../lib/i18n";
import { serverSizeMB } from "../lib/releases";

const SIZE = serverSizeMB() ?? 20;

export const PORT_FORWARD_DOC = "/docs/usage/port-forwarding/";

export type UseCaseIcon =
  | "world-www"
  | "device-mobile"
  | "git-branch"
  | "cpu"
  | "brand-windows"
  | "terminal-2"
  | "file-analytics"
  | "eye-check"
  | "heartbeat";

export interface Step {
  text: string;
}

export interface UseCase {
  /** ASCII anchor slug, stable across languages. */
  id: string;
  icon: UseCaseIcon;
  /** Who is in this situation. */
  who: string;
  title: string;
  /** The situation before WebMux. */
  pain: string;
  steps: Step[];
  /** Feature chips. */
  uses: string[];
  links: { href: string; label: string }[];
  shot?: { name: string; dark?: string };
}

export function useCases(lang: Lang): UseCase[] {
  const zh = lang === "zh-cn";
  const cn = zh ? "" : " (Chinese)";
  return zh
    ? [
        {
          id: "remote-web-dev",
          icon: "world-www",
          who: "全栈 / 前端开发者 · 远程 Linux 服务器",
          title: "在远程 Linux 服务器上开发 Web 应用，浏览器里就能看到页面。",
          pain: "代码、依赖和 GPU / 内存都在服务器上，本机只有一台轻薄本或一部手机。过去要开 SSH、tmux、再配 SSH 端口转发才能看到 localhost:5173，换台设备就得重来一遍。",
          steps: [
            {
              text: "登记仓库，为每个功能新建 Git worktree，直接在其中启动 Claude Code、Codex 或 OpenCode。",
            },
            {
              text: "终端分屏（Ctrl+B %）：左边是 agent，右边跑 pnpm dev；会话由服务端持有，合上电脑也不停。",
            },
            {
              text: "开发服务器开始监听后，终端上方 3 秒内提示“检测到端口 5173（node）正在监听”，点“转发并打开”即可经 /forward/5173/ 预览，HMR WebSocket 照常工作。",
            },
            {
              text: "在终端旁的代码面板里审 Git Diff、预览 Markdown 与图片，选中几行把 路径:行号 发回 agent 让它修改。",
            },
            {
              text: "转发地址与 WebMux 同源，经 Tailscale 或 Cloudflare Tunnel 时手机上也能打开，顺手检查移动端布局。",
            },
            { text: "需要素材时直接拖进资源管理器上传；构建产物可以整目录打包成 ZIP 下载。" },
          ],
          uses: [
            "端口转发预览",
            "终端分屏",
            "Git worktree",
            "Diff 审阅",
            "资源管理器",
            "Tailscale",
          ],
          links: [
            { href: PORT_FORWARD_DOC, label: "端口转发预览" },
            { href: "/docs/usage/terminal/#终端分屏", label: "终端分屏" },
            { href: "/docs/usage/#代码工作区", label: "代码工作区" },
            { href: "/docs/usage/worktrees/", label: "仓库与 worktree" },
          ],
          shot: { name: "desktop-diff.png" },
        },
        {
          id: "phone-takeover",
          icon: "device-mobile",
          who: "通勤、出差、排队中的开发者",
          title: "离开工位，agent 停下来提问时手机会响。",
          pain: "长任务跑到一半，agent 要你确认一次权限或回答一个问题；没人回应，它就在那里干等几个小时。",
          steps: [
            {
              text: "安装为 PWA 并开启 Web Push：agent 提问、请求授权、出错或完成时推送到锁屏；页面右上角也会弹出提示，不需要通知权限。",
            },
            {
              text: "点开通知直达会话：原生 TUI 配合软键栏（Esc、Ctrl、方向键、/ @ #）回答，或切到聊天视图打字回复。",
            },
            {
              text: "聊天视图里一次处理权限请求与表单，第一份回答生效；回合进行中的消息进入多设备共享队列。",
            },
            { text: "锁屏、切到 4G、关掉标签页都不影响；回来时只补发缺失的输出。" },
          ],
          uses: ["Web Push", "软键栏", "聊天视图", "断线续接"],
          links: [
            { href: "/docs/deployment/pwa-and-push/", label: "安装为应用与手机推送" },
            { href: "/docs/usage/mobile/", label: "移动端" },
            { href: "/docs/hybrid-sessions/#聊天视图", label: "聊天视图" },
          ],
          shot: { name: "mobile-omp.png" },
        },
        {
          id: "parallel-agents",
          icon: "git-branch",
          who: "同时推进多个任务的开发者",
          title: "让几个 agent 在各自的 worktree 里并行干活，一眼看出谁在等你。",
          pain: "多个终端标签页、多个 tmux 窗口，谁跑完了、谁卡在授权、谁报错了，只能一个个切过去看。",
          steps: [
            {
              text: "快速开始：选仓库和基准分支、选 agent、写下第一句任务，WebMux 自动新建 worktree 并在聊天里开工。",
            },
            {
              text: "工作台模式按“仓库 → worktree → 会话”列出全部会话，卡片实时显示状态与屏幕预览；需要回答、等待授权或出错的会话以红色标出。",
            },
            {
              text: "不同任务互不干扰：每个 worktree 有独立分支与目录，删除前会检查未提交改动与活跃会话。",
            },
            { text: "聊天会话可以停止并归档，之后从所属 worktree 的“已归档”中恢复到聊天或终端。" },
          ],
          uses: ["快速开始", "会话总览", "Git worktree", "归档与恢复"],
          links: [
            { href: "/docs/usage/#会话列表", label: "会话列表" },
            { href: "/docs/usage/worktrees/", label: "仓库与 worktree" },
            { href: "/docs/hybrid-sessions/#关闭中断与恢复", label: "归档与恢复" },
          ],
          shot: { name: "desktop-overview.png" },
        },
        {
          id: "workstation",
          icon: "cpu",
          who: "家里有台工作站、实验室有台 GPU 机器",
          title: "把长任务交给家里的高性能机器，在任何地方看进度。",
          pain: "训练、编译、数据处理一跑就是几个小时，SSH 一断就得重新连、重新找回输出。",
          steps: [
            {
              text: `在工作站上以普通用户身份运行一个约 ${SIZE} MB 的二进制，空闲约 13 MB 内存，无需 root、tmux 或数据库。`,
            },
            { text: "通过 Tailscale Serve 获得 HTTPS 地址，笔记本、平板和手机都能直接打开。" },
            {
              text: "omp 等程序可用 Kitty 图形协议在浏览器终端里直接显示图表；查找功能在保留的输出中定位关键字。",
            },
            { text: "结果文件在代码面板里预览：CSV / TSV 表格、JSON 树、PDF 与图片，需要时下载。" },
          ],
          uses: ["Tailscale Serve", "终端图形", "查找输出", "多格式预览"],
          links: [
            { href: "/docs/tailscale/", label: "Tailscale Serve / Funnel" },
            { href: "/docs/usage/terminal/#终端图形", label: "终端图形" },
            { href: "/docs/usage/terminal/#查找终端输出", label: "查找终端输出" },
          ],
          shot: {
            name: "kitty-graphics/after-desktop-light.png",
            dark: "kitty-graphics/after-desktop-dark.png",
          },
        },
        {
          id: "review-anywhere",
          icon: "eye-check",
          who: "需要随时把关 agent 改动的人",
          title: "agent 改完代码，在平板或手机上先把 Diff 审一遍。",
          pain: "agent 改了十几个文件，想在合并前看一眼，却只能等回到电脑前打开编辑器。",
          steps: [
            {
              text: "代码面板按未暂存、已暂存、未跟踪分组列出改动，Diff 按屏幕宽度自动切换并排或统一视图，支持图片 Diff。",
            },
            { text: "选中几行把 路径:12-18 引用插入草稿或终端，写上意见一次性发给 agent。" },
            { text: "桌面上可把代码面板弹出为独立窗口，双屏对照终端与 Diff。" },
          ],
          uses: ["Diff 审阅", "行引用", "草稿模式", "独立窗口"],
          links: [
            { href: "/docs/usage/#代码工作区", label: "代码工作区" },
            { href: "/docs/usage/#草稿模式", label: "草稿模式" },
          ],
          shot: { name: "mobile-diff.png" },
        },
        {
          id: "terminal-handoff",
          icon: "terminal-2",
          who: "习惯在本机终端里工作的人",
          title: "在自己的终端里开工，起身后在浏览器里接着用。",
          pain: "已经在 iTerm 或 Windows Terminal 里跑着 agent，出门时没法把这个进程带走。",
          steps: [
            { text: "用 webmux run -- claude 在本机终端里启动，体验和直接运行一样。" },
            {
              text: "按 Ctrl+] 分离，进程留在服务端；手机或另一台电脑的浏览器里打开同一会话继续。",
            },
            { text: "回到电脑 webmux attach <ID> 接续，全程是同一个进程，一行输出都不会丢。" },
          ],
          uses: ["webmux run / attach", "同一 PTY", "多设备控制权"],
          links: [{ href: "/docs/usage/#从终端启动与附着", label: "从终端启动与附着" }],
        },
        {
          id: "windows-wsl",
          icon: "brand-windows",
          who: "Windows 用户",
          title: "在 Windows 上用 WSL 2 跑 agent，托盘一键管理。",
          pain: "agent CLI 大多在 Linux / macOS 上体验最好，Windows 上要自己折腾 WSL 服务、端口和开机启动。",
          steps: [
            {
              text: "运行安装程序：托盘程序把同架构的服务端装进 WSL，负责启动、监控、自动重启与升级，安装托盘不需要管理员权限。",
            },
            {
              text: "在 PowerShell 或 Windows Terminal 里用 webmux.exe run / attach 直接操作 WSL 里的会话，当前目录自动换算为 WSL 路径。",
            },
            { text: "托盘菜单里一键开启 Tailscale Serve 或局域网访问，用手机接管。" },
          ],
          uses: ["托盘程序", "webmux.exe", "自动更新"],
          links: [{ href: "/docs/deployment/windows-wsl/", label: "Windows（WSL）部署" }],
        },
        {
          id: "docs-and-data",
          icon: "file-analytics",
          who: "不只写代码：写文档、整理数据、做调研",
          title: "让 agent 产出报告、表格和 PDF，在浏览器里直接看成品。",
          pain: "agent 生成的 Markdown、CSV、PDF 落在服务器某个目录里，想看还得先下载到本地。",
          steps: [
            { text: "上传资料时文件进入会话临时文件夹，服务器路径自动插入终端，agent 直接读取。" },
            {
              text: "产物在代码面板里预览：带目录的 Markdown、有表头的 CSV / TSV、可折叠的 JSON、可跳页缩放的 PDF。",
            },
            { text: "把常用提示词存成快捷指令，从终端菜单、软键栏或聊天发送键旁一键插入。" },
          ],
          uses: ["会话临时文件夹", "多格式预览", "快捷指令", "文件上传"],
          links: [
            { href: "/docs/usage/terminal/#会话临时文件夹", label: "会话临时文件夹" },
            { href: "/docs/usage/terminal/#文件上传", label: "文件上传" },
          ],
          shot: {
            name: "file-explorer/after-desktop-light.png",
            dark: "file-explorer/after-desktop-dark.png",
          },
        },
        {
          id: "ops",
          icon: "heartbeat",
          who: "管自己服务器的开发者",
          title: "长时间的迁移、部署脚本，在手机上也能盯着。",
          pain: "跑一个要半小时的数据迁移，不敢合上电脑，怕 SSH 断开把进程带走。",
          steps: [
            {
              text: "在 WebMux 的 Shell 会话里执行脚本，浏览器断开不影响进程；完成或出错时，程序发出的通知可以推送到手机。",
            },
            { text: "多台设备同时打开同一会话：一台控制，其他设备观察；输入即可接管控制权。" },
            { text: "WebMux 以服务用户身份执行命令，不是沙箱：只放在本机回环或可信 VPN 后面。" },
          ],
          uses: ["Shell 会话", "多设备观察", "提醒"],
          links: [
            { href: "/docs/usage/#需要你介入的提醒", label: "需要你介入的提醒" },
            { href: "/docs/security/", label: "安全策略" },
          ],
        },
      ]
    : [
        {
          id: "remote-web-dev",
          icon: "world-www",
          who: "Full-stack and front-end developers · remote Linux server",
          title: "Build web apps on a remote Linux server and see the page in your browser.",
          pain: "Code, dependencies, GPU and memory live on the server; you have a thin laptop or a phone. Seeing localhost:5173 used to mean SSH, tmux and an SSH port forward, set up again on every device.",
          steps: [
            {
              text: "Register the repository, create a Git worktree per feature and start Claude Code, Codex or OpenCode right inside it.",
            },
            {
              text: "Split the terminal (Ctrl+B %): the agent on the left, pnpm dev on the right. The server holds the sessions, so closing the laptop stops nothing.",
            },
            {
              text: "Once the dev server listens, a banner appears within 3 seconds: “Port 5173 (node) is listening”. “Forward and open” previews it at /forward/5173/, with HMR WebSockets working.",
            },
            {
              text: "Review the Git diff and preview Markdown and images in the code panel beside the terminal; select lines and send path:line back to the agent.",
            },
            {
              text: "The forward shares the WebMux address, so over Tailscale or Cloudflare Tunnel it opens on your phone too: check the mobile layout while you are at it.",
            },
            {
              text: "Drag assets into the file explorer to upload them; download build output as a ZIP of the whole folder.",
            },
          ],
          uses: [
            "Port forwarding",
            "Terminal splits",
            "Git worktrees",
            "Diff review",
            "File explorer",
            "Tailscale",
          ],
          links: [
            { href: PORT_FORWARD_DOC, label: `Port forwarding${cn}` },
            { href: "/docs/usage/terminal/#终端分屏", label: "Terminal splits" },
            { href: "/docs/usage/#代码工作区", label: "Code workspace" },
            { href: "/docs/usage/worktrees/", label: "Repositories and worktrees" },
          ],
          shot: { name: "desktop-diff.png" },
        },
        {
          id: "phone-takeover",
          icon: "device-mobile",
          who: "Commuting, travelling, waiting in line",
          title: "Away from your desk, your phone buzzes when the agent has a question.",
          pain: "Halfway through a long task the agent needs one permission or one answer. With nobody there, it waits for hours.",
          steps: [
            {
              text: "Install the PWA and turn on Web Push: questions, permission requests, errors and completions reach the lock screen, and an in-page toast appears at the top right with no permission needed.",
            },
            {
              text: "Tap through to the session: answer in the native TUI with the soft-key bar (Esc, Ctrl, arrows, / @ #) or switch to the chat view and type.",
            },
            {
              text: "The chat view handles permission prompts and forms once, first answer wins; messages sent mid-turn join a queue shared by all devices.",
            },
            {
              text: "Locking the phone, switching to mobile data or closing the tab changes nothing; coming back replays only what you missed.",
            },
          ],
          uses: ["Web Push", "Soft-key bar", "Chat view", "Reconnect"],
          links: [
            { href: "/docs/deployment/pwa-and-push/", label: `Install as an app and push${cn}` },
            { href: "/docs/usage/mobile/", label: `Mobile${cn}` },
            { href: "/docs/hybrid-sessions/#聊天视图", label: `Chat view${cn}` },
          ],
          shot: { name: "mobile-omp.png" },
        },
        {
          id: "parallel-agents",
          icon: "git-branch",
          who: "Developers juggling several tasks",
          title: "Run several agents in their own worktrees and see at a glance who needs you.",
          pain: "Many terminal tabs, many tmux windows: which one finished, which is stuck on a permission, which failed? You click through them one by one.",
          steps: [
            {
              text: "Quick Start: pick a repository and base branch, an agent and the first task; WebMux creates a worktree and starts the chat.",
            },
            {
              text: "Workbench mode lists every session as repository → worktree → session; cards show live status and screen previews, and sessions that need an answer, a permission or hit an error turn red.",
            },
            {
              text: "Tasks stay apart: each worktree has its own branch and folder, and removal checks for uncommitted changes and live sessions first.",
            },
            {
              text: "Chat sessions can be stopped and archived, then resumed to chat or terminal from their worktree's “Archived” section.",
            },
          ],
          uses: ["Quick Start", "Session overview", "Git worktrees", "Archive and resume"],
          links: [
            { href: "/docs/usage/#会话列表", label: `Session list${cn}` },
            { href: "/docs/usage/worktrees/", label: `Repositories and worktrees${cn}` },
            { href: "/docs/hybrid-sessions/#关闭中断与恢复", label: `Archive and resume${cn}` },
          ],
          shot: { name: "desktop-overview.png" },
        },
        {
          id: "workstation",
          icon: "cpu",
          who: "A workstation at home, a GPU box in the lab",
          title: "Hand long jobs to the powerful machine at home and check in from anywhere.",
          pain: "Training, builds and data jobs run for hours; when SSH drops you reconnect and hunt for the output again.",
          steps: [
            {
              text: `Run one ~${SIZE} MB binary as a normal user on the workstation: about 13 MB of memory when idle, no root, tmux or database.`,
            },
            {
              text: "Tailscale Serve gives it an HTTPS address that laptops, tablets and phones open directly.",
            },
            {
              text: "Programs like omp draw charts right in the browser terminal through the Kitty graphics protocol; search finds keywords in the kept output.",
            },
            {
              text: "Preview result files in the code panel: CSV / TSV tables, JSON trees, PDFs and images, and download them when needed.",
            },
          ],
          uses: ["Tailscale Serve", "Terminal graphics", "Find in output", "File previews"],
          links: [
            { href: "/docs/tailscale/", label: `Tailscale Serve / Funnel${cn}` },
            { href: "/docs/usage/terminal/#终端图形", label: `Terminal graphics${cn}` },
            { href: "/docs/usage/terminal/#查找终端输出", label: `Find in output${cn}` },
          ],
          shot: {
            name: "kitty-graphics/after-desktop-light.png",
            dark: "kitty-graphics/after-desktop-dark.png",
          },
        },
        {
          id: "review-anywhere",
          icon: "eye-check",
          who: "Anyone who signs off on agent changes",
          title: "When the agent is done, review the diff on a tablet or phone first.",
          pain: "The agent touched a dozen files. You want a look before merging, but that waits until you are back at an editor.",
          steps: [
            {
              text: "The code panel groups changes into unstaged, staged and untracked; diffs switch between split and unified by width, image diffs included.",
            },
            {
              text: "Select lines to insert a path:12-18 reference into the draft or terminal, add your notes and send them to the agent in one go.",
            },
            {
              text: "On a desktop, pop the code panel out into its own window and keep terminal and diff side by side on two screens.",
            },
          ],
          uses: ["Diff review", "Line references", "Drafts", "Pop-out window"],
          links: [
            { href: "/docs/usage/#代码工作区", label: `Code workspace${cn}` },
            { href: "/docs/usage/#草稿模式", label: `Drafts${cn}` },
          ],
          shot: { name: "mobile-diff.png" },
        },
        {
          id: "terminal-handoff",
          icon: "terminal-2",
          who: "People who live in their local terminal",
          title: "Start in your own terminal, carry on in the browser when you leave.",
          pain: "The agent is already running in iTerm or Windows Terminal, and you cannot take that process with you.",
          steps: [
            {
              text: "Start it with webmux run -- claude in your local terminal; it feels the same as running it directly.",
            },
            {
              text: "Press Ctrl+] to detach; the process stays on the server, and a phone or another computer opens the same session.",
            },
            {
              text: "Back at your desk, webmux attach <ID> picks it up. It is the same process all the way, and no output is lost.",
            },
          ],
          uses: ["webmux run / attach", "One PTY", "Multi-device control"],
          links: [
            { href: "/docs/usage/#从终端启动与附着", label: `Run and attach from a terminal${cn}` },
          ],
        },
        {
          id: "windows-wsl",
          icon: "brand-windows",
          who: "Windows users",
          title: "Run agents in WSL 2 on Windows and manage everything from the tray.",
          pain: "Agent CLIs work best on Linux or macOS; on Windows you wire up a WSL service, ports and autostart yourself.",
          steps: [
            {
              text: "Run the installer: the tray app installs the matching server into WSL and starts, monitors, restarts and upgrades it. No administrator rights are needed for the tray.",
            },
            {
              text: "Use webmux.exe run / attach in PowerShell or Windows Terminal to drive sessions inside WSL; the current folder is translated to a WSL path.",
            },
            {
              text: "Turn on Tailscale Serve or LAN access from the tray menu and take over from your phone.",
            },
          ],
          uses: ["Tray app", "webmux.exe", "Auto-update"],
          links: [{ href: "/en/windows/", label: "WebMux on Windows" }],
        },
        {
          id: "docs-and-data",
          icon: "file-analytics",
          who: "Beyond code: docs, data and research",
          title:
            "Let the agent produce reports, tables and PDFs, and read the result in the browser.",
          pain: "The Markdown, CSV and PDF files the agent writes sit in a folder on the server; reading them means downloading first.",
          steps: [
            {
              text: "Uploaded material lands in the session temp folder and its server path is typed into the terminal for the agent to read.",
            },
            {
              text: "Preview output in the code panel: Markdown with a table of contents, CSV / TSV with sticky headers, collapsible JSON, PDFs with page jump and zoom.",
            },
            {
              text: "Save prompts you reuse as quick commands and insert them from the terminal menu, the soft-key bar or beside the chat Send button.",
            },
          ],
          uses: ["Session temp folder", "File previews", "Quick commands", "Uploads"],
          links: [
            { href: "/docs/usage/terminal/#会话临时文件夹", label: `Session temp folder${cn}` },
            { href: "/docs/usage/terminal/#文件上传", label: `File uploads${cn}` },
          ],
          shot: {
            name: "file-explorer/after-desktop-light.png",
            dark: "file-explorer/after-desktop-dark.png",
          },
        },
        {
          id: "ops",
          icon: "heartbeat",
          who: "Developers who run their own servers",
          title: "Keep an eye on long migrations and deploy scripts from your phone.",
          pain: "A data migration takes half an hour and you dare not close the laptop in case SSH drops and takes the process with it.",
          steps: [
            {
              text: "Run the script in a WebMux shell session; a browser disconnect does not touch the process, and notifications the program emits can reach your phone.",
            },
            {
              text: "Open the same session on several devices: one controls, the others watch, and typing takes over control.",
            },
            {
              text: "WebMux runs commands as the service user and is not a sandbox: keep it on loopback or behind a trusted VPN.",
            },
          ],
          uses: ["Shell sessions", "Multi-device watching", "Alerts"],
          links: [
            { href: "/docs/usage/#需要你介入的提醒", label: `Attention alerts${cn}` },
            { href: "/en/security/", label: "Security" },
          ],
        },
      ];
}

/** Situations WebMux is not built for, with a better fit. */
export function notFor(lang: Lang): [string, string][] {
  return lang === "zh-cn"
    ? [
        ["多人共用一台服务", "WebMux 是单用户服务，没有账号与权限隔离；团队请各自部署。"],
        [
          "在浏览器里编辑代码",
          "代码面板是只读的，没有编辑器与 Git 提交界面；需要时搭配 VS Code Remote 或 code-server。",
        ],
        [
          "服务重启后终端会话还在",
          "终端会话只在内存中，服务重启即结束；只有混合会话可从记录恢复。需要跨重启的 shell 请用 tmux。",
        ],
        [
          "直接暴露到公网",
          "不要这样做。用 Tailscale / WireGuard，或受控隧道（此时 Token 是唯一屏障）。",
        ],
        [
          "转发其他主机或容器里的端口",
          "端口转发只能转发服务器本机的端口，不含其他主机或 Docker 网络命名空间。",
        ],
      ]
    : [
        [
          "Several people sharing one service",
          "WebMux is single-user with no accounts or isolation; give each person their own instance.",
        ],
        [
          "Editing code in the browser",
          "The code panel is read-only, with no editor or Git commit UI; pair it with VS Code Remote or code-server.",
        ],
        [
          "Terminal sessions that survive a service restart",
          "Terminal sessions live in memory and end on restart; only hybrid sessions resume from their records. Use tmux for shells that must survive.",
        ],
        [
          "Exposing it directly to the internet",
          "Don't. Use Tailscale / WireGuard or a controlled tunnel, where the token is the only barrier.",
        ],
        [
          "Forwarding ports from other hosts or containers",
          "Port forwarding only reaches ports on the server itself, not other hosts or Docker network namespaces.",
        ],
      ];
}
