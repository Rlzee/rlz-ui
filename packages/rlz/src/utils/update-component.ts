import type { rlzConfig } from "@/config/types";
import { removeUseClient } from "./remove-use-client";
import { updateIcons } from "../icons/update";
import { defaultUiComponentsAliases } from "@/config/constants";
import { SourceFile } from "ts-morph";
import { updateAliases } from "./update-aliases";

type UpdateComponentParams = {
  sourceFile: SourceFile;
  config: rlzConfig;
};

export async function UpdateComponent({
  sourceFile,
  config,
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

  await sourceFile.save();
  // logger.info(`Updated component file: ${filePath}`);
}
