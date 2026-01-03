import { z } from "zod";
import { frameworkSchema } from "./framework";

export const aliasesSchema = z.object({
  baseComponent: z.string(),
  uiComponents: z.string(),
  utils: z.string(),
  lib: z.string(),
  types: z.string(),
});

export const dirsSchema = z.object({
  root: z.string(),
  components: z.string().optional(),
  utils: z.string().optional(),
  lib: z.string().optional(),
  types: z.string().optional(),
});

export const rlzConfigSchema = z.object({
  framework: frameworkSchema,
  dirs: dirsSchema,
  css: z.object({
    global: z.string(),
    theme: z.string(),
  }),
  aliases: aliasesSchema,
});
