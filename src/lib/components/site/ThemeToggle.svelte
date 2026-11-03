<script lang="ts">
  // Theme override (design.md#深色模式与动效): one shadcn Button cycling system → light → dark.
  // A dropdown would pull bits-ui's floating layer onto every page, past the 50 KB JS budget
  // (ux.md#性能预算).
  import IconDeviceDesktop from "@tabler/icons-svelte/icons/device-desktop";
  import IconMoon from "@tabler/icons-svelte/icons/moon";
  import IconSun from "@tabler/icons-svelte/icons/sun";
  import { Button } from "$lib/components/ui/button/index.js";
  import { applyTheme, readTheme, type ThemeChoice } from "$lib/theme";

  let { labels }: { labels: { label: string; auto: string; light: string; dark: string } } =
    $props();
  const order: ThemeChoice[] = ["auto", "light", "dark"];
  const icons = { auto: IconDeviceDesktop, light: IconSun, dark: IconMoon };
  let choice = $state<ThemeChoice>("auto");
  $effect(() => {
    choice = readTheme();
  });
  const Current = $derived(icons[choice]);
  const name = $derived(`${labels.label}: ${labels[choice]}`);

  let status = $state("");

  function next() {
    choice = order[(order.indexOf(choice) + 1) % order.length];
    applyTheme(choice);
    status = `${labels.label}: ${labels[choice]}`;
  }
</script>

<Button
  variant="ghost"
  size="icon"
  class="wm-control text-muted-foreground"
  aria-label={name}
  title={name}
  onclick={next}
>
  <Current class="size-[18px]" aria-hidden="true" />
</Button>
<span class="sr-only" aria-live="polite">{status}</span>
