import { Command } from "commander";
import { logger } from "@/utils/logger";
import { readRegistry } from "@/utils/read-registry";
import { REGISTRY_ITEM_TYPES, isRegistryItemType } from "@rlz/registry";
import type { RegistryItemType, RegistryItem } from "@rlz/registry";

export const listCommand = new Command()
  .name("list")
  .description(
    "List items available in the RLZ registry. Use --type to filter by a single type."
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

        requestedType = rawType;
      }

      const grouped: Partial<Record<RegistryItemType, string[]>> = {};

      for (const key in registry) {
        const item = registry[key] as RegistryItem;

        // Only components can define manual installation rules
        if (
          item.type === "component" &&
          (item.allowManualInstall === false ||
            item.allowManualInstall === "deprecated")
        ) {
          continue;
        }

        const type = item.type;

        if (!grouped[type]) {
          grouped[type] = [];
        }

        grouped[type]!.push(item.name);
      }

      for (const type of Object.keys(grouped) as RegistryItemType[]) {
        grouped[type]!.sort((a, b) => a.localeCompare(b));
      }

      const typesToShow: RegistryItemType[] = requestedType
        ? [requestedType]
        : [...REGISTRY_ITEM_TYPES];

      let printedAnything = false;

      for (const type of typesToShow) {
        const entries = grouped[type];

        if (entries && entries.length > 0) {
          printedAnything = true;

          logger.info(`${type.charAt(0).toUpperCase() + type.slice(1)}s:`);

          for (const name of entries) {
            logger.info(`  ${name}`);
          }

          logger.break();
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
