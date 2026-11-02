import type {
  PresetComponentCustomization,
  RegistryPreset,
} from "@rlz/registry";

import {
  capabilitiesOf,
  partsOf,
} from "@rlz/ui/registry/resolve-capabilities";

import { currentAppliedVariant } from "./component-edits";
import { shadowPrimitives } from "./preset-shadows";
import { variantClassSections } from "./variant-classes";

/**
 * The playground answers back: whatever the Creator edits is applied to the live
 * demos, not only written into the exported preset - and to the demos only, never
 * to the pane's toolbar or tabs, which are the Creator's own chrome.
 *
 * Two mechanisms, because the two kinds of edits are not the same thing:
 *  - CSS custom properties. The design system reads every color, radius and
 *    spacing through a variable, so overriding the variables on the preview area
 *    restyles the demos it holds - light and dark values included.
 *  - Class replacement. A variant value, or a part's own look, IS a list of
 *    Tailwind classes, and classes are not CSS: the classes the Creator wrote are
 *    swapped for the built-in ones on the elements they belong to (see
 *    `previewPatches`).
 */

// The demos only: the pane's own toolbar and tabs are Creator chrome, so the
// preset never restyles them (`#playground-preview` inside the Tabs.Panel).
export const PREVIEW_ID = "playground-preview";

const SCOPE = `#${PREVIEW_ID}`;

// A color value is written by a picker, so a stray `}` would break the sheet.
export function safe(value: string) {
  return value.replace(/[{}<>;]/g, "");
}

/** The variables the preview area should read instead of the design system's. */
export function presetVariables(
  preset: RegistryPreset,
  isDark: boolean
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const section of preset.colors) {
    for (const token of section.tokens) {
      vars[token.cssVar.replace(/^--/, "")] = safe(
        (isDark ? token.dark.value : token.light.value).trim()
      );
    }
  }

  const { radius, spacing } = preset.base.layout;
  const { letterSpacing } = preset.base.typography;

  // `--tracking-normal` is what the `tracking-normal` body utility resolves, and
  // `--font-*` are the families the recommended typefaces land on. A number the
  // draft never settled writes nothing, exactly as the exported sheet leaves it out
  // (see `sized`): these three variables are what Tailwind's own radius and spacing
  // scales are computed from, so a `--radius:NaNrem` here would not only lose the
  // radius - it would take every `rounded-*` utility in the preview down with it.
  const settled = (value: number | undefined, unit: string) =>
    Number.isFinite(value) ? `${value}${unit}` : "";

  Object.assign(vars, {
    radius: settled(radius, "rem"),
    spacing: settled(spacing, "rem"),
    "tracking-normal": settled(letterSpacing, "em"),
  });

  const typography = preset.recommendations?.typography;

  if (typography?.fontSans) vars["font-sans"] = fontFamily(typography.fontSans);
  if (typography?.fontHeading) {
    vars["font-heading"] = fontFamily(typography.fontHeading);
  }
  if (typography?.fontMono) {
    vars["font-mono"] = fontFamily(typography.fontMono, "monospace");
  }

  // The shadow box, only its six primitives. The app's own `@theme inline` draws the
  // steps from them and resolves the primitives on the element each `shadow-*` utility
  // styles, so a box written here is seen on the demo, not only in the exported sheet.
  const shadows = preset.base.shadows;

  if (shadows) {
    for (const [cssVar, value] of Object.entries(shadowPrimitives(shadows))) {
      vars[cssVar.replace(/^--/, "")] = safe(value);
    }
  }

  return vars;
}

// A family name, quoted with a fallback so it never stands alone.
export function fontFamily(value: string, fallback = "sans-serif") {
  const name = safe(value.trim());

  return /["']|^var\(/.test(name) ? name : `"${name}", ${fallback}`;
}

/**
 * The stylesheet injected while the Creator runs: the preset's variables, applied
 * to the playground. A per-component edit is a list of classes for one box, not a
 * declaration the whole design system reads, so it stays out here and goes through
 * `previewPatches` instead.
 */
export function playgroundCss(preset: RegistryPreset, isDark: boolean): string {
  const declarations = Object.entries(presetVariables(preset, isDark))
    // A value the draft left unset writes nothing, so the preview keeps the value
    // the app shipped with rather than an empty custom property.
    .filter(([, value]) => value !== "")
    .map(([name, value]) => `--${name}:${value}`);

  // `font-family` and `letter-spacing` are inherited as a resolved value, so the
  // preview has to read them itself for its subtree to inherit the preset's. And
  // because it is the canvas the draft paints on, it carries the preset's own
  // background and default text - the surrounding Creator chrome keeps the site's.
  declarations.push(
    "font-family:var(--font-sans)",
    "letter-spacing:var(--tracking-normal)",
    "background-color:var(--background)",
    "color:var(--foreground)"
  );

  const rules = [`${SCOPE}{${declarations.join(";")}}`];

  return rules.join("\n");
}

/**
 * One class replacement to perform on the demos: the elements of `slot` that carry
 * the built-in classes lose them and take the Creator's own.
 *
 * `remove` is what the design system ships there, which is also how the element is
 * recognised: a variant value only owns the elements drawn with its classes, so the
 * other variants of the same demo are left alone. A part is the opposite case -
 * `wholeSlot` - since every element of that slot IS that part, and the edit is on
 * the box itself rather than on one of its values.
 */
export type PreviewPatch = {
  slot: string;
  remove: string[];
  add: string[];
  wholeSlot?: boolean;
};

export function previewPatches(
  edits: Record<string, PresetComponentCustomization>
): PreviewPatch[] {
  const patches: PreviewPatch[] = [];

  for (const [slug, edit] of Object.entries(edits)) {
    const capabilities = capabilitiesOf(slug);

    for (const axis of capabilities?.variants ?? []) {
      // Only the value in effect is worth applying: the others are not shown.
      const option = currentAppliedVariant(axis, edit);

      for (const section of variantClassSections(slug, axis, option)) {
        if (section.override === undefined) continue;

        patches.push({
          slot: section.slot,
          remove: tokensOf(section.builtIn),
          add: tokensOf(section.override),
        });
      }
    }

    for (const part of partsOf(slug)) {
      const override = edit.partClasses?.[part.name];

      if (override === undefined) continue;

      const remove = tokensOf(part.classes);
      const add = tokensOf(override);

      // Nothing authored and nothing written: the part draws what it always drew.
      if (remove.length === 0 && add.length === 0) continue;

      patches.push({ slot: part.slot, remove, add, wholeSlot: true });
    }
  }

  return patches;
}

// Splits a class string into the individual tokens a patch removes or adds.
function tokensOf(classes: string | undefined) {
  return (classes ?? "").split(/\s+/).filter(Boolean);
}
