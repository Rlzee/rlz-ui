import { rlzConfigSchema } from "./schemas";
import type { rlzConfig } from "./types";
import path from "path";
import fs from "fs-extra";

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
