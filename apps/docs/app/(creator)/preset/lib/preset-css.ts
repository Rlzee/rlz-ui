import type { PresetShadowConfig, RegistryPreset } from "@rlz/registry";

import { defaultPreset } from "@rlz/ui/styles/presets";

import { fontFamily, safe } from "./preset-styles";
import {
  designSystemShadowBox,
  designSystemShadowFields,
  shadowPrimitives,
} from "./preset-shadows";

// The shared classes as the shipped preset declares them. The Creator reads its
// defaults through the preset and nowhere else in the design system, which is what
// keeps `globals.css` the only truth of what an app ships.
const designSystemUtilities: Record<string, string> =
  defaultPreset.base.utilities ?? {};

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
 * A utility is the one place allowed to grow a name of its own: a class the app was
 * never given restyles nothing that exists, so a preset may declare one (see
 * `addUtility`) next to retuning the four the design system ships.
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
  | { kind: "utility"; name: string }
  /** one field of the shadow box the preset retuned */
  | { kind: "shadow"; key: keyof PresetShadowConfig };

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

  // The design system closes both of its blocks with the shadow box, so a preset
  // carrying one closes them the same way - light values under `:root`, dark under
  // `.dark`, the one box the sheet itself ships twice.
  const shadows = shadowEntries(preset);

  if (shadows.length > 0) {
    light.push({ title: "Shadow", entries: shadows });
    dark.push({ title: "Shadow", entries: shadows });
  }

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
  return `${cssSheet(preset).map(renderRule).filter(Boolean).join("\n\n")}\n`;
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

    case "shadow":
      return writeShadow(preset, target.key, raw);
  }
}

/**
 * The shadow part of the sheet: the six primitives of the box a preset declares.
 * A preset that carries no box at all - one imported from before the field existed -
 * lists nothing, the way a preset without a recommendation lists no font variables.
 * The steps are never listed: the app's own `@theme inline` draws them from these
 * six, which is why one box is six numbers here rather than eight shadow strings.
 */
function shadowEntries(preset: RegistryPreset): CssEntry[] {
  const box = preset.base.shadows;

  if (!box) return [];

  const primitives = shadowPrimitives(box);

  return designSystemShadowFields.map(({ key, cssVar }) => ({
    name: cssVar,
    value: primitives[cssVar],
    target: { kind: "shadow", key },
  }));
}

function writeShadow(
  preset: RegistryPreset,
  key: keyof PresetShadowConfig,
  raw: string
): RegistryPreset {
  // The box the draft carries, or the one the shipped preset declares: a field is
  // always edited against what it shows. A design system whose preset names no box has
  // no values for a field to start from - and no Shadows section offers one.
  const current = preset.base.shadows ?? designSystemShadowBox;

  if (!current) return preset;

  if (key === "color") {
    return withShadowBox(preset, { ...current, color: safe(raw.trim()) });
  }

  const number = Number.parseFloat(raw);

  // A field mid-typing is not a value yet, so it leaves the draft alone.
  if (!Number.isFinite(number)) return preset;

  return withShadowBox(preset, shadowNumber(current, key, number));
}

// One numeric field written back. Named per key, so a number cannot land on `color`.
function shadowNumber(
  current: PresetShadowConfig,
  key: Exclude<keyof PresetShadowConfig, "color">,
  value: number
): PresetShadowConfig {
  switch (key) {
    case "opacity":
      return { ...current, opacity: value };
    case "blur":
      return { ...current, blur: value };
    case "spread":
      return { ...current, spread: value };
    case "offsetX":
      return { ...current, offsetX: value };
    default:
      return { ...current, offsetY: value };
  }
}

// The draft with its box written. A box is declared rather than differed, the way
// `layout.radius` is: a preset keeps the shadow it draws even when that is the one
// the design system ships, so the JSON says what the app will look like.
function withShadowBox(
  preset: RegistryPreset,
  box: PresetShadowConfig
): RegistryPreset {
  return {
    ...preset,
    base: { ...preset.base, shadows: box },
  };
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
  // A shared class is declared rather than differed, the way the radius and the
  // shadow box are: writing the design system's own classes back keeps the entry, at
  // those classes, so the preset's JSON says what the app will draw. A class of the
  // preset's own has nothing to fall back to: an empty field is a definition still
  // being written, and `removeUtility` is what takes the class out.
  return withUtilities(preset, { ...preset.base.utilities, [name]: value });
}

/**
 * Declares a utility of the preset's own, with no classes yet - the field that
 * appears below is what fills it in. A name the draft already carries, one of the
 * design system's four or a class declared earlier, leaves the draft alone.
 */
export function addUtility(
  preset: RegistryPreset,
  rawName: string
): RegistryPreset {
  const name = utilityName(rawName);

  if (!name || utilitiesOf(preset).some((utility) => utility.name === name)) {
    return preset;
  }

  return writeUtility(preset, name, "");
}

/**
 * Takes a utility of the preset's own out of the draft. A class the design system
 * declares cannot be removed - the components carrying it would lose their look -
 * so its rewrite simply goes back through `writeUtility`.
 */
export function removeUtility(
  preset: RegistryPreset,
  name: string
): RegistryPreset {
  if (!isOwnUtility(name)) return preset;

  const utilities = { ...preset.base.utilities };
  delete utilities[name];

  return withUtilities(preset, utilities);
}

/**
 * The name a typed label becomes as a utility. The panel writes a class with its
 * dot, so the dot comes off first, and only what a selector can carry survives:
 * empty when the text could not name a class.
 */
export function utilityName(raw: string) {
  const name = safe(raw).trim().replace(/^\.+/, "").replace(/\s+/g, "-");

  return /^[A-Za-z][A-Za-z0-9_-]*$/.test(name) ? name : "";
}

/** One utility as the Creator reads it: what is shipped, what was written over it. */
export type UtilityDraft = {
  /** the class the app types, without its leading dot */
  name: string;
  /** the shipped preset's own classes, empty for a class of the draft's own */
  builtIn: string;
  /** what the draft wrote over it, `undefined` while it wrote nothing */
  override?: string;
  /** a class only this preset declares, so it can be removed rather than reset */
  own: boolean;
};

/**
 * Every utility the draft can write classes for: the ones the shipped preset declares,
 * in the order it declares them, then any class only this draft knows about. Both the
 * base panel and the CSS editor list from here, so neither can hide an entry the other
 * one created.
 */
export function utilitiesOf(preset: RegistryPreset): UtilityDraft[] {
  const rewritten = preset.base.utilities ?? {};

  return [
    ...Object.keys(designSystemUtilities),
    ...Object.keys(rewritten).filter(isOwnUtility),
  ].map((name) => ({
    name,
    builtIn: builtIn(name),
    override: rewritten[name],
    own: isOwnUtility(name),
  }));
}

// The classes the shipped preset declares under a name, empty for a class it never
// declares - which is how a utility of the preset's own tells itself apart.
function builtIn(name: string): string {
  return designSystemUtilities[name] ?? "";
}

function isOwnUtility(name: string) {
  return !(name in designSystemUtilities);
}

// The draft with its shared class rewrites replaced. An empty record drops the
// field, so a preset that retunes nothing carries nothing.
function withUtilities(
  preset: RegistryPreset,
  utilities: Record<string, string>
): RegistryPreset {
  return {
    ...preset,
    base: {
      ...preset.base,
      utilities: Object.keys(utilities).length ? utilities : undefined,
    },
  };
}

function utilityEntries(preset: RegistryPreset): CssEntry[] {
  return utilitiesOf(preset).map(({ name, builtIn: shipped, override }) => ({
    name,
    value: classes(override ?? shipped),
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
  return safe(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
