import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { defaultPreset } from "@rlz/ui/styles/presets";
import type { PresetSection } from "@/lib/docs";
import type {
  PresetComponentCustomization,
  RegistryPreset,
} from "@rlz/registry";
import {
  animationSettingsAtom,
  animationPhaseAtom,
} from "./lib/animation-state";
import { pruneUnusedCreatorAnimations } from "./lib/animation-apply";
import { classEditorRequestAtom } from "./lib/class-editor-state";
import {
  animationPartAtom,
  animationStudioOpenAtom,
} from "./components/animation-studio/panel-state";

function createPresetId() {
  return `preset-${crypto.randomUUID().split("-")[0]}`;
}
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
export const ensurePresetIdAtom = atom(null, (get, set) => {
  const preset = get(presetBuilderAtom);
  if (!preset.id || preset.id === defaultPreset.id)
    set(presetBuilderAtom, { ...preset, id: createPresetId() });
});
export const componentEditsAtom = atomWithStorage<
  Record<string, PresetComponentCustomization>
>("rlz-component-edits", {});

export const resetPresetAtom = atom(null, (_get, set) => {
  set(presetBuilderAtom, createDraftPreset());
  set(componentEditsAtom, {});
  set(animationSettingsAtom, {});
  set(animationPartAtom, "");
  set(animationPhaseAtom, "enter");
  set(animationStudioOpenAtom, false);
  set(classEditorRequestAtom, null);
});

export const resetSectionAtom = atom(
  null,
  (get, set, section: PresetSection) => {
    const preset = get(presetBuilderAtom);
    const shipped = structuredClone(defaultPreset);
    set(classEditorRequestAtom, null);
    switch (section) {
      case "info":
        set(presetBuilderAtom, {
          ...preset,
          name: DRAFT_NAME,
          description: defaultPreset.description,
        });
        break;
      case "base":
        set(presetBuilderAtom, { ...preset, base: shipped.base });
        break;
      case "colors":
        set(presetBuilderAtom, { ...preset, colors: shipped.colors });
        break;
      case "recommendations":
        set(presetBuilderAtom, {
          ...preset,
          recommendations: shipped.recommendations,
        });
        break;
    }
  }
);

export const resetComponentEditsAtom = atom(null, (get, set, slug: string) => {
  set(classEditorRequestAtom, null);
  const edits = get(componentEditsAtom);
  const remainingEdits = { ...edits };
  delete remainingEdits[slug];
  set(componentEditsAtom, remainingEdits);
  const settings = get(animationSettingsAtom);
  const remainingSettings = Object.fromEntries(
    Object.entries(settings).filter(([key]) => {
      try {
        const parsed: unknown = JSON.parse(key);
        return !Array.isArray(parsed) || parsed[0] !== slug;
      } catch {
        return true;
      }
    })
  );
  set(animationSettingsAtom, remainingSettings);
  set(
    presetBuilderAtom,
    pruneUnusedCreatorAnimations(get(presetBuilderAtom), remainingEdits)
  );
});

export const setComponentEditAtom = atom(
  null,
  (get, set, slug: string, patch: PresetComponentCustomization) => {
    const edits = get(componentEditsAtom);
    const current = edits[slug] ?? {};
    const partClasses = { ...current.partClasses, ...patch.partClasses };
    for (const part of Object.keys(partClasses)) {
      if (partClasses[part] === undefined) delete partClasses[part];
    }
    set(componentEditsAtom, {
      ...edits,
      [slug]: {
        props: { ...current.props, ...patch.props },
        variants: { ...current.variants, ...patch.variants },
        partClasses:
          Object.keys(partClasses).length > 0 ? partClasses : undefined,
      },
    });
  }
);
