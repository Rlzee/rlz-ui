import { Command } from "commander";
import { logger } from "../../utils/logger";
import { readConfig } from "@/config/read";
import { runAddComponent } from "./runComponent";
import { runAddFiles } from "./runFiles";
import { componentSchema } from "@/schemas/add";

export const addCommand = new Command()
  .name("add")
  .description("Add a new component or file from rlz-ui")
  .argument("<name>", "The name of the component or file to add")
  .option("-f, --file", "Install a file instead of a component")
  .option(
    "-t, --type <type>",
    "Specify the component type or file type (e.g. ui, utils, lib, types, hooks, stores)"
  )
  .action(async (name: string, options: { file?: boolean; type?: string }) => {
    try {
      if (!name || name.trim() === "") {
        return logger.error("Name cannot be empty");
      }

      const cwd = process.cwd();
      const config = readConfig(cwd);

      const typeOption = options.type || (options.file ? "utils" : "ui");

      if (options.file) {
        // Ensure filename has an extension; default to .ts
        let fileName = name;
        if (
          !fileName.endsWith(".ts") &&
          !fileName.endsWith(".tsx") &&
          !fileName.endsWith(".js") &&
          !fileName.endsWith(".jsx")
        ) {
          fileName = `${fileName}.ts`;
        }

        await runAddFiles({
          cwd,
          fileNames: [fileName],
          config,
          type: typeOption as any,
        });
      } else {
        const componentName = componentSchema.parse(name);

        await runAddComponent({
          cwd,
          componentName,
          config,
          type: typeOption,
        });
      }
    } catch (error: any) {
      logger.error(`Error adding item: ${error.message}`);
      process.exit(1);
    }
  });
