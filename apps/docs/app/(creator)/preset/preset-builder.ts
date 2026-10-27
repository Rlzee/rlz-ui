import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { defaultPreset } from "@rlz/ui/styles/presets";
import type { RegistryPreset } from "@rlz/registry";

const initialPreset: RegistryPreset = structuredClone(defaultPreset);

export const presetBuilderAtom = atomWithStorage<RegistryPreset>(
  "rlz-preset-builder",
  initialPreset
);

export const resetPresetAtom = atom(null, (_get, set) => {
  set(presetBuilderAtom, structuredClone(initialPreset));
});
