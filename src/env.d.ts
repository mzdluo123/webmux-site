import "astro";

declare module "astro" {
  interface AstroClientDirectives {
    /** Hydrate on first pointer/focus/touch/click (src/directives/interaction.mjs). */
    "client:interaction"?: boolean;
  }
}
