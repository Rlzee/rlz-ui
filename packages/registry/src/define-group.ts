import type {
  RegistryItem,
  RegistryItemType,
  RegistryComponentItem,
  RegistryHookItem,
  RegistryLibItem,
  RegistryPresetItem,
} from "./types";

type RegistryGroupInput<T extends RegistryItem> = {
  [key: string]: Omit<T, "id" | "type">;
};

export function defineRegistryGroup(
  type: "component",
  items: RegistryGroupInput<RegistryComponentItem>
): Record<string, RegistryComponentItem>;

export function defineRegistryGroup(
  type: "hook",
  items: RegistryGroupInput<RegistryHookItem>
): Record<string, RegistryHookItem>;

export function defineRegistryGroup(
  type: "lib",
  items: RegistryGroupInput<RegistryLibItem>
): Record<string, RegistryLibItem>;

export function defineRegistryGroup(
  type: "preset",
  items: RegistryGroupInput<RegistryPresetItem>
): Record<string, RegistryPresetItem>;

export function defineRegistryGroup(
  type: RegistryItemType,
  items: Record<string, Omit<RegistryItem, "id" | "type">>
) {
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
