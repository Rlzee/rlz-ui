import type { AddComponentRunOptions, FilesType } from "@/src/types/add";
import fs from "fs-extra";
import path from "path";
import { logger } from "../../utils/logger";
import { resolveDirs } from "@/src/utils/resolve-dirs";
import { installDependencies } from "@/src/utils/install-dependencies";
import { UI_URL } from "@/src/config";
import { getUiFile } from "@/src/utils/get-ui-file";
import { UpdateComponent } from "@/src/utils/update-component";
import { Project } from "ts-morph";
import { detectImport } from "@/src/utils/detect-import";
import { runAddFiles } from "./runFiles";

export async function runAddComponent({
  cwd,
  componentName,
  config,
  type,
}: AddComponentRunOptions): Promise<void> {
  try {
    const dirs = resolveDirs({ dirs: config.dirs, cwd });

    const componentsPath =
      type === "ui" ? dirs.uiComponents : dirs.baseComponent;

    await fs.ensureDir(componentsPath);
    const componentFilePath = path.join(componentsPath, `${componentName}.tsx`);

    if (await fs.pathExists(componentFilePath)) {
      logger.error(`Component "${componentName}" already exists.`);
      return;
    }

    const componentUrl = `${UI_URL}/components/${type}/${componentName}.tsx`;
    await getUiFile(componentUrl, componentFilePath);

    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(componentFilePath);

    await UpdateComponent({
      sourceFile,
      config,
    });

    const { dependencies, internalComponents, internalFiles } = detectImport({
      sourceFile,
      dirs,
      aliases: config.aliases,
    });

    for (const ic of internalComponents) {
      const compName = path.basename(ic);

      await runAddComponent({
        cwd,
        componentName: compName,
        config,
        type: ic.startsWith(config.aliases.uiComponents) ? "ui" : "base",
      });
    }

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

    for (const inf of internalFiles || []) {
      const pathMatch = inf.match(/\/(lib|types|utils)\/([^\/]+)$/);
      if (pathMatch) {
        const type = pathMatch[1] as FilesType;
        const name = pathMatch[2];

        await runAddFiles({
          cwd,
          fileNames: [`${name}.ts`],
          config,
          type,
        });
      }
    }

    logger.success(`Component "${componentName}" added successfully.`);
  } catch (error: any) {
    logger.error(`Failed to add component: ${error.message}`);
    throw error;
  }
}
