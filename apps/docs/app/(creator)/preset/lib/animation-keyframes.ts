import {
  ANIMATION_PROPERTIES,
  normalizedOffset,
  upsertProperty,
  valueAt,
  type AnimationKeyframe,
  type CreatorAnimation,
} from "./animation-model";

/** Insert in the widest gap, keeping the first gap when several are equal. */
export function nextKeyframeOffset(frames: AnimationKeyframe[]) {
  const offsets = [
    ...new Set([0, ...frames.map((frame) => frame.offset), 1]),
  ].sort((a, b) => a - b);
  let start = 0;
  let widest = 0;
  for (let index = 0; index < offsets.length - 1; index++) {
    const gap = offsets[index + 1] - offsets[index];
    if (gap > widest) {
      widest = gap;
      start = offsets[index];
    }
  }
  return widest < 0.002 ? undefined : normalizedOffset(start + widest / 2);
}

export function insertInterpolatedKeyframe(
  animation: CreatorAnimation,
  offset: number
) {
  return ANIMATION_PROPERTIES.reduce(
    (frames, property) =>
      upsertProperty(
        frames,
        property,
        offset,
        valueAt(animation.keyframes, property, offset, animation.easing)
      ),
    animation.keyframes
  );
}
