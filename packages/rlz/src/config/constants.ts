import type { rlzConfig } from "./types";

export const defaultAliasesRlzConfig: rlzConfig["aliases"] = {
  baseComponents: "@/components/ui/base",
  uiComponents: "@/components/ui",
  utils: "@/utils",
  lib: "@/lib",
  types: "@/types",
  hooks: "@/hooks",
  stores: "@/stores",
};

export const defaultUiComponentsAliases: rlzConfig["aliases"] = {
  baseComponents: "@/components/base",
  uiComponents: "@/components/ui",
  utils: "@/utils",
  lib: "@/lib",
  types: "@/types",
  hooks: "@/hooks",
  stores: "@/stores",
};
