import { z } from "zod";

// A single selectable value of a capability (variant option, part name...).
// `label` is an optional display hint; when omitted the value itself is shown.
export const ComponentCapabilityValueSchema = z.object({
  value: z.string(),
  label: z.string().optional(),
});

// A named axis the component exposes, e.g. `variant` or `size`. `values` are
// the options that already exist in the design system; `customizable` marks
// axes where the Creator may later add brand-new values (reserved slot, kept
// distinct from the plain read-only detection of available variants).
export const ComponentVariantSchema = z.object({
  name: z.string(),
  values: z.array(z.string()),
  default: z.string().optional(),
  customizable: z.boolean().optional(),
});

// A numeric style the Creator can tune live (radius, spacing...). `kind` is a
// discriminator so future control types (color, select...) can be added.
export const ComponentStylePropertySchema = z.object({
  key: z.string(),
  label: z.string(),
  kind: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  unit: z.string(),
  default: z.number().optional(),
});

// Everything the Creator needs to auto-build a PropertiesPanel for a
// component. Every group is optional: a section only renders when present, so
// a component without variants never shows a Variants block.
export const ComponentCapabilitiesSchema = z.object({
  variants: z.array(ComponentVariantSchema).optional(),
  states: z.array(z.string()).optional(),
  parts: z.array(z.string()).optional(),
  styles: z.array(ComponentStylePropertySchema).optional(),
  // Props worth surfacing as an always-available Creator adjustment (e.g.
  // booleans such as `backdrop`, `showCloseButton`), separate from the
  // structural `variants`/`parts` they accompany.
  editableProperties: z.array(z.string()).optional(),
});

// Per-component edits captured in the Creator and serialized into a preset.
export const PresetComponentCustomizationSchema = z.object({
  // Chosen value per variant axis, e.g. { variant: "outline", size: "sm" }.
  props: z.record(z.string(), z.union([z.string(), z.null()])).optional(),
  // Numeric style overrides keyed by ComponentStyleProperty.key.
  styles: z.record(z.string(), z.number()).optional(),
});
