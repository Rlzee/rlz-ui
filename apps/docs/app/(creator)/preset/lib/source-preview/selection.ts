import type { PresetComponentCustomization } from "@rlz/registry";
import { capabilitiesOf } from "@rlz/ui/registry/resolve-capabilities";
import { currentVariantValue } from "../component-edits";
import type {
  SourcePreviewSelection,
  SourcePreviewSelectionDefinition,
} from "./types";

export function previewSelectionDefinition(
  slug: string,
  edit?: PresetComponentCustomization
): SourcePreviewSelectionDefinition {
  const capabilities = capabilitiesOf(slug);
  return {
    axes: Object.fromEntries(
      (capabilities?.variants ?? []).map((axis) => [
        axis.name,
        [
          ...new Set([
            ...axis.values,
            ...(edit?.variants?.[axis.name] ?? []).map(({ value }) => value),
          ]),
        ],
      ])
    ),
    props: capabilities?.editableProperties ?? [],
  };
}

export function previewSelection(
  slug: string,
  edit?: PresetComponentCustomization
): SourcePreviewSelection {
  const capabilities = capabilitiesOf(slug);
  const selected: SourcePreviewSelection = {};
  for (const name of capabilities?.editableProperties ?? []) {
    const value = edit?.props?.[name];
    if (typeof value === "string")
      selected[name] =
        value === "true" ? true : value === "false" ? false : value;
  }
  for (const axis of capabilities?.variants ?? []) {
    const value = currentVariantValue(axis, edit);
    selected[axis.name] = axis.values.every(
      (value) => value === "true" || value === "false"
    )
      ? value === "true"
      : axis.values.length &&
        axis.values.every(
          (value) => value.trim() !== "" && Number.isFinite(Number(value))
        )
      ? Number(value)
      : value;
  }
  return selected;
}
