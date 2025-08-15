import fs from "fs";
import path from "path";

interface RlzConfig {
  cssPath: string;
  uiPath?: string;
  aliases?: Aliases;
}

interface RlzConfigWithDefaults {
  cssPath: string;
  uiPath: string;
  aliases: Aliases;
}

interface Aliases {
  [key: string]: string;
}

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
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  const configWithDefaults = {
    ...config,
    uiPath: config.uiPath || "src/ui",
    aliases: config.aliases || defaultAliases,
  };
  await fs.promises.writeFile(
    configPath,
    JSON.stringify(configWithDefaults, null, 2)
  );
};

export const loadConfig = async (): Promise<RlzConfig | null> => {
  const configPath = path.join(process.cwd(), CONFIG_FILE);

  try {
    const configContent = await fs.promises.readFile(configPath, "utf-8");
    return JSON.parse(configContent);
  } catch (error) {
    return null;
  }
};

export const getConfigOrDefault = async (): Promise<RlzConfigWithDefaults> => {
  const config = await loadConfig();
  if (config) {
    return {
      cssPath: config.cssPath,
      uiPath: config.uiPath || "src/ui",
      aliases: config.aliases || defaultAliases,
    };
  }

  return {
    cssPath: "app/globals.css",
    uiPath: "src/ui",
    aliases: defaultAliases,
  };
};
