import fs from "fs";
import path from "path";
import {
  rlzConfigSchema,
  rlzConfigWithDefaultsSchema,
  aliasesSchema,
  type RlzConfig,
  type RlzConfigWithDefaults,
  type Aliases,
} from "../schemas";

const defaultAliases: Aliases = {
  components: "@ui/components",
  utils: "@ui/utils",
  lib: "@ui/lib",
  stores: "@ui/stores",
  helpers: "@ui/helpers",
  types: "@ui/types",
  hooks: "@ui/hooks",
};

const CONFIG_FILE = "rlz.config.json";

export const saveConfig = async (config: RlzConfig) => {
  const validatedConfig = rlzConfigSchema.parse(config);

  const configPath = path.join(process.cwd(), CONFIG_FILE);
  const configWithDefaults = {
    ...validatedConfig,
    uiPath: validatedConfig.uiPath || "src/ui",
    aliases: validatedConfig.aliases || defaultAliases,
  };

  const finalConfig = rlzConfigWithDefaultsSchema.parse(configWithDefaults);

  await fs.promises.writeFile(configPath, JSON.stringify(finalConfig, null, 2));
};

export const loadConfig = async (): Promise<RlzConfig | null> => {
  const configPath = path.join(process.cwd(), CONFIG_FILE);

  try {
    const configContent = await fs.promises.readFile(configPath, "utf-8");
    const parsedConfig = JSON.parse(configContent);

    return rlzConfigSchema.parse(parsedConfig);
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
    return null;
  }
};

export const getConfigOrDefault = async (): Promise<RlzConfigWithDefaults> => {
  try {
    const config = await loadConfig();
    if (config) {
      const configWithDefaults = {
        cssPath: config.cssPath,
        uiPath: config.uiPath || "src/ui",
        aliases: config.aliases || defaultAliases,
      };

      return rlzConfigWithDefaultsSchema.parse(configWithDefaults);
    }
  } catch (error) {
    console.warn("Config validation failed, using default config:", error);
  }

  const defaultConfig = {
    cssPath: "app/globals.css",
    uiPath: "src/ui",
    aliases: defaultAliases,
  };

  return rlzConfigWithDefaultsSchema.parse(defaultConfig);
};
