import fs from "fs";
import path from "path";
import { rlzConfigSchema } from "../shemas/config";
import type { rlzConfig } from "../types/config";

export function createConfig(cwd: string, config: rlzConfig) {
  rlzConfigSchema.parse(config);
  const configPath = path.join(cwd, "rlz.config.json");
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
