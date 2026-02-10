import type { AddComponentRunOptions, FilesType } from "@/types/add";
import fs from "fs-extra";
import path from "path";
import { logger } from "@/utils/logger";
import { resolveDirs } from "@/config/utils";
import { installDependencies } from "@/utils/install-dependencies";
import { UI_URL } from "@/config";
import { getUiFile } from "@/utils/get-ui-file";
import { UpdateComponent } from "@/utils/update-component";
import { Project } from "ts-morph";
import { detectImport } from "@/utils/detect-import";
import { runAddFiles } from "./runFiles";

export async function runAddComponent({
  cwd,
  componentName,
  config,
  type,
}: AddComponentRunOptions): Promise<void> {
  try {
    const dirs = resolveDirs({ dirs: config.dirs, cwd });

    const componentsPath = path.join(dirs.components, type);

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
      aliases: config.aliases,
    });

    for (const ic of internalComponents) {
      const compName = path.basename(ic);

      // Derive child component "type" from the components alias path.
      // Expected import shapes:
      //  - "@/components/<type>/<Component>"
      //  - "@/components/<Component>" (no type folder)
      const aliasesAny = config.aliases as Record<string, string>;
      const compAlias = String(aliasesAny.components || "@/components").replace(
        /\/+$/g,
        ""
      );
      const matchingAlias =
        Object.values(aliasesAny)
          .map(String)
          .find((a) => ic.startsWith(a)) || compAlias;
      const remainder = ic
        .slice(String(matchingAlias).length)
        .replace(/^\/+/, "");
      const segments = remainder.split("/").filter(Boolean);

      // If there's a subfolder after the alias, treat it as the type. Otherwise fall back to parent `type`.
      const childType = segments.length >= 2 ? segments[0] : type || "";

      await runAddComponent({
        cwd,
        componentName: compName,
        config,
        type: childType,
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
      const pathMatch = inf.match(
        /\/(lib|types|utils|hooks|stores)\/([^\/]+)$/
      );
      if (pathMatch) {
        const candidate = pathMatch[1];
        const name = pathMatch[2];

        const allowedTypes = ["utils", "types", "lib", "hooks", "stores"];
        if (!allowedTypes.includes(candidate)) {
          logger.warn(
            `Skipping internal file '${inf}': unknown file type '${candidate}'.`
          );
          continue;
        }

        const fileType = candidate as FilesType;

        await runAddFiles({
          cwd,
          fileNames: [`${name}.ts`],
          config,
          type: fileType,
        });
      }
    }

    logger.success(`Component "${componentName}" added successfully.`);
  } catch (error: any) {
    logger.error(`Failed to add component: ${error.message}`);
    throw error;
  }
}
