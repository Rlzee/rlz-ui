import type { Registry } from "./types";
import type { RegistryItem } from "./items/types";
import type { RegistryPreset } from "./presets/types";

export function defineRegistry({
  items,
  presets = {},
}: {
  items: Record<string, RegistryItem>;
  presets?: Record<string, RegistryPreset>;
}): Readonly<Registry> {
  const normalizedItems: Record<string, RegistryItem> = {};

  for (const key in items) {
    const item = items[key];
    const id = item.id.toLowerCase();

    if (normalizedItems[id]) {
      throw new Error(`Duplicate registry item: ${id}`);
    }

    normalizedItems[id] = {
      ...item,
      id,
    };
  }

  const normalizedPresets: Record<string, RegistryPreset> = {};

  for (const key in presets) {
    const preset = presets[key];
    const id = preset.id.toLowerCase();

    if (normalizedPresets[id]) {
      throw new Error(`Duplicate registry preset: ${id}`);
    }

    normalizedPresets[id] = {
      ...preset,
      id,
    };
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    items: Object.freeze(normalizedItems),
    presets: Object.freeze(normalizedPresets),
  });
}
