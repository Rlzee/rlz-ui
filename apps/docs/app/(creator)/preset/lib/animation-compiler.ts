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
 * Conservative compiler: emits utilities only for shapes supported exactly by
 * the project's animate-in/animate-out + fade-in-0/fade-out-0 utilities.
 * Complex transforms, partial tracks and per-property easings use keyframes.
 *
 * The caller owns the selected component part and applies the returned classes
 * using the existing class-patch mechanism. This module does not edit presets.
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
    if (
      easing === "linear" ||
      easing === "ease-in" ||
      easing === "ease-out" ||
      easing === "ease-in-out"
    ) {
      classes.push(`${prefix}${easing === "linear" ? "ease-linear" : easing}`);
    } else {
      classes.push(`${prefix}ease-[${easing.replace(/\s+/g, "")}]`);
    }
    return { kind: "utilities", classes };
  }

  // Property tracks can have different keyframe times and easings. Sampling
  // through valueAt preserves the Studio's per-track interpolation behavior.
  const samples = Math.min(300, Math.max(60, Math.ceil(duration / 8)));
  const offsets = new Set<number>([0, 1]);
  for (let i = 0; i <= samples; i++) offsets.add(i / samples);
  for (const frame of animation.keyframes) offsets.add(frame.offset);

  const keyframes: PresetAnimation["keyframes"] = {};
  for (const offset of [...offsets].sort((a, b) => a - b)) {
    const at = (offset * 100).toFixed(5).replace(/0+$/, "").replace(/\.$/, "");
    const get = (property: AnimationProperty) =>
      formatNumber(valueAt(animation.keyframes, property, offset, easing));
    keyframes[`${at}%`] = {
      opacity: get("opacity"),
      transform: `translate(${get("x")}px, ${get("y")}px) scale(${get(
        "scale"
      )}) rotate(${get("rotate")}deg)`,
    };
  }

  // The Studio's preview uses sampled interpolation. Linear playback avoids
  // applying the easing twice to these already-eased samples.
  const animationValue = `${normalizedName} ${duration}ms linear ${delay}ms both`;
  return {
    kind: "keyframes",
    name: normalizedName,
    classes: [`${prefix}animate-${normalizedName}`],
    animation: { value: animationValue, keyframes },
  };
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
