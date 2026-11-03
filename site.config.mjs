// Production origin. Canonical URLs, sitemap, OG and hreflang links are built from it.
// Change it here (or via SITE_URL in CI) when a custom domain replaces workers.dev.
export const SITE_URL = process.env.SITE_URL || "https://webmux-site.rainchan.workers.dev";

export const REPO = "mzdluo123/webmux";
export const REPO_URL = `https://github.com/${REPO}`;
export const SITE_REPO_URL = "https://github.com/mzdluo123/webmux-site";
export const INSTALL_URL = `${REPO_URL}/releases/latest/download/install.sh`;
export const MIRROR_PREFIX = "https://ghfast.top/";
