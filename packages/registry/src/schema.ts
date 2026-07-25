import { z } from "zod";
import { RegistryItemSchema } from "./items/schema";
import { RegistryPresetSchema } from "./presets/schema";

export const RegistrySchema = z.object({
  schemaVersion: z.literal(1),

  items: z.record(z.string(), RegistryItemSchema),

  presets: z.record(z.string(), RegistryPresetSchema),
});
