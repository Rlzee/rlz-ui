import type {
  ComponentCapabilities,
  ComponentCapabilitiesOverride,
  ComponentCapabilityExclusions,
  ComponentStyleProperty,
  ComponentVariant,
} from "./types";

// Groups an override may add to or exclude from, in the order the resolved
// capabilities list them.
const GROUPS = [
  "variants",
  "styles",
  "parts",
  "states",
  "editableProperties",
] as const;

type Group = (typeof GROUPS)[number];

type Exclusions = Required<ComponentCapabilityExclusions>;

const NO_EXCLUSIONS: Exclusions = {
  variants: [],
  styles: [],
  parts: [],
  states: [],
  editableProperties: [],
};

// Union of every `exclude` list, in the order they were declared.
function collectExclusions(
  overrides: ComponentCapabilitiesOverride[]
): Exclusions {
  return overrides.reduce<Exclusions>((all, override) => {
    for (const group of GROUPS) {
      all[group] = [...all[group], ...(override.exclude?.[group] ?? [])];
    }

    return all;
  }, { ...NO_EXCLUSIONS });
}

/**
 * Resolves what the Creator can configure on a component: what its sources
 * already expose (detection), plus what only a human can declare (numeric
 * sliders, labels, intent), minus everything the policy hides (`exclude`).
 * Returns undefined when nothing is left to edit, so the Creator shows no panel
 * instead of an empty one.
 */
export function resolveComponentCapabilities(
  detected?: ComponentCapabilities,
  ...overrides: (ComponentCapabilitiesOverride | undefined)[]
): ComponentCapabilities | undefined {
  const valid = overrides.filter(Boolean) as ComponentCapabilitiesOverride[];
  const excluded = collectExclusions(valid);
  const added = <T>(group: Group, pick: (o: ComponentCapabilitiesOverride) => T[] | undefined) =>
    valid.flatMap((override) => pick(override) ?? []);

  const variants = mergeVariants(
    detected?.variants,
    added("variants", (override) => override.variants),
    excluded
  );
  const styles = mergeByKey(
    detected?.styles,
    added("styles", (override) => override.styles),
    excluded.styles
  );
  const parts = mergeStrings(detected?.parts, added("parts", (o) => o.parts), excluded.parts);
  const states = mergeStrings(detected?.states, added("states", (o) => o.states), excluded.states);
  const editableProperties = mergeStrings(
    detected?.editableProperties,
    added("editableProperties", (o) => o.editableProperties),
    excluded.editableProperties
  );

  const resolved: ComponentCapabilities = {
    variants,
    styles,
    parts,
    states,
    editableProperties,
  };

  return GROUPS.some((group) => resolved[group] !== undefined)
    ? resolved
    : undefined;
}

// Detected names + declared additions - exclusions. The detected order is kept,
// because the panel renders the groups in it.
function mergeStrings(
  detected: string[] | undefined,
  added: string[],
  excluded: string[]
): string[] | undefined {
  const merged = [...(detected ?? []), ...added].filter(
    (name) => !excluded.includes(name)
  );

  return merged.length > 0 ? [...new Set(merged)] : undefined;
}

// Same as `mergeStrings`, but keyed: a declared style with a detected `key`
// patches it instead of being appended twice.
function mergeByKey(
  detected: ComponentStyleProperty[] | undefined,
  added: ComponentStyleProperty[],
  excluded: string[]
): ComponentStyleProperty[] | undefined {
  const byKey = new Map<string, ComponentStyleProperty>();

  for (const style of [...(detected ?? []), ...added]) {
    if (excluded.includes(style.key)) {
      byKey.delete(style.key);
      continue;
    }

    byKey.set(style.key, { ...byKey.get(style.key), ...style });
  }

  return byKey.size > 0 ? [...byKey.values()] : undefined;
}

// A patch only changes the fields it declares: an axis keeps the values, the
// default and the parts that detection read out of the component.
function mergeVariants(
  detected: ComponentVariant[] | undefined,
  added: NonNullable<ComponentCapabilitiesOverride["variants"]>,
  excluded: Exclusions
): ComponentVariant[] | undefined {
  const byName = new Map<string, ComponentVariant>();

  for (const axis of detected ?? []) {
    if (!excluded.variants.includes(axis.name)) byName.set(axis.name, axis);
  }

  for (const patch of added) {
    const existing = byName.get(patch.name);

    if (!existing && !patch.values) {
      // Nothing was detected for this axis and the override only patches it, so
      // there is nothing to patch: the axis would render an empty list.
      console.warn(
        `[capabilities] variant "${patch.name}" is declared but not detected, and carries no values - ignored`
      );
      continue;
    }

    // Only the fields the patch declares change; the rest keep their detected
    // value, so declaring an intent never means re-typing what the component has.
    const next: ComponentVariant = {
      ...existing,
      name: patch.name,
      values: patch.values ?? existing?.values ?? [],
      ...(patch.default !== undefined ? { default: patch.default } : {}),
      ...(patch.customizable !== undefined
        ? { customizable: patch.customizable }
        : {}),
      ...(patch.parts !== undefined ? { parts: patch.parts } : {}),
    };

    if (excluded.variants.includes(next.name)) byName.delete(next.name);
    else byName.set(next.name, next);
  }

  return byName.size > 0 ? [...byName.values()] : undefined;
}
