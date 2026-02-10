import { z } from "zod";
import { frameworkSchema } from "../schemas/framework";
import { DIR_DEFINITION } from "./def";

export const aliasesSchema = z.object({
  components: z.string(),
  utils: z.string(),
  lib: z.string(),
  types: z.string(),
  hooks: z.string(),
  stores: z.string(),
});

export const dirsSchema = z
  .object({
    root: z.string(),
  })
  .extend(
    Object.fromEntries(
      Object.keys(DIR_DEFINITION).map((key) => [key, z.string().optional()])
    ) as Record<string, z.ZodOptional<z.ZodString>>
  );

export const rlzConfigSchema = z.object({
  framework: frameworkSchema,
  dirs: dirsSchema,
  css: z.object({
    global: z.string(),
    theme: z.string(),
  }),
  aliases: aliasesSchema,
});
