import type { RegistryPreset } from "./types";

type RegistryPresetsInput = {
  [key: string]: Omit<RegistryPreset, "id" | "type">;
};

export function defineRegistryPresets(
  presets: RegistryPresetsInput
): Record<string, RegistryPreset> {
  return Object.fromEntries(
    Object.entries(presets).map(([id, preset]) => [
      id,
      {
        ...preset,
        id,
        type: "preset",
      },
    ])
  );
}
