import { atom } from "jotai";
import {
  componentEditsAtom,
  presetBuilderAtom,
  ensurePresetIdAtom,
  resetPresetAtom,
} from "./preset-builder";
import { styleGroupsAtom } from "./style-group-state";
import { animationSettingsAtom } from "./animation-state";
import type { CreatorDraftContent } from "../lib/creator-draft";

export const creatorDraftContentAtom = atom(
  (get): CreatorDraftContent => ({
    preset: get(presetBuilderAtom),
    edits: get(componentEditsAtom),
    groups: get(styleGroupsAtom),
    animationSettings: get(animationSettingsAtom),
  })
);
export const restoreCreatorDraftAtom = atom(
  null,
  (_get, set, content: CreatorDraftContent) => {
    set(resetPresetAtom);
    set(presetBuilderAtom, content.preset);
    set(componentEditsAtom, content.edits);
    set(styleGroupsAtom, content.groups);
    set(animationSettingsAtom, content.animationSettings);
    set(ensurePresetIdAtom);
  }
);
export type DraftSaveStatus =
  | { state: "empty" | "saving" }
  | { state: "saved"; updatedAt: number }
  | { state: "error"; message: string };
export const draftSaveStatusAtom = atom<DraftSaveStatus>({ state: "empty" });
