import { z } from "zod";
import { BaseRegistryItemSchema } from "../base-schema";

export const PresetComponentsStyleValueSchema = z.union([
  z.string(),
  z.number(),
]);

export const PresetComponentsStylesSchema = z.record(
  z.string(),
  PresetComponentsStyleValueSchema
);

export const ComponentStyleConfigSchema = z.object({
  styles: PresetComponentsStylesSchema.optional(),

  parts: z.record(z.string(), PresetComponentsStylesSchema).optional(),

  states: z
    .record(
      z.string(),
      z.object({
        styles: PresetComponentsStylesSchema.optional(),

        parts: z.record(z.string(), PresetComponentsStylesSchema).optional(),
      })
    )
    .optional(),

  selectors: z.record(z.string(), PresetComponentsStylesSchema).optional(),
});

export const PresetComponentsSchema = z.record(
  z.string(),
  ComponentStyleConfigSchema
);

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

  components: PresetComponentsSchema.optional(),

  recommendations: PresetRecommendationsSchema.optional(),
});
