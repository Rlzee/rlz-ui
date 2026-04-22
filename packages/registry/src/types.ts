export const REGISTRY_ITEM_TYPES = ["component", "lib", "hook"] as const;

/**
 * Runtime array of registry types (readonly tuple).
 * Use `REGISTRY_TYPES` at runtime so you don't need to duplicate allowed values.
 */
export type RegistryItemType = (typeof REGISTRY_ITEM_TYPES)[number];

/**
 * Type guard to validate a string at runtime as a RegistryType.
 */
export function isRegistryItemType(value: string): value is RegistryItemType {
  return (REGISTRY_ITEM_TYPES as readonly string[]).includes(value);
}

export type RegistryItem = {
  name: string;
  type: RegistryItemType;
  description?: string;
  path: string;
  destPath?: string;
  version: string;
  dependencies?: string[];
  registryDependencies?: string[];
  allowManualInstall?: boolean | "deprecated";
};
