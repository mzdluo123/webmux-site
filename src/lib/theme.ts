// Theme override shared by marketing pages and Starlight docs. The stored key and values match
// Starlight ("starlight-theme": "light" | "dark" | "" for system) so both sides agree; the root
// carries both the product's `.dark` class and Starlight's `data-theme`.
export type ThemeChoice = "auto" | "light" | "dark";
const KEY = "starlight-theme";

export function readTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "auto";
  } catch {
    return "auto";
  }
}

export function applyTheme(choice: ThemeChoice) {
  try {
    localStorage.setItem(KEY, choice === "auto" ? "" : choice);
  } catch {
    // storage disabled: the choice lasts for this page only
  }
  const dark =
    choice === "dark" || (choice === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}
