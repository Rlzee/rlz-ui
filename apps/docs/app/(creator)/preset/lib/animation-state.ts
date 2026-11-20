import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { CreatorAnimation } from "../components/animation-studio/model";
import type { AnimationPhase } from "./animation-compiler";

export type AnimationMode = "default" | "none" | "custom";
export type SavedAnimation = {
  mode: AnimationMode;
  animation?: CreatorAnimation;
};
export type AnimationSettings = Record<string, SavedAnimation>;

export const animationSettingsAtom = atomWithStorage<AnimationSettings>(
  "rlz-creator-animation-settings",
  {}
);

export function animationSettingKey(
  slug: string,
  part: string,
  phase: AnimationPhase
) {
  return JSON.stringify([slug, part, phase]);
}

/** The requested target for the next Studio session. */
export const animationPhaseAtom = atom<AnimationPhase>("enter");
