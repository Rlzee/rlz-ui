import type { ComponentCapabilities } from "@rlz/registry";
import { capabilitiesOf } from "@rlz/ui/registry/resolve-capabilities";

/**
 * Component Analyzer lookup: what a component exposes to the Creator, detected
 * from its own source and filtered by the capability policy, keyed by its
 * registry id (== docs page slug, e.g. "button"). Returns undefined for a
 * component with nothing to customize, so the Creator shows no panel instead of
 * an empty one - and a component nobody declared is still editable.
 */
export function getCapabilities(
  slug: string
): ComponentCapabilities | undefined {
  return capabilitiesOf(slug);
}
