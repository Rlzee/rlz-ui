#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init/index";
import { addCommand } from "./commands/add/index";

async function main() {
  const program = new Command();
  program.name("rlz").description("A CLI for rlz-ui").version("1.0.0");
  program.addCommand(initCommand);
  program.addCommand(addCommand);
  program.parse();
}

main();
