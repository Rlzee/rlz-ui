import { Command } from "commander";
import { logger } from "../utils/logger.js";
import { getPackageInfo } from "../utils/get-package-info.js";
import { getFramework } from "../utils/get-framework.js";
import { getTailwindInfo } from "../utils/get-tailwind-info.js";
import { getTypeScriptInfo } from "../utils/get-typescript-info.js";

export const initCommand = new Command()
  .name("init")
  .description("Initialize rlz-ui")
  .action(async () => {
    try {
      const cwd = process.cwd();

      // Package info

      const packageInfo = getPackageInfo(cwd, false);
      if (!packageInfo) {
        logger.error("No package.json found. Run this inside a project.");
        process.exit(1);
      }

      // Framework info

      const { framework, appDir } = getFramework(cwd, packageInfo);
      if (framework === "invalid") {
        logger.error(
          "Unsupported framework. rlz-ui supports Next.js, Vite, and React projects."
        );
        process.exit(1);
      }

      // TypeScript info

      const ts = getTypeScriptInfo(cwd, packageInfo);
      if (!ts.installed) {
        logger.error("TypeScript is required to use rlz-ui.");
        process.exit(1);
      }

      if (!ts.configPath) {
        logger.error("tsconfig.json not found. Please initialize TypeScript.");
        process.exit(1);
      }

      // Tailwind info

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

      logger.info(`Framework detected: ${framework}, appDir: ${appDir}`);
      logger.info(`TypeScript v${ts.rawVersion} detected at ${ts.configPath}`);
      logger.info(`Tailwind CSS v${tailwind.rawVersion} detected.`);
    } catch (error) {
      logger.error("Initialization failed.");
      logger.error(error);
      process.exit(1);
    }
  });
