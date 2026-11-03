// `client:interaction`: hydrate an island on first intent (pointer over, focus, touch, click)
// instead of on load. Used for the mobile menu so its shadcn Sheet (bits-ui) stays out of the
// initial JS budget (ux.md#性能预算). A click that lands before hydration finishes is replayed
// on the hydrated trigger, so the first tap still opens the menu.
/** @type {import("astro").ClientDirective} */
export default (load, _options, el) => {
  const intents = ["pointerenter", "focusin", "touchstart"];
  let hydrated = false;
  let started = false;
  let replay = false;

  const start = async () => {
    if (started) return;
    started = true;
    for (const type of intents) el.removeEventListener(type, start, true);
    const hydrate = await load();
    await hydrate();
    hydrated = true;
    el.removeEventListener("click", onClick, true);
    if (replay) el.querySelector("button")?.click();
  };
  const onClick = (event) => {
    if (hydrated) return;
    event.preventDefault();
    event.stopPropagation();
    replay = true;
    start();
  };

  for (const type of intents) el.addEventListener(type, start, { capture: true, passive: true });
  el.addEventListener("click", onClick, true);
};
