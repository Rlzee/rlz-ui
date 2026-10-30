import {
  resolveComponentCapabilities,
  type RegistryComponentItem,
} from "@rlz/registry";

import { componentCapabilitiesOverrides, GLOBAL_EXCLUSIONS } from "./capabilities";
import {
  detectedCapabilities,
  detectedVariantClasses,
} from "./capabilities.detected";

/**
 * The "Component Analyzer" layer of the capability system: what a component's
 * source already exposes, minus what the policy hides, plus what only a human
 * declares. Every registered component goes through it, so its capabilities are
 * never written by hand - which is what lets a new component be editable the
 * moment it exists. Returns undefined when there is nothing to customize.
 */
export function capabilitiesOf(id: string) {
  return resolveComponentCapabilities(
    detectedCapabilities[id],
    GLOBAL_EXCLUSIONS,
    componentCapabilitiesOverrides[id]
  );
}

/** Resolves the capabilities of every component item, keyed by registry id. */
export function withResolvedCapabilities<T extends RegistryComponentItem>(
  items: Record<string, T>
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(items).map(([id, item]) => [
      id,
      { ...item, capabilities: capabilitiesOf(id) },
    ])
  );
}

/**
 * Built-in classes of a component's variant values, keyed by registry id. They
 * come from the same detection pass but stay out of the manifest: a preset is
 * meant to store what the Creator changed, not a copy of the design system.
 */
export function variantClassesOf(id: string) {
  return detectedVariantClasses[id];
}
