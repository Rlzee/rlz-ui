import type { ComponentType } from "react";

export const ComponentsExamples: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  // Accordion
  accordion: () => import("@rlz/ui/components/examples/ui/accordion/default"),
  "accordion-multiple": () =>
    import("@rlz/ui/components/examples/ui/accordion/multiple"),
  "accordion-disabled": () =>
    import("@rlz/ui/components/examples/ui/accordion/disabled"),

  // Alert
  alert: () => import("@rlz/ui/components/examples/ui/alert/default"),
  "alert-with-icon": () =>
    import("@rlz/ui/components/examples/ui/alert/with-icon"),
  "alert-warning": () => import("@rlz/ui/components/examples/ui/alert/warning"),
  "alert-error": () => import("@rlz/ui/components/examples/ui/alert/error"),
  "alert-success": () => import("@rlz/ui/components/examples/ui/alert/success"),
  "alert-info": () => import("@rlz/ui/components/examples/ui/alert/info"),
  "alert-action": () => import("@rlz/ui/components/examples/ui/alert/action"),

  // Alert Dialog
  "alert-dialog": () =>
    import("@rlz/ui/components/examples/ui/alert-dialog/default"),
};
