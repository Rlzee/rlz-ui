import type { PresetComponentCustomization } from "@rlz/registry";
import type { SourceFile } from "ts-morph";
import {
  applyPresetPartClasses,
  applyPresetVariantClasses,
} from "./update-classes";

export { applyPresetPartClasses, applyPresetVariantClasses };

/** Source-only preset engine. No CLI, framework, filesystem or Creator behavior. */
export function transformPresetComponent(
  source: SourceFile,
  componentId: string,
  customization?: PresetComponentCustomization
) {
  return {
    variants: applyPresetVariantClasses(
      source,
      componentId,
      customization?.variants,
      customization?.props
    ),
    parts: applyPresetPartClasses(
      source,
      componentId,
      customization?.partClasses
    ),
  };
}
