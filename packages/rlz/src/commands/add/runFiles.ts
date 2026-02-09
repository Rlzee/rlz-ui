import { logger } from "@/utils/logger";
import type { AddFilesRunOptions } from "@/types/add";
import { resolveDirs } from "@/config/utils";
import fs from "fs-extra";
import path from "path";
import { UI_URL } from "@/config";
import { getUiFile } from "@/utils/get-ui-file";
import { detectImport } from "@/utils/detect-import";
import { Project } from "ts-morph";
import { installDependencies } from "@/utils/install-dependencies";
import type { rlzConfig } from "@/config/types";

function getTargetPath(
  type: keyof Omit<rlzConfig["aliases"], "baseComponents" | "uiComponents">,
  dirs: ReturnType<typeof resolveDirs>
): string {
  switch (type) {
    case "utils":
      return dirs.utils;
    case "types":
      return dirs.types;
    case "lib":
      return dirs.lib;
    case "hooks":
      return dirs.hooks;
    case "stores":
      return dirs.stores;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

export async function runAddFiles({
  cwd,
  fileNames,
  config,
  type,
}: AddFilesRunOptions): Promise<void> {
  try {
    const dirs = resolveDirs({ dirs: config.dirs, cwd });
    const targetPath = getTargetPath(type, dirs);

    await fs.ensureDir(targetPath);

    await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(targetPath, fileName);

        if (await fs.pathExists(filePath)) {
          //   logger.error(
          //     `File "${fileName}" already exists in ${type} directory.`
          //   );
          return;
        }

        const fileUrl = `${UI_URL}/${type}/${fileName}`;
        await getUiFile(fileUrl, filePath);

        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(filePath);

        const { dependencies } = detectImport({
          sourceFile: sourceFile,
          aliases: config.aliases,
        });

        if (dependencies.length > 0) {
          const packageNames = dependencies.map((dep) => {
            if (dep.startsWith("@")) {
              // Scoped package: @scope/package/subpath -> @scope/package
              const parts = dep.split("/");
              return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : dep;
            } else {
              // Regular package: package/subpath -> package
              return dep.split("/")[0];
            }
          });

          // Remove duplicates
          const uniquePackages = Array.from(new Set(packageNames));
          await installDependencies(uniquePackages, cwd, true);
        }

        logger.info(`Added file "${fileName}" to ${type} directory.`);
      })
    );
  } catch (error: any) {
    logger.error(`Error adding files: ${error.message}`);
  }
}
