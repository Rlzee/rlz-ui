import type {
  ComponentCapabilities,
  ComponentStyleProperty,
  ComponentVariant,
  PresetComponentCustomization,
  PresetVariantValue,
} from "@rlz/registry";

// The panel needs the same shape everywhere: an option carries its name and,
// once the Creator touched it, its own classes.
export type VariantOption = PresetVariantValue;

// Drafts saved before class editing stored plain strings, so both shapes are
// accepted on read and normalised to options.
function toOptions(
  list: (VariantOption | string)[] | undefined
): VariantOption[] {
  return (list ?? []).map((item) =>
    typeof item === "string" ? { value: item } : item
  );
}

// The option list an axis actually offers: the Creator's edited list when it
// has one (renamed / added / removed / restyled values), otherwise the values
// declared in the registry manifest. An empty override is ignored so an axis can
// never end up with no selectable value.
export function currentVariantOptions(
  axis: ComponentVariant,
  edit?: PresetComponentCustomization
): VariantOption[] {
  const override = toOptions(edit?.variants?.[axis.name]);

  return override.length > 0
    ? override
    : axis.values.map((value) => ({ value }));
}

// Resolve the value a control should show for a variant axis (variant, size).
// Order: explicit Creator edit -> declared default -> first available value.
// A value that is no longer in the list is skipped, so renaming or deleting
// never leaves the axis pointing at something that does not exist.
export function currentVariantValue(
  axis: ComponentVariant,
  edit?: PresetComponentCustomization
): string {
  const options = currentVariantOptions(axis, edit);
  const chosen = edit?.props?.[axis.name];

  if (chosen && options.some((option) => option.value === chosen)) {
    return chosen;
  }

  if (axis.default && options.some((option) => option.value === axis.default)) {
    return axis.default;
  }

  return options[0]?.value ?? "";
}

// Resolve a numeric style (radius, spacing...). Order: edit -> default -> min.
export function currentStyleValue(
  style: ComponentStyleProperty,
  edit?: PresetComponentCustomization
): number {
  return edit?.styles?.[style.key] ?? style.default ?? style.min;
}

// Booleans are stored as "true"/"false" strings (the props record is
// string|null). When untouched we default them ON: the pilot boolean props
// (dialog backdrop / showCloseButton / backdropBlur) all render a sensible
// popup this way, and both the panel and the live demo share this helper so
// they can never disagree.
export function currentBool(
  key: string,
  edit?: PresetComponentCustomization
): boolean {
  const value = edit?.props?.[key];

  return value === undefined || value === null ? true : value === "true";
}

// `variant` -> "Variant", `backdropBlur` -> "Backdrop Blur".
export function titleCase(value: string) {
  const spaced = value.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// One-line "what is applied" summary shown under the live demo, mirroring the
// prototype: "Variant: outline - Size: md - Radius: 0.4rem".
export function describeEdits(
  capabilities: ComponentCapabilities,
  edit?: PresetComponentCustomization
): string {
  const bits: string[] = [];

  capabilities.variants?.forEach((axis) => {
    bits.push(`${titleCase(axis.name)}: ${currentVariantValue(axis, edit)}`);
  });

  capabilities.styles?.forEach((style) => {
    bits.push(
      `${style.label}: ${currentStyleValue(style, edit)}${style.unit}`
    );
  });

  return bits.join(" - ");
}
