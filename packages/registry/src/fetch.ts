import type { RegistryItem } from "./types";

export async function fetchRegistry(
  url: string
): Promise<Record<string, RegistryItem>> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}
