import type { Registry } from "./types";
import { RegistrySchema } from "./schema";

export async function fetchRegistry(url: string): Promise<Registry> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry: ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();

  return RegistrySchema.parse(json);
}
