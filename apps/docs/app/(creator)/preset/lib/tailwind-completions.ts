import type { Completion } from "@codemirror/autocomplete";

export type TailwindSuggestion = Completion & {
  category: string;
  description: string;
  token?: string;
};

const SPACING = [
  "0",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
];
const RADIUS = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"];
const FONT_SIZES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"];
const STATES = [
  "hover",
  "focus",
  "focus-visible",
  "active",
  "disabled",
  "dark",
  "sm",
  "md",
  "lg",
  "group-hover",
  "aria-expanded",
  "data-open",
];

export function tailwindCompletions(
  colorTokens: string[]
): TailwindSuggestion[] {
  const entries = new Map<string, TailwindSuggestion>();
  const add = (
    label: string,
    category: string,
    description: string,
    token?: string
  ) =>
    entries.set(label, {
      label,
      type: token ? "variable" : "keyword",
      detail: category,
      info: description,
      category,
      description,
      token,
    });

  [
    "block",
    "inline",
    "inline-block",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "hidden",
  ].forEach((x) => add(x, "Layout", `Display: ${x}`));
  [
    "flex-row",
    "flex-col",
    "flex-wrap",
    "flex-nowrap",
    "items-start",
    "items-center",
    "items-end",
    "justify-start",
    "justify-center",
    "justify-end",
    "justify-between",
    "grow",
    "shrink",
  ].forEach((x) => add(x, "Flexbox", `Flex layout: ${x}`));
  SPACING.forEach((n) =>
    [
      "p",
      "px",
      "py",
      "pt",
      "pb",
      "pl",
      "pr",
      "m",
      "mx",
      "my",
      "gap",
      "gap-x",
      "gap-y",
      "space-x",
      "space-y",
    ].forEach((prefix) =>
      add(`${prefix}-${n}`, "Spacing", `${prefix} spacing · ${n}`)
    )
  );
  FONT_SIZES.forEach((x) => add(`text-${x}`, "Typography", `Font size: ${x}`));
  ["normal", "medium", "semibold", "bold"].forEach((x) =>
    add(`font-${x}`, "Typography", `Font weight: ${x}`)
  );
  RADIUS.forEach((x) => add(`rounded-${x}`, "Radius", `Border radius: ${x}`));
  add("rounded", "Radius", "Default border radius");
  [
    "shadow-none",
    "shadow-xs",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "opacity-0",
    "opacity-25",
    "opacity-50",
    "opacity-75",
    "opacity-100",
    "transition",
    "transition-all",
    "transition-colors",
    "transition-opacity",
    "duration-150",
    "duration-200",
    "duration-300",
    "ease-in",
    "ease-out",
    "ease-in-out",
  ].forEach((x) => add(x, "Effects", `Effect: ${x}`));
  STATES.forEach((x) =>
    add(`${x}:`, "Variant", `Apply a utility when ${x} matches`)
  );
  colorTokens.forEach((token) =>
    ["bg", "text", "border", "ring", "fill", "stroke"].forEach((prefix) =>
      add(
        `${prefix}-${token}`,
        "Preset color",
        `Uses the current preset token --${token}`,
        token
      )
    )
  );
  return [...entries.values()];
}

/** The last variant prefix is retained, so hover:bg-pr completes to hover:bg-primary. */
export function completionFragment(beforeCursor: string) {
  const match = /(?:^|\s)([^\s]*)$/.exec(beforeCursor);
  if (!match) return null;
  const full = match[1];
  const lastColon = full.lastIndexOf(":");
  const prefix = lastColon >= 0 ? full.slice(0, lastColon + 1) : "";
  const fragment = lastColon >= 0 ? full.slice(lastColon + 1) : full;
  return { full, prefix, fragment };
}
