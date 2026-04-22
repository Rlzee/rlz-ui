import { fetchRegistry, type RegistryItem } from "@rlz/registry";
import { UI_URL } from "@/config";

const registryUrl = `${UI_URL}/registry/registry.json`;
let cachedRegistry: Record<string, RegistryItem> | null = null;

export async function readRegistry() {
  if (cachedRegistry) return cachedRegistry;
  cachedRegistry = await fetchRegistry(registryUrl);
  return cachedRegistry!;
}
