import { z } from "zod";

export const BaseRegistryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  path: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});
