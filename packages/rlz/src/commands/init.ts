import { Command } from "commander";
import prompts from "prompts";
import { getPackageInfo } from "../utils/get-package-info";
import { initializeCss } from "../utils/initialize-css";
import { installDependencies } from "../utils/install-dependencies";
import { defaultDepencies } from "../config";
import { initializeStructure } from "../utils/initialize-structure";
import { saveConfig } from "../utils/config-manager";
import { logger } from "../utils/logger";
import { getFramework } from "../utils/get-framework";
import { getTailwindVersion } from "../utils/get-tailwind-version";
import { isTypeScriptProject } from "../utils/is-typescript-project";
import { isZodError, formatZodError } from "../utils/validation";
import { z } from "zod";

const cssPathResponseSchema = z.object({
  cssPath: z
    .string()
    .min(1, "CSS path cannot be empty")
    .endsWith(".css", "CSS path must end with .css"),
});

const tailwindVersionSchema = z
  .string()
  .regex(/^[\^~><= ]*\d+/, "Invalid Tailwind version format");

export const init = new Command()
  .name("init")
  .description("Initialize rlz-ui")
  .action(async () => {
    try {
      const packageInfo = await getPackageInfo();
      if (!packageInfo) {
        logger.error("No package information found.");
        return;
      }

      const framework = getFramework();
      if (framework !== "next.js" && framework !== "react") {
        return logger.error(
          "Unsupported framework. Please use Next.js or React."
        );
      }

      if (!isTypeScriptProject()) {
        return logger.error(
          "TypeScript is required for rlz-ui. Please create your project with TypeScript support.\n" +
            "For Next.js: npx create-next-app@latest my-app --typescript\n" +
            "For React: npx create-react-app my-app --template typescript"
        );
      }

      const tailwindDep = getTailwindVersion();
      if (!tailwindDep) {
        logger.error(
          "You must install tailwindcss v4 or higher before initializing rlz-ui.\nRun: pnpm add -D tailwindcss@^4"
        );
        return;
      }

      try {
        tailwindVersionSchema.parse(tailwindDep);
      } catch (error) {
        if (isZodError(error)) {
          logger.error(
            "Invalid Tailwind version format:",
            formatZodError(error)
          );
        }
        return;
      }

      const cleanedVersion = tailwindDep.replace(/^[\^~><= ]+/, "");
      const versionMatch = cleanedVersion.match(/^(\d+)/);

      if (!versionMatch) {
        logger.error(
          "Could not determine tailwindcss version. Please install tailwindcss v4 or higher."
        );
        return;
      }

      const major = Number(versionMatch[1]);
      if (isNaN(major) || major < 4) {
        logger.error(
          "You must install tailwindcss v4 or higher before initializing rlz-ui.\nRun: pnpm add -D tailwindcss@^4"
        );
        return;
      }

      const cssPathResponse = await prompts({
        type: "text",
        name: "cssPath",
        message: "Enter the path to your css file:",
        initial: "app/globals.css",
        validate: (value: string) => {
          try {
            cssPathResponseSchema.parse({ cssPath: value });
            return true;
          } catch (error) {
            if (isZodError(error)) {
              return formatZodError(error);
            }
            return "Invalid CSS path";
          }
        },
      });

      const validatedResponse = cssPathResponseSchema.parse(cssPathResponse);

      await saveConfig({ cssPath: validatedResponse.cssPath });
      await initializeCss();
      await installDependencies(defaultDepencies, process.cwd());
      await initializeStructure();

      logger.success("rlz-ui initialized successfully !");
    } catch (error) {
      if (isZodError(error)) {
        logger.error("Validation error:", formatZodError(error));
      } else {
        logger.error("An error occurred during initialization:", error);
      }
    }
  });
