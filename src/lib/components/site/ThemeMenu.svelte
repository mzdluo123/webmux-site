<script lang="ts">
  import IconDeviceDesktop from "@tabler/icons-svelte/icons/device-desktop";
  import IconMoon from "@tabler/icons-svelte/icons/moon";
  import IconSun from "@tabler/icons-svelte/icons/sun";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { applyTheme, readTheme, type ThemeChoice } from "$lib/theme";

  let { labels }: { labels: { label: string; auto: string; light: string; dark: string } } =
    $props();
  let choice = $state<ThemeChoice>("auto");
  $effect(() => {
    choice = readTheme();
  });
  const icons = { auto: IconDeviceDesktop, light: IconSun, dark: IconMoon };
  const Current = $derived(icons[choice]);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={buttonVariants({ variant: "ghost", size: "icon" })}
    aria-label={`${labels.label}: ${labels[choice]}`}
  >
    <Current class="size-[18px] text-muted-foreground" aria-hidden="true" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end" class="min-w-36">
    <DropdownMenu.RadioGroup
      bind:value={choice}
      onValueChange={(v) => applyTheme(v as ThemeChoice)}
    >
      {#each ["auto", "light", "dark"] as const as option (option)}
        {@const OptionIcon = icons[option]}
        <DropdownMenu.RadioItem value={option} closeOnSelect>
          <OptionIcon class="size-4" aria-hidden="true" />
          {labels[option]}
        </DropdownMenu.RadioItem>
      {/each}
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>
