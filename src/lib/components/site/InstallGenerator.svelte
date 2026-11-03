<script lang="ts">
  // Install command generator (features.md#1-安装命令生成器, design.md#安装区与提示).
  // Server-rendered with the Linux / macOS tab active, so the default command is in the HTML
  // without JS. Hydration pre-selects the visitor's OS (never hides other tabs) and enables
  // the mirror / pinned version / install directory options.
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import IconChevronRight from "@tabler/icons-svelte/icons/chevron-right";
  import CommandBox from "./CommandBox.svelte";
  import { installCopy, type InstallLang } from "./install-copy";

  interface AssetLink {
    name: string;
    url: string;
  }
  let {
    lang,
    version,
    installUrl,
    mirrorPrefix,
    packages,
    windowsSetup,
    windowsTray,
    tabs = ["linux", "windows", "packages", "manual"],
    links,
  }: {
    lang: InstallLang;
    version?: string;
    installUrl: string;
    mirrorPrefix: string;
    packages: AssetLink[];
    windowsSetup?: AssetLink;
    windowsTray?: AssetLink;
    tabs?: ("linux" | "windows" | "packages" | "manual" | "source")[];
    /** Localized site paths for "next steps". */
    links: {
      services: string;
      remote: string;
      attach: string;
      windows: string;
      install: string;
      security: string;
      contributing: string;
    };
  } = $props();
  const c = $derived(installCopy[lang]);

  let tab = $state("linux");
  let mirror = $state(false);
  let pinned = $state("");
  let dir = $state("");

  $effect(() => {
    // Pre-select only; userAgentData first, platform as fallback (ux.md#渐进增强).
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = nav.userAgentData?.platform || navigator.platform || "";
    if (/win/i.test(platform) && tabs.includes("windows")) tab = "windows";
  });

  const installCommand = $derived.by(() => {
    const url = `${mirror ? mirrorPrefix : ""}${installUrl}`;
    const env = [
      pinned.trim() && `WEBMUX_VERSION=${pinned.trim().replace(/[^0-9A-Za-z.\-]/g, "")}`,
      dir.trim() && `WEBMUX_INSTALL_DIR="${dir.trim().replace(/["`\\]/g, "")}"`,
    ].filter(Boolean);
    return env.length ? `curl -fsSL ${url} \\\n  | ${env.join(" ")} sh` : `curl -fsSL ${url} | sh`;
  });

  const deb = $derived(packages.filter((p) => p.name.endsWith(".deb")));
  const rpm = $derived(packages.filter((p) => p.name.endsWith(".rpm")));
  const debAmd = $derived(deb.find((p) => p.name.includes("amd64")) ?? deb[0]);
  const rpmAmd = $derived(rpm.find((p) => p.name.includes("x86_64")) ?? rpm[0]);
  const manualCommand = $derived(
    [
      `curl -LO ${installUrl.replace("install.sh", "webmux-linux-amd64")}`,
      `curl -LO ${installUrl.replace("install.sh", "SHA256SUMS")}`,
      "sha256sum --check --ignore-missing SHA256SUMS   # macOS: shasum -a 256 -c --ignore-missing SHA256SUMS",
      "install -m 755 webmux-linux-amd64 ~/.local/bin/webmux",
    ].join("\n"),
  );
  const box = $derived({ copyLabel: c.copy, copiedLabel: c.copied, failedLabel: c.copyFailed });
  const step = "m-0 text-[15px] leading-relaxed";
</script>

<Tabs.Root bind:value={tab} class="gap-6">
  <Tabs.List
    variant="line"
    class="w-full justify-start gap-4 overflow-x-auto border-b border-band-line pb-0 [scrollbar-width:none]"
    aria-label={c.tabsLabel}
  >
    {#each tabs as id (id)}
      <Tabs.Trigger
        value={id}
        class="flex-none px-0 text-[15px] text-muted-foreground data-[state=active]:text-foreground"
        >{c.tabs[id]}</Tabs.Trigger
      >
    {/each}
  </Tabs.List>

  <Tabs.Content value="linux">
    <ol class="m-0 flex list-none flex-col gap-6 p-0">
      <li class="flex flex-col gap-3">
        <p class={step}><strong>{c.linux.s1}</strong> {c.linux.s1d}</p>
        <CommandBox command={installCommand} {...box} />
        <Collapsible.Root class="rounded-md border bg-page">
          <Collapsible.Trigger
            class="group flex min-h-11 w-full items-center gap-2 px-3.5 text-left text-sm font-semibold"
          >
            <IconChevronRight
              class="size-4 transition-transform group-data-[state=open]:rotate-90"
              aria-hidden="true"
            />
            {c.options.title}
          </Collapsible.Trigger>
          <Collapsible.Content class="flex flex-col gap-4 px-3.5 pb-4">
            <div class="flex items-start gap-3">
              <Switch id={`mirror-${lang}`} bind:checked={mirror} class="mt-0.5" />
              <div class="flex flex-col gap-1">
                <Label for={`mirror-${lang}`} class="text-sm">{c.options.mirror}</Label>
                <p class="m-0 text-[13px] text-muted-foreground">{c.options.mirrorNote}</p>
              </div>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="flex flex-col gap-1.5">
                <Label for={`pin-${lang}`} class="text-sm">{c.options.version}</Label>
                <Input
                  id={`pin-${lang}`}
                  bind:value={pinned}
                  placeholder={version ?? "0.10.1"}
                  inputmode="decimal"
                  autocomplete="off"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <Label for={`dir-${lang}`} class="text-sm">{c.options.dir}</Label>
                <Input
                  id={`dir-${lang}`}
                  bind:value={dir}
                  placeholder="~/.local/bin"
                  autocomplete="off"
                />
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </li>
      <li class="flex flex-col gap-3">
        <p class={step}><strong>{c.linux.s2}</strong> {c.linux.s2d}</p>
        <CommandBox command="webmux --listen 127.0.0.1:7681" {...box} />
      </li>
      <li>
        <p class={step}>
          <strong>{c.linux.s3}</strong>
          <a class="link" href={links.services}>{c.linux.services}</a>{c.sep}
          <a class="link" href={links.remote}>{c.linux.remote}</a>{c.sep}
          <a class="link" href={links.attach}>{c.linux.attach}</a>{c.end}
        </p>
      </li>
    </ol>
  </Tabs.Content>

  <Tabs.Content value="windows">
    <ol class="m-0 flex list-none flex-col gap-6 p-0">
      <li><p class={step}><strong>{c.windows.s1}</strong> {c.windows.s1d}</p></li>
      <li class="flex flex-col gap-3">
        <p class={step}>
          <strong>{c.windows.s2}</strong>
          {#if windowsSetup}
            <a class="link font-mono text-sm" href={windowsSetup.url}>{windowsSetup.name}</a>
            {c.windows.s2d}
          {:else if windowsTray}
            <a class="link font-mono text-sm" href={windowsTray.url}>{windowsTray.name}</a>
            {c.windows.s2tray}
          {/if}
        </p>
      </li>
      <li><p class={step}><strong>{c.windows.s3}</strong> {c.windows.s3d}</p></li>
      <li><p class={step}><a class="link" href={links.windows}>{c.windows.more}</a></p></li>
    </ol>
  </Tabs.Content>

  <Tabs.Content value="packages">
    {#if debAmd || rpmAmd}
      <ol class="m-0 flex list-none flex-col gap-6 p-0">
        {#if debAmd}
          <li class="flex flex-col gap-3">
            <p class={step}><strong>Debian / Ubuntu.</strong> {c.packages.archNote}</p>
            <CommandBox
              command={`curl -LO ${debAmd.url}\nsudo apt install ./${debAmd.name}`}
              {...box}
            />
          </li>
        {/if}
        {#if rpmAmd}
          <li class="flex flex-col gap-3">
            <p class={step}><strong>Fedora / RHEL / openSUSE.</strong> {c.packages.archNote}</p>
            <CommandBox
              command={`curl -LO ${rpmAmd.url}\nsudo dnf install ./${rpmAmd.name}`}
              {...box}
            />
          </li>
        {/if}
        <li class="flex flex-col gap-3">
          <p class={step}><strong>{c.packages.enable}</strong> {c.packages.enableNote}</p>
          <CommandBox command="systemctl --user enable --now webmux" {...box} />
        </li>
      </ol>
    {:else}
      <p class={step}>
        {c.packages.none(version)} <a class="link" href={links.install}>{c.packages.doc}</a>
      </p>
    {/if}
  </Tabs.Content>

  {#if tabs.includes("manual")}
    <Tabs.Content value="manual" class="flex flex-col gap-3">
      <p class={step}>{c.manual.intro}</p>
      <CommandBox command={manualCommand} {...box} />
      <p class="m-0 text-sm text-muted-foreground">
        {c.manual.note} <a class="link" href={links.install}>{c.manual.more}</a>
      </p>
    </Tabs.Content>
  {/if}

  {#if tabs.includes("source")}
    <Tabs.Content value="source" class="flex flex-col gap-3">
      <p class={step}>{c.source.intro}</p>
      <CommandBox
        command={"git clone https://github.com/mzdluo123/webmux.git\ncd webmux\nmake build          # bin/webmux\nmake install        # ~/.local/bin/webmux"}
        {...box}
      />
      <p class="m-0 text-sm"><a class="link" href={links.contributing}>{c.source.more}</a></p>
    </Tabs.Content>
  {/if}
</Tabs.Root>
