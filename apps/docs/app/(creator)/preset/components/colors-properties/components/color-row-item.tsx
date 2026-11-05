"use client";

import type { PresetColorToken as ColorRow } from "@rlz/registry";

import { ColorField } from "../../color-field";

/**
 * One token, and both of its values at once. A preset decides what a color looks
 * like in the light scheme and what it looks like in the dark one: those are two
 * answers about the draft, not two states of the site, so the panel stopped asking
 * which scheme it was wearing to know which value to show. Each value is edited
 * with the shared ColorField - the swatch, the free value and the Tailwind picker.
 */
export function ColorRowItem({
  row,
  onChange,
}: {
  row: ColorRow;
  onChange: (mode: "light" | "dark", value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 rounded px-2 py-1.5">
      <span className="text-xs text-muted-foreground">{row.label}</span>

      <ColorField
        value={row.light.value}
        label="light"
        labelClassName="w-9 text-[11px] capitalize"
        ariaLabel={`light value of ${row.cssVar}`}
        onChange={(value) => onChange("light", value)}
      />

      <ColorField
        value={row.dark.value}
        label="dark"
        labelClassName="w-9 text-[11px] capitalize"
        ariaLabel={`dark value of ${row.cssVar}`}
        onChange={(value) => onChange("dark", value)}
      />
    </div>
  );
}
