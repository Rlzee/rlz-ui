import { Command } from "commander";
import prompts from "prompts";
import { logger } from "../../utils/logger";
import { runCreateCommand } from "./run";

export const createCommand = new Command("create")
  .description("Create a new project")
  .action(async () => {
    const response = await prompts(
      [
        {
          type: "text",
          name: "projectName",
          message: "Project name",
          initial: "my-app",
        },
        {
          type: "select",
          name: "framework",
          message: "Framework",
          choices: [
            { title: "Next.js", value: "next" },
            { title: "React + Vite", value: "vite" },
            { title: "React", value: "react" },
          ],
        },
      ],
      {
        onCancel: () => {
          logger.error("Project creation cancelled.");
          process.exit(1);
        },
      }
    );

    await runCreateCommand({
      cwd: process.cwd(),
      project: {
        name: response.projectName,
        framework: response.framework,
      },
    });
  });
