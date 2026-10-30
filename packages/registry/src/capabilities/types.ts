import type { z } from "zod";
import type {
  ComponentCapabilitiesSchema,
  ComponentCapabilityValueSchema,
  ComponentStylePropertySchema,
  ComponentVariantSchema,
  PresetComponentCustomizationSchema,
  PresetVariantValueSchema,
} from "./schema";

export type ComponentCapabilityValue = z.infer<
  typeof ComponentCapabilityValueSchema
>;

export type ComponentVariant = z.infer<typeof ComponentVariantSchema>;

export type ComponentStyleProperty = z.infer<typeof ComponentStylePropertySchema>;

export type ComponentCapabilities = z.infer<typeof ComponentCapabilitiesSchema>;

export type PresetVariantValue = z.infer<typeof PresetVariantValueSchema>;

export type PresetComponentCustomization = z.infer<
  typeof PresetComponentCustomizationSchema
>;
