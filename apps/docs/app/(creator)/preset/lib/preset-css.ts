import type { RegistryPreset } from "@rlz/registry";

import {
  designSystemUtilities,
  type DesignSystemUtility,
} from "@rlz/ui/styles/utilities";

import { fontFamily, safe } from "./preset-styles";

/**
 * The stylesheet a consuming app ends up with, described once and rendered twice:
 * as text for the preview, as a form for the value editor. The design system reads
 * every color, radius and spacing through a custom property, so a preset is applied
 * by writing its values into the ones the app already declares - light values under
 * `:root`, dark values under `.dark` - and the shared utility classes come along at
 * the end, since a preset retunes them through `base.utilities`.
 *
 * The split is what makes an entry editable at all: `name` is what the design system
 * owns - the selector, the variable, the `@apply` keyword - and `value` is what the
 * preset owns. A preset that could rename `--background` would not be styling the
 * design system anymore, it would be replacing it, and every component reading that
 * variable would stop being drawn.
 *
 * Values are derived with the helpers the playground paints with (see
 * `presetVariables`), so what is shown, what is edited and what is applied live can
 * never disagree. A per-component edit stays out of this sheet: it is a list of
 * classes for one box, not a declaration the whole design system reads.
 */

/** Where a written value belongs in the draft. */
export type CssTarget =
  | { kind: "color"; cssVar: string; mode: "light" | "dark" }
  | { kind: "radius" }
  | { kind: "spacing" }
  | { kind: "letterSpacing" }
  | { kind: "font"; key: "fontSans" | "fontHeading" | "fontMono" }
  | { kind: "utility"; name: string };

export type CssEntry = {
  /** locked label: the custom property, or the class without its leading dot */
  name: string;
  /** the only editable part: the value, or the classes that follow `@apply` */
  value: string;
  target: CssTarget;
};

export type CssGroup = { title: string; entries: CssEntry[] };

export type CssRule = {
  selector: string;
  /**
   * `declarations` lists `name: value;` lines in one block, `rules` gives each entry
   * its own `.name { @apply value; }` block - the shape `@layer utilities` uses.
   */
  shape: "declarations" | "rules";
  groups: CssGroup[];
};

/** The draft, read as the declarations it writes. Empty values stay listed: an
 *  entry the user cleared is still one they are editing. */
export function cssSheet(preset: RegistryPreset): CssRule[] {
  const { radius, spacing } = preset.base.layout;
  const { letterSpacing } = preset.base.typography;
  const typography = preset.recommendations?.typography;

  const light: CssGroup[] = [
    {
      title: "Radius",
      entries: [
        {
          name: "--radius",
          value: sized(radius, "rem"),
          target: { kind: "radius" },
        },
      ],
    },
    {
      title: "Spacing",
      entries: [
        {
          name: "--spacing",
          value: sized(spacing, "rem"),
          target: { kind: "spacing" },
        },
      ],
    },
    {
      title: "Tracking",
      entries: [
        {
          name: "--tracking-normal",
          value: sized(letterSpacing, "em"),
          target: { kind: "letterSpacing" },
        },
      ],
    },
  ];

  // The recommended typefaces, under the three variables the design system reads.
  if (typography) {
    light.push({
      title: "Font",
      entries: [
        {
          name: "--font-sans",
          value: typography.fontSans ? fontFamily(typography.fontSans) : "",
          target: { kind: "font", key: "fontSans" },
        },
        {
          name: "--font-heading",
          value: typography.fontHeading
            ? fontFamily(typography.fontHeading)
            : "",
          target: { kind: "font", key: "fontHeading" },
        },
        {
          name: "--font-mono",
          value: typography.fontMono
            ? fontFamily(typography.fontMono, "monospace")
            : "",
          target: { kind: "font", key: "fontMono" },
        },
      ],
    });
  }

  for (const group of preset.colors ?? []) {
    light.push({
      title: group.name,
      entries: group.tokens.map(
        (token): CssEntry => ({
          name: token.cssVar,
          value: color(token.light.value),
          target: { kind: "color", cssVar: token.cssVar, mode: "light" },
        })
      ),
    });
  }

  const dark: CssGroup[] = (preset.colors ?? []).map((group) => ({
    title: group.name,
    entries: group.tokens.map(
      (token): CssEntry => ({
        name: token.cssVar,
        value: color(token.dark.value),
        target: { kind: "color", cssVar: token.cssVar, mode: "dark" },
      })
    ),
  }));

  return [
    { selector: ":root", shape: "declarations", groups: light },
    { selector: ".dark", shape: "declarations", groups: dark },
    {
      selector: "@layer utilities",
      shape: "rules",
      groups: [{ title: "Utilities", entries: utilityEntries(preset) }],
    },
  ];
}

/** The sheet as the text an app's stylesheet carries. */
export function themeCss(preset: RegistryPreset): string {
  return `${cssSheet(preset)
    .map(renderRule)
    .filter(Boolean)
    .join("\n\n")}\n`;
}

/**
 * One value written back, and the only way the editor reaches the draft. Numbers
 * that do not parse leave the draft alone - a field mid-typing is not a value yet.
 */
export function writeCssValue(
  preset: RegistryPreset,
  target: CssTarget,
  raw: string
): RegistryPreset {
  switch (target.kind) {
    case "color":
      return writeColor(preset, target, safe(raw.trim()));

    case "radius":
    case "spacing":
    case "letterSpacing": {
      const number = Number.parseFloat(raw);

      if (!Number.isFinite(number)) return preset;

      if (target.kind === "letterSpacing") {
        return {
          ...preset,
          base: {
            ...preset.base,
            typography: { ...preset.base.typography, letterSpacing: number },
          },
        };
      }

      const layout =
        target.kind === "radius"
          ? { ...preset.base.layout, radius: number }
          : { ...preset.base.layout, spacing: number };

      return { ...preset, base: { ...preset.base, layout } };
    }

    case "font": {
      const current = preset.recommendations?.typography;
      const typography = {
        fontSans: current?.fontSans ?? "",
        fontHeading: current?.fontHeading ?? "",
        fontMono: current?.fontMono,
      };

      typography[target.key] = safe(raw.trim());

      return {
        ...preset,
        recommendations: {
          ...preset.recommendations,
          typography,
        },
      };
    }

    case "utility":
      return writeUtility(preset, target.name, classes(raw));
  }
}

function writeColor(
  preset: RegistryPreset,
  target: { cssVar: string; mode: "light" | "dark" },
  value: string
): RegistryPreset {
  return {
    ...preset,
    colors: (preset.colors ?? []).map((group) => ({
      ...group,
      tokens: group.tokens.map((token) => {
        if (token.cssVar !== target.cssVar) return token;

        const patched =
          target.mode === "dark"
            ? { dark: { ...token.dark, value } }
            : { light: { ...token.light, value } };

        return { ...token, ...patched };
      }),
    })),
  };
}

function writeUtility(preset: RegistryPreset, name: string, value: string) {
  const utilities = { ...preset.base.utilities };

  // Writing the design system's own classes back drops the rewrite, so the app
  // keeps the definition it ships and the preset stores no copy of it.
  if (value === builtIn(name)) delete utilities[name];
  else utilities[name] = value;

  return {
    ...preset,
    base: {
      ...preset.base,
      utilities: Object.keys(utilities).length ? utilities : undefined,
    },
  };
}

function builtIn(name: string) {
  return designSystemUtilities[name as DesignSystemUtility] ?? "";
}

function utilityEntries(preset: RegistryPreset): CssEntry[] {
  const rewritten = preset.base.utilities ?? {};

  // The shared classes first, in the order the design system declares them, then
  // any class only this preset knows about.
  const names = [
    ...Object.keys(designSystemUtilities),
    ...Object.keys(rewritten).filter((name) => !(name in designSystemUtilities)),
  ];

  return names.map((name) => ({
    name,
    value: classes(rewritten[name] ?? builtIn(name)),
    target: { kind: "utility", name },
  }));
}

function renderRule(rule: CssRule): string {
  const lines = ruleBody(rule);

  if (lines.length === 0) return "";

  const body = lines.map((line) => (line ? `  ${line}` : "")).join("\n");

  return `${rule.selector} {\n${body}\n}`;
}

// The lines of a rule, unindented: a blank one between each group, the same layout
// the design system's own stylesheet uses.
function ruleBody(rule: CssRule): string[] {
  const written = (entry: CssEntry) => entry.value !== "";

  if (rule.shape === "rules") {
    const blocks: string[][] = [];

    for (const entry of rule.groups.flatMap((group) => group.entries)) {
      if (!written(entry)) continue;

      if (blocks.length > 0) blocks.push([""]);

      blocks.push([`.${entry.name} {`, `  @apply ${entry.value};`, `}`]);
    }

    return blocks.flat();
  }

  const lines: string[] = [];

  for (const group of rule.groups) {
    const entries = group.entries.filter(written);

    if (entries.length === 0) continue;

    if (lines.length > 0) lines.push("");

    lines.push(
      `/* ${group.title} */`,
      ...entries.map((entry) => `${entry.name}: ${entry.value};`)
    );
  }

  return lines;
}

// A number the draft never settled (a cleared slider) writes nothing, so the app
// keeps the value it shipped with.
function sized(value: number | undefined, unit: string) {
  return Number.isFinite(value) ? `${value}${unit}` : "";
}

function color(value: string | undefined) {
  return safe(value ?? "").trim();
}

// Classes are one line here, however they were typed.
function classes(value: string | undefined) {
  return safe(value ?? "").replace(/\s+/g, " ").trim();
}
