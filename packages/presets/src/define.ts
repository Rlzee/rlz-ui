import type { Preset } from "./types";

export function definePreset<const T extends Preset>(preset: T): T {
  return preset;
}
