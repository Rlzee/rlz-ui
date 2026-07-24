import type { RegistryItem } from "./items/types";
import type { RegistryPreset } from "./presets/types";

export const REGISTRY_TYPES = ["component", "lib", "hook", "preset"] as const;

export type RegistryType = (typeof REGISTRY_TYPES)[number];

export function isRegistryType(value: string): value is RegistryType {
  return REGISTRY_TYPES.includes(value as RegistryType);
}

export type BaseRegistryItem = {
  id: string;
  name: string;
  version: string;
  path: string;
  description?: string;
  dependencies?: string[];
};

export type Registry = {
  schemaVersion: 1;

  items: Record<string, RegistryItem>;
  presets: Record<string, RegistryPreset>;
};
