import type { rlzConfig } from "./types/config";

export const UI_URL =
  "https://raw.githubusercontent.com/Rlzee/rlz-ui/main/packages/ui/src";

export const defaultDependencies: string[] = [
  "@base-ui/react",
  "tw-animate-css",
];

export const defaultAliasesRlzConfig: rlzConfig["aliases"] = {
  baseComponent: "@/components/ui/base",
  uiComponents: "@/components/ui",
  utils: "@/utils",
  lib: "@/lib",
  types: "@/types",
};
