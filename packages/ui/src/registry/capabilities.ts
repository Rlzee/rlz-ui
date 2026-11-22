import type { ComponentCapabilitiesOverride } from "@rlz/registry";

/**
 * The hand-written half of the capability system - and it stays hand-written
 * only for what a source cannot say.
 *
 * What a component exposes is DETECTED from its own file (`./capabilities.detected`,
 * refreshed by `pnpm --filter @rlz/ui detect:capabilities`): cva variant axes and
 * their values, compound parts, and boolean props. So adding a component needs no
 * entry here at all - it becomes editable on its own, and this file only lists the
 * exceptions.
 *
 * `GLOBAL_EXCLUSIONS` hides what detection is right about in general but must
 * never offer; `componentCapabilitiesOverrides` hides what one component should
 * not expose, and declares what no file can tell: the intent that an axis accepts
 * brand-new values. `exclude: true` disables a component entirely, including its
 * editable parts and any capabilities detected in the future.
 */

export const GLOBAL_EXCLUSIONS: ComponentCapabilitiesOverride = {
  exclude: {
    // Parts that draw nothing themselves: they mount a portal, a context or a
    // positioner, so there is no class of theirs to customize.
    parts: ["Portal", "Provider", "Positioner"],
    // React plumbing and behavior props: how a component works, not how it looks.
    editableProperties: [
      "children",
      "className",
      "style",
      "render",
      "id",
      "value",
      "defaultValue",
      "unstyled",
      "disabled",
      "checked",
      "defaultChecked",
      "required",
      "readOnly",
      "multiple",
      "hidden",
      "autoFocus",
      "open",
      "defaultOpen",
      "onOpenChange",
    ],
  },
};

export const componentCapabilitiesOverrides: Record<
  string,
  ComponentCapabilitiesOverride
> = {
  // Context menus reuse menu styling and must not expose their own customization.
  "context-menu": { exclude: true },

  // A behavior-only wrapper with no authored styles to customize.
  form: { exclude: true },

  collapsible: {
    // Only the panel owns styles; root and trigger are behavior-only wrappers.
    exclude: { parts: ["Root", "Trigger"] },
  },

  "alert-dialog": {
    exclude: {
      parts: ["Viewport"],
      editableProperties: ["blur", "backdropBlur"],
    },
  },

  button: {
    // The one axis meant to grow with brand-new brand values: `size` stays the
    // scale it is, `variant` is a palette.
    variants: [{ name: "variant", customizable: true }],
  },

  dialog: {
    exclude: {
      // Structure of the popup, not style: hiding them leaves the parts and props
      // a preset is actually meant to restyle.
      parts: ["Viewport", "Close"],
      editableProperties: ["blur", "scrollFade"],
    },
  },

  drawer: {
    exclude: {
      parts: ["Viewport", "Close", "SwipeArea", "Indent", "IndentBackground"],
      editableProperties: ["blur", "scrollFade", "indent"],
    },
  },

  // Overlay props that only ever mute or position the popup.
  command: { exclude: { editableProperties: ["blur", "keepHighlight"] } },
  menu: { exclude: { parts: ["Viewport", "Close"] } },
  select: { exclude: { editableProperties: ["alignItemWithTrigger"] } },
  tooltip: { exclude: { editableProperties: ["arrow"] } },

  sidebar: {
    exclude: {
      // A layout shell: its own open/close plumbing is not a design decision.
      editableProperties: ["isMobile", "openMobile", "isActive", "showOnHover"],
    },
  },

  chart: {
    exclude: {
      // Emits CSS variables and forwards to recharts instead of drawing itself.
      parts: ["Style", "TooltipContent", "LegendContent"],
      editableProperties: ["hideLabel", "hideIndicator", "hideIcon"],
    },
  },
};
