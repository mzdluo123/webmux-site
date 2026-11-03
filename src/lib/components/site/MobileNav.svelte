<script lang="ts">
  // Narrow-screen menu (ux.md#导航模型). The shadcn Sheet provides aria-expanded on the trigger,
  // focus moving into the panel, Esc to close and focus return.
  import IconMenu2 from "@tabler/icons-svelte/icons/menu-2";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import ThemeMenu from "./ThemeMenu.svelte";

  interface Link {
    href: string;
    label: string;
    current?: boolean;
  }
  let {
    links,
    aux,
    label,
    title,
    theme,
  }: {
    links: Link[];
    aux: Link[];
    label: string;
    title: string;
    /** The header hides its theme menu below 900px; the sheet carries it instead. */
    theme: { label: string; auto: string; light: string; dark: string };
  } = $props();
  let open = $state(false);
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger
    class={buttonVariants({ variant: "outline", size: "icon" }) + " wm-control"}
    aria-label={label}
  >
    <IconMenu2 class="size-5" aria-hidden="true" />
  </Sheet.Trigger>
  <Sheet.Content side="right" class="w-72">
    <Sheet.Header>
      <Sheet.Title>{title}</Sheet.Title>
    </Sheet.Header>
    <nav aria-label={title} class="flex flex-col px-4">
      {#each [...links, ...aux] as link (link.href)}
        <a
          href={link.href}
          aria-current={link.current ? "page" : undefined}
          class="flex min-h-11 items-center border-b border-band-line text-base text-foreground no-underline aria-[current=page]:font-semibold"
          onclick={() => (open = false)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
    <div class="flex items-center justify-between px-4 text-sm text-muted-foreground">
      {theme.label}
      <ThemeMenu labels={theme} />
    </div>
  </Sheet.Content>
</Sheet.Root>
