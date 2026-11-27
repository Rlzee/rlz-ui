import { atom } from "jotai";
import type { AnimationMode, CreatorAnimation } from "../lib/animation-model";
import type { AnimationPhase } from "../lib/animation-compiler";

export type SavedAnimation = {
  mode: AnimationMode;
  animation?: CreatorAnimation;
};
export type AnimationSettings = Record<string, SavedAnimation>;

export const animationSettingsAtom = atom<AnimationSettings>({});

export function animationSettingKey(
  slug: string,
  part: string,
  phase: AnimationPhase
) {
  return JSON.stringify([slug, part, phase]);
}

export type LibraryAnimation = {
  key: string;
  slug: string;
  part: string;
  phase: AnimationPhase;
  animation: CreatorAnimation;
};

/** Derived from the current preset's saved animations: no server or separate library storage. */
export const animationLibraryAtom = atom((get): LibraryAnimation[] => {
  const settings = get(animationSettingsAtom);
  const library: LibraryAnimation[] = [];
  for (const [key, saved] of Object.entries(settings)) {
    if (!saved.animation) continue;
    try {
      const parsed: unknown = JSON.parse(key);
      if (!Array.isArray(parsed) || parsed.length !== 3) continue;
      const [slug, part, phase] = parsed;
      if (typeof slug !== "string" || typeof part !== "string") continue;
      if (phase !== "enter" && phase !== "exit") continue;
      library.push({ key, slug, part, phase, animation: saved.animation });
    } catch {
      /* Ignore obsolete storage entries. */
    }
  }
  return library.sort((a, b) =>
    a.animation.name.localeCompare(b.animation.name)
  );
});

export const animationPhaseAtom = atom<AnimationPhase>("enter");
