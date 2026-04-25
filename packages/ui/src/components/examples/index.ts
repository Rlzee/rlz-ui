import type { ComponentType } from "react";

export const ComponentsExamples: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  accordion: () => import("@rlz/ui/components/examples/ui/accordion/default"),
  alert: () => import("@rlz/ui/components/examples/ui/alert/default"),
};
