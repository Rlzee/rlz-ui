import { Command } from "commander";
import { logger } from "../../utils/logger";
import { getPackageInfo } from "../../utils/get-package-info";
import { getFramework } from "../../utils/get-framework";
import { getTailwindInfo } from "../../utils/get-tailwind-info";
import { getTypeScriptInfo } from "../../utils/get-typescript-info";

import { runInit } from "./run";

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

      const frameworkInfo = getFramework(packageInfo);
      if (frameworkInfo.framework === "invalid") {
        logger.error(
          "Unsupported framework. rlz-ui supports Next.js, Vite, and React projects."
        );
        process.exit(1);
      }

      const ts = getTypeScriptInfo(cwd, packageInfo);
      if (!ts.installed) {
        logger.error("TypeScript is required to use rlz-ui.");
        process.exit(1);
      }

      if (!ts.configPath) {
        logger.error("tsconfig.json not found. Please initialize TypeScript.");
        process.exit(1);
      }

      const tailwind = getTailwindInfo(cwd, packageInfo);
      if (!tailwind.installed) {
        logger.error("Tailwind CSS is required (v4+).");
        process.exit(1);
      }

      if (!tailwind.version || tailwind.version < 4) {
        logger.error(
          `Unsupported Tailwind version (${tailwind.rawVersion}). rlz-ui requires v4+.`
        );
        process.exit(1);
      }

      // logger.info(`Framework detected: ${frameworkInfo.framework}`);
      // logger.info(`TypeScript v${ts.rawVersion} detected at ${ts.configPath}`);
      // logger.info(`Tailwind CSS v${tailwind.rawVersion} detected.`);

      await runInit({ cwd, framework: frameworkInfo.framework });
    } catch (error) {
      logger.error("Initialization failed.");
      logger.error(error);
      process.exit(1);
    }
  });
