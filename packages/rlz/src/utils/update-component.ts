import type { rlzConfig } from "@/config/types";
import { removeUseClient } from "./remove-use-client";
import { updateIcons } from "../icons/update";
import { defaultUiComponentsAliases } from "@/config/constants";
import { SourceFile } from "ts-morph";
import { updateAliases } from "./update-aliases";
import type { PresetComponentCustomization } from "@rlz/registry";
import { applyPresetPartClasses } from "./apply-preset-part-classes";
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

  const skipped = applyPresetPartClasses(
    sourceFile,
    componentId,
    customization?.partClasses
  );
  if (skipped.length) {
    logger.warn(
      `Preset classes not applied to ${componentId}: unsupported parts or source layout (${skipped.join(
        ", "
      )}).`
    );
  }
  if (
    Object.keys(customization?.variants ?? {}).length ||
    Object.keys(customization?.props ?? {}).length
  ) {
    logger.warn(
      `Preset variant and prop overrides for ${componentId} are not supported yet.`
    );
  }

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
