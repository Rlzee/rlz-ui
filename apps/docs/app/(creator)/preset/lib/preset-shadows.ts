import { defaultPreset } from "@rlz/ui/styles/presets";
import type { PresetShadowConfig } from "@rlz/registry";

/**
 * The shadow box the Creator starts from, and the one a draft stored before shadows
 * existed gets back. Taken from the shipped preset, because that is where the design
 * system declares its values - the preset is the only shadow data the site reads from
 * `@rlz/ui`.
 *
 * A preset that names no box leaves this `undefined`, and the Creator then has no
 * Shadows section to offer: the same rule that keeps a section the draft does not
 * carry out of the explorer.
 */
export const designSystemShadowBox: PresetShadowConfig | undefined =
  defaultPreset.base.shadows;

/**
 * Which variable each field of the box writes, and the unit it carries: the sheet's own
 * vocabulary, in the order it declares it. `--shadow-x` is a preset's `offsetX`, an
 * alpha is written bare. What a field is called, the order the panel asks them in and
 * how far each slider reaches are the form's business, not this list's.
 */
export const designSystemShadowFields: {
  key: keyof PresetShadowConfig;
  cssVar: string;
  unit: "px" | "";
}[] = [
  { key: "offsetX", cssVar: "--shadow-x", unit: "px" },
  { key: "offsetY", cssVar: "--shadow-y", unit: "px" },
  { key: "blur", cssVar: "--shadow-blur", unit: "px" },
  { key: "spread", cssVar: "--shadow-spread", unit: "px" },
  { key: "opacity", cssVar: "--shadow-opacity", unit: "" },
  { key: "color", cssVar: "--shadow-color", unit: "" },
];

/**
 * The box, in those variables. Written once here, so what the preview paints, what the
 * sheet shows and what the JSON stores can never disagree about what a `2` means.
 */
export function shadowPrimitives(
  box: PresetShadowConfig
): Record<string, string> {
  return Object.fromEntries(
    designSystemShadowFields.map(({ key, cssVar, unit }): [string, string] => {
      const value = box[key];

      return [cssVar, typeof value === "number" ? `${num(value)}${unit}` : value];
    })
  );
}

// An integer stays an integer, and a multiply never leaks the float it is made of
// (`0.18 * 2.5` is not `0.4499999`).
function num(value: number): string {
  return String(Math.round(value * 1e4) / 1e4);
}
