import type { ComponentVariant, PresetVariantValue } from "@rlz/registry";

import {
  partsOf,
  variantClassesOf,
} from "@rlz/ui/registry/resolve-capabilities";

/**
 * Built-in classes of one variant value, read from the component itself - never
 * copied into the manifest, which would drift from the source. They come from the
 * same detection pass that resolved the component's capabilities
 * (`packages/ui/src/scripts/capability-analyzer`), so a component is covered as
 * soon as it exists: no per-component registration, and the classes are the ones
 * its cva literally declares.
 * A component whose values are not cva-driven has no class data: its values start
 * empty, and the Creator defines them.
 *
 * `part` selects the box whose built-in classes are wanted. A single-element axis
 * styles only the component itself, so its classes belong to `Root` (or to the whole
 * value when no part is named); a compound axis stores one list per part it touches.
 * A part the axis never styles has no built-in classes: it starts empty and the
 * Creator fills it in.
 */
export function builtinVariantClasses(
  slug: string,
  axis: ComponentVariant,
  value: string,
  part?: string
): string | undefined {
  const classes = variantClassesOf(slug);

  // A value the Creator made up has nothing to inherit: only the values the
  // component itself declares carry built-in classes.
  if (!classes || !axis.values.includes(value)) return undefined;

  if (part === undefined || part === "Root") {
    return (
      classes.byPart?.[axis.name]?.[part ?? ""]?.[value] ??
      classes.byValue?.[axis.name]?.[value] ??
      undefined
    );
  }

  return classes.byPart?.[axis.name]?.[part]?.[value] || undefined;
}

/**
 * One class editor: a part of the component, or the whole component when it has no
 * parts beyond itself (`part` undefined). `slot` is the `data-slot` the demos carry,
 * `builtIn` is what the design system ships - "" when it ships nothing - and
 * `override` is what the Creator wrote over it, if anything.
 */
export type VariantClassSection = {
  part?: string;
  slot: string;
  builtIn: string;
  override?: string;
};

/**
 * The class editors a value offers: one per box of the component. A compound
 * component gets an editor for every part the Creator can restyle - not only the
 * ones this axis's cva happens to touch - so each part of a value can be defined on
 * its own. A single-element component keeps one editor for the whole value.
 */
export function variantClassSections(
  slug: string,
  axis: ComponentVariant,
  option: PresetVariantValue
): VariantClassSection[] {
  const parts = partsOf(slug);
  const { value } = option;

  // Only the component's own box: one editor standing for the whole value, stored
  // on `classes` exactly as a single-element axis always was.
  if (parts.length <= 1) {
    return [
      {
        slot: slug,
        builtIn: builtinVariantClasses(slug, axis, value) ?? "",
        override: option.classes,
      },
    ];
  }

  return parts.map((part) => ({
    part: part.name,
    slot: part.slot,
    builtIn: builtinVariantClasses(slug, axis, value, part.name) ?? "",
    // `Root` still reads a whole-value override written before every box had its
    // own editor, so an existing draft does not silently lose its styling.
    override:
      option.partClasses?.[part.name] ??
      (part.name === "Root" ? option.classes : undefined),
  }));
}

/**
 * Classes that actually define a section: the Creator's own, else the built-in
 * ones. A section that ships nothing has no classes at all, so the empty string
 * never lands in the preset.
 */
export function variantSectionClasses(section: VariantClassSection) {
  return section.override ?? (section.builtIn || undefined);
}
