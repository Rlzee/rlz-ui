import type { z } from "zod";
import type {
  ComponentStyleConfigSchema,
  PresetComponentsSchema,
  PresetComponentsStyleValueSchema,
  PresetComponentsStylesSchema,
  PresetBaseConfigSchema,
  PresetColorConfigSchema,
  PresetColorTokenSchema,
  PresetRecommendationsSchema,
  RegistryPresetSchema,
} from "./schema";

// Base

export type PresetBaseConfig = z.infer<typeof PresetBaseConfigSchema>;

// Colors

export type PresetColorToken = z.infer<typeof PresetColorTokenSchema>;
export type PresetColorConfig = z.infer<typeof PresetColorConfigSchema>;

// Recommendations

export type PresetRecommendations = z.infer<typeof PresetRecommendationsSchema>;

// Components

export type PresetComponentsStyleValue = z.infer<
  typeof PresetComponentsStyleValueSchema
>;
export type PresetComponentsStyles = z.infer<typeof PresetComponentsStylesSchema>;
export type ComponentStyleConfig = z.infer<typeof ComponentStyleConfigSchema>;
export type PresetComponents = z.infer<typeof PresetComponentsSchema>;

// Preset

export type RegistryPreset = z.infer<typeof RegistryPresetSchema>;
