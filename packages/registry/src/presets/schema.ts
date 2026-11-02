import { z } from "zod";
import { BaseRegistryItemSchema } from "../base-schema";
import { PresetComponentCustomizationSchema } from "../capabilities/schema";

export const PresetShadowConfigSchema = z.object({
  /** `--shadow-color`: what every layer of the ladder is drawn in */
  color: z.string(),

  /** `--shadow-opacity`: the alpha the steps scale, not a percentage */
  opacity: z.number(),

  /** `--shadow-blur`, `--shadow-spread` and both offsets are pixels */
  blur: z.number(),
  spread: z.number(),
  offsetX: z.number(),
  offsetY: z.number(),
});

export const PresetBaseConfigSchema = z.object({
  typography: z.object({
    letterSpacing: z.number(),
  }),

  layout: z.object({
    radius: z.number(),
    spacing: z.number(),
  }),

  // One shadow box: the color it is drawn in, the alpha, and how far it reaches.
  // Absent means the app keeps the box its own stylesheet declares.
  shadows: PresetShadowConfigSchema.optional(),

  utilities: z.record(z.string(), z.string()).optional(),
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

  // Per-component Creator edits (chosen variants, style overrides), keyed by
  // registry component id. Serialized into the preset output when present.
  components: z
    .record(z.string(), PresetComponentCustomizationSchema)
    .optional(),
});
