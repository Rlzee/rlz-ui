import { Command } from "commander";
import { logger } from "@/utils/logger";
import { readRegistry } from "@/utils/read-registry";
import kleur from "kleur";

export const infoCommand = new Command()
  .name("info")
  .description(
    "Show detailed information about a registry item, including dependencies"
  )
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
      const item = registry[normalizedName];
      if (!item) {
        return logger.error(`Item not found in the registry: ${name}`);
      }

      logger.info(kleur.bold(`${item.name} (${item.type})`));
      logger.info(`Version: ${kleur.cyan(item.version)}`);
      if (item.description) logger.info(`Description: ${item.description}`);
      const allowManualInstallText = String(item.allowManualInstall ?? true);
      logger.info(
        `Manual Install Allowed: ${kleur.yellow(allowManualInstallText)}`
      );
      logger.info(`Path in UI package: ${item.path}`);
      if (item.destPath) logger.info(`Destination Path: ${item.destPath}`);

      if (item.dependencies?.length) {
        logger.info(kleur.green("\nDependencies:"));
        for (const dep of item.dependencies) {
          logger.info(`  - ${dep}`);
        }
      } else {
        logger.info(kleur.green("\nDependencies: None"));
      }

      const printRegistryDeps = (
        name: string,
        level = 1,
        visited = new Set<string>()
      ) => {
        if (visited.has(name)) return;
        visited.add(name);

        const depItem = registry[name];
        if (!depItem || !depItem.registryDependencies?.length) return;

        for (const dep of depItem.registryDependencies) {
          logger.info(`${"  ".repeat(level)}- ${kleur.magenta(dep)}`);
          printRegistryDeps(dep, level + 1, visited);
        }
      };

      if (item.registryDependencies?.length) {
        logger.info(kleur.magenta("\nRegistry Dependencies:"));
        printRegistryDeps(normalizedName);
      } else {
        logger.info(kleur.magenta("\nRegistry Dependencies: None"));
      }

      logger.break();
    } catch (error: any) {
      logger.error(
        `Error fetching info for item "${name}": ${
          error?.message ?? String(error)
        }`
      );
      process.exit(1);
    }
  });
