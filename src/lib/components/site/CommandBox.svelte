<script lang="ts">
  // Copyable command (ux.md#反馈与状态). The command is plain text in server-rendered HTML, so it
  // is readable without JS; hydration adds copy with an aria-live confirmation and, when the
  // Clipboard API is unavailable, a pre-selected text field for manual copying.
  import IconCheck from "@tabler/icons-svelte/icons/check";
  import IconCopy from "@tabler/icons-svelte/icons/copy";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { cn } from "$lib/utils";

  let {
    command,
    copyLabel,
    copiedLabel,
    failedLabel,
    variant = "plain",
    class: className,
  }: {
    command: string;
    copyLabel: string;
    copiedLabel: string;
    failedLabel: string;
    /** hero: band background (Hero CTA); plain: terminal colors (install steps). */
    variant?: "hero" | "plain";
    class?: string;
  } = $props();

  let copied = $state(false);
  let failed = $state(false);
  let status = $state("");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let fallback = $state<HTMLTextAreaElement | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      failed = false;
      copied = true;
      status = copiedLabel;
      clearTimeout(timer);
      timer = setTimeout(() => {
        copied = false;
        status = "";
      }, 2000);
    } catch {
      failed = true;
      status = failedLabel;
      queueMicrotask(() => fallback?.select());
    }
  }
</script>

<div
  class={cn(
    "grid grid-cols-[minmax(0,1fr)_auto] items-stretch rounded-md border",
    variant === "hero" ? "bg-band text-foreground" : "bg-terminal text-terminal-foreground",
    className,
  )}
>
  <pre
    class="m-0 overflow-x-auto px-4 py-3 text-sm leading-relaxed whitespace-pre [mask-image:linear-gradient(to_right,#000_calc(100%-24px),transparent)] [scrollbar-width:thin]"
    tabindex="0"><code>{command}</code></pre>
  <Button
    variant="ghost"
    class="wm-control not-in-[.js]:hidden h-auto min-h-11 w-12 rounded-l-none border-0 border-l text-muted-foreground hover:text-primary"
    aria-label={copied ? copiedLabel : copyLabel}
    title={copyLabel}
    onclick={copy}
  >
    {#if copied}
      <IconCheck class="size-[18px]" aria-hidden="true" />
    {:else}
      <IconCopy class="size-[18px]" aria-hidden="true" />
    {/if}
  </Button>
  <span class="sr-only" aria-live="polite">{status}</span>
  {#if failed}
    <Textarea
      bind:ref={fallback}
      class="col-span-2 m-2 font-mono text-sm"
      readonly
      rows={2}
      aria-label={failedLabel}
      value={command}
    />
  {/if}
</div>
