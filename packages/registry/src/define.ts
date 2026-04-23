import type { RegistryItem } from "./types";

export function defineRegistry(
  items: Record<string, RegistryItem>
): Record<string, RegistryItem> {
  const normalized: Record<string, RegistryItem> = {};

  for (const key in items) {
    const item = items[key];

    const name = (item.name ?? key).toLowerCase();

    if (normalized[name]) {
      throw new Error(`Duplicate registry item: ${name}`);
    }

    normalized[name] = {
      ...item,
      name,
    };
  }

  return normalized;
}
