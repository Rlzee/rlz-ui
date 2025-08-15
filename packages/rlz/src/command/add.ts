import { Command } from "commander";
import { addComponent, componentType } from "../utils/add-component";
import { logger } from "../utils/logger";

export const add = new Command()
  .name("add")
  .description("Add a component to rlz-ui")
  .option("-t, --type <type>", "Type of component")
  .argument("<component>", "The name of the component to add")
  .action(async (component: string, options: { type?: componentType }) => {
    try {
      await addComponent({ component, options });
      logger.success("Component added successfully !");
    } catch (error) {
      logger.error("Failed to add component:", error);
    }
  });
