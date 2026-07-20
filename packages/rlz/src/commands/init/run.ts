import { logger } from "@/utils/logger";
import prompts, { type PromptObject } from "prompts";
import { cssPathResponseSchema } from "@/schemas/init";
import { safeParseWithError } from "@/utils/validation";
import { createConfig } from "@/config/create";
import type { rlzConfig } from "@/config/types";
import { getUiFile } from "@/utils/get-ui-file";
import { UI_URL } from "@/config";
import { defaultAliasesRlzConfig } from "@/config/constants";
import { defaultDependencies } from "@/config";
import { installDependencies } from "@/utils/install-dependencies";
import { ensureTsconfigPaths } from "@/utils/ensure-config-path";
import { updateViteConfig } from "@/utils/update-vite-config";
import { DEFAULT_CSS_BY_FRAMEWORK } from "@/utils/get-default-css-by-framework";
import { addFonts } from "@/fonts/add";
import { iconLibSchema } from "@/icons/schema";
import { type IconLib, ICON_LIBS } from "@/icons/libs";
import { GOOGLE_FONTS } from "@rlz/fonts";

import path from "path";
import fs from "fs-extra";

import type { Framework } from "@/types/framework";

type InitOptions = {
  cwd?: string;
  framework: Framework;
  headingFont?: string;
  bodyFont?: string;
  iconLib?: IconLib;
};

export async function runInit({
  cwd = process.cwd(),
  framework,
  bodyFont,
  headingFont,
  iconLib,
}: InitOptions): Promise<void> {
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

  if (!cssPathResponse?.cssPath) {
    logger.error("Initialization cancelled or no CSS path provided.");
    process.exit(1);
  }

  const { cssPath } = safeParseWithError(
    () => cssPathResponseSchema.parse(cssPathResponse),
    "CSS path validation failed"
  );

  let selectedIconLib = iconLib;

  if (!selectedIconLib) {
    const iconLibraryResponse = await prompts({
      type: "select",
      name: "iconLibrary",
      message: "Select an icon library:",
      choices: Object.keys(ICON_LIBS).map((lib) => ({
        title: lib,
        value: lib as IconLib,
      })),
    });

    if (!iconLibraryResponse?.iconLibrary) {
      logger.error("Initialization cancelled or no icon library selected.");
      process.exit(1);
    }

    selectedIconLib = iconLibraryResponse.iconLibrary;
  }

  selectedIconLib = safeParseWithError(
    () => iconLibSchema.parse(selectedIconLib),
    "Icon library selection failed"
  );

  let selectedBodyFont = bodyFont;
  let selectedHeadingFont = headingFont;

  const fontChoices = GOOGLE_FONTS.map((font) => ({
    title: font.family,
    value: font.family,
  }));

  const fontQuestions: PromptObject[] = [];

  if (!selectedBodyFont) {
    fontQuestions.push({
      type: "select",
      name: "bodyFont",
      message: "Select body font:",
      choices: fontChoices,
    });
  }

  if (!selectedHeadingFont) {
    fontQuestions.push({
      type: "select",
      name: "headingFont",
      message: "Select heading font:",
      choices: fontChoices,
    });
  }

  if (fontQuestions.length > 0) {
    const fontsResponse = await prompts(fontQuestions);

    if (!selectedBodyFont) {
      selectedBodyFont = fontsResponse.bodyFont;
    }

    if (!selectedHeadingFont) {
      selectedHeadingFont = fontsResponse.headingFont;
    }
  }

  if (!selectedBodyFont || !selectedHeadingFont) {
    logger.error("Body font and heading font are required.");
    process.exit(1);
  }

  const rlzConfig: rlzConfig = {
    framework,
    dirs: {
      root: rootDir,
    },
    css: cssPath,
    aliases: defaultAliasesRlzConfig,
    icons: selectedIconLib,
  };

  createConfig(cwd, rlzConfig);

  await installDependencies(defaultDependencies, cwd);

  const cssUrl =
    framework === "vite"
      ? `${UI_URL}/styles/globals.vite.css`
      : `${UI_URL}/styles/globals.css`;

  await getUiFile(cssUrl, cssPath);

  await addFonts({
    cwd,
    framework,
    bodyFont: selectedBodyFont,
    headingFont: selectedHeadingFont,
  });

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
