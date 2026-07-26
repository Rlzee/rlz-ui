import { Command } from "commander";
import { logger } from "@/utils/logger";
import { readRegistry } from "@/utils/read-registry";
import type { RegistryItem } from "@rlz/registry";
import kleur from "kleur";

export const infoCommand = new Command()
  .name("info")
  .description("Show detailed information about a registry item")
  .argument("<name>", "The name of the registry item")
  .action(async (name: string) => {
    try {
      if (!name || name.trim() === "") {
        return logger.error("Name cannot be empty");
      }

      const registry = await readRegistry();

      if (!registry) {
        return logger.error("Registry not found");
      }

      const normalizedName = name.toLowerCase().replace(/\.(tsx?|ts?)$/, "");

      const item: RegistryItem | undefined = registry.items[normalizedName];

      if (!item) {
        return logger.error(`Item not found in registry: ${name}`);
      }

      logger.info(kleur.bold(`${item.name} (${item.type})`));

      logger.info(`Version: ${kleur.cyan(item.version)}`);
      logger.info(`Path: ${item.path}`);

      if (item.description) {
        logger.info(`Description: ${item.description}`);
      }

      if (item.dependencies?.length) {
        logger.info(kleur.green("\nDependencies:"));

        for (const dep of item.dependencies) {
          logger.info(`  - ${dep}`);
        }
      } else {
        logger.info(kleur.green("\nDependencies: None"));
      }

      if (item.type === "component") {
        logger.info(
          `Manual Install Allowed: ${kleur.yellow(
            String(item.allowManualInstall ?? true)
          )}`
        );

        if (item.destPath) {
          logger.info(`Destination Path: ${item.destPath}`);
        }

        if (item.registryDependencies?.length) {
          logger.info(kleur.magenta("\nRegistry Dependencies:"));

          for (const dep of item.registryDependencies) {
            logger.info(`  - ${kleur.magenta(dep)}`);
          }
        } else {
          logger.info(kleur.magenta("\nRegistry Dependencies: None"));
        }
      }

      logger.break();
    } catch (error: any) {
      logger.error(
        `Error fetching info for "${name}": ${error?.message ?? String(error)}`
      );

      process.exit(1);
    }
  });
