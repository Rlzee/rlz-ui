import {
  resolveComponentCapabilities,
  type ComponentCapabilitiesOverride,
  type ComponentPart,
  type RegistryComponentItem,
} from "@rlz/registry";

import { componentCapabilitiesOverrides, GLOBAL_EXCLUSIONS } from "./capabilities";
import {
  detectedCapabilities,
  detectedParts,
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

/**
 * Every box of a component the Creator can restyle, in display order: the
 * component itself (`Root`), then the parts it exports. Names come from detection -
 * which is what lets a part nobody declared still be editable - minus the ones the
 * policy hides, and only those whose element carries a `data-slot`, since that is
 * how the demos are pointed at.
 */
export function partsOf(id: string): (ComponentPart & { name: string })[] {
  const detected = detectedParts[id];

  if (!detected) return [];

  const excluded = new Set([
    ...hiddenParts(GLOBAL_EXCLUSIONS),
    ...hiddenParts(componentCapabilitiesOverrides[id]),
  ]);

  return Object.entries(detected)
    .filter(([name]) => !excluded.has(name))
    .map(([name, part]) => ({ name, ...part }));
}

function hiddenParts(override?: ComponentCapabilitiesOverride) {
  return override?.exclude?.parts ?? [];
}
