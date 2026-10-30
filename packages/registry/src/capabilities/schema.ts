import { z } from "zod";

// A single selectable value of a capability (variant option, part name...).
// `label` is an optional display hint; when omitted the value itself is shown.
export const ComponentCapabilityValueSchema = z.object({
  value: z.string(),
  label: z.string().optional(),
});

// A named axis the component exposes, e.g. `variant` or `size`. `values` are
// the options that already exist in the design system; `customizable` marks
// the axes meant to grow with brand-new values. The Creator can rename, add and
// remove values on any axis, so this flag is a hint about intent, not a gate.
// `parts` names the compound parts one value restyles at once (a dialog variant
// drives Popup, Header and Footer): the axes without it style a single element.
export const ComponentVariantSchema = z.object({
  name: z.string(),
  values: z.array(z.string()),
  default: z.string().optional(),
  customizable: z.boolean().optional(),
  parts: z.array(z.string()).optional(),
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

// What source detection already knows about a component, minus the groups the
// Creator is not allowed to show. One name per group: a variant axis, a part, a
// state, a style key or a prop.
export const ComponentCapabilityExclusionsSchema = z.object({
  variants: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  parts: z.array(z.string()).optional(),
  styles: z.array(z.string()).optional(),
  editableProperties: z.array(z.string()).optional(),
});

// A patch of one detected variant axis. Every field but `name` is optional, so
// declaring an intent (`customizable`) never means re-typing the values the
// component already exposes: they keep coming from detection.
export const ComponentVariantPatchSchema = z.object({
  name: z.string(),
  values: z.array(z.string()).optional(),
  default: z.string().optional(),
  customizable: z.boolean().optional(),
  parts: z.array(z.string()).optional(),
});

// The hand-written half of a component's capabilities. Capabilities are
// detected from the component sources, so this only carries what detection
// cannot know (numeric sliders, labels, intent) and what must be hidden
// (`exclude`). Adding a component therefore needs no entry at all.
export const ComponentCapabilitiesOverrideSchema = z.object({
  exclude: ComponentCapabilityExclusionsSchema.optional(),
  variants: z.array(ComponentVariantPatchSchema).optional(),
  states: z.array(z.string()).optional(),
  parts: z.array(z.string()).optional(),
  styles: z.array(ComponentStylePropertySchema).optional(),
  editableProperties: z.array(z.string()).optional(),
});

// One value of a variant axis as the Creator stores it: its name plus the
// classes that define it. `classes` is only written when the Creator changed
// them, so a value keeps inheriting the design system's own classes by default.
// `partClasses` does the same per part of a compound axis (keyed by the part
// names the axis declares), so each part of a value can be restyled on its own.
export const PresetVariantValueSchema = z.object({
  value: z.string(),
  classes: z.string().optional(),
  partClasses: z.record(z.string(), z.string()).optional(),
});

// Per-component edits captured in the Creator and serialized into a preset.
export const PresetComponentCustomizationSchema = z.object({
  // Chosen value per variant axis, e.g. { variant: "outline", size: "sm" }.
  props: z.record(z.string(), z.union([z.string(), z.null()])).optional(),
  // Numeric style overrides keyed by ComponentStyleProperty.key.
  styles: z.record(z.string(), z.number()).optional(),
  // Full option list per variant axis, keyed by axis name, in display order.
  // Written by the Creator as soon as a value is renamed, added, removed or
  // restyled: the registry manifest keeps the design system's built-in values
  // untouched, and this override becomes the authoritative list for the axis.
  variants: z.record(z.string(), z.array(PresetVariantValueSchema)).optional(),
});
