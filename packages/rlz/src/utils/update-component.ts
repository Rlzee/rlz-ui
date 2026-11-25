import type { rlzConfig } from "@/config/types";
import { removeUseClient } from "./remove-use-client";
import { updateIcons } from "../icons/update";
import { defaultUiComponentsAliases } from "@/config/constants";
import { SourceFile } from "ts-morph";
import { updateAliases } from "./update-aliases";
import type { PresetComponentCustomization } from "@rlz/registry";
import {
  applyPresetPartClasses,
  applyPresetVariantClasses,
} from "@/presets/update-classes";
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

  const skippedVariants = applyPresetVariantClasses(
    sourceFile,
    componentId,
    customization?.variants
  );
  if (skippedVariants.length) {
    logger.warn(
      `Some preset variant changes were not applied to ${componentId}: ${skippedVariants.join(
        "; "
      )}. The registry defaults were kept.`
    );
  }

  const skippedParts = applyPresetPartClasses(
    sourceFile,
    componentId,
    customization?.partClasses
  );
  if (skippedParts.length) {
    logger.warn(
      `Preset classes not applied to ${componentId}: unsupported parts or source layout (${skippedParts.join(
        ", "
      )}).`
    );
  }
  if (Object.keys(customization?.props ?? {}).length) {
    logger.warn(
      `Preset prop overrides for ${componentId} are not supported yet.`
    );
  }

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
