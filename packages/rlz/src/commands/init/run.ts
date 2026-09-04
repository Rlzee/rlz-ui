import path from "node:path";
import fs from "fs-extra";

import { logger } from "@/utils/logger";
import { confirm, input, select, search } from "@inquirer/prompts";
import { cssPathResponseSchema } from "@/schemas/init";
import { safeParseWithError } from "@/utils/validation";
import { createConfig } from "@/config/create";
import type { rlzConfig, PresetConfig } from "@/config/types";
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
import { GOOGLE_FONTS, getFontByFamily } from "@rlz/fonts";

import type { RegistryPreset } from "@rlz/registry";
import type { Framework } from "@/types/framework";

type InitOptions = {
  cwd?: string;
  framework: Framework;
  fontSans?: string;
  fontHeading?: string;
  fontMono?: string;
  iconLib?: IconLib;
  preset?: RegistryPreset;
  presetConfig?: PresetConfig;
};

function validateFont(
  font: string | undefined,
  label: string
): string | undefined {
  if (!font) {
    return undefined;
  }

  if (!getFontByFamily(font)) {
    throw new Error(`Unknown ${label} font: ${font}`);
  }

  return font;
}

export async function runInit({
  cwd = process.cwd(),
  framework,
  fontSans,
  fontHeading,
  fontMono,
  iconLib,
  preset,
  presetConfig,
}: InitOptions): Promise<void> {
  const hasSrc = await fs.pathExists(path.join(cwd, "src"));
  const rootDir = hasSrc ? "src" : ".";

  const defaultCssPath =
    DEFAULT_CSS_BY_FRAMEWORK[framework]?.(rootDir) ?? "src/index.css";

  // --------------------------------
  // CSS path
  // --------------------------------

  const cssPath = await input({
    message: "Enter the path to your CSS file:",
    default: defaultCssPath,
    validate: (value) => {
      try {
        cssPathResponseSchema.parse({ cssPath: value });
        return true;
      } catch (error: any) {
        return error.message;
      }
    },
  });

  const validatedCssPath = safeParseWithError(
    () => cssPathResponseSchema.parse({ cssPath }),
    "CSS path validation failed"
  ).cssPath;

  // --------------------------------
  // Icon library
  // --------------------------------

  let selectedIconLib = iconLib;

  if (!selectedIconLib) {
    const recommendedIconLib = preset?.recommendations?.icons?.library;

    if (recommendedIconLib) {
      const recommendationIsValid =
        Object.keys(ICON_LIBS).includes(recommendedIconLib);

      if (recommendationIsValid) {
        const useRecommendedIconLib = await confirm({
          message: `Use the icon library recommended by the preset (${recommendedIconLib})?`,
          default: true,
        });

        if (useRecommendedIconLib) {
          selectedIconLib = recommendedIconLib as IconLib;
        }
      } else {
        logger.warn(
          `The preset recommends an unsupported icon library: ${recommendedIconLib}`
        );
      }
    }

    if (!selectedIconLib) {
      selectedIconLib = await select<IconLib>({
        message: "Select an icon library:",
        choices: Object.keys(ICON_LIBS).map((library) => ({
          name: library,
          value: library as IconLib,
        })),
      });
    }
  }

  selectedIconLib = safeParseWithError(
    () => iconLibSchema.parse(selectedIconLib),
    "Icon library selection failed"
  );

  // --------------------------------
  // Typography recommendations
  // --------------------------------

  let selectedFontSans = fontSans;
  let selectedFontHeading = fontHeading;
  let selectedFontMono = fontMono;

  const recommendedTypography = preset?.recommendations?.typography;

  const hasRecommendedTypography =
    Boolean(recommendedTypography?.fontSans) ||
    Boolean(recommendedTypography?.fontHeading) ||
    Boolean(recommendedTypography?.fontMono);

  const hasMissingFonts =
    !selectedFontSans || !selectedFontHeading || !selectedFontMono;

  if (hasMissingFonts && hasRecommendedTypography) {
    const useRecommendedTypography = await confirm({
      message: "Use the typography recommendations from the preset?",
      default: true,
    });

    if (useRecommendedTypography) {
      selectedFontSans ??= recommendedTypography?.fontSans;
      selectedFontHeading ??=
        recommendedTypography?.fontHeading ?? selectedFontSans;
      selectedFontMono ??= recommendedTypography?.fontMono;
    }
  }

  // --------------------------------
  // Validate recommended fonts
  // --------------------------------

  try {
    selectedFontSans = validateFont(selectedFontSans, "sans");
    selectedFontHeading = validateFont(selectedFontHeading, "heading");
    selectedFontMono = validateFont(selectedFontMono, "mono");
  } catch (error) {
    logger.warn(
      error instanceof Error ? error.message : "Invalid recommended font."
    );

    if (
      recommendedTypography?.fontSans === selectedFontSans ||
      recommendedTypography?.fontHeading === selectedFontHeading ||
      recommendedTypography?.fontMono === selectedFontMono
    ) {
      logger.warn("The invalid recommendation will be selected manually.");
    }
  }

  // --------------------------------
  // Sans font
  // --------------------------------

  if (!selectedFontSans) {
    selectedFontSans = await search<string>({
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

  // --------------------------------
  // Heading font
  // --------------------------------

  if (!selectedFontHeading) {
    selectedFontHeading = await select<string>({
      message: "Select heading font:",
      choices: [
        {
          name: `Use sans font (${selectedFontSans})`,
          value: selectedFontSans,
        },
        ...GOOGLE_FONTS.map((font) => ({
          name: font.family,
          value: font.family,
        })),
      ],
    });
  }

  // --------------------------------
  // Mono font
  // --------------------------------

  if (!selectedFontMono) {
    selectedFontMono = await search<string>({
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

  // --------------------------------
  // Final validation
  // --------------------------------

  if (!selectedFontSans) {
    throw new Error("Main font is required.");
  }

  if (!selectedFontHeading) {
    selectedFontHeading = selectedFontSans;
  }

  if (!selectedFontMono) {
    throw new Error("Mono font is required.");
  }

  // --------------------------------
  // Config
  // --------------------------------

  const rlzConfig: rlzConfig = {
    framework,
    dirs: {
      root: rootDir,
    },
    css: validatedCssPath,
    aliases: defaultAliasesRlzConfig,
    icons: selectedIconLib,
    ...(presetConfig && {
      preset: presetConfig,
    }),
  };

  createConfig(cwd, rlzConfig);

  // --------------------------------
  // Dependencies
  // --------------------------------

  await installDependencies(defaultDependencies, cwd);

  // --------------------------------
  // CSS
  // --------------------------------

  const cssUrl =
    framework === "vite"
      ? `${UI_URL}/styles/globals.vite.css`
      : `${UI_URL}/styles/globals.css`;

  await getUiFile(cssUrl, validatedCssPath);

  // --------------------------------
  // Fonts
  // --------------------------------

  await addFonts({
    cwd,
    framework,
    fontSans: selectedFontSans,
    fontHeading: selectedFontHeading,
    fontMono: selectedFontMono,
  });

  // --------------------------------
  // Framework configuration
  // --------------------------------

  if (framework !== "next") {
    ensureTsconfigPaths({
      cwd,
      paths: {
        "@/*": [`${rootDir}/*`],
      },
    });

    if (framework === "vite") {
      await installDependencies(["vite-tsconfig-paths"], cwd, true);
      await updateViteConfig(cwd);
    }
  }

  logger.success("rlz-ui initialized successfully.");
}
