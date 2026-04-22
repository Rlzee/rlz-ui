import { Command } from "commander";
import { logger } from "@/utils/logger";
import { readConfig } from "@/config/read";
import { resolveDirs } from "@/config/utils";
import { readRegistry } from "@/utils/read-registry";
import { getUiFile } from "@/utils/get-ui-file";
import { Project } from "ts-morph";
import { UpdateComponent } from "@/utils/update-component";
import { installDependencies } from "@/utils/install-dependencies";
import { UI_URL } from "@/config";

import fs from "fs-extra";
import path from "path";

import { REGISTRY_ITEM_TYPES, isRegistryItemType } from "@rlz/registry";
import type { RegistryItemType, RegistryItem } from "@rlz/registry";

export const addCommand = new Command()
  .name("add")
  .description("Add a new component, hook, or lib from rlz-ui")
  .argument("<name>", "The name of the item to add")
  .action(async (name: string) => {
    try {
      if (!name?.trim()) {
        return logger.error("Name cannot be empty");
      }

      const cwd = process.cwd();
      const config = readConfig(cwd);
      const registry = await readRegistry();

      if (!registry) {
        return logger.error("Registry not found");
      }

      const normalizedName = name.toLowerCase().replace(/\.(tsx?|ts?)$/, "");
      const item = registry[normalizedName] as RegistryItem | undefined;

      if (!item) {
        return logger.error(`Item not found in registry: ${name}`);
      }

      if (!isRegistryItemType(item.type)) {
        return logger.error(
          `Registry item '${item.name}' has invalid type '${String(
            item.type
          )}'. Valid types are: ${REGISTRY_ITEM_TYPES.join(", ")}`
        );
      }

      if (item.allowManualInstall === false) {
        return logger.error(
          `Item ${name} cannot be installed directly via the CLI.`
        );
      }

      if (item.allowManualInstall === "deprecated") {
        return logger.error(
          `Item ${name} is obsolete and can no longer be installed.`
        );
      }

      const dirs = resolveDirs({ dirs: config.dirs, cwd });

      const typeToDir: Record<RegistryItemType, keyof typeof dirs> = {
        component: "components",
        hook: "hooks",
        lib: "lib",
      };

      const installed = new Set<string>();

      const installSingleItem = async (item: RegistryItem) => {
        const baseDirKey = typeToDir[item.type];
        const baseDir = dirs[baseDirKey];

        if (!baseDir)
          throw new Error(`Target directory not found for type: ${item.type}`);

        let targetDir = baseDir;

        if (item.type === "component") {
          const subDir = item.destPath ?? "ui";

          if (subDir.includes("..")) {
            throw new Error(`Invalid destPath in registry for ${item.name}`);
          }

          targetDir = path.join(baseDir, subDir);
        }

        const fileName = path.basename(item.path);
        const itemPath = path.join(targetDir, fileName);

        if (await fs.pathExists(itemPath)) {
          installed.add(item.name);
          return;
        }

        const itemUrl = `${UI_URL}/${item.path}`;
        await fs.ensureDir(path.dirname(itemPath));
        await getUiFile(itemUrl, itemPath);

        const project = new Project();
        const sourceFile = project.addSourceFileAtPath(itemPath);

        await UpdateComponent({ sourceFile, config });

        if (item.dependencies?.length) {
          await installDependencies(item.dependencies, cwd, true);
        }

        logger.info(`Installed ${item.type}: ${item.name}`);
      };

      const installItem = async (itemName: string) => {
        if (installed.has(itemName)) return;

        const regItem = registry[itemName] as RegistryItem | undefined;
        if (!regItem) throw new Error(`Registry item not found: ${itemName}`);

        if (!isRegistryItemType(regItem.type)) {
          throw new Error(
            `Registry item '${regItem.name}' has invalid type '${String(
              regItem.type
            )}'`
          );
        }

        if (regItem.registryDependencies?.length) {
          for (const dep of regItem.registryDependencies) {
            await installItem(dep);
          }
        }

        await installSingleItem(regItem);
        installed.add(itemName);
      };

      await installItem(normalizedName);

      logger.success(`Item "${normalizedName}" added successfully.`);
    } catch (error: any) {
      logger.error(`Error adding item: ${error?.message ?? String(error)}`);
      process.exit(1);
    }
  });
