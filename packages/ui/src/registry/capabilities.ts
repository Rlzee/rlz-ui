import type { ComponentCapabilities } from "@rlz/registry";

/**
 * Declarative source of truth for what the Creator can configure per
 * component. This is the "Component Registry" layer of the capability system:
 * the PropertiesPanel is generated straight from this data, and only sections
 * that exist are rendered (a component without `variants` shows no Variants
 * block, one without `parts` shows none, and so on).
 *
 * Values mirror each component's real props / cva config in `../components`:
 *  - Button  -> `buttonVariants` (variant + size)
 *  - Input   -> `InputProps.variant` (TS union, no cva)
 *  - Card    -> compound parts + spacing styles
 *  - Dialog  -> context `variant` + compound parts + boolean props
 *
 * Adding a component means adding an entry here (optionally seeded from its
 * cva config via `lib/read-cva-variants`), not rebuilding the panel.
 */
export const componentCapabilities: Record<string, ComponentCapabilities> = {
  button: {
    variants: [
      {
        name: "variant",
        default: "primary",
        customizable: true,
        values: ["primary", "outline", "secondary", "ghost", "link", "destructive"],
      },
      {
        name: "size",
        default: "md",
        values: [
          "xs",
          "sm",
          "md",
          "lg",
          "xl",
          "icon-xs",
          "icon-sm",
          "icon-md",
          "icon-lg",
          "icon-xl",
        ],
      },
    ],
    styles: [
      { key: "radius", label: "Border radius", kind: "slider", min: 0, max: 2, step: 0.05, unit: "rem", default: 0.375 },
    ],
  },

  input: {
    variants: [
      { name: "variant", default: "primary", values: ["primary", "secondary"] },
    ],
    states: ["focus", "disabled", "invalid"],
  },

  card: {
    parts: ["Header", "Title", "Description", "Body", "Footer"],
    styles: [
      { key: "radius", label: "Border radius", kind: "slider", min: 0, max: 2, step: 0.05, unit: "rem", default: 0.5 },
      { key: "gap", label: "Gap", kind: "slider", min: 0, max: 3, step: 0.25, unit: "rem", default: 1.5 },
      { key: "padding", label: "Padding", kind: "slider", min: 0, max: 3, step: 0.25, unit: "rem", default: 1.5 },
    ],
  },

  dialog: {
    variants: [
      {
        name: "variant",
        default: "default",
        values: ["default", "bare", "bare-top", "bare-bottom"],
      },
    ],
    parts: [
      "Trigger",
      "Popup",
      "Header",
      "Title",
      "Description",
      "Body",
      "Footer",
      "Backdrop",
    ],
    editableProperties: ["backdrop", "backdropBlur", "showCloseButton"],
    styles: [
      { key: "radius", label: "Border radius", kind: "slider", min: 0, max: 2, step: 0.05, unit: "rem", default: 0.5 },
    ],
  },
};
