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
      source: "从源码构建",
    },
    copy: "复制命令",
    copied: "已复制",
    copyFailed: "无法自动复制，请手动选中下方命令",
    sep: "、",
    end: "。",
    linux: {
      s1: "1. 安装。",
      s1d: "自动识别 Linux / macOS 与架构；优先用 minisign 或支持 Ed25519 的 OpenSSL 验证发布清单签名，再按清单校验二进制的 SHA-256。通过后安装到 ~/.local/bin，无需 sudo。",
      s2: "2. 运行。",
      s2d: "默认只监听本机 127.0.0.1:7681。在浏览器打开 http://127.0.0.1:7681，点击“新建会话”；要使用其他设备，见下方“从手机访问”。",
      s3: "3. 下一步：",
      services: "让服务常驻后台",
      remote: "从手机访问",
      attach: "在常用终端里启动 agent",
    },
    options: {
      title: "更多选项：国内镜像、开发版、固定版本、安装目录",
      mirror: "从 ghfast.top 镜像获取安装脚本",
      mirrorNote:
        "这会直接执行镜像返回的脚本；签名不能保护已被替换的验签脚本。优先从 GitHub 获取脚本，或先用独立可信的摘要核对脚本本身。",
      dev: "安装开发版（预发布 Release dev 中的当前开发版）",
      devNote:
        "只影响本次安装，不写配置；想让 webmux update check 也跟随开发版，再执行 sudo webmux update channel dev。",
      version: "固定版本（留空为最新；v0.11.0 以前需另行提供可信的 WEBMUX_SHA256）",
      dir: "安装目录（留空为 ~/.local/bin）",
    },
    windows: {
      s1: "1. 准备 WSL 2。",
      s1d: "Windows 10 22H2 及以上或 Windows 11，从 Microsoft Store 安装的 WSL 2（在 PowerShell 执行 wsl --update 升级），至少一个发行版；安装托盘本身不需要管理员权限。",
      s2: "2. 下载并运行",
      s2d: "。只为当前用户安装，并内置同架构的 Linux 服务端。默认勾选的托盘转发防火墙规则仅限专用 / 域网络，不需要时可取消。安装程序没有 Windows 代码签名；遇到 SmartScreen 提示，请先按下载页说明核实发布清单签名与安装包摘要。",
      s2tray: "（托盘程序，无需安装）。",
      s3: "3. 在托盘菜单选择“安装 WSL 中的 webmux”。",
      s3d: "托盘下载与发行版架构匹配的 Linux 二进制，校验 SHA-256 后安装，然后从菜单启动 WebMux。",
      more: "Windows 托盘、控制台客户端与故障诊断",
    },
    packages: {
      archNote:
        "以下示例需先安装 minisign 0.11 或以上版本。arm64 设备请把 file 换成下载表中对应的软件包。",
      enable: "开机自启。",
      enableNote:
        "软件包不会为任何用户启用服务；首次启动会在 ~/.config/webmux/config.toml 生成带随机 Token 的配置。包内另带自动更新的 systemd 定时器，第一次装上带定时器的版本时启用。",
      none: (v?: string) =>
        `${v ? `v${v}` : "当前版本"} 未附带 deb / rpm 包，请使用 Linux / macOS 一键脚本。`,
      doc: "安装包说明",
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
      source: "Build from source",
    },
    copy: "Copy command",
    copied: "Copied",
    copyFailed: "Copy failed; select the command below manually",
    sep: ", ",
    end: ".",
    linux: {
      s1: "1. Install.",
      s1d: "Detects Linux / macOS and your architecture. With minisign or Ed25519-capable OpenSSL, it verifies the release manifest signature, then checks the binary’s SHA-256 before installing to ~/.local/bin. No sudo needed.",
      s2: "2. Run.",
      s2d: "WebMux listens on 127.0.0.1:7681 only by default. Open http://127.0.0.1:7681 in a browser and click “New session”; to use another device, see “reach it from your phone” below.",
      s3: "3. Next:",
      services: "keep it running in the background",
      remote: "reach it from your phone",
      attach: "start agents from your usual terminal",
    },
    options: {
      title: "More options: mirror, dev build, pinned version, install directory",
      mirror: "Fetch the installer script from the ghfast.top mirror",
      mirrorNote:
        "This executes the script returned by a third party. A replaced script could skip verification. Prefer GitHub for the script itself, or check the script against a digest from an independent trusted source first.",
      dev: "Install the development build (current build from the pre-release “dev” Release)",
      devNote:
        "Applies to this install only and saves nothing; to make webmux update check follow the dev channel too, run sudo webmux update channel dev afterwards.",
      version:
        "Pin a version (empty = latest; before v0.11.0 supply a trusted WEBMUX_SHA256 separately)",
      dir: "Install directory (empty = ~/.local/bin)",
    },
    windows: {
      s1: "1. Prepare WSL 2.",
      s1d: "Windows 10 22H2+ or Windows 11, WSL 2 from the Microsoft Store (run wsl --update in PowerShell), and at least one distribution. Installing the tray itself needs no administrator rights.",
      s2: "2. Download and run",
      s2d: ". It installs for the current user only and bundles the matching Linux server. The optional tray-forwarding firewall rule is limited to private and domain networks. The installer has no Windows code signature; if SmartScreen warns, verify the signed release manifest and installer digest before proceeding.",
      s2tray: " (the tray app; no installer needed).",
      s3: "3. In the tray menu, choose “Install webmux in WSL”.",
      s3d: "The tray fetches the Linux binary matching your distribution, verifies its SHA-256, installs it, and starts WebMux from the menu.",
      more: "Windows tray, console client and troubleshooting",
    },
    packages: {
      archNote:
        "Install minisign 0.11 or newer first. On arm64, set file to the matching package name from the download table.",
      enable: "Start at login.",
      enableNote:
        "Packages never enable the service for any user. The first start writes ~/.config/webmux/config.toml with a random token. They also ship an auto-update systemd timer, enabled the first time you install a version that includes it.",
      none: (v?: string) =>
        `${v ? `v${v}` : "This release"} ships no deb / rpm packages; use the Linux / macOS script instead.`,
      doc: "About the packages",
    },
    source: {
      intro: "To compile it yourself, install Go 1.26+, Node.js, pnpm and GNU Make, then run:",
      more: "Development setup and build requirements",
    },
  },
} as const;
