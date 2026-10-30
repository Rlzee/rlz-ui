import { defineRegistry } from "@rlz/registry";

import { registryBaseComponents } from "./base_components";
import { registryComponents } from "./components";
import { registryHooks } from "./hooks";
import { withResolvedCapabilities } from "./resolve-capabilities";

import { testPreset } from "./test/preset.test";

/**
 * No component item declares its capabilities: they are detected from its source
 * and resolved here, so the manifest (and `registry.json`) always says what the
 * component really exposes. See `./capabilities` for what the policy hides.
 */
export const REGISTRY = defineRegistry({
  items: {
    ...withResolvedCapabilities(registryBaseComponents),
    ...withResolvedCapabilities(registryComponents),
    ...registryHooks,
  },
  presets: {
    testPreset,
  },
});
