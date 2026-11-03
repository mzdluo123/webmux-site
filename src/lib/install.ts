import { INSTALL_URL, MIRROR_PREFIX, REPO_URL, SITE_URL } from "../../site.config.mjs";
import { localize, type Lang } from "./i18n";
import { findAsset, latest, version } from "./releases";

const link = (a?: { name: string; url: string }) => (a ? { name: a.name, url: a.url } : undefined);

/** Props for InstallGenerator.svelte, derived from build-time release data. */
export function installProps(lang: Lang) {
  return {
    lang,
    version,
    installUrl: INSTALL_URL,
    mirrorPrefix: MIRROR_PREFIX,
    packages: (latest?.assets ?? [])
      .filter((a) => /\.(deb|rpm)$/.test(a.name))
      .map((a) => ({ name: a.name, url: a.url })),
    windowsSetup: link(findAsset(/^webmux-setup-windows-amd64\.exe$/)),
    windowsTray: link(findAsset(/^webmux-tray-windows-amd64\.exe$/)),
    links: {
      services: "/docs/deployment/services/",
      remote: "/docs/deployment/remote-access/",
      attach: "/docs/usage/#从终端启动与附着",
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
