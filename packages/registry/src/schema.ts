import { z } from "zod";
import { RegistryItemSchema } from "./items/schema";
import { RegistryPresetSchema } from "./presets/schema";

export const BaseRegistryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  path: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const RegistrySchema = z.object({
  schemaVersion: z.literal(1),

  items: z.record(z.string(), RegistryItemSchema),
  presets: z.record(z.string(), RegistryPresetSchema),
});
