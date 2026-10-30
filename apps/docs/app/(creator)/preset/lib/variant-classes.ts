import type { ComponentVariant, PresetVariantValue } from "@rlz/registry";

import { buttonVariants } from "@rlz/ui/components/ui/button";
import {
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogPopupVariants,
} from "@rlz/ui/components/ui/dialog";
import { inputVariants } from "@rlz/ui/components/ui/input";

/**
 * cva functions the Creator can introspect, keyed by registry component id.
 * Only cva-backed components can answer: a component with no cva config has no
 * class data to read here, so its values start without built-in classes.
 * A single-element component registers its one function; a compound component
 * registers one entry per part its variant restyles, under the part name the
 * capabilities declare, so every part can be read and edited on its own.
 */
const cvaVariants: Record<string, unknown> = {
  button: buttonVariants,
  input: inputVariants,
};

const cvaPartVariants: Record<string, Record<string, unknown>> = {
  // One dialog variant value restyles all three parts, each from its own cva.
  dialog: {
    Popup: dialogPopupVariants,
    Header: dialogHeaderVariants,
    Footer: dialogFooterVariants,
  },
};

// cva only declares the call signature on its return type (0.7.1 attaches
// nothing else to the function at runtime), so the lookup is cast to the shape
// actually being called.
type CvaFn = (props?: Record<string, string>) => string;

// cva joins every class it selects into one space-separated string.
function tokenize(classes: string) {
  return classes.split(/\s+/).filter(Boolean);
}

/**
 * Built-in classes of one variant value, read from the component itself - never
 * copied into the manifest, which would drift from the source. cva 0.7.1 no
 * longer exposes its config on the returned function, so the classes are
 * recovered by *calling* it: the base classes and the defaults of the other
 * axes are identical for every value of the axis, so whatever a value does not
 * share with all the others is exactly the classes it owns. `part` picks the
 * compound part being read; an axis without parts styles the component itself.
 */
export function builtinVariantClasses(
  slug: string,
  axis: ComponentVariant,
  value: string,
  part?: string
): string | undefined {
  const fn = (
    part === undefined ? cvaVariants[slug] : cvaPartVariants[slug]?.[part]
  ) as CvaFn | undefined;

  // A value the Creator made up is refused: cva answers an unknown value with
  // the axis' default, which would pass another value's styling off as this
  // one's.
  if (!fn || !axis.values.includes(value)) return undefined;

  const tokensByValue = axis.values.map((candidate) =>
    tokenize(fn({ [axis.name]: candidate }))
  );
  const own = tokensByValue[axis.values.indexOf(value)];

  // Shared by every value -> belongs to the component, not to this value.
  const shared = new Set(
    own.filter((token) =>
      tokensByValue.every((tokens) => tokens.includes(token))
    )
  );

  const classes = [...new Set(own.filter((token) => !shared.has(token)))];

  return classes.length > 0 ? classes.join(" ") : undefined;
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
