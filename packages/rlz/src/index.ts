#!/usr/bin/env node
import { init } from "./command/init";
import { Command } from "commander";

async function main() {
    const program = new Command();

    program
        .name("rlz")
        .description("A CLI for rlz-ui")
        .version("1.0.0");

    program
        .addCommand(init);

    program.parse()
}

main();
