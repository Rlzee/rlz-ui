import { Command } from "commander";
import { logger } from "../utils/logger.js";
import { getPackageInfo } from "../utils/get-package-info.js";
import { getFramework } from "../utils/get-framework.js";
import { getTailwindInfo } from "../utils/get-tailwind-info.js";

export const initCommand = new Command()
  .name("init")
  .description("Initialize rlz-ui")
  .action(async () => {
    try {
      const cwd = process.cwd();

      const packageInfo = getPackageInfo(cwd, false);
      if (!packageInfo) {
        logger.error("No package.json found. Run this inside a project.");
        process.exit(1);
      }

      const { framework, appDir } = getFramework(cwd, packageInfo);
      if (framework === "invalid") {
        logger.error(
          "Unsupported framework. rlz-ui supports Next.js, Vite, and React projects."
        );
        process.exit(1);
      }

      const tailwind = getTailwindInfo(cwd, packageInfo);
      if (!tailwind.installed) {
        logger.error("Tailwind CSS is required (v4+).");
        process.exit(1);
      }

      if (!tailwind.configPath) {
        logger.error(
          "No Tailwind config found. Please create a tailwind.config.ts before using rlz-ui."
        );
        process.exit(1);
      }

      if (!tailwind.version || tailwind.version < 4) {
        logger.error(
          `Unsupported Tailwind version (${tailwind.rawVersion}). rlz-ui requires v4+.`
        );
        process.exit(1);
      }

      logger.info(`Framework detected: ${framework}, appDir: ${appDir}`);
      logger.info(
        `Tailwind v${tailwind.rawVersion} detected at ${tailwind.configPath}`
      );
    } catch (error) {
      logger.error("Initialization failed.");
      logger.error(error);
      process.exit(1);
    }
  });
