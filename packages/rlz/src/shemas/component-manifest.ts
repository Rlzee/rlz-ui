import { z } from "zod";
import { aliasesSchema } from "./config";

export const ComponentManifestSchema = z.object({
  name: z.string(),
  dependencies: z
    .object({
      npm: z.array(z.string()).optional(),
      internalComponents: z.array(z.string()).optional(),
      internalFiles: z.array(z.string()).optional(),
    })
    .optional(),
  files: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
    })
  ),
  imports: aliasesSchema.optional(),
});
