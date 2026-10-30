import type { z } from "zod";
import type {
  ComponentCapabilitiesOverrideSchema,
  ComponentCapabilitiesSchema,
  ComponentCapabilityExclusionsSchema,
  ComponentCapabilityValueSchema,
  ComponentStylePropertySchema,
  ComponentVariantPatchSchema,
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

export type ComponentCapabilityExclusions = z.infer<
  typeof ComponentCapabilityExclusionsSchema
>;

export type ComponentVariantPatch = z.infer<typeof ComponentVariantPatchSchema>;

export type ComponentCapabilitiesOverride = z.infer<
  typeof ComponentCapabilitiesOverrideSchema
>;

/**
 * Built-in classes of a variant axis, as read out of the component source.
 * `byValue` covers axes that style a single element (axis -> value -> classes);
 * `byPart` covers axes whose one value restyles several parts of a compound
 * component (axis -> part -> value -> classes). Kept out of the manifest on
 * purpose: the classes belong to the component, and only the Creator reads them
 * to seed a class editor.
 */
export type ComponentVariantClasses = {
  byValue?: Record<string, Record<string, string>>;
  byPart?: Record<string, Record<string, Record<string, string>>>;
};

/**
 * One box of a component the Creator can restyle: `slot` is the `data-slot` its
 * element carries in the demos, `classes` what the design system authored on it -
 * the shared classes, before any variant value is added. Detected from the source,
 * so a preset only stores what the Creator changed. `Root` is the component itself,
 * the other names are the parts it exports (`Header`, `Popup`...).
 */
export type ComponentPart = { slot: string; classes: string };

export type PresetVariantValue = z.infer<typeof PresetVariantValueSchema>;

export type PresetComponentCustomization = z.infer<
  typeof PresetComponentCustomizationSchema
>;
