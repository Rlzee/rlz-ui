import type { ComponentCapabilitiesOverride } from "@rlz/registry";

/**
 * The hand-written half of the capability system - and it stays hand-written
 * only for what a source cannot say.
 *
 * What a component exposes is DETECTED from its own file (`./capabilities.detected`,
 * refreshed by `pnpm --filter @rlz/ui detect:capabilities`): cva variant axes and
 * their values, compound parts, styled states, boolean props, and the radius
 * tokens it draws. So adding a component needs no entry here at all - it becomes
 * editable on its own, and this file only lists the exceptions.
 *
 * `GLOBAL_EXCLUSIONS` hides what detection is right about in general but must
 * never offer; `componentCapabilitiesOverrides` hides what one component should
 * not expose, and declares what no file can tell: the range of a numeric slider
 * and the intent that an axis accepts brand-new values.
 *
 * A style `default` must be the value the design system already renders, so a
 * preset that never touched the slider still previews identically: `radius` is the
 * `--radius` token (0.575rem in `../styles/globals.css`, same as the default
 * preset's `base.layout.radius`), not the corner a given utility draws - which is
 * also why detection seeds it instead of every component declaring it.
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
  button: {
    // The one axis meant to grow with brand-new brand values: `size` stays the
    // scale it is, `variant` is a palette.
    variants: [{ name: "variant", customizable: true }],
  },

  card: {
    // `gap-6` and `px-6` are the design system's choice, not a range the Creator
    // can be trusted to guess: the sliders tuning them are declared.
    styles: [
      { key: "gap", label: "Gap", kind: "slider", min: 0, max: 3, step: 0.25, unit: "rem", default: 1.5 },
      { key: "padding", label: "Padding", kind: "slider", min: 0, max: 3, step: 0.25, unit: "rem", default: 1.5 },
    ],
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
