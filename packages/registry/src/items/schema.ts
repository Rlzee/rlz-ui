import { z } from "zod";
import { BaseRegistryItemSchema } from "../schema";

export const RegistryComponentItemSchema = BaseRegistryItemSchema.extend({
  type: z.literal("component"),
  destPath: z.string().optional(),
  registryDependencies: z.array(z.string()).optional(),
  allowManualInstall: z
    .union([z.boolean(), z.literal("deprecated")])
    .optional(),
});

export const RegistryHookItemSchema = BaseRegistryItemSchema.extend({
  type: z.literal("hook"),
  hookType: z.enum(["client", "server"]).optional(),
});

export const RegistryLibItemSchema = BaseRegistryItemSchema.extend({
  type: z.literal("lib"),
});

export const RegistryItemSchema = z.discriminatedUnion("type", [
  RegistryComponentItemSchema,
  RegistryHookItemSchema,
  RegistryLibItemSchema,
]);
