import { Command } from "commander";
import { logger } from "../../utils/logger";
import { readConfig } from "@/config/read";
import { runAddComponent } from "./runComponent";
import { componentSchema } from "@/schemas/add";

export const addCommand = new Command()
  .name("add")
  .description("Add a new component rlz-ui")
  .argument("<component>", "The name of the component to add")
  .action(async (component: string) => {
    try {
      const componentName = componentSchema.parse(component);

      if (!component || component.trim() === "") {
        return logger.error("Component name cannot be empty");
      }

      const cwd = process.cwd();
      const config = readConfig(cwd);

      await runAddComponent({ cwd, componentName, config, type: "ui" });
    } catch (error: any) {
      logger.error(`Error adding component: ${error.message}`);
      process.exit(1);
    }
  });
