import { z } from "zod";
import { frameworkSchema } from "./framework";

export const aliasesSchema = z.object({
  baseComponent: z.string(),
  uiComponents: z.string(),
  utils: z.string(),
  lib: z.string(),
  types: z.string(),
});

export const rlzConfigSchema = z.object({
  framework: frameworkSchema,
  dirs: z
    .object({
      root: z.string(),
    })
    .catchall(z.string()),
  css: z.object({
    global: z.string(),
    theme: z.string(),
  }),
  aliases: aliasesSchema,
});
