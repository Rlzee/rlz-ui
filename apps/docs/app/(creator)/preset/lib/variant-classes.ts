import type { ComponentVariant, PresetVariantValue } from "@rlz/registry";

import { variantClassesOf } from "@rlz/ui/registry/resolve-capabilities";

/**
 * Built-in classes of one variant value, read from the component itself - never
 * copied into the manifest, which would drift from the source. They come from the
 * same detection pass that resolved the component's capabilities
 * (`packages/ui/src/scripts/capability-analyzer`), so a component is covered as
 * soon as it exists: no per-component registration, and the classes are the ones
 * its cva literally declares.
 * A component whose values are not cva-driven has no class data: its values start
 * empty, and the Creator defines them.
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

  const own =
    (part === undefined
      ? undefined
      : classes.byPart?.[axis.name]?.[part]?.[value]) ??
    classes.byValue?.[axis.name]?.[value];

  return own || undefined;
}

/**
 * One class editor: a part that a compound value restyles, or the whole
 * component when the axis styles a single element (`part` undefined). `builtIn`
 * is what the design system ships - "" when it ships nothing - and `override`
 * is what the Creator wrote over it, if anything.
 */
export type VariantClassSection = {
  part?: string;
  builtIn: string;
  override?: string;
};

/**
 * The class editors a value offers: one per part when the axis declares them, so
 * every part of a compound component is restyled on its own instead of the whole
 * value going through a single editor.
 */
export function variantClassSections(
  slug: string,
  axis: ComponentVariant,
  option: PresetVariantValue
): VariantClassSection[] {
  const { parts } = axis;

  if (!parts || parts.length === 0) {
    return [
      {
        builtIn: builtinVariantClasses(slug, axis, option.value) ?? "",
        override: option.classes,
      },
    ];
  }

  return parts.map((part) => ({
    part,
    builtIn: builtinVariantClasses(slug, axis, option.value, part) ?? "",
    override: option.partClasses?.[part],
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
