import type { InitOptions } from "../../types/init";
import { logger } from "../../utils/logger";
import prompts from "prompts";
import { cssPathResponseSchema } from "../../shemas/init";
import { safeParseWithError } from "../../utils/validation";
import { createConfig } from "../../utils/config";
import type { rlzConfig } from "../../types/config";
import { getUiFile } from "@/src/utils/get-ui-file";
import {
  UI_URL,
  defaultDependencies,
  defaultAliasesRlzConfig,
} from "@/src/config";
import { installDependencies } from "@/src/utils/install-dependencies";
import { ensureTsconfigPaths } from "@/src/utils/ensure-config-path";
import { updateViteConfig } from "@/src/utils/update-vite-config";
import path from "path";
import fs from "fs-extra";

export const DEFAULT_CSS_BY_FRAMEWORK: Record<
  string,
  (rootDir: string) => string
> = {
  next: () => "app/globals.css",
  vite: (rootDir) => (rootDir === "." ? "index.css" : "src/index.css"),
  react: (rootDir) => (rootDir === "." ? "index.css" : "src/index.css"),
};

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

  const rlzConfig: rlzConfig = {
    framework,
    dirs: {
      root: rootDir,
    },
    css: {
      global: cssPath,
      theme: cssPath,
    },
    aliases: defaultAliasesRlzConfig,
  };

  createConfig(cwd, rlzConfig);

  await installDependencies(defaultDependencies, cwd);

  await getUiFile(`${UI_URL}/style/theme.css`, cssPath);

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
