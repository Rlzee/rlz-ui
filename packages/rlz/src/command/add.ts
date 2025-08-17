import { Command } from "commander";
import { addComponent, type componentType } from "../utils/add-component";
import { logger } from "../utils/logger";
import { addUtils, type utils } from "../utils/add-utils";
import { deprecatedComponents } from "../config";

export const add = new Command()
  .name("add")
  .description("Add a component to rlz-ui")
  .option("-t, --type <type>", "Type of component (text, background, animation) or utils (helpers, hooks, lib, types, stores, utils)")
  .argument("<component>", "The name of the component to add")
  .action(async (component: string, options: { type?: componentType | utils }) => {
    try {
      if (deprecatedComponents.includes(component)) {
        return logger.warn(`Component "${component}" is deprecated and may be removed in future versions.`);
      }

      const utilTypes: utils[] = ["helpers", "hooks", "lib", "types", "stores", "utils"];
      if (options.type && utilTypes.includes(options.type as utils)) {
        await addUtils(component, options.type as utils);
      } else {
        await addComponent({ component, options: { type: options.type as componentType } });
      }
      logger.success("Component added successfully !");
    } catch (error) {
      logger.error("Failed to add component:", error);
    }
  });
