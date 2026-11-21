import { atom } from "jotai";
import { setPartAnimation } from "../lib/animation-apply";
import type { AnimationPhase } from "../lib/animation-compiler";
import type { AnimationMode, CreatorAnimation } from "../lib/animation-model";
import { animationSettingKey, animationSettingsAtom } from "./animation-state";
import {
  componentEditsAtom,
  presetBuilderAtom,
  setComponentEditAtom,
} from "./preset-builder";

type PartAnimationUpdate = {
  slug: string;
  part: string;
  phase: AnimationPhase;
  mode: AnimationMode;
  animation?: CreatorAnimation;
};

/** Keep the CSS, edited classes and saved animation settings in sync. */
export const updatePartAnimationAtom = atom(
  null,
  (get, set, update: PartAnimationUpdate) => {
    const { slug, part, phase, mode, animation } = update;
    const edits = get(componentEditsAtom);
    const result = setPartAnimation(
      get(presetBuilderAtom),
      edits[slug],
      slug,
      part,
      phase,
      mode,
      animation,
      edits
    );

    set(presetBuilderAtom, result.preset);
    set(setComponentEditAtom, slug, {
      partClasses: { [part]: result.partClasses },
    });
    set(animationSettingsAtom, (previous) => ({
      ...previous,
      [animationSettingKey(slug, part, phase)]: {
        mode,
        animation: animation ? structuredClone(animation) : undefined,
      },
    }));
  }
);
