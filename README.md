# webmux-site

Official website for [WebMux](https://github.com/mzdluo123/webmux): marketing pages, download and install, and a mirror of the project documentation. The specification lives in the main repository under `docs/website/` (strategy, stack, pages, design, UX, SEO, features, checklist); the chosen visual direction is “叙事长卷” (prototype C).

## Stack

- [Astro](https://astro.build) static site, [Starlight](https://starlight.astro.build) for the docs mirror (`/docs/`, Pagefind search).
- UI: [shadcn-svelte](https://shadcn-svelte.com) components (`src/lib/components/ui`, adapted copies from the product's `web/`) on Tailwind CSS v4 and the product's own design tokens (`src/styles/design-tokens.css`, synced). Interactive pieces are Svelte 5 islands; everything else renders to plain HTML.
- Hosting: Cloudflare Workers static assets (`wrangler.jsonc`), with `_headers` and `_redirects`.

## Layout

```
scripts/
  sync.mjs             entry point: docs mirror + assets from one mzdluo123/webmux ref
  sync-docs.mjs        docs/ → src/content/docs, images → public/docs/images, sidebar, manifest
  sync-assets.mjs      logos, fonts, licenses, screenshots, agent icons, design tokens
  fetch-releases.mjs   build-time GitHub Releases data → src/data/releases.json
  postbuild.mjs        renders dist/_headers with CSP hashes for inline scripts
  build-og.mjs         regenerates public/og/*.png (run manually, needs a CJK font)
src/plugins/remark-webmux-docs.mjs   link/anchor/image rewriting and GitHub alerts at build time
src/views/            page views shared by the zh (/) and en (/en/) routes
tests/                link + anchor checker, axe/overflow scan, static server
```

Generated, never hand-edited: `src/content/docs/**`, `public/docs/**`, `public/{brand,fonts,licenses}/**`, `src/assets/{screenshots,agents,brand}/**`, `src/styles/design-tokens.css`, `src/data/{docs-manifest,docs-sidebar,assets-manifest,screenshots,fonts}.json`.

## Docs sync

`pnpm sync` mirrors the **latest release tag** of mzdluo123/webmux. When that tag predates the docs hub (`docs/README.md`), it mirrors `main` instead and switches back automatically once a release ships the hub. Override with `WEBMUX_REF=<ref>`; use `WEBMUX_SOURCE=../webmux` to read from a local clone instead of cloning.

- Excluded by rule: `docs/agent-rules*`, `docs/doc-governance.md`, `docs/user-stories/verification-log-*.md`, and any file whose first lines contain `<!-- site: exclude -->`.
- Links to files that are not mirrored point to GitHub at the mirrored ref; a link that resolves to nothing fails the sync and the build.
- `pnpm sync:check` regenerates from the commit recorded in `src/data/docs-manifest.json` and fails if the committed mirror differs.

The `Site` workflow re-syncs daily, on manual dispatch, and on a `repository_dispatch` event of type `webmux-release` (send it from the main repository's release workflow with a fine-grained token that can dispatch to this repo), commits the diff to `main`, then builds and deploys.

## Develop

```sh
corepack enable            # pnpm version comes from package.json
pnpm install
pnpm dev                   # http://localhost:4321
pnpm build                 # fetch release data, astro build, render _headers
pnpm preview               # wrangler dev on dist/ (applies _headers/_redirects)
pnpm check                 # astro check
pnpm test:links && pnpm test:html && pnpm test:a11y && pnpm test:lighthouse
```

After changing `src/plugins/remark-webmux-docs.mjs` or the Expressive Code options, delete `.astro/` and `node_modules/.astro/` so cached docs re-render.

## Deploy

GitHub Actions (`.github/workflows/site.yml`): pull requests run the gates and upload a preview version (`pr-<n>` alias); pushes to `main` deploy with `wrangler deploy` to the custom domain `webmux.rainbit.net` (declared in `wrangler.jsonc`). Required secrets: `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit) and `CLOUDFLARE_ACCOUNT_ID`. Optional repository variables: `SITE_URL` (canonical origin, defaults to `https://webmux.rainbit.net` from `site.config.mjs`) and `PUBLIC_CF_WEB_ANALYTICS_TOKEN` (cookie-free Cloudflare Web Analytics).

## License

Site code: MIT. Synced fonts (Inter, Maple Mono: OFL) and LobeHub icons (MIT) keep their licenses under `public/licenses/`.
