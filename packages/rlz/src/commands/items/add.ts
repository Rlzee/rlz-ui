import { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import path from "node:path";
import { logger } from "@/utils/logger";
import { readConfig } from "@/config/read";
import { readRegistry } from "@/utils/read-registry";
import { resolveDirs } from "@/config/utils";
import { installItem } from "@/utils/install-item";
import { resolveProjectPreset } from "@/utils/project-preset";

export const addCommand = new Command()
  .name("add")
  .description("Add an item from rlz-ui")
  .argument("<name>", "The name of the item to add")
  .option("--overwrite", "Replace the requested component if it already exists")
  .action(async (name: string, options: { overwrite?: boolean }) => {
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

      if (item.type === "component") {
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
      }

      const dirs = resolveDirs({
        dirs: config.dirs,
        cwd,
      });
      const preset = await resolveProjectPreset(cwd, config.preset, registry);

      const outcome = await installItem({
        item,
        registry,
        dirs,
        config,
        cwd,
        preset,
        async confirmOverwrite(filePath) {
          if (options.overwrite) return true;
          if (!process.stdin.isTTY || !process.stdout.isTTY) {
            logger.info(
              "Use --overwrite to replace an existing component in non-interactive mode."
            );
            return false;
          }
          const relativePath = path.relative(cwd, filePath);
          return confirm({
            message: `"${relativePath}" already exists. Replace it with the registry version${
              preset ? " using the current preset" : ""
            }? Local changes will be lost.`,
            default: false,
          });
        },
      });

      if (outcome === "skipped") {
        logger.info(
          `Item "${normalizedName}" already exists and was left unchanged.`
        );
      } else {
        logger.success(
          `Item "${normalizedName}" ${
            outcome === "overwritten" ? "replaced" : "added"
          } successfully.`
        );
      }
    } catch (error: any) {
      logger.error(`Error adding item: ${error?.message ?? String(error)}`);
      process.exit(1);
    }
  });
