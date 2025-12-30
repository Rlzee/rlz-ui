import type { InitOptions } from "../../types/init";
import { logger } from "../../utils/logger";
import prompts from "prompts";
import { cssPathResponseSchema } from "../../shemas/init";
import { safeParseWithError } from "../../utils/validation";
import { createConfig } from "../../utils/config";
import type { rlzConfig } from "../../types/config";
import path from "path";
import fs from "fs";

export async function runInit({ cwd, framework }: InitOptions): Promise<void> {
  logger.info("Initializing rlz-ui...");

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

  // Resolve CSS absolute path
  const cssAbsolutePath = path.resolve(cwd, cssPath);
  if (!fs.existsSync(cssAbsolutePath)) {
    logger.error(`CSS file not found at "${cssAbsolutePath}".`);
    process.exit(1);
  }

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
}
