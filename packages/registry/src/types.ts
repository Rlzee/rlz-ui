export const REGISTRY_ITEM_TYPES = ["component", "lib", "hook"] as const;

export type RegistryItemType = (typeof REGISTRY_ITEM_TYPES)[number];

export function isRegistryItemType(value: string): value is RegistryItemType {
  return REGISTRY_ITEM_TYPES.includes(value as RegistryItemType);
}

type BaseRegistryItem = {
  name: string;
  description?: string;
  version: string;
  path: string;
  dependencies?: string[];
};

export type RegistryComponentItem = BaseRegistryItem & {
  type: "component";
  destPath?: string;
  registryDependencies?: string[];
  allowManualInstall?: boolean | "deprecated";
};

export type RegistryHookItem = BaseRegistryItem & {
  type: "hook";
  hookType?: "client" | "server";
};

export type RegistryLibItem = BaseRegistryItem & {
  type: "lib";
};

export type RegistryItem =
  | RegistryComponentItem
  | RegistryHookItem
  | RegistryLibItem;
