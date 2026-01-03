import type { AddComponentRunOptions } from "@/src/types/add";
import fs from "fs-extra";
import path from "path";
import { logger } from "../../utils/logger";
import { resolveDirs } from "@/src/utils/resolve-dirs";
import { installDependencies } from "@/src/utils/install-dependencies";
import { getComponentManifest } from "@/src/utils/get-component-manifest";
import type { ComponentManifest } from "@/src/types/components-manifest";
import { UI_URL } from "@/src/config";
import { copyInternalFile } from "@/src/utils/copy-internal-file";
import { getUiFile } from "@/src/utils/get-ui-file";
import { UpdateComponent } from "@/src/utils/update-component";

export async function runAdd({
  cwd,
  componentName,
  config,
  type,
}: AddComponentRunOptions): Promise<void> {
  try {
    const dirs = resolveDirs({ dirs: config.dirs, cwd });

    await fs.ensureDir(dirs.components);

    const manifestUrl = `${UI_URL}/components/${type}/${componentName}/component.json`;
    const manifest = (await getComponentManifest(
      manifestUrl
    )) as ComponentManifest;

    if (!manifest.files || !manifest.files.source || !manifest.files.target) {
      throw new Error(`Invalid manifest for component "${componentName}"`);
    }

    const componentFilePath = path.join(dirs.components, manifest.files.source);

    if (await fs.pathExists(componentFilePath)) {
      logger.error(`Component "${componentName}" already exists.`);
      return;
    }

    if (manifest.dependencies?.npm && manifest.dependencies.npm.length > 0) {
      await installDependencies(manifest.dependencies.npm, cwd);
    }

    if (manifest.dependencies?.internalComponents?.length) {
      for (const internal of manifest.dependencies.internalComponents) {
        const [internalType, ...internalNameParts] = internal.split("/");
        const internalComponentName = internalNameParts.join("/");

        await runAdd({
          cwd,
          componentName: internalComponentName,
          config,
          type: internalType as AddComponentRunOptions["type"],
        });
      }
    }

    if (manifest.dependencies?.internalFiles?.length) {
      for (const dep of manifest.dependencies.internalFiles) {
        await copyInternalFile(dep, dirs, cwd);
      }
    }

    await getUiFile(`${UI_URL}/${manifest.files.target}`, componentFilePath);

    // Update component
    await UpdateComponent({
      filePath: componentFilePath,
      config,
    });

    logger.success(`Component "${componentName}" added successfully.`);
  } catch (error: any) {
    logger.error(`Failed to add component: ${error.message}`);
    throw error;
  }
}
