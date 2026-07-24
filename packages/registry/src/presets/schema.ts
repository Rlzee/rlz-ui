import { z } from "zod";
import { BaseRegistryItemSchema } from "../schema";

export const RegistryPresetSchema = BaseRegistryItemSchema.extend({
  type: z.literal("preset"),
  base: z.object({
    typography: z.object({
      letterSpacing: z.number(),
    }),
    layout: z.object({
      radius: z.number(),
      spacing: z.number(),
    }),
  }),
  colors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      tokens: z.array(
        z.object({
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
        })
      ),
    })
  ),
  animations: z.record(z.string(), z.unknown()).optional(),
  recommendations: z
    .object({
      typography: z
        .object({
          headingFont: z.string(),
          bodyFont: z.string(),
        })
        .optional(),
      icons: z
        .object({
          library: z.string(),
        })
        .optional(),
    })
    .optional(),
});
