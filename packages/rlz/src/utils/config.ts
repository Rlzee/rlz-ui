import fs from "fs-extra";
import path from "path";
import { rlzConfigSchema } from "../shemas/config";
import type { rlzConfig } from "../types/config";
import { logger } from "./logger";

/**
 * Creates and writes the rlz configuration file.
 * @param cwd - The current working directory.
 * @param config - The rlz configuration object.
 */
export function createConfig(cwd: string, config: rlzConfig) {
  rlzConfigSchema.parse(config);
  const configPath = path.join(cwd, "rlz.config.json");
  fs.writeJsonSync(configPath, config, { spaces: 2 });
}

/**
 * Reads and validates the rlz-ui config from rlz.config.json
 * @param cwd - The current working directory.
 * @returns The validated rlz configuration object.
 */
export function readConfig(cwd: string): rlzConfig {
  const configPath = path.join(cwd, "rlz.config.json");

  if (!fs.pathExistsSync(configPath)) {
    logger.error(`rlz.config.json not found in ${cwd}`);
    process.exit(1);
  }

  try {
    const parsed = fs.readJsonSync(configPath);
    const config = rlzConfigSchema.parse(parsed);
    return config;
  } catch (error: any) {
    logger.error("Failed to read or validate rlz.config.json");
    logger.error(error);
    process.exit(1);
  }
}
