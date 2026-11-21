"use client";

import { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import type { CreatorAnimation } from "../lib/animation-model";
import { updatePartAnimationAtom } from "../state/animation-actions";
import {
  animationPhaseAtom,
  animationSettingKey,
  animationSettingsAtom,
} from "../state/animation-state";
import { animationStudioOpenAtom } from "../state/animation-panel-state";
import { classEditorRequestAtom } from "../state/class-editor-state";
import { useAnimationPart } from "./use-animation-part";

export function usePresetWorkspace() {
  const { slug, partName, selectedPart } = useAnimationPart();
  const [studioOpen, setStudioOpen] = useAtom(animationStudioOpenAtom);
  const [classRequest, setClassRequest] = useAtom(classEditorRequestAtom);
  const [phase, setPhase] = useAtom(animationPhaseAtom);
  const settings = useAtomValue(animationSettingsAtom);
  const updateAnimation = useSetAtom(updatePartAnimationAtom);
  const [applyError, setApplyError] = useState("");

  const closeStudio = () => {
    setApplyError("");
    setStudioOpen(false);
  };
  const closeClasses = () => setClassRequest(null);

  // Class editing takes priority when opened from a properties field.
  const activeTab = classRequest
    ? "classes"
    : studioOpen
    ? "animation"
    : "selected";

  function changeTab(next: unknown) {
    switch (next) {
      case "selected":
        closeClasses();
        closeStudio();
        break;
      case "animation":
        closeClasses();
        setStudioOpen(true);
        break;
      case "classes":
        closeStudio();
        break;
    }
  }

  function applyAnimation(animation: CreatorAnimation) {
    try {
      if (!slug)
        throw new Error("Select a component before applying an animation.");
      if (!selectedPart)
        throw new Error("This component has no editable parts.");

      updateAnimation({
        slug,
        part: selectedPart.name,
        phase,
        mode: "custom",
        animation,
      });
      closeStudio();
    } catch (error) {
      setApplyError(
        error instanceof Error ? error.message : "Unable to apply animation."
      );
    }
  }

  return {
    activeTab,
    changeTab,
    studioOpen,
    classRequest,
    closeStudio,
    closeClasses,
    phase,
    setPhase,
    applyError,
    applyAnimation,
    studioKey: `${slug}:${partName}:${phase}:${studioOpen}`,
    animation: settings[animationSettingKey(slug, partName, phase)]?.animation,
  };
}
