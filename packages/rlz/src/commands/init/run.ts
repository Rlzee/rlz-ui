import type { InitOptions } from "@/types/init";
import { logger } from "@/utils/logger";
import prompts from "prompts";
import { cssPathResponseSchema } from "@/schemas/init";
import { safeParseWithError } from "@/utils/validation";
import { createConfig } from "@/config/create";
import type { rlzConfig } from "@/config/types";
import { initializeCss } from "@/utils/initialize-css";
import { defaultAliasesRlzConfig } from "@/config/constants";
import { defaultDependencies } from "@/config";
import { installDependencies } from "@/utils/install-dependencies";
import { ensureTsconfigPaths } from "@/utils/ensure-config-path";
import { updateViteConfig } from "@/utils/update-vite-config";
import { DEFAULT_CSS_BY_FRAMEWORK } from "@/utils/get-default-css-by-framework";
import { iconLibSchema } from "@/icons/schema";
import { type IconLib, ICON_LIBS } from "@/icons/libs";
import path from "path";
import fs from "fs-extra";

export async function runInit({ cwd, framework }: InitOptions): Promise<void> {
  const hasSrc = await fs.pathExists(path.join(cwd, "src"));
  const rootDir = hasSrc ? "src" : ".";

  const defaultCssPath =
    DEFAULT_CSS_BY_FRAMEWORK[framework]?.(rootDir) ?? "src/index.css";

  const cssPathResponse = await prompts({
    type: "text",
    name: "cssPath",
    message: "Enter the path to your CSS file:",
    initial: defaultCssPath,
    validate: (value: string) => {
      try {
        cssPathResponseSchema.parse({ cssPath: value });
        return true;
      } catch (err: any) {
        return err.message;
      }
    },
  });

  if (!cssPathResponse || !cssPathResponse.cssPath) {
    logger.error("Initialization cancelled or no CSS path provided.");
    process.exit(1);
  }

  const { cssPath } = safeParseWithError(
    () => cssPathResponseSchema.parse(cssPathResponse),
    "CSS path validation failed"
  );

  const iconLibraryResponse = await prompts({
    type: "select",
    name: "iconLibrary",
    message: "Select an icon library:",
    choices: Object.keys(ICON_LIBS).map((lib) => ({
      title: lib,
      value: lib as IconLib,
    })),
  });

  if (!iconLibraryResponse || !iconLibraryResponse.iconLibrary) {
    logger.error("Initialization cancelled or no icon library selected.");
    process.exit(1);
  }

  const iconLibrary = safeParseWithError(
    () => iconLibSchema.parse(iconLibraryResponse.iconLibrary),
    "Icon library selection failed"
  );

  const rlzConfig: rlzConfig = {
    framework,
    dirs: {
      root: rootDir,
    },
    css: cssPath,
    aliases: defaultAliasesRlzConfig,
    icons: iconLibrary,
  };

  createConfig(cwd, rlzConfig);

  await installDependencies(defaultDependencies, cwd);

  initializeCss(cssPath);

  if (framework !== "next") {
    ensureTsconfigPaths({
      cwd,
      paths: {
        "@/*": [`${rootDir}/*`],
      },
    });

    if (framework === "vite") {
      installDependencies(["vite-tsconfig-paths"], cwd, true);
      await updateViteConfig(cwd);
    }
  }

  logger.success("rlz-ui initialized successfully.");
}
