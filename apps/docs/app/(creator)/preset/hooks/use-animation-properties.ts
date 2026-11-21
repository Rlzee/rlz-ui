"use client";

import { useAtomValue, useSetAtom } from "jotai";
import type { AnimationPhase } from "../lib/animation-compiler";
import type { AnimationMode, CreatorAnimation } from "../lib/animation-model";
import { updatePartAnimationAtom } from "../state/animation-actions";
import {
  animationLibraryAtom,
  animationPhaseAtom,
  animationSettingKey,
  animationSettingsAtom,
} from "../state/animation-state";
import { animationStudioOpenAtom } from "../state/animation-panel-state";
import { useAnimationPart } from "./use-animation-part";

export function useAnimationProperties() {
  const { slug, parts, selectedPart, setPartName } = useAnimationPart();
  const settings = useAtomValue(animationSettingsAtom);
  const library = useAtomValue(animationLibraryAtom);
  const setStudioOpen = useSetAtom(animationStudioOpenAtom);
  const setPhase = useSetAtom(animationPhaseAtom);
  const updateAnimation = useSetAtom(updatePartAnimationAtom);

  function openStudio(part: string, phase: AnimationPhase) {
    setPartName(part);
    setPhase(phase);
    setStudioOpen(true);
  }

  function applyMode(
    part: string,
    phase: AnimationPhase,
    mode: AnimationMode,
    animation?: CreatorAnimation
  ) {
    const existing = settings[animationSettingKey(slug, part, phase)];
    const selectedAnimation = animation ?? existing?.animation;
    if (mode === "custom" && !selectedAnimation) {
      openStudio(part, phase);
      return;
    }
    updateAnimation({
      slug,
      part,
      phase,
      mode,
      animation: selectedAnimation,
    });
  }

  return {
    slug,
    parts,
    selectedPart,
    setPartName,
    settings,
    library,
    openStudio,
    applyMode,
  };
}
