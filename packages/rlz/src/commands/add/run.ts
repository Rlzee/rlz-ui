import type { AddComponentRunOptions } from "@/src/types/add";
import fs from "fs";
import path from "path";
import { logger } from "../../utils/logger";
import { getUiFile } from "@/src/utils/get-ui-file";
import { UI_URL } from "@/src/config";
import { Project } from "ts-morph";
import { addUseClient } from "@/src/utils/add-use-client";
import { getPackageManager } from "@/src/utils/get-package-manager";
import { resolveDirs } from "@/src/utils/resolve-dirs";

export async function runAdd({
  cwd,
  componentName,
  config,
}: AddComponentRunOptions): Promise<void> {
  try {
    const dirs = resolveDirs({ dirs: config.dirs, cwd });

    // Ensure dirs only when needed
    await fs.promises.mkdir(dirs.components, { recursive: true });

    const componentFilePath = path.join(
      dirs.components,
      `${componentName}.tsx`
    );

    if (fs.existsSync(componentFilePath)) {
      logger.error(`Component "${componentName}" already exists.`);
      return;
    }

    // Download the UI file
    await getUiFile(
      `${UI_URL}/components/${componentName}.tsx`,
      componentFilePath
    );

    // ts-morph handling
    const project = new Project({ skipAddingFilesFromTsConfig: true });
    const sourceFile = project.addSourceFileAtPath(componentFilePath);

    if (config.framework === "next") {
      addUseClient(sourceFile);
      await sourceFile.save();
    }

    logger.success(`Component "${componentName}" added successfully !`);
  } catch (error: any) {
    logger.error(`Failed to add component: ${error.message}`);
    throw error;
  }
}
