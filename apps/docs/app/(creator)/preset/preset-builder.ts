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
  if (!preset.id || preset.id === defaultPreset.id) {
    set(presetBuilderAtom, { ...preset, id: createPresetId() });
  }
});

export const componentEditsAtom = atomWithStorage<
  Record<string, PresetComponentCustomization>
>("rlz-component-edits", {});

/** Reset the preset, component overrides, editable animations and Studio UI together. */
export const resetPresetAtom = atom(null, (_get, set) => {
  set(presetBuilderAtom, createDraftPreset());
  set(componentEditsAtom, {});
  set(animationSettingsAtom, {});
  set(animationPartAtom, "");
  set(animationPhaseAtom, "enter");
  set(animationStudioOpenAtom, false);
});

export const resetSectionAtom = atom(
  null,
  (get, set, section: PresetSection) => {
    const preset = get(presetBuilderAtom);
    const shipped = structuredClone(defaultPreset);

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

/** Reset a single component, including its saved editable animations. */
export const resetComponentEditsAtom = atom(null, (get, set, slug: string) => {
  const edits = get(componentEditsAtom);
  if (edits[slug]) {
    const rest = { ...edits };
    delete rest[slug];
    set(componentEditsAtom, rest);
  }

  const settings = get(animationSettingsAtom);
  const remaining = Object.fromEntries(
    Object.entries(settings).filter(([key]) => {
      try {
        const parsed: unknown = JSON.parse(key);
        return !Array.isArray(parsed) || parsed[0] !== slug;
      } catch {
        return true;
      }
    })
  );
  if (Object.keys(remaining).length !== Object.keys(settings).length) {
    set(animationSettingsAtom, remaining);
  }

  // Only remove generated keyframes belonging to this component.
  const preset = get(presetBuilderAtom);
  const existingAnimations = preset.base.animations;
  if (existingAnimations) {
    const animations = { ...existingAnimations };
    let changed = false;
    for (const key of Object.keys(animations)) {
      if (key.startsWith(`creator-${slug}-`)) {
        delete animations[key];
        changed = true;
      }
    }
    if (changed) {
      set(presetBuilderAtom, {
        ...preset,
        base: {
          ...preset.base,
          animations: Object.keys(animations).length ? animations : undefined,
        },
      });
    }
  }
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
