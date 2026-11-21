"use client";

import { useState } from "react";
import {
  moveProperty,
  normalizedOffset,
  removeProperty,
  setSegmentEasing,
  upsertProperty,
  valueAt,
  type AnimationProperty,
  type CreatorAnimation,
} from "../lib/animation-model";
import {
  insertInterpolatedKeyframe,
  nextKeyframeOffset,
} from "../lib/animation-keyframes";

export type AnimationInspectorTab = "animation" | "keyframe" | "easing";

/** A studio session owns its draft; changing component/part remounts the studio. */
export function useAnimationDraft(value: CreatorAnimation) {
  const [draft, setDraft] = useState(() => structuredClone(value));
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [activeProperty, setActiveProperty] =
    useState<AnimationProperty | null>(null);
  const [inspector, setInspector] =
    useState<AnimationInspectorTab>("animation");
  const [progress, setProgress] = useState(0);
  const [seekRequest, setSeekRequest] = useState({ value: 0, id: 0 });
  const [segmentProperty, setSegmentProperty] =
    useState<AnimationProperty>("scale");
  const [segmentStart, setSegmentStart] = useState(0);

  function seekTimeline(next: number) {
    setProgress(next);
    setSeekRequest((previous) => ({ value: next, id: previous.id + 1 }));
  }

  function setField<K extends keyof CreatorAnimation>(
    key: K,
    next: CreatorAnimation[K]
  ) {
    setDraft((previous) => ({ ...previous, [key]: next }));
  }

  function selectKeyframe(offset: number, property: AnimationProperty | null) {
    setSelectedOffset(offset);
    setActiveProperty(property);
    setInspector("keyframe");
  }

  function selectProperty(property: AnimationProperty | null) {
    setActiveProperty(property);
    setInspector("keyframe");
  }

  function setKeyframe(property: AnimationProperty, next: number) {
    setDraft((previous) => ({
      ...previous,
      keyframes: upsertProperty(
        previous.keyframes,
        property,
        selectedOffset,
        next
      ),
    }));
  }

  function addPropertyKeyframe(property: AnimationProperty, offset: number) {
    const at = normalizedOffset(offset);
    setDraft((previous) => ({
      ...previous,
      keyframes: upsertProperty(
        previous.keyframes,
        property,
        at,
        valueAt(previous.keyframes, property, at, previous.easing)
      ),
    }));
    selectKeyframe(at, property);
  }

  function moveKeyframe(property: AnimationProperty, from: number, to: number) {
    const at = normalizedOffset(to);
    if (from === at || at === 0 || at === 1) return;
    if (
      draft.keyframes.some(
        (frame) => frame.offset === at && frame[property] !== undefined
      )
    )
      return;
    setDraft((previous) => ({
      ...previous,
      keyframes: moveProperty(previous.keyframes, property, from, at),
    }));
    setSelectedOffset(at);
  }

  function addKeyframe() {
    const at = nextKeyframeOffset(draft.keyframes);
    if (at === undefined) return;
    setDraft((previous) => ({
      ...previous,
      keyframes: insertInterpolatedKeyframe(previous, at),
    }));
    selectKeyframe(at, null);
  }

  function removeSelected() {
    if (activeProperty) {
      setDraft((previous) => ({
        ...previous,
        keyframes: removeProperty(
          previous.keyframes,
          activeProperty,
          selectedOffset
        ),
      }));
    } else if (selectedOffset > 0 && selectedOffset < 1) {
      setDraft((previous) => ({
        ...previous,
        keyframes: previous.keyframes.filter(
          (frame) => frame.offset !== selectedOffset
        ),
      }));
      setSelectedOffset(0);
    }
  }

  function updateSegmentEasing(
    property: AnimationProperty,
    offset: number,
    easing: string | undefined
  ) {
    setDraft((previous) => ({
      ...previous,
      keyframes: setSegmentEasing(previous.keyframes, property, offset, easing),
    }));
  }

  return {
    draft,
    setField,
    selectedOffset,
    activeProperty,
    setActiveProperty,
    inspector,
    setInspector,
    progress,
    setProgress,
    seekRequest,
    seekTimeline,
    selectKeyframe,
    selectProperty,
    setKeyframe,
    addPropertyKeyframe,
    moveKeyframe,
    addKeyframe,
    removeSelected,
    updateSegmentEasing,
    segmentProperty,
    setSegmentProperty,
    segmentStart,
    setSegmentStart,
  };
}

export type AnimationDraft = ReturnType<typeof useAnimationDraft>;
