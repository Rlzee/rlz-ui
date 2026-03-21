import type { RegistryItem } from "./types";
import { UI_URL } from "@/config";

const registryUrl = `${UI_URL}/registry/index`;
let cachedRegistry: Record<string, RegistryItem> | null = null;

export async function readRegistry(): Promise<Record<string, RegistryItem>> {
  if (cachedRegistry) return cachedRegistry;

  const res = await fetch(registryUrl);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry: ${res.status} ${res.statusText}`
    );
  }

  cachedRegistry = await res.json();
  return cachedRegistry!;
}
