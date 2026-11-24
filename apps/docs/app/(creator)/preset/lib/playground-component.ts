import type { PresetComponentCustomization } from "@rlz/registry";
import { cn } from "@rlz/ui/lib/cn";
import { capabilitiesOf, partsOf } from "@rlz/ui/registry/resolve-capabilities";
import { currentAppliedVariant } from "./component-edits";
import { builtinVariantClasses, variantClassSections } from "./variant-classes";

type PreviewVariant = { axis: string; native: string; value: string };

/** Keep a native value for the component's behavior, even for newly authored styles. */
export function playgroundVariant(
  slug: string,
  name: string,
  edit?: PresetComponentCustomization
): PreviewVariant {
  const axis = capabilitiesOf(slug)?.variants?.find(
    (axis) => axis.name === name
  );
  if (!axis) throw new Error(`Missing preview variant: ${slug}.${name}`);
  const { value } = currentAppliedVariant(axis, edit);
  const native = axis.values.includes(value)
    ? value
    : axis.default ?? axis.values[0] ?? "";
  return { axis: name, native, value };
}

/** The caller identifies the component, slot and native variant at render time. */
export function resolvePreviewClasses(
  slug: string,
  slot: string,
  authored: string,
  edit: PresetComponentCustomization | undefined,
  variants: PreviewVariant[]
): string {
  if (!edit) return authored;
  const part = partsOf(slug).find((part) => part.slot === slot);
  const partEdit = part && edit.partClasses?.[part.name];
  const tokens = (value: string | undefined) =>
    (value ?? "").split(/\s+/).filter(Boolean);
  const remove = new Set(partEdit === undefined ? [] : tokens(part?.classes));
  const rules = capabilitiesOf(slug)?.variants ?? [];
  const layers = variants.flatMap(({ axis: name, value, native }) => {
    const axis = rules.find((axis) => axis.name === name);
    if (!axis) return [];
    const option = currentAppliedVariant(axis, edit);
    const section = variantClassSections(slug, axis, option).find(
      (section) => section.slot === slot
    );
    if (!section) return [];
    const original = builtinVariantClasses(slug, axis, native, section.part);
    if (
      section.override === undefined &&
      value === native &&
      partEdit === undefined
    )
      return [];
    return [{ original, next: section.override ?? section.builtIn }];
  });

  if (partEdit === undefined && !layers.length) return authored;
  for (const layer of layers)
    tokens(layer.original).forEach((token) => remove.add(token));
  return cn(
    tokens(authored).filter((token) => !remove.has(token)),
    ...layers.map(({ next }) => next),
    partEdit
  );
}
