import { defineRegistry } from "@rlz/registry";

import { registryBaseComponents } from "./base_components";
import { registryComponents } from "./components";
import { registryLibs } from "./lib";
import { registryHooks } from "./hooks";

import { testPreset } from "./test/preset.test";

export const REGISTRY = defineRegistry({
  items: {
    ...registryBaseComponents,
    ...registryComponents,
    ...registryLibs,
    ...registryHooks,
  },
  presets: {
    testPreset,
  },
});
