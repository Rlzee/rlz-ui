import type {
  PresetComponentCustomization,
  RegistryPreset,
} from "@rlz/registry";

import { capabilitiesOf } from "@rlz/ui/registry/resolve-capabilities";

import { currentAppliedVariant, currentStyleValue } from "./component-edits";
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
 *  - Class replacement. A variant value IS a list of Tailwind classes, and classes
 *    are not CSS: the classes the Creator wrote are swapped for the built-in ones
 *    on the elements that carry them (see `variantPatches`).
 */

// The demos only: the pane's own toolbar and tabs are Creator chrome, so the
// preset never restyles them (`#playground-preview` inside the Tabs.Panel).
export const PREVIEW_ID = "playground-preview";

const SCOPE = `#${PREVIEW_ID}`;

// Which CSS property one style slider tunes, on the component's own box.
const STYLE_PROPERTIES: Record<string, string> = {
  radius: "border-radius",
  gap: "gap",
  padding: "padding",
};

/**
 * The box a component style applies to. The root slot when the component draws
 * itself (Card, Button), else the part holding the surface users see: a dialog
 * tunes its popup, an input its control, a drawer its content. A component style
 * wins over `base.layout` because it is a declaration, while the base is the
 * variable those declarations read.
 */
const SURFACE_SLOTS = ["", "popup", "content", "control", "body"];

// A color value is written by a picker, so a stray `}` would break the sheet.
function safe(value: string) {
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
  // `--font-*` are the families the recommended typefaces land on.
  Object.assign(vars, {
    radius: `${radius}rem`,
    spacing: `${spacing}rem`,
    "tracking-normal": `${letterSpacing}em`,
  });

  const typography = preset.recommendations?.typography;

  if (typography?.fontSans) vars["font-sans"] = fontFamily(typography.fontSans);
  if (typography?.fontHeading) {
    vars["font-heading"] = fontFamily(typography.fontHeading);
  }
  if (typography?.fontMono) vars["font-mono"] = fontFamily(typography.fontMono);

  return vars;
}

// A family name, quoted with a fallback so it never stands alone.
function fontFamily(value: string) {
  const name = safe(value.trim());

  return /["']|^var\(/.test(name) ? name : `"${name}", sans-serif`;
}

/**
 * The stylesheet injected while the Creator runs: the preset's variables on the
 * playground, then one rule per component style the Creator moved.
 */
export function playgroundCss(
  preset: RegistryPreset,
  isDark: boolean,
  edits: Record<string, PresetComponentCustomization>
): string {
  const declarations = Object.entries(presetVariables(preset, isDark)).map(
    ([name, value]) => `--${name}:${value}`
  );

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

  for (const [slug, edit] of Object.entries(edits)) {
    const styles = edit.styles;

    if (!styles) continue;

    const capabilities = capabilitiesOf(slug);

    for (const style of capabilities?.styles ?? []) {
      const moved = styles[style.key];

      if (moved === undefined) continue;

      const property = STYLE_PROPERTIES[style.key];

      if (!property) continue;

      const value = `${currentStyleValue(style, edit)}${style.unit}`;

      rules.push(
        ...SURFACE_SLOTS.map(
          (surface) =>
            `${SCOPE} [data-slot="${surface ? `${slug}-${surface}` : slug}"]{${property}:${value}}`
        )
      );
    }
  }

  return rules.join("\n");
}

/**
 * One class replacement to perform on the demos: the elements of `slot` that carry
 * the built-in classes of the applied variant value lose them and take the
 * Creator's own. `remove` is what the design system ships for that value, so an
 * element that never used it (another variant in the same demo) is left alone.
 */
export type VariantPatch = { slot: string; remove: string[]; add: string[] };

export function variantPatches(
  edits: Record<string, PresetComponentCustomization>
): VariantPatch[] {
  const patches: VariantPatch[] = [];

  for (const [slug, edit] of Object.entries(edits)) {
    const capabilities = capabilitiesOf(slug);

    if (!capabilities?.variants) continue;

    for (const axis of capabilities.variants) {
      // Only the value in effect is worth applying: the others are not shown.
      const option = currentAppliedVariant(axis, edit);

      for (const section of variantClassSections(slug, axis, option)) {
        if (section.override === undefined) continue;

        patches.push({
          slot: slotOfSection(slug, section.part),
          remove: tokensOf(section.builtIn),
          add: tokensOf(section.override),
        });
      }
    }
  }

  return patches;
}

// `Dialog` + `Popup` -> `dialog-popup`, the slot the demos are marked with.
function slotOfSection(slug: string, part?: string) {
  return part ? `${slug}-${kebab(part)}` : slug;
}

function kebab(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
    .toLowerCase();
}

function tokensOf(classes: string | undefined) {
  return (classes ?? "").split(/\s+/).filter(Boolean);
}
