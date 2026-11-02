import type { PresetShadowConfig } from "./types";

/**
 * The shadow the design system ships, held as one box: the six primitives its
 * stylesheet declares in the `Shadow` block of `globals.css`.
 *
 * The ladder Tailwind's `shadow-*` utilities read is not stored here - the sheet
 * draws it, in `@theme inline`, out of these six. That is what makes a preset's
 * shadow one box and not eight class strings: retune the box and every step it
 * draws moves with it. Keep this and `globals.css` (and `globals.vite.css`) in
 * step, the same rule the shared utility classes follow: an app's own sheet stays
 * the truth of what ships.
 */
export const designSystemShadowBox = {
  color: "hsl(0 0% 0%)",
  opacity: 0.18,
  blur: 2,
  spread: 0,
  offsetX: 0,
  offsetY: 1,
} satisfies PresetShadowConfig;

/**
 * The box's fields, in the order a form asks them: what it is drawn in first, then
 * how far it reaches. One list, three readers - the Creator's form, the stylesheet it
 * previews and the CLI that writes a consuming app - so none of them invents its own
 * order, label or unit.
 */
export const designSystemShadowFields: {
  /** the key a preset edit writes */
  key: keyof PresetShadowConfig;
  /** the variable the app's stylesheet reads it through */
  cssVar: string;
  /** what the field is called in a form */
  label: string;
  /** how the value is written: a length carries its unit, an alpha does not */
  unit: "px" | "";
}[] = [
  { key: "color", cssVar: "--shadow-color", label: "Color", unit: "" },
  { key: "opacity", cssVar: "--shadow-opacity", label: "Opacity", unit: "" },
  { key: "blur", cssVar: "--shadow-blur", label: "Blur", unit: "px" },
  { key: "spread", cssVar: "--shadow-spread", label: "Spread", unit: "px" },
  { key: "offsetX", cssVar: "--shadow-x", label: "Offset X", unit: "px" },
  { key: "offsetY", cssVar: "--shadow-y", label: "Offset Y", unit: "px" },
];

/** The box, in the six variables the design system reads it through. */
export function shadowPrimitives(
  box: PresetShadowConfig
): Record<string, string> {
  return Object.fromEntries(
    designSystemShadowFields.map(({ key, cssVar, unit }): [string, string] => {
      const value = box[key];

      return [
        cssVar,
        typeof value === "number" ? (unit ? px(value) : num(value)) : value,
      ];
    })
  );
}

/**
 * Whether a box is the one the design system already ships. Writing it into a preset
 * would store a copy of its sheet rather than a decision, the same rule a shared
 * utility class follows when it is written back unchanged.
 */
export function isDesignSystemShadowBox(box: PresetShadowConfig): boolean {
  return Object.entries(designSystemShadowBox).every(
    ([key, value]) => box[key as keyof PresetShadowConfig] === value
  );
}

// Pixels and alphas a preset can type back: an integer stays an integer, and a
// multiply never leaks the float it is made of (`0.18 * 2.5` is not `0.4499999`).
function num(value: number): string {
  return String(Math.round(value * 1e4) / 1e4);
}

function px(value: number): string {
  return `${num(value)}px`;
}
