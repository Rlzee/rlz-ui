import { registryComponents } from "@rlz/ui/registry/components";
import type { ComponentCapabilities } from "@rlz/registry";

/**
 * Component Analyzer lookup: resolves the declarative capabilities a component
 * exposes, keyed by its registry id (== docs page slug, e.g. "button"). Returns
 * undefined for components with no manifest entry, so the Creator can fall back
 * to "no editable properties" instead of guessing.
 */
export function getCapabilities(
  slug: string
): ComponentCapabilities | undefined {
  return registryComponents[slug]?.capabilities;
}
