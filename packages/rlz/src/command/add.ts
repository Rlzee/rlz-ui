import { Command } from "commander";
import { addComponent, componentType } from "../utils/add-component";

export const add = new Command()
  .name("add")
  .description("Add a component to rlz-ui")
  .option("-t, --type <type>", "Type of component")
  .argument("<component>", "The name of the component to add")
  .action(async (component: string, options: { type?: componentType }) => {
    await addComponent({ component, options });
    console.log("✅ Component added successfully!");
  });
