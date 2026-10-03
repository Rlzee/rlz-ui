import { z } from "zod";
import { BaseRegistryItemSchema } from "../base-schema";

export const PresetBaseConfigSchema = z.object({
  typography: z.object({
    letterSpacing: z.number(),
  }),

  layout: z.object({
    radius: z.number(),
    spacing: z.number(),
  }),
});

export const PresetColorTokenSchema = z.object({
  label: z.string(),
  cssVar: z.string(),

  dark: z.object({
    value: z.string(),
    swatch: z.string(),
  }),

  light: z.object({
    value: z.string(),
    swatch: z.string(),
  }),
});

export const PresetColorConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokens: z.array(PresetColorTokenSchema),
});

export const PresetRecommendationsSchema = z.object({
  typography: z
    .object({
      fontSans: z.string(),
      fontHeading: z.string(),
      fontMono: z.string().optional(),
    })
    .optional(),

  icons: z
    .object({
      library: z.string(),
    })
    .optional(),
});

export const RegistryPresetSchema = BaseRegistryItemSchema.extend({
  type: z.literal("preset"),

  base: PresetBaseConfigSchema,

  colors: z.array(PresetColorConfigSchema),

  recommendations: PresetRecommendationsSchema.optional(),
});
