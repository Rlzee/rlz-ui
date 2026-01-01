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
import fs from "fs";

export async function runInit({ cwd, framework }: InitOptions): Promise<void> {
  // Prompt CSS path
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

  // Handle cancellation
  if (!cssPathResponse || !cssPathResponse.cssPath) {
    logger.error("Initialization cancelled or no CSS path provided.");
    process.exit(1);
  }

  // Validate final response
  const { cssPath } = safeParseWithError(
    () => cssPathResponseSchema.parse(cssPathResponse),
    "CSS path validation failed"
  );

  // Determine root directory
  const rootDir = fs.existsSync(path.join(cwd, "src")) ? "src" : ".";

  // Create rlz config
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
      utils: "@/lib/utils",
      lib: "@/lib",
      types: "@/types",
    },
  };

  // Write config to file
  createConfig(cwd, rlzConfig);

  // Install default dependencies
  await installDependencies(defaultDependencies, cwd);

  // initialize css file
  await getUiFile(`${UI_URL}/style/theme.css`, cssPath);

  // success message
  logger.success("rlz-ui initialized successfully.");
}
