// Copy for the install generator. Commands and facts follow README "快速开始" and
// docs/deployment/install-and-upgrade.md / windows-wsl.md in mzdluo123/webmux.
export type InstallLang = "zh-cn" | "en";

export const installCopy = {
  "zh-cn": {
    tabsLabel: "安装方式",
    tabs: {
      linux: "Linux / macOS",
      windows: "Windows（WSL）",
      packages: "deb / rpm",
      manual: "手动下载",
      source: "从源码构建",
    },
    copy: "复制命令",
    copied: "已复制",
    copyFailed: "无法自动复制，请手动选中下方命令",
    sep: "、",
    end: "。",
    linux: {
      s1: "1. 安装。",
      s1d: "自动识别 Linux / macOS 与 amd64 / arm64，校验 SHA-256 后装到 ~/.local/bin，不需要 sudo，也不改写 shell 配置。",
      s2: "2. 运行。",
      s2d: "默认只监听本机 127.0.0.1:7681。在浏览器打开 http://127.0.0.1:7681，点击“新建会话”；要让局域网或 VPN 内的设备访问，见下方“从手机访问”。",
      s3: "3. 下一步：",
      services: "让服务常驻后台",
      remote: "从手机访问",
      attach: "在常用终端里启动 agent",
    },
    options: {
      title: "更多选项：国内镜像、开发版、固定版本、安装目录",
      mirror: "使用国内镜像（ghfast.top 代理同一 Release 资产）",
      mirrorNote:
        "镜像是第三方服务，能看到请求者 IP；二进制与 SHA256SUMS 必须来自同一来源并通过校验。",
      dev: "安装开发版（预发布 Release dev 中的当前开发版）",
      devNote:
        "只影响本次安装，不写配置；想让 webmux update check 也跟随开发版，再执行 sudo webmux update channel dev。",
      version: "固定版本（留空为最新；开发版时不可用）",
      dir: "安装目录（留空为 ~/.local/bin）",
    },
    windows: {
      s1: "1. 准备 WSL 2。",
      s1d: "Windows 10 22H2 及以上或 Windows 11，从 Microsoft Store 安装的 WSL 2（在 PowerShell 执行 wsl --update 升级），至少一个发行版；安装托盘本身不需要管理员权限。",
      s2: "2. 下载并运行",
      s2d: "。只为当前用户安装，并内置同架构的 Linux 服务端。默认勾选的“允许其他设备通过托盘转发访问”会在安装完成后弹出一次管理员确认，添加仅限专用 / 域网络的防火墙规则，不需要时可取消勾选。安装程序未签名，SmartScreen 拦截时选择“更多信息 → 仍要运行”。",
      s2tray: "（托盘程序，无需安装）。",
      s3: "3. 在托盘菜单选择“安装 WSL 中的 webmux”。",
      s3d: "托盘下载与发行版架构匹配的 Linux 二进制，校验 SHA-256 后安装，然后从菜单启动 WebMux。",
      more: "Windows 托盘、控制台客户端与故障诊断",
    },
    packages: {
      archNote: "arm64 设备请在下载表中选择对应的包。",
      enable: "开机自启。",
      enableNote:
        "软件包不会为任何用户启用服务；首次启动会在 ~/.config/webmux/config.toml 生成带随机 Token 的配置。包内另带自动更新的 systemd 定时器，第一次装上带定时器的版本时启用。",
      none: (v?: string) =>
        `${v ? `v${v}` : "当前版本"} 未附带 deb / rpm 包，请使用 Linux / macOS 一键脚本。`,
      doc: "安装包说明",
    },
    manual: {
      intro:
        "不用脚本时，手动下载对应平台的二进制与 SHA256SUMS，校验后安装（以 Linux amd64 为例）：",
      note: "其他平台把文件名换成 webmux-{linux,darwin}-{amd64,arm64}。",
      more: "安装与升级文档",
    },
    source: {
      intro: "只想自己编译、不参与开发时，装好 Go 1.26+、Node.js、pnpm 与 GNU Make 后执行：",
      more: "开发环境与构建要求",
    },
  },
  en: {
    tabsLabel: "Install method",
    tabs: {
      linux: "Linux / macOS",
      windows: "Windows (WSL)",
      packages: "deb / rpm",
      manual: "Manual download",
      source: "Build from source",
    },
    copy: "Copy command",
    copied: "Copied",
    copyFailed: "Copy failed; select the command below manually",
    sep: ", ",
    end: ".",
    linux: {
      s1: "1. Install.",
      s1d: "Detects Linux / macOS and amd64 / arm64, verifies SHA-256 and installs to ~/.local/bin. No sudo, no changes to your shell config.",
      s2: "2. Run.",
      s2d: "WebMux listens on 127.0.0.1:7681 only by default. Open http://127.0.0.1:7681 in a browser and click “New session”; to reach it from other devices on your LAN or VPN, see “reach it from your phone” below.",
      s3: "3. Next:",
      services: "keep it running in the background",
      remote: "reach it from your phone",
      attach: "start agents from your usual terminal",
    },
    options: {
      title: "More options: mirror, dev build, pinned version, install directory",
      mirror: "Use the ghfast.top mirror (proxies the same Release assets)",
      mirrorNote:
        "The mirror is a third-party service and can see your IP. The binary and SHA256SUMS must come from the same source and pass verification.",
      dev: "Install the development build (current build from the pre-release “dev” Release)",
      devNote:
        "Applies to this install only and saves nothing; to make webmux update check follow the dev channel too, run sudo webmux update channel dev afterwards.",
      version: "Pin a version (empty = latest; unavailable for the dev build)",
      dir: "Install directory (empty = ~/.local/bin)",
    },
    windows: {
      s1: "1. Prepare WSL 2.",
      s1d: "Windows 10 22H2+ or Windows 11, WSL 2 from the Microsoft Store (run wsl --update in PowerShell), and at least one distribution. Installing the tray itself needs no administrator rights.",
      s2: "2. Download and run",
      s2d: ". It installs for the current user only and bundles the matching Linux server. The pre-ticked “allow other devices through the tray” option shows one administrator prompt after install to add a firewall rule limited to private and domain networks; untick it if you do not need it. The installer is unsigned; if SmartScreen blocks it, choose “More info → Run anyway”.",
      s2tray: " (the tray app; no installer needed).",
      s3: "3. In the tray menu, choose “Install webmux in WSL”.",
      s3d: "The tray fetches the Linux binary matching your distribution, verifies its SHA-256, installs it, and starts WebMux from the menu.",
      more: "Windows tray, console client and troubleshooting",
    },
    packages: {
      archNote: "On arm64, pick the matching package from the download table.",
      enable: "Start at login.",
      enableNote:
        "Packages never enable the service for any user. The first start writes ~/.config/webmux/config.toml with a random token. They also ship an auto-update systemd timer, enabled the first time you install a version that includes it.",
      none: (v?: string) =>
        `${v ? `v${v}` : "This release"} ships no deb / rpm packages; use the Linux / macOS script instead.`,
      doc: "About the packages",
    },
    manual: {
      intro:
        "Without the script, download the binary and SHA256SUMS, verify, then install (Linux amd64 shown):",
      note: "For other platforms use webmux-{linux,darwin}-{amd64,arm64}.",
      more: "Install and upgrade docs",
    },
    source: {
      intro: "To compile it yourself, install Go 1.26+, Node.js, pnpm and GNU Make, then run:",
      more: "Development setup and build requirements",
    },
  },
} as const;
