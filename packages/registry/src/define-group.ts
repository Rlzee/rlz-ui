import type {
  RegistryItem,
  RegistryItemType,
  RegistryComponentItem,
  RegistryHookItem,
  RegistryLibItem,
  RegistryPresetItem,
} from "./types";

type RegistryItemsInput<T extends RegistryItem> = {
  [key: string]: Omit<T, "id" | "type">;
};

export function defineRegistryItems(
  type: "component",
  items: RegistryItemsInput<RegistryComponentItem>
): Record<string, RegistryComponentItem>;

export function defineRegistryItems(
  type: "hook",
  items: RegistryItemsInput<RegistryHookItem>
): Record<string, RegistryHookItem>;

export function defineRegistryItems(
  type: "lib",
  items: RegistryItemsInput<RegistryLibItem>
): Record<string, RegistryLibItem>;

export function defineRegistryItems(
  type: Exclude<RegistryItemType, "preset">,
  items: Record<string, Omit<RegistryItem, "id" | "type">>
): Record<string, RegistryItem> {
  return Object.fromEntries(
    Object.entries(items).map(([id, item]) => [
      id,
      {
        ...item,
        id,
        type,
      },
    ])
  );
}

type RegistryPresetsInput = {
  [key: string]: Omit<RegistryPresetItem, "id" | "type">;
};

export function defineRegistryPresets(
  presets: RegistryPresetsInput
): Record<string, RegistryPresetItem> {
  return Object.fromEntries(
    Object.entries(presets).map(([id, preset]) => [
      id,
      {
        ...preset,
        id,
        type: "preset",
      },
    ])
  );
}
