import { fetchRegistry } from "./fetch";
import type { Registry } from "./types";

let cachedRegistry: Registry | null = null;

export async function readRegistry(url: string) {
  if (cachedRegistry) return cachedRegistry;

  cachedRegistry = await fetchRegistry(url);

  return cachedRegistry;
}
