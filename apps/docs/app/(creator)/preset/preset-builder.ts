import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { defaultPreset } from "@rlz/ui/styles/presets";
import type { RegistryPreset } from "@rlz/registry";

// Registry key for a fresh draft, so a created preset never collides with the
// built-in "default" one.
function createPresetId() {
  return `preset-${crypto.randomUUID().split("-")[0]}`;
}

// Starting name of a draft, instead of the inherited "default".
const DRAFT_NAME = "United";

function createDraftPreset(): RegistryPreset {
  return {
    ...structuredClone(defaultPreset),
    id: createPresetId(),
    name: DRAFT_NAME,
  };
}

export const presetBuilderAtom = atomWithStorage<RegistryPreset>(
  "rlz-preset-builder",
  createDraftPreset()
);

// Completes drafts stored before the generated key existed, so arriving on the
// creator always ends up with a real id. The name is left alone: it is user
// editable, so only Reset gives it a fresh "United".
export const ensurePresetIdAtom = atom(null, (get, set) => {
  const preset = get(presetBuilderAtom);

  if (!preset.id || preset.id === defaultPreset.id) {
    set(presetBuilderAtom, { ...preset, id: createPresetId() });
  }
});

export const resetPresetAtom = atom(null, (_get, set) => {
  set(presetBuilderAtom, createDraftPreset());
});
