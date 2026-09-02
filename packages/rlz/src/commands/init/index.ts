import { Command } from "commander";
import { logger } from "@/utils/logger";
import { getPackageInfo } from "@/utils/get-package-info";
import { getFramework } from "@/utils/get-framework";
import { getTailwindInfo } from "@/utils/get-tailwind-info";
import { getTypeScriptInfo } from "@/utils/get-typescript-info";
import { getFontByFamily } from "@rlz/fonts";
import { ICON_LIBS, type IconLib } from "@/icons/libs";
import { readRegistry } from "@/utils/read-registry";
import { runInit } from "./run";

import path from "path";
import fs from "fs-extra";

export const initCommand = new Command()
  .name("init")
  .description("Initialize rlz-ui")
  .option("--font-sans <font>", "Main UI font")
  .option("--font-heading <font>", "Heading font")
  .option("--font-mono <font>", "Monospace font")
  .option(
    "--icon-lib <lib>",
    `Icon library (${Object.keys(ICON_LIBS).join(", ")})`
  )
  .option(
    "--preset <preset>",
    "Preset name from registry or path to a JSON preset"
  )
  .action(
    async (options: {
      fontSans?: string;
      fontHeading?: string;
      fontMono?: string;
      iconLib?: IconLib;
      preset?: string;
    }) => {
      try {
        const cwd = process.cwd();

        // --------------------------------
        // Project checks
        // --------------------------------

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
          logger.error(
            "tsconfig.json not found. Please initialize TypeScript."
          );
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

        // --------------------------------
        // Fonts
        // --------------------------------

        if (options.fontSans && !getFontByFamily(options.fontSans)) {
          logger.error(`Unknown sans font: ${options.fontSans}`);
          process.exit(1);
        }

        if (options.fontHeading && !getFontByFamily(options.fontHeading)) {
          logger.error(`Unknown heading font: ${options.fontHeading}`);
          process.exit(1);
        }

        if (options.fontMono && !getFontByFamily(options.fontMono)) {
          logger.error(`Unknown mono font: ${options.fontMono}`);
          process.exit(1);
        }

        // --------------------------------
        // Icons
        // --------------------------------

        if (
          options.iconLib &&
          !Object.keys(ICON_LIBS).includes(options.iconLib)
        ) {
          logger.error(
            `Unknown icon library: ${options.iconLib}. Available: ${Object.keys(
              ICON_LIBS
            ).join(", ")}`
          );
          process.exit(1);
        }

        // --------------------------------
        // Preset
        // --------------------------------

        let preset:
          | {
              type: "registry" | "file";
              value: string;
            }
          | undefined;

        if (options.preset !== undefined) {
          const presetInput = options.preset;

          const isFile =
            presetInput.startsWith("./") ||
            presetInput.startsWith("../") ||
            presetInput.startsWith("/") ||
            presetInput.endsWith(".json");

          // --------------------------------
          // Local JSON preset
          // --------------------------------

          if (isFile) {
            const presetPath = path.resolve(cwd, presetInput);

            if (!(await fs.pathExists(presetPath))) {
              logger.error(`Preset file not found: ${presetInput}`);
              process.exit(1);
            }

            if (path.extname(presetPath).toLowerCase() !== ".json") {
              logger.error(`Preset file must be a JSON file: ${presetInput}`);
              process.exit(1);
            }

            preset = {
              type: "file",
              value: presetPath,
            };

            logger.info(`Preset file: ${presetInput}`);
          }

          // --------------------------------
          // Registry preset
          // --------------------------------
          else {
            const registry = await readRegistry();

            if (!registry) {
              logger.error("Registry not found.");
              process.exit(1);
            }

            const registryPreset = registry.presets[presetInput];

            if (!registryPreset) {
              logger.error(`Preset not found in registry: ${presetInput}`);
              process.exit(1);
            }

            preset = {
              type: "registry",
              value: presetInput,
            };

            logger.info(`Preset: ${presetInput}`);
          }
        }

        // --------------------------------
        // Logs
        // --------------------------------

        logger.info(`Framework detected: ${frameworkInfo.framework}`);
        logger.info(`TypeScript v${ts.rawVersion}`);
        logger.info(`Tailwind CSS v${tailwind.rawVersion} detected.`);

        if (options.fontSans) {
          logger.info(`Sans font: ${options.fontSans}`);
        }

        if (options.fontHeading) {
          logger.info(`Heading font: ${options.fontHeading}`);
        }

        if (options.fontMono) {
          logger.info(`Mono font: ${options.fontMono}`);
        }

        if (options.iconLib) {
          logger.info(`Icon library: ${options.iconLib}`);
        }

        // --------------------------------
        // Init
        // --------------------------------

        await runInit({
          framework: frameworkInfo.framework,
          fontSans: options.fontSans,
          fontHeading: options.fontHeading,
          fontMono: options.fontMono,
          iconLib: options.iconLib,
          preset,
        });
      } catch (error) {
        logger.error("Initialization failed.");
        logger.error(error);
        process.exit(1);
      }
    }
  );
