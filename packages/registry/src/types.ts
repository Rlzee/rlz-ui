export const REGISTRY_ITEM_TYPES = [
  "component",
  "lib",
  "hook",
  "preset",
] as const;

export type RegistryItemType = (typeof REGISTRY_ITEM_TYPES)[number];

export function isRegistryItemType(value: string): value is RegistryItemType {
  return REGISTRY_ITEM_TYPES.includes(value as RegistryItemType);
}

type BaseRegistryItem = {
  id: string;
  name: string;
  version: string;
  path: string;
  description?: string;
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

export type PresetBaseConfig = {
  typography: {
    letterSpacing: number;
  };
  layout: {
    radius: number;
    spacing: number;
  };
};

export type PresetColorToken = {
  label: string;
  cssVar: string;
  dark: {
    value: string;
    swatch: string;
  };
  light: {
    value: string;
    swatch: string;
  };
};

export type PresetColorConfig = {
  id: string;
  name: string;
  tokens: PresetColorToken[];
};

export type PresetRecommendations = {
  typography?: {
    headingFont: string;
    bodyFont: string;
  };
  icons?: {
    library: string;
  };
};

export type RegistryPresetItem = BaseRegistryItem & {
  type: "preset";

  base: PresetBaseConfig;
  colors: PresetColorConfig[];

  animations?: Record<string, unknown>;

  recommendations?: PresetRecommendations;
};

export type RegistryItem =
  | RegistryComponentItem
  | RegistryHookItem
  | RegistryLibItem
  | RegistryPresetItem;
