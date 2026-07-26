import { Command } from "commander";
import { logger } from "@/utils/logger";
import { readConfig } from "@/config/read";
import { readRegistry } from "@/utils/read-registry";
import { resolveDirs } from "@/config/utils";
import { installItem } from "@/utils/install-item";

export const addCommand = new Command()
  .name("add")
  .description("Add a new items from rlz-ui")
  .argument("<name>", "The name of the item to add")
  .action(async (name: string) => {
    try {
      if (!name?.trim()) {
        return logger.error("Name cannot be empty");
      }

      const cwd = process.cwd();
      const config = readConfig(cwd);
      if (!config) return logger.error("Config files not found");

      const registry = await readRegistry();
      if (!registry) return logger.error("Registry not found");

      const normalizedName = name.toLowerCase().replace(/\.(tsx?|ts?)$/, "");
      const item = registry.items[normalizedName];
      if (!item) return logger.error(`Item not found in registry: ${name}`);

      if (item.allowManualInstall === false) {
        return logger.error(
          `Item "${item.name}" cannot be installed directly via the CLI.`
        );
      }
      if (item.allowManualInstall === "deprecated") {
        return logger.error(
          `Item "${item.name}" is deprecated and can no longer be installed.`
        );
      }

      const dirs = resolveDirs({
        dirs: config.dirs,
        cwd,
      });

      await installItem({
        item,
        registry,
        dirs,
        config,
        cwd,
      });

      logger.success(`Item "${normalizedName}" added successfully.`);
    } catch (error: any) {
      logger.error(`Error adding item: ${error?.message ?? String(error)}`);
      process.exit(1);
    }
  });
