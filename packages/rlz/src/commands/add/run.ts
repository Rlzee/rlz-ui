import { logger } from "@/utils/logger";
import { readRegistry } from "@/utils/read-registry";
import type { RegistryItem } from "@rlz/registry";

export async function runAdd(name: string) {
  const registry = await readRegistry();

  const normalizedName = name.toLowerCase().replace(/\.(tsx?|ts?)$/, "");
  const item = registry[normalizedName] as RegistryItem | undefined;

  if (!item) {
    return logger.error(`Item "${name}" not found`);
  }

  switch (item.type) {
    case "component":
      console.log("install component");
      break;

    case "hook":
      console.log("install hook");
      break;

    case "lib":
      console.log("install lib");
      break;

    case "preset":
      return logger.error("Presets must be installed with `rlz preset add`");
  }

  logger.success(`${name} added successfully`);
}
