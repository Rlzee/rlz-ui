import { Command } from "commander";

export const add = new Command()
    .name("add")
    .description("Add a component to rlz-ui")
    .argument("<component>", "The name of the component to add")
    .action((component) => {
        console.log(`Adding component: ${component}`);
    });