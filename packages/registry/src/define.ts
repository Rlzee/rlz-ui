import type { RegistryItem } from "./types";

export function defineRegistry(
  items: Record<string, RegistryItem>
): Readonly<Record<string, RegistryItem>> {
  const normalized: Record<string, RegistryItem> = {};

  for (const key in items) {
    const item = items[key];
    const id = item.id.toLowerCase();

    if (normalized[id]) {
      throw new Error(`Duplicate registry item: ${id}`);
    }

    if (!item.name) {
      throw new Error(`Registry item "${id}" is missing a name`);
    }

    if (!item.version) {
      throw new Error(`Registry item "${id}" is missing a version`);
    }

    if (!item.path) {
      throw new Error(`Registry item "${id}" is missing a path`);
    }

    normalized[id] = {
      ...item,
      id,
    };
  }

  return Object.freeze(normalized);
}
