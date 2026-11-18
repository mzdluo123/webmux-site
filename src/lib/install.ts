import {
  DEV_INSTALL_URL,
  INSTALL_URL,
  MIRROR_PREFIX,
  REPO_URL,
  SITE_URL,
} from "../../site.config.mjs";
import { localize, type Lang } from "./i18n";
import { findAsset, latest, version } from "./releases";
import { shellArg } from "./shell";

const link = (a?: { name: string; url: string }) => (a ? { name: a.name, url: a.url } : undefined);

// Stable release key published in upstream docs/deployment/updates.md and embedded in install.sh.
const STABLE_RELEASE_KEY = "RWQchIwF6KH3SuZyvOfqZZAoobboXxcEAyyLB3YptnKdLs7vUvxLHm4e";

/** Install only the selected asset, after authenticating the manifest, version and digest. */
export function manualInstallCommand(version: string, asset: string) {
  const install = asset.endsWith(".deb")
    ? 'sudo apt install "./$file"'
    : asset.endsWith(".rpm")
      ? 'sudo dnf install "./$file"'
      : 'mkdir -p "$HOME/.local/bin"\n  install -m 755 "$file" "$HOME/.local/bin/webmux"';
  return `(
  set -eu
  version=${shellArg(version)}
  file=${shellArg(asset)}
  base="${REPO_URL}/releases/download/v$version"
  work=$(mktemp -d)
  trap 'rm -rf "$work"' EXIT
  cd "$work"
  for name in SHA256SUMS SHA256SUMS.minisig "$file"; do
    curl -fsSLO "$base/$name"
  done
  signed=$(minisign -QVm SHA256SUMS -P ${STABLE_RELEASE_KEY})
  [ "$signed" = "webmux $version" ] || { echo "Wrong release version" >&2; exit 1; }
  awk -v file="$file" '$2 == file {print; found++} END {exit (found != 1)}' SHA256SUMS > selected.sha256
  if command -v sha256sum >/dev/null; then
    sha256sum -c selected.sha256
  else
    shasum -a 256 -c selected.sha256
  fi
  ${install}
)`;
}

/** Props for InstallGenerator.svelte, derived from build-time release data. */
export function installProps(lang: Lang) {
  const releaseVersion = version;
  return {
    lang,
    version: releaseVersion,
    installUrl: INSTALL_URL,
    devInstallUrl: DEV_INSTALL_URL,
    mirrorPrefix: MIRROR_PREFIX,
    packages: releaseVersion
      ? (latest?.assets ?? [])
          .filter((a) => /\.(deb|rpm)$/.test(a.name))
          .map((a) => ({ name: a.name, command: manualInstallCommand(releaseVersion, a.name) }))
      : [],
    windowsSetup: link(findAsset(/^webmux-setup-windows-amd64\.exe$/)),
    windowsTray: link(findAsset(/^webmux-tray-windows-amd64\.exe$/)),
    links: {
      services: "/docs/deployment/services/",
      remote: "/docs/deployment/remote-access/",
      attach: "/docs/usage/command-line/#启动与附着",
      windows: localize(lang, "/windows/"),
      install: "/docs/deployment/install-and-upgrade/",
      security: localize(lang, "/security/"),
      contributing: "/docs/contributing/#从源码构建",
    },
  };
}

/** SoftwareApplication JSON-LD for the home and download pages (seo.md#结构化数据). */
export function softwareApplication(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WebMux",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows (WSL 2)",
    ...(latest && {
      softwareVersion: latest.tag,
      datePublished: latest.publishedAt,
      downloadUrl: latest.url,
    }),
    license: "https://spdx.org/licenses/MIT.html",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    screenshot: new URL("/og/home-zh-cn.png", SITE_URL).href,
    url: new URL(localize(lang, "/"), SITE_URL).href,
    author: { "@type": "Person", name: "mzdluo123", url: "https://github.com/mzdluo123" },
    sameAs: [REPO_URL],
  };
}
