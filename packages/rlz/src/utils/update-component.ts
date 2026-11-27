import type { rlzConfig } from "@/config/types";
import { removeUseClient } from "./remove-use-client";
import { updateIcons } from "../icons/update";
import { defaultUiComponentsAliases } from "@/config/constants";
import { SourceFile } from "ts-morph";
import { updateAliases } from "./update-aliases";
import type { PresetComponentCustomization } from "@rlz/registry";
import { transformPresetComponent } from "@rlz/preset-transform";
import { logger } from "./logger";

type UpdateComponentParams = {
  sourceFile: SourceFile;
  config: rlzConfig;
  componentId: string;
  customization?: PresetComponentCustomization;
};

export async function UpdateComponent({
  sourceFile,
  config,
  componentId,
  customization,
}: UpdateComponentParams): Promise<void> {
  if (config.framework === "vite") {
    removeUseClient(sourceFile);
  }

  if (config.icons !== "lucide") {
    await updateIcons({ sourceFile, iconLib: config.icons });
  }

  updateAliases({
    sourceFile,
    config,
  });

  const { variants: skippedVariants, parts: skippedParts } =
    transformPresetComponent(sourceFile, componentId, customization);
  if (skippedVariants.length) {
    logger.warn(
      `Some preset variant changes were not applied to ${componentId}: ${skippedVariants.join(
        "; "
      )}.`
    );
  }

  if (skippedParts.length) {
    logger.warn(
      `Preset classes not applied to ${componentId}: unsupported parts or source layout (${skippedParts.join(
        ", "
      )}).`
    );
  }
  const unsupportedProps = Object.keys(customization?.props ?? {}).filter(
    (prop) => !Object.hasOwn(customization?.variants ?? {}, prop)
  );
  if (unsupportedProps.length) {
    logger.warn(
      `Preset prop overrides for ${componentId} are not supported: ${unsupportedProps.join(
        ", "
      )}.`
    );
  }

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
