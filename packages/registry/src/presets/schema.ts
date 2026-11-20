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

export const PresetAnimationNameSchema = z.string().regex(/^[a-z][a-z0-9-]*$/);

export const PresetKeyframeSelectorSchema = z.string().refine(
  (value) =>
    value.split(",").every((part) => {
      const selector = part.trim();
      if (selector === "from" || selector === "to") return true;
      return (
        /^(?:\d+(?:\.\d+)?|\.\d+)%$/.test(selector) &&
        Number(selector.slice(0, -1)) <= 100
      );
    }),
  "Expected from, to, or percentages between 0% and 100%"
);

const AnimationPropertySchema = z
  .string()
  .regex(/^(?:-?[a-z][a-z0-9-]*|--[a-zA-Z_][a-zA-Z0-9_-]*)$/);

// Values may contain functions and strings, but cannot escape their declaration.
const AnimationValueSchema = z
  .string()
  .min(1)
  .refine((value) => {
    if (
      !value.trim() ||
      /[;{}@\\\u0000-\u001f\u007f]/.test(value) ||
      /\/\*|\*\//.test(value)
    )
      return false;

    let quote = "";
    let depth = 0;
    for (const character of value) {
      if (quote) {
        if (character === quote) quote = "";
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === "(") {
        depth++;
      } else if (character === ")") {
        if (--depth < 0) return false;
      }
    }
    return quote === "" && depth === 0;
  }, "Expected a CSS value without rule delimiters, comments or unbalanced functions");

export const PresetAnimationSchema = z.object({
  value: AnimationValueSchema,
  keyframes: z.record(
    PresetKeyframeSelectorSchema,
    z.record(AnimationPropertySchema, AnimationValueSchema)
  ),
});

export const PresetAnimationsSchema = z.record(
  PresetAnimationNameSchema,
  PresetAnimationSchema
);

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

  animations: PresetAnimationsSchema.optional(),
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
