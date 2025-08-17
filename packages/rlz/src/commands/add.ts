import { Command } from "commander";
import { addComponent } from "../utils/add-component";
import { logger } from "../utils/logger";
import { addUtils } from "../utils/add-utils";
import { deprecatedComponents } from "../config";
import {
  addCommandOptionsSchema,
  utilsTypeSchema,
  componentTypeSchema,
  type UtilsType,
  type AddCommandOptions,
} from "../schemas";
import { isZodError, formatZodError } from "../utils/validation";

export const add = new Command()
  .name("add")
  .description("Add a component to rlz-ui")
  .option(
    "-t, --type <type>",
    "Type of component (text, background, animation) or utils (helpers, hooks, lib, types, stores, utils)"
  )
  .argument("<component>", "The name of the component to add")
  .action(async (component: string, options: AddCommandOptions) => {
    try {
      const validatedOptions = addCommandOptionsSchema.parse(options);

      if (!component || component.trim() === "") {
        return logger.error("Component name cannot be empty");
      }

      if (deprecatedComponents.includes(component)) {
        return logger.warn(
          `Component "${component}" is deprecated and may be removed in future versions.`
        );
      }

      const utilTypes: UtilsType[] = [
        "helpers",
        "hooks",
        "lib",
        "types",
        "stores",
        "utils",
      ];

      if (
        validatedOptions.type &&
        utilTypes.includes(validatedOptions.type as UtilsType)
      ) {
        const validatedUtilType = utilsTypeSchema.parse(validatedOptions.type);
        await addUtils(component, validatedUtilType);
      } else {
        const componentType = validatedOptions.type
          ? componentTypeSchema.parse(validatedOptions.type)
          : null;
        await addComponent({ component, options: { type: componentType } });
      }
      logger.success("Component added successfully !");
    } catch (error) {
      if (isZodError(error)) {
        logger.error("Validation error:", formatZodError(error));
      } else {
        logger.error("Failed to add component:", error);
      }
    }
  });
