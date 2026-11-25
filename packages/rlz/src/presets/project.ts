import { createHash } from "node:crypto";
import path from "node:path";
import fs from "fs-extra";
import {
  RegistryPresetSchema,
  type Registry,
  type RegistryPreset,
} from "@rlz/registry";
import type { PresetConfig } from "@/config/types";

export async function readPresetFile(file: string): Promise<RegistryPreset> {
  try {
    return RegistryPresetSchema.parse(await fs.readJson(file));
  } catch (error) {
    throw new Error(
      `Cannot read preset "${file}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/** New initializations pin the exact preset used by init; old configs still work. */
export async function resolveProjectPreset(
  cwd: string,
  config: PresetConfig | undefined,
  registry: Registry
): Promise<RegistryPreset | undefined> {
  if (!config) return undefined;
  if (config.snapshot)
    return readPresetFile(path.resolve(cwd, config.snapshot));
  if (config.source === "path")
    return readPresetFile(path.resolve(cwd, config.path));

  const preset = Object.values(registry.presets).find(
    (entry) => entry.id === config.id
  );
  if (!preset)
    throw new Error(
      `Configured preset "${config.id}" not found in the registry.`
    );
  return preset;
}

export async function pinProjectPreset(
  cwd: string,
  config: PresetConfig,
  preset: RegistryPreset
): Promise<PresetConfig> {
  const contents = `${JSON.stringify(preset, null, 2)}\n`;
  const hash = createHash("sha256").update(contents).digest("hex");
  const snapshot = `.rlz/presets/${hash}.json`;
  const file = path.resolve(cwd, snapshot);
  await fs.ensureDir(path.dirname(file));
  try {
    await fs.writeFile(file, contents, { flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if ((await fs.readFile(file, "utf8")) !== contents) {
      throw new Error(
        `Preset snapshot already exists with different contents: "${snapshot}".`
      );
    }
  }
  return { ...config, snapshot };
}
