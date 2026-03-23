import { Command } from "commander";
import { logger } from "@/utils/logger";
import { readRegistry } from "@/registry/read";
import { REGISTRY_ITEM_TYPES, isRegistryItemType } from "@/registry/types";
import type { RegistryItemType } from "@/registry/types";

export const listCommand = new Command()
  .name("list")
  .description(
    `List items available in the RLZ registry. Use --type to filter by a single type.`
  )
  .option(
    "-t, --type <type>",
    `Filter listed items by type. Allowed values: ${REGISTRY_ITEM_TYPES.join(
      ", "
    )}`
  )
  .action(async (opts: { type?: string }) => {
    try {
      const registry = await readRegistry();
      if (!registry) {
        logger.error("Registry not found");
        return;
      }

      const rawType = opts?.type?.trim().toLowerCase();
      let requestedType: RegistryItemType | undefined;

      if (rawType) {
        if (!isRegistryItemType(rawType)) {
          logger.error(
            `Invalid type '${
              opts.type
            }'. Valid types are: ${REGISTRY_ITEM_TYPES.join(", ")}.`
          );
          process.exit(1);
        }
        requestedType = rawType as RegistryItemType;
      }

      const grouped: Partial<Record<RegistryItemType, string[]>> = {};
      for (const key in registry) {
        const item = registry[key];

        // Do not include items that cannot be installed manually or are marked deprecated
        if (
          item.allowManualInstall === false ||
          item.allowManualInstall === "deprecated"
        ) {
          continue;
        }

        const t = item.type as RegistryItemType;
        if (!grouped[t]) grouped[t] = [];
        grouped[t]!.push(item.name);
      }

      // Sort names alphabetically for each type to provide deterministic output
      for (const t of Object.keys(grouped) as RegistryItemType[]) {
        grouped[t]!.sort((a, b) => a.localeCompare(b));
      }

      const typesToShow: RegistryItemType[] = requestedType
        ? [requestedType]
        : (Array.from(REGISTRY_ITEM_TYPES) as RegistryItemType[]);

      let printedAnything = false;
      for (const type of typesToShow) {
        const entries = grouped[type];
        if (entries && entries.length > 0) {
          printedAnything = true;
          logger.info(`${type.charAt(0).toUpperCase() + type.slice(1)}s:`);
          for (const name of entries) {
            logger.info(`  ${name}`);
          }
          logger.info("");
        }
      }

      if (!printedAnything) {
        if (requestedType) {
          logger.info(
            `No items of type '${requestedType}' found in the registry.`
          );
        } else {
          logger.info("No items found in the registry.");
        }
      }
    } catch (error: any) {
      logger.error(
        `Error listing registry items: ${error?.message ?? String(error)}`
      );
      process.exit(1);
    }
  });
