import { z } from "zod";

export const ComponentManifestSchema = z.object({
  name: z.string(),
  dependencies: z
    .object({
      npm: z.array(z.string()).optional(),
      internalComponents: z.array(z.string()).optional(),
      internalFiles: z.array(z.string()).optional(),
    })
    .optional(),
  files: z.object({
    source: z.string(),
    target: z.string(),
  })
});
