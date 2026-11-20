import type { z } from "zod";
import type {
  PresetAnimationSchema,
  PresetBaseConfigSchema,
  PresetColorConfigSchema,
  PresetColorTokenSchema,
  PresetRecommendationsSchema,
  PresetShadowConfigSchema,
  RegistryPresetSchema,
} from "./schema";

// Base

export type PresetBaseConfig = z.infer<typeof PresetBaseConfigSchema>;

export type PresetAnimation = z.infer<typeof PresetAnimationSchema>;

// Shadow

export type PresetShadowConfig = z.infer<typeof PresetShadowConfigSchema>;

// Colors

export type PresetColorToken = z.infer<typeof PresetColorTokenSchema>;
export type PresetColorConfig = z.infer<typeof PresetColorConfigSchema>;

// Recommendations

export type PresetRecommendations = z.infer<typeof PresetRecommendationsSchema>;

// Preset

export type RegistryPreset = z.infer<typeof RegistryPresetSchema>;
