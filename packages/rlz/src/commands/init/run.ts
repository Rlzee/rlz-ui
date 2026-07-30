import { logger } from "@/utils/logger";
import { input, select, search } from "@inquirer/prompts";
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
  fontSans?: string;
  fontHeading?: string;
  fontMono?: string;
  iconLib?: IconLib;
};

export async function runInit({
  cwd = process.cwd(),
  framework,
  fontSans,
  fontHeading,
  fontMono,
  iconLib,
}: InitOptions): Promise<void> {
  const hasSrc = await fs.pathExists(path.join(cwd, "src"));
  const rootDir = hasSrc ? "src" : ".";

  const defaultCssPath =
    DEFAULT_CSS_BY_FRAMEWORK[framework]?.(rootDir) ?? "src/index.css";

  const cssPath = await input({
    message: "Enter the path to your CSS file:",
    default: defaultCssPath,
    validate: (value) => {
      try {
        cssPathResponseSchema.parse({ cssPath: value });
        return true;
      } catch (err: any) {
        return err.message;
      }
    },
  });

  const validatedCssPath = safeParseWithError(
    () => cssPathResponseSchema.parse({ cssPath }),
    "CSS path validation failed"
  ).cssPath;

  let selectedIconLib = iconLib;

  if (!selectedIconLib) {
    selectedIconLib = await select<IconLib>({
      message: "Select an icon library:",
      choices: Object.keys(ICON_LIBS).map((lib) => ({
        name: lib,
        value: lib as IconLib,
      })),
    });
  }

  selectedIconLib = safeParseWithError(
    () => iconLibSchema.parse(selectedIconLib),
    "Icon library selection failed"
  );

  // Sans font
  let selectedFontSans = fontSans;

  if (!selectedFontSans) {
    selectedFontSans = await search({
      message: "Select main font:",
      source: async (term) => {
        const query = term?.toLowerCase() ?? "";

        return GOOGLE_FONTS.filter((font) =>
          font.family.toLowerCase().includes(query)
        )
          .slice(0, 20)
          .map((font) => ({
            name: font.family,
            value: font.family,
          }));
      },
    });
  }

  // Heading font
  let selectedFontHeading = fontHeading;

  if (!selectedFontHeading) {
    selectedFontHeading = await search({
      message: "Select heading font (optional):",
      source: async (term) => {
        const query = term?.toLowerCase() ?? "";

        return GOOGLE_FONTS.filter((font) =>
          font.family.toLowerCase().includes(query)
        )
          .slice(0, 20)
          .map((font) => ({
            name: font.family,
            value: font.family,
          }));
      },
    });
  }

  // Fallback heading = body
  if (!selectedFontHeading) {
    selectedFontHeading = selectedFontSans;
  }

  // Mono font
  let selectedFontMono = fontMono;

  if (!selectedFontMono) {
    selectedFontMono = await search({
      message: "Select mono font:",
      source: async (term) => {
        const query = term?.toLowerCase() ?? "";

        return GOOGLE_FONTS.filter((font) =>
          font.family.toLowerCase().includes(query)
        )
          .slice(0, 20)
          .map((font) => ({
            name: font.family,
            value: font.family,
          }));
      },
    });
  }

  if (!selectedFontSans) {
    logger.error("Main font is required.");
    process.exit(1);
  }

  const rlzConfig: rlzConfig = {
    framework,
    dirs: {
      root: rootDir,
    },
    css: validatedCssPath,
    aliases: defaultAliasesRlzConfig,
    icons: selectedIconLib,
  };

  createConfig(cwd, rlzConfig);

  await installDependencies(defaultDependencies, cwd);

  const cssUrl =
    framework === "vite"
      ? `${UI_URL}/styles/globals.vite.css`
      : `${UI_URL}/styles/globals.css`;

  await getUiFile(cssUrl, validatedCssPath);

  await addFonts({
    cwd,
    framework,
    fontSans: selectedFontSans,
    fontHeading: selectedFontHeading,
    fontMono: selectedFontMono,
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
