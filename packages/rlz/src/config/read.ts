import type { rlzConfig } from "./types";
import { rlzConfigSchema } from "./schemas";
import { logger } from "../utils/logger";
import path from "path";
import fs from "fs-extra";

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
