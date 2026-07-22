import { fetchRegistry } from "./fetch";
import type { RegistryItem } from "./types";

let cachedRegistry: Record<string, RegistryItem> | null = null;

export async function readRegistry(url: string) {
  if (cachedRegistry) return cachedRegistry;
  cachedRegistry = await fetchRegistry(url);
  return cachedRegistry!;
}
