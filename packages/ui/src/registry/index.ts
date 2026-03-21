import { registryBaseComponents } from "./base_components";
import { registryComponents } from "./components";
import { registryLibs } from "./lib";
import { registryHooks } from "./hooks";

export const REGISTRY = {
  ...registryBaseComponents,
  ...registryComponents,
  ...registryLibs,
  ...registryHooks,
};
