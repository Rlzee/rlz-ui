import { z } from "zod";
import {
  RegistryPresetSchema,
  PresetComponentCustomizationSchema,
  type RegistryPreset,
  type PresetComponentCustomization,
} from "@rlz/registry";
import {
  materializeLegacyGroupDraft,
  refreshLegacyGroupSuggestions,
} from "./style-group-migration";

export const CREATOR_DRAFT_KEY = "rlz-creator-draft-v1";
const legacyKeys = [
  "rlz-preset-builder",
  "rlz-component-edits",
  "rlz-style-groups",
  "rlz-creator-animation-settings",
  "rlz-appearance-overrides",
  "rlz-style-groups-batch-v1",
  "rlz-style-group-suggestions-v2",
];
const numericProperties = {
  opacity: z.number().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  scale: z.number().optional(),
  rotate: z.number().optional(),
};
const savedAnimationSchema = z.object({
  mode: z.enum(["default", "none", "custom"]),
  animation: z
    .object({
      id: z.string(),
      name: z.string(),
      duration: z.number(),
      delay: z.number(),
      easing: z.string(),
      keyframes: z.array(
        z.object({
          offset: z.number(),
          ...numericProperties,
          easing: z
            .object({
              opacity: z.string().optional(),
              x: z.string().optional(),
              y: z.string().optional(),
              scale: z.string().optional(),
              rotate: z.string().optional(),
            })
            .optional(),
        })
      ),
    })
    .optional(),
});
const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  members: z.array(z.object({ component: z.string(), part: z.string() })),
  values: z.record(z.string(), z.string()),
  classes: z.string().optional(),
  animations: z
    .object({
      enter: savedAnimationSchema.optional(),
      exit: savedAnimationSchema.optional(),
    })
    .optional(),
});
const contentSchema = z.object({
  preset: z.custom<RegistryPreset>(
    (value) => RegistryPresetSchema.safeParse(value).success
  ),
  edits: z.record(
    z.string(),
    z.custom<PresetComponentCustomization>(
      (value) => PresetComponentCustomizationSchema.safeParse(value).success
    )
  ),
  groups: z.array(groupSchema),
  animationSettings: z.record(z.string(), savedAnimationSchema),
});
const draftSchema = contentSchema.extend({
  version: z.literal(1),
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
});
export type CreatorDraftContent = z.infer<typeof contentSchema>;
export type CreatorDraft = z.infer<typeof draftSchema>;
export type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export class DraftFormatError extends Error {}
export class DraftConflictError extends Error {}

/** Identity alone does not turn an untouched session into a saved draft. */
export function draftFingerprint(content: CreatorDraftContent) {
  const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, entry]) => entry !== undefined)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, entry]) => [key, canonical(entry)])
      );
    return value;
  };
  return JSON.stringify(
    canonical({ ...content, preset: { ...content.preset, id: "" } })
  );
}

export function readLocalDraft(
  storage: DraftStorage,
  empty: CreatorDraftContent
): {
  raw: string | null;
  draft?: CreatorDraft;
} {
  const raw = storage.getItem(CREATOR_DRAFT_KEY);
  try {
    if (raw !== null) return { raw, draft: draftSchema.parse(JSON.parse(raw)) };
    const preset = storage.getItem("rlz-preset-builder");
    if (!preset) return { raw };
    const parsedPreset = RegistryPresetSchema.safeParse(JSON.parse(preset));
    if (!parsedPreset.success)
      throw new DraftFormatError("The saved preset could not be read.");
    const parsed = parsedPreset.data;
    const storedGroups = storage.getItem("rlz-style-groups");
    const content = contentSchema.parse({
      preset: parsed,
      edits: JSON.parse(
        storage.getItem("rlz-component-edits") ??
          JSON.stringify(parsed.components ?? {})
      ),
      groups: JSON.parse(storedGroups ?? JSON.stringify(empty.groups)),
      animationSettings: JSON.parse(
        storage.getItem("rlz-creator-animation-settings") ?? "{}"
      ),
    });
    if (!storage.getItem("rlz-style-groups-batch-v1")) {
      const overrides = z
        .record(
          z.string(),
          z.record(z.string(), z.record(z.string(), z.string().nullable()))
        )
        .parse(JSON.parse(storage.getItem("rlz-appearance-overrides") ?? "{}"));
      if (storedGroups || Object.keys(overrides).length)
        content.edits = materializeLegacyGroupDraft(
          storedGroups ? content.groups : [],
          content.edits,
          overrides
        );
    }
    if (!storage.getItem("rlz-style-group-suggestions-v2"))
      content.groups = refreshLegacyGroupSuggestions(content.groups);
    if (draftFingerprint(content) === draftFingerprint(empty)) return { raw };
    // Older storage has no trustworthy last-edit date.
    return {
      raw,
      draft: { version: 1, createdAt: 0, updatedAt: 0, ...content },
    };
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof z.ZodError)
      throw new DraftFormatError("The saved draft could not be read.");
    throw error;
  }
}

function checkCurrentDraft(storage: DraftStorage, expected: string | null) {
  if (storage.getItem(CREATOR_DRAFT_KEY) !== expected)
    throw new DraftConflictError(
      "Another tab changed the local draft. Reload this page to resume the latest version, or export your current work."
    );
}
function removeLegacyDraft(storage: DraftStorage) {
  for (const key of legacyKeys) storage.removeItem(key);
}
export function writeLocalDraft(
  storage: DraftStorage,
  draft: CreatorDraft,
  expected: string | null
) {
  checkCurrentDraft(storage, expected);
  const raw = JSON.stringify(draft);
  storage.setItem(CREATOR_DRAFT_KEY, raw);
  // Only remove old storage once the complete new snapshot has been written.
  removeLegacyDraft(storage);
  return raw;
}
export function clearLocalDraft(
  storage: DraftStorage,
  expected: string | null
) {
  checkCurrentDraft(storage, expected);
  // Remove legacy entries first so a failure cannot resurrect them on reload.
  removeLegacyDraft(storage);
  storage.removeItem(CREATOR_DRAFT_KEY);
}
