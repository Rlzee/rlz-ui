import type { RegistryItem } from "./types";

export function defineRegistry(
  items: Record<string, RegistryItem>
): Record<string, RegistryItem> {
  return items;
}
