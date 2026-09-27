import type { z } from "zod";
import type {
  RegistryComponentItemSchema,
  RegistryHookItemSchema,
  RegistryItemSchema,
  RegistryLibItemSchema,
} from "./schema";

export const REGISTRY_ITEM_TYPES = ["component", "lib", "hook"] as const;

export type RegistryItemType = (typeof REGISTRY_ITEM_TYPES)[number];

export function isRegistryItemType(value: string): value is RegistryItemType {
  return REGISTRY_ITEM_TYPES.includes(value as RegistryItemType);
}

export type RegistryComponentItem = z.infer<
  typeof RegistryComponentItemSchema
>;

export type RegistryHookItem = z.infer<typeof RegistryHookItemSchema>;

export type RegistryLibItem = z.infer<typeof RegistryLibItemSchema>;

export type RegistryItem = z.infer<typeof RegistryItemSchema>;
