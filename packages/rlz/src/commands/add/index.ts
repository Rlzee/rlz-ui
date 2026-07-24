import { Command } from "commander";
import { runAdd } from "./run";

export const addCommand = new Command()
  .name("add")
  .description("Add an item from rlz-ui registry")
  .argument("<name>", "Item name")
  .action(async (name: string) => {
    await runAdd(name);
  });
