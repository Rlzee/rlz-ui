import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { defaultPreset } from "@rlz/ui/styles/presets";
import type { PresetSection } from "@/lib/docs";
import type { PresetComponentCustomization, RegistryPreset } from "@rlz/registry";

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

// Per-component Creator edits (chosen variants/sizes, style overrides), keyed
// by registry component id. Persisted like the draft preset so edits survive a
// reload, and stamped into `preset.components` on export (see preset-dialog).
export const componentEditsAtom = atomWithStorage<
  Record<string, PresetComponentCustomization>
>("rlz-component-edits", {});

export const resetPresetAtom = atom(null, (_get, set) => {
  set(presetBuilderAtom, createDraftPreset());
  // A fresh draft also drops per-component Creator edits, so Reset is total.
  set(componentEditsAtom, {});
});

/**
 * Puts ONE Foundation entry back to what the design system ships and leaves every
 * other part of the draft alone - the counterpart of `resetPresetAtom`, which
 * discards everything. `info` owns only the draft's own words: the registry
 * coordinates stay where they are, the same rule the disabled fields and the JSON
 * dialog follow through `keepIdentity`.
 */
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
        // Radius, letter spacing, spacing and the shared utility rewrites.
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

/**
 * Drops the Creator edits of ONE component (variants, styles, part classes) so its
 * properties go back to the built-in ones. Sibling components keep theirs.
 */
export const resetComponentEditsAtom = atom(null, (get, set, slug: string) => {
  const edits = get(componentEditsAtom);

  if (!edits[slug]) return;

  const rest = { ...edits };
  delete rest[slug];
  set(componentEditsAtom, rest);
});

// Merges a patch for one component without clobbering the other axes (props vs
// styles vs variant lists vs part classes), and without touching sibling components.
export const setComponentEditAtom = atom(
  null,
  (
    get,
    set,
    slug: string,
    patch: PresetComponentCustomization
  ) => {
    const edits = get(componentEditsAtom);
    const current = edits[slug] ?? {};

    const partClasses = { ...current.partClasses, ...patch.partClasses };

    // A part written back to its built-in classes carries no override anymore, so
    // it leaves the preset entirely rather than storing a copy of the design system.
    for (const part of Object.keys(partClasses)) {
      if (partClasses[part] === undefined) delete partClasses[part];
    }

    set(componentEditsAtom, {
      ...edits,
      [slug]: {
        props: { ...current.props, ...patch.props },
        styles: { ...current.styles, ...patch.styles },
        variants: { ...current.variants, ...patch.variants },
        partClasses: Object.keys(partClasses).length > 0 ? partClasses : undefined,
      },
    });
  }
);
