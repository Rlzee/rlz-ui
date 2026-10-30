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
 *  - Input   -> `inputVariants` (variant)
 *  - Card    -> compound parts + spacing styles
 *  - Dialog  -> context `variant` (one value styled per part: Popup, Header and
 *              Footer each answer with their own cva classes, and the Creator
 *              edits all three)
 *              + compound parts + boolean props
 *
 * Adding a component means adding an entry here, not rebuilding the panel: the
 * Creator recovers each value's built-in classes by calling the component's cva
 * function (see `app/(creator)/preset/lib/variant-classes` in the docs app).
 *
 * A style `default` must be the value the design system already renders, so a
 * preset that never touched the slider still previews identically: `radius` is
 * the `--radius` token (0.575rem in `../styles/globals.css`, same as the default
 * preset's `base.layout.radius`), not the corner a given utility draws.
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
      { key: "radius", label: "Border radius", kind: "slider", min: 0, max: 2, step: 0.05, unit: "rem", default: 0.575 },
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
      { key: "radius", label: "Border radius", kind: "slider", min: 0, max: 2, step: 0.05, unit: "rem", default: 0.575 },
      { key: "gap", label: "Gap", kind: "slider", min: 0, max: 3, step: 0.25, unit: "rem", default: 1.5 },
      { key: "padding", label: "Padding", kind: "slider", min: 0, max: 3, step: 0.25, unit: "rem", default: 1.5 },
    ],
  },

  dialog: {
    variants: [
      {
        name: "variant",
        default: "default",
        // One chosen value restyles three parts at once, so the Creator edits
        // the classes of every part, not only the Popup's.
        parts: ["Popup", "Header", "Footer"],
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
      { key: "radius", label: "Border radius", kind: "slider", min: 0, max: 2, step: 0.05, unit: "rem", default: 0.575 },
    ],
  },
};
