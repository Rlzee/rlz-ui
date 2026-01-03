import type { InitOptions } from "../../types/init";
import { logger } from "../../utils/logger";
import prompts from "prompts";
import { cssPathResponseSchema } from "../../shemas/init";
import { safeParseWithError } from "../../utils/validation";
import { createConfig } from "../../utils/config";
import type { rlzConfig } from "../../types/config";
import { getUiFile } from "@/src/utils/get-ui-file";
import { UI_URL, defaultDependencies } from "@/src/config";
import { installDependencies } from "@/src/utils/install-dependencies";
import path from "path";
import fs from "fs-extra";

export async function runInit({ cwd, framework }: InitOptions): Promise<void> {
  const cssPathResponse = await prompts({
    type: "text",
    name: "cssPath",
    message: "Enter the path to your CSS file:",
    initial: "src/index.css",
    validate: (value: string) => {
      try {
        safeParseWithError(
          () => cssPathResponseSchema.parse({ cssPath: value }),
          "Invalid CSS path"
        );
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

  const rootDir = (await fs.pathExists(path.join(cwd, "src"))) ? "src" : ".";

  const rlzConfig: rlzConfig = {
    framework,
    dirs: {
      root: rootDir,
    },
    css: {
      global: cssPath,
      theme: cssPath,
    },
    aliases: {
      baseComponent: "@/components/base",
      uiComponents: "@/components/ui",
      utils: "@/utils",
      lib: "@/lib",
      types: "@/types",
    },
  };

  createConfig(cwd, rlzConfig);

  await installDependencies(defaultDependencies, cwd);

  await getUiFile(`${UI_URL}/style/theme.css`, cssPath);

  logger.success("rlz-ui initialized successfully.");
}
