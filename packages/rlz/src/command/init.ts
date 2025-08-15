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

      const tailwindDep = getTailwindVersion();
      if (!tailwindDep) {
        logger.error(
          "You must install tailwindcss v4 or higher before initializing rlz-ui.\nRun: pnpm add -D tailwindcss@^4"
        );
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
      });

      await saveConfig({ cssPath: cssPathResponse.cssPath });
      await initializeCss();
      await installDependencies(defaultDepencies, process.cwd());
      await initializeStructure();

      logger.success("rlz-ui initialized successfully !");
    } catch (error) {
      logger.error("An error occurred during initialization:", error);
    }
  });
