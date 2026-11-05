"use client";

import type { PresetShadowConfig } from "@rlz/registry";

import { CollapsibleProperties } from "../../colapsible-properties";
import { ColorField } from "../../color-field";
import { designSystemShadowFields } from "../../../lib/preset-shadows";

import { SliderRow } from "./slider-row";

// The five numbers of the shadow box, in the order this panel asks them, each with
// the reach worth sliding to: an alpha has none beyond one, a blur only grows one
// way. Labels and reach are this form's business; which variable a field writes, and
// in what unit, is what `preset-shadows` answers for the whole Creator.
const SHADOW_SCALES = {
  opacity: { label: "Opacity", min: 0, max: 1, step: 0.01 },
  blur: { label: "Blur", min: 0, max: 48, step: 1 },
  spread: { label: "Spread", min: -24, max: 24, step: 1 },
  offsetX: { label: "Offset X", min: -32, max: 32, step: 1 },
  offsetY: { label: "Offset Y", min: -32, max: 32, step: 1 },
} satisfies Record<
  Exclude<keyof PresetShadowConfig, "color">,
  { label: string; min: number; max: number; step: number }
>;

// A row of the form: what it is called, how far it slides, and the unit the design
// system writes the number with - so an addon and the sheet cannot disagree about
// what `2` means.
const SHADOW_ROWS = Object.entries(SHADOW_SCALES).map(([key, scale]) => {
  const field = key as Exclude<keyof PresetShadowConfig, "color">;

  return {
    ...scale,
    key: field,
    unit: designSystemShadowFields.find((one) => one.key === field)?.unit ?? "",
  };
});

/**
 * The shadow box as a form: what it is drawn in, then how far it reaches. The color is
 * the Colors panel's own trio - swatch, value, Tailwind picker - and the five numbers
 * slide and type like the radius above them. What they add up to is the ladder the app's
 * sheet draws from the six, which is why this panel has no step to name.
 */
export function ShadowBoxFields({
  box,
  onChange,
}: {
  box: PresetShadowConfig;
  onChange: (key: keyof PresetShadowConfig, value: string) => void;
}) {
  return (
    <CollapsibleProperties name="SHADOWS" defaultOpen>
      <div className="flex flex-col gap-0.5 px-2 py-2">
        <span className="px-2 text-[11px] text-muted-foreground">
          Each shadow-* step is drawn from this box.
        </span>

        <ColorField
          value={box.color}
          label="Color"
          ariaLabel="Shadow color"
          className="px-2 py-1.5"
          onChange={(value) => onChange("color", value)}
        />

        {SHADOW_ROWS.map((row) => (
          <SliderRow
            key={row.key}
            showLabel
            label={row.label}
            value={box[row.key]}
            min={row.min}
            max={row.max}
            step={row.step}
            unit={row.unit}
            onChange={(value) => onChange(row.key, String(value))}
          />
        ))}
      </div>
    </CollapsibleProperties>
  );
}
