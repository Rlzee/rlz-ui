import type { PresetAnimation } from "@rlz/registry";
import {
  ANIMATION_PROPERTIES,
  NEUTRAL,
  propertyFrames,
  valueAt,
  type AnimationProperty,
  type CreatorAnimation,
} from "../components/animation-studio/model";

export type AnimationPhase = "enter" | "exit";

export type CompiledAnimation =
  | { kind: "utilities"; classes: string[] }
  | {
      kind: "keyframes";
      name: string;
      classes: string[];
      animation: PresetAnimation;
    };

/**
 * Compile Studio animations into Tailwind utilities when possible, otherwise
 * compact CSS keyframes. Only independent easing/timing tracks need sampling.
 */
export function compileCreatorAnimation(
  animation: CreatorAnimation,
  phase: AnimationPhase,
  name = animation.id
): CompiledAnimation {
  const normalizedName = normalizeAnimationName(name);
  const duration = positiveDuration(animation.duration);
  const delay = nonnegativeDelay(animation.delay);
  const easing = cssEasing(animation.easing);
  const prefix = phase === "enter" ? "data-open:" : "data-ending-style:";

  if (canUseFadeUtilities(animation, phase)) {
    const direction = phase === "enter" ? "in" : "out";
    const classes = [
      `${prefix}animate-${direction}`,
      `${prefix}fade-${direction}-0`,
      `${prefix}duration-[${duration}ms]`,
    ];
    if (delay) classes.push(`${prefix}delay-[${delay}ms]`);
    if (["linear", "ease-in", "ease-out", "ease-in-out"].includes(easing)) {
      classes.push(`${prefix}${easing === "linear" ? "ease-linear" : easing}`);
    } else {
      classes.push(`${prefix}ease-[${easing.replace(/\s+/g, "")}]`);
    }
    return { kind: "utilities", classes };
  }

  const compact = compactKeyframes(animation, easing);
  const keyframes = compact ?? sampledKeyframes(animation, duration, easing);
  const animationValue = `${normalizedName} ${duration}ms ${
    compact ? easing : "linear"
  } ${delay}ms both`;

  return {
    kind: "keyframes",
    name: normalizedName,
    classes: [`${prefix}animate-${normalizedName}`],
    animation: { value: animationValue, keyframes },
  };
}

/**
 * CSS can interpolate every property natively when all changing tracks have
 * the same offsets and the same easing for each segment. A track with only
 * one value is constant, and a missing track is neutral.
 *
 * Preserve explicit offsets rather than manufacturing intermediate frames.
 * Segment-specific easing is encoded in the starting keyframe using the CSS
 * animation-timing-function property.
 */
function compactKeyframes(
  animation: CreatorAnimation,
  defaultEasing: string
): PresetAnimation["keyframes"] | null {
  const tracks = ANIMATION_PROPERTIES.map((property) => ({
    property,
    frames: propertyFrames(animation.keyframes, property),
  }));
  const changing = tracks.filter(
    ({ frames, property }) =>
      frames.length > 1 &&
      frames.some((frame) => frame[property] !== frames[0][property])
  );

  // A single-keyed property is constant in the Studio's interpolation model.
  // Different offsets are harmless for constant tracks, but changing tracks
  // must share offsets to avoid altering their independent timing.
  const reference = changing[0]?.frames.map((frame) => frame.offset) ?? [0, 1];
  if (
    changing.some(
      ({ frames }) =>
        frames.length !== reference.length ||
        frames.some((frame, i) => frame.offset !== reference[i])
    )
  )
    return null;

  const offsets = [...new Set([0, 1, ...reference])].sort((a, b) => a - b);
  const segmentEasings: string[] = [];
  for (let i = 0; i < offsets.length - 1; i++) {
    const start = offsets[i];
    const end = offsets[i + 1];
    const easings = new Set<string>();
    for (const { property, frames } of changing) {
      const first = frames[0];
      const last = frames[frames.length - 1];
      if (start < first.offset || end > last.offset) continue;
      const startFrame = frames.find((frame) => frame.offset === start);
      if (!startFrame) return null;
      easings.add(cssEasing(startFrame.easing?.[property] ?? defaultEasing));
    }
    if (easings.size > 1) return null;
    segmentEasings.push([...easings][0] ?? defaultEasing);
  }

  const result: PresetAnimation["keyframes"] = {};
  for (let i = 0; i < offsets.length; i++) {
    const offset = offsets[i];
    const get = (property: AnimationProperty) =>
      formatNumber(valueAt(animation.keyframes, property, offset, "linear"));
    const frame: Record<string, string> = {
      opacity: get("opacity"),
      transform: `translate(${get("x")}px, ${get("y")}px) scale(${get(
        "scale"
      )}) rotate(${get("rotate")}deg)`,
    };
    if (i < segmentEasings.length && segmentEasings[i] !== defaultEasing) {
      frame["animation-timing-function"] = segmentEasings[i];
    }
    result[`${formatNumber(offset * 100)}%`] = frame;
  }
  return result;
}

/** Fallback for independently timed or eased tracks. */
function sampledKeyframes(
  animation: CreatorAnimation,
  duration: number,
  easing: string
): PresetAnimation["keyframes"] {
  const samples = Math.min(300, Math.max(60, Math.ceil(duration / 8)));
  const offsets = new Set<number>([0, 1]);
  for (let i = 0; i <= samples; i++) offsets.add(i / samples);
  for (const frame of animation.keyframes) offsets.add(frame.offset);

  const result: PresetAnimation["keyframes"] = {};
  for (const offset of [...offsets].sort((a, b) => a - b)) {
    const get = (property: AnimationProperty) =>
      formatNumber(valueAt(animation.keyframes, property, offset, easing));
    result[`${formatNumber(offset * 100)}%`] = {
      opacity: get("opacity"),
      transform: `translate(${get("x")}px, ${get("y")}px) scale(${get(
        "scale"
      )}) rotate(${get("rotate")}deg)`,
    };
  }
  return result;
}

function canUseFadeUtilities(
  animation: CreatorAnimation,
  phase: AnimationPhase
): boolean {
  if (!animation.keyframes.length) return false;
  const opacity = propertyFrames(animation.keyframes, "opacity");
  if (
    opacity.length !== 2 ||
    opacity[0].offset !== 0 ||
    opacity[1].offset !== 1
  )
    return false;
  if (
    opacity[0].easing?.opacity &&
    opacity[0].easing.opacity !== animation.easing
  )
    return false;
  if (opacity[0].opacity !== (phase === "enter" ? 0 : 1)) return false;
  if (opacity[1].opacity !== (phase === "enter" ? 1 : 0)) return false;
  for (const property of ANIMATION_PROPERTIES) {
    if (property === "opacity") continue;
    for (const frame of propertyFrames(animation.keyframes, property)) {
      if (frame[property] !== NEUTRAL[property]) return false;
    }
  }
  return true;
}

function normalizeAnimationName(raw: string): string {
  const name = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return /^[a-z][a-z0-9-]*$/.test(name)
    ? name
    : `creator-${name || "animation"}`;
}
function positiveDuration(value: number): number {
  return Number.isFinite(value) ? Math.max(1, Math.round(value)) : 300;
}
function nonnegativeDelay(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}
function cssEasing(value: string): string {
  const easing = value.trim();
  if (["linear", "ease", "ease-in", "ease-out", "ease-in-out"].includes(easing))
    return easing;
  if (
    /^cubic-bezier\(\s*(?:-?\d*\.?\d+\s*,\s*){3}-?\d*\.?\d+\s*\)$/.test(easing)
  )
    return easing;
  return "linear";
}
function formatNumber(value: number): string {
  return String(Number(value.toFixed(6)));
}
