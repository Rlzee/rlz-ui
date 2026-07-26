#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init/index";

// Items Commands
import { addCommand } from "./commands/items/add";
import { infoCommand } from "./commands/items/info";
import { listCommand } from "./commands/items/list";

async function main() {
  const program = new Command();

  program.name("rlz").description("A CLI for rlz-ui").version("1.0.0");

  program.addCommand(initCommand);

  // Items Commands
  program.addCommand(addCommand);
  program.addCommand(infoCommand);
  program.addCommand(listCommand);

  await program.parseAsync();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
