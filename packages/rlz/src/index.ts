#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init/index.js";

async function main() {
  const program = new Command();
  program.name("rlz").description("A CLI for rlz-ui").version("1.0.0");
  program.addCommand(initCommand);
  program.parse();
}

main();
