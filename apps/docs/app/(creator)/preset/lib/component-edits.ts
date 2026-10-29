import type {
  ComponentCapabilities,
  ComponentStyleProperty,
  ComponentVariant,
  PresetComponentCustomization,
} from "@rlz/registry";

// Resolve the value a control should show for a variant axis (variant, size).
// Order: explicit Creator edit -> declared default -> first available value.
export function currentVariantValue(
  axis: ComponentVariant,
  edit?: PresetComponentCustomization
): string {
  return edit?.props?.[axis.name] ?? axis.default ?? axis.values[0];
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
