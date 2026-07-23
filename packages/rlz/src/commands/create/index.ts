import { Command } from "commander";
import { input, select } from "@inquirer/prompts";
import { logger } from "../../utils/logger";
import { runCreateCommand } from "./run";

export const createCommand = new Command("create")
  .description("Create a new project")
  .option("-f, --framework <framework>", "Framework (next, vite, react)")
  .action(async (options) => {
    try {
      const projectName = await input({
        message: "Project name:",
        default: "my-app",
      });

      const framework =
        options.framework ??
        (await select({
          message: "Framework:",
          choices: [
            {
              name: "Next.js",
              value: "next",
            },
            {
              name: "React + Vite",
              value: "vite",
            },
            {
              name: "React",
              value: "react",
            },
          ],
        }));

      await runCreateCommand({
        cwd: process.cwd(),
        project: {
          name: projectName,
          framework,
        },
      });
    } catch {
      logger.error("Project creation cancelled.");
      process.exit(1);
    }
  });
