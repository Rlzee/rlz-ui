import type {
  RegistryItemType,
  RegistryComponentItem,
  RegistryHookItem,
  RegistryLibItem,
  RegistryItem,
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
