import fs from "fs";
import path from "path";

interface RlzConfig {
  srcDir: boolean;
}

const CONFIG_FILE = "rlz.config.json";

export const saveConfig = async (config: RlzConfig) => {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));
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

export const getConfigOrDefault = async (): Promise<RlzConfig> => {
  const config = await loadConfig();
  return config || { srcDir: false };
};
