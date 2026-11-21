export type AnimationMode = "default" | "none" | "custom";

export type AnimationProperty = "opacity" | "x" | "y" | "scale" | "rotate";
export const ANIMATION_PROPERTIES: AnimationProperty[] = [
  "opacity",
  "x",
  "y",
  "scale",
  "rotate",
];
export const NEUTRAL: Record<AnimationProperty, number> = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
};

// Each offset holds only the properties explicitly keyed at that time.
export type AnimationKeyframe = {
  offset: number;
  easing?: Partial<Record<AnimationProperty, string>>;
} & Partial<Record<AnimationProperty, number>>;
export type CreatorAnimation = {
  id: string;
  name: string;
  duration: number;
  delay: number;
  easing: string;
  keyframes: AnimationKeyframe[];
};
export const DEFAULT_ANIMATION: CreatorAnimation = {
  id: "fade-scale-in",
  name: "Fade + Scale In",
  duration: 300,
  delay: 0,
  easing: "ease-out",
  keyframes: [
    { offset: 0, opacity: 0, x: 0, y: 12, scale: 0.95, rotate: 0 },
    { offset: 1, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
  ],
};
export function clampNumber(value: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;
}
export function normalizedOffset(value: number) {
  return Math.round(clampNumber(value, 0, 1) * 1000) / 1000;
}
export function sortedFrames(frames: AnimationKeyframe[]) {
  return [...frames].sort((a, b) => a.offset - b.offset);
}
export function propertyFrames(
  frames: AnimationKeyframe[],
  key: AnimationProperty
) {
  return sortedFrames(frames).filter((frame) => frame[key] !== undefined);
}
// CSS easing applied independently between each property's neighboring keys.
function easedProgress(t: number, easing: string): number {
  if (easing === "linear") return t;
  const curves: Record<string, [number, number, number, number]> = {
    ease: [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
  };
  const custom =
    /^cubic-bezier\(\s*(-?(?:\d+\.?\d*|\.\d+))\s*,\s*(-?(?:\d+\.?\d*|\.\d+))\s*,\s*(-?(?:\d+\.?\d*|\.\d+))\s*,\s*(-?(?:\d+\.?\d*|\.\d+))\s*\)$/.exec(
      easing
    );
  const curve =
    curves[easing] ??
    (custom
      ? (custom.slice(1).map(Number) as [number, number, number, number])
      : undefined);
  if (!curve || curve[0] < 0 || curve[0] > 1 || curve[2] < 0 || curve[2] > 1)
    return t;
  const [x1, y1, x2, y2] = curve;
  const bezier = (u: number, a: number, b: number) =>
    3 * (1 - u) ** 2 * u * a + 3 * (1 - u) * u ** 2 * b + u ** 3;
  let low = 0,
    high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (bezier(mid, x1, x2) < t) low = mid;
    else high = mid;
  }
  return bezier((low + high) / 2, y1, y2);
}

export function valueAt(
  frames: AnimationKeyframe[],
  key: AnimationProperty,
  offset: number,
  easing = "linear"
): number {
  const keys = propertyFrames(frames, key);
  if (!keys.length) return NEUTRAL[key];
  if (offset <= keys[0].offset) return keys[0][key]!;
  const last = keys[keys.length - 1];
  if (offset >= last.offset) return last[key]!;
  for (let i = 1; i < keys.length; i++) {
    if (offset <= keys[i].offset) {
      const a = keys[i - 1],
        b = keys[i];
      const t = (offset - a.offset) / (b.offset - a.offset);
      return (
        a[key]! +
        (b[key]! - a[key]!) * easedProgress(t, a.easing?.[key] ?? easing)
      );
    }
  }
  return last[key]!;
}
export function upsertProperty(
  frames: AnimationKeyframe[],
  key: AnimationProperty,
  offset: number,
  value: number
) {
  const at = normalizedOffset(offset);
  const existing = frames.find((frame) => frame.offset === at);
  if (existing)
    return sortedFrames(
      frames.map((frame) =>
        frame === existing ? { ...frame, [key]: value } : frame
      )
    );
  return sortedFrames([...frames, { offset: at, [key]: value }]);
}
export function removeProperty(
  frames: AnimationKeyframe[],
  key: AnimationProperty,
  offset: number
) {
  return frames
    .map((frame) => {
      if (frame.offset !== offset) return frame;
      const next = { ...frame };
      delete next[key];
      if (next.easing) {
        const easing = { ...next.easing };
        delete easing[key];
        next.easing = easing;
      }
      return next;
    })
    .filter((frame) =>
      ANIMATION_PROPERTIES.some((property) => frame[property] !== undefined)
    );
}
export function moveProperty(
  frames: AnimationKeyframe[],
  key: AnimationProperty,
  from: number,
  to: number
) {
  const source = frames.find((frame) => frame.offset === from);
  if (!source || source[key] === undefined) return frames;
  const destination = normalizedOffset(to);
  if (
    frames.some(
      (frame) =>
        frame.offset === destination &&
        frame[key] !== undefined &&
        frame !== source
    )
  )
    return frames;
  const result = upsertProperty(
    removeProperty(frames, key, from),
    key,
    destination,
    source[key]!
  );
  const segmentEasing = source.easing?.[key];
  if (!segmentEasing) return result;
  return result.map((frame) =>
    frame.offset === destination
      ? { ...frame, easing: { ...frame.easing, [key]: segmentEasing } }
      : frame
  );
}
// Sample all tracks at shared times so WAAPI interpolates the exact same
// property-specific values shown in the editor. Linear WAAPI easing avoids
// applying the animation easing a second time.
export function toWebKeyframes(animation: CreatorAnimation): Keyframe[] {
  const frames = animation.keyframes;
  const samples = Math.min(
    300,
    Math.max(60, Math.ceil(animation.duration / 8))
  );
  const offsets = new Set<number>([0, 1]);
  for (let i = 0; i <= samples; i++) offsets.add(i / samples);
  for (const frame of frames) offsets.add(frame.offset);
  return [...offsets]
    .sort((a, b) => a - b)
    .map((offset) => {
      const sample = (key: AnimationProperty) =>
        valueAt(frames, key, offset, animation.easing);
      return {
        offset,
        opacity: sample("opacity"),
        transform: `translate(${sample("x")}px, ${sample(
          "y"
        )}px) scale(${sample("scale")}) rotate(${sample("rotate")}deg)`,
      };
    });
}

/** Override the easing on the outgoing segment of a property's keyframe. */
export function setSegmentEasing(
  frames: AnimationKeyframe[],
  property: AnimationProperty,
  start: number,
  easing: string | undefined
) {
  return frames.map((frame) => {
    if (frame.offset !== start || frame[property] === undefined) return frame;
    const nextEasing = { ...frame.easing };
    if (easing) nextEasing[property] = easing;
    else delete nextEasing[property];
    return {
      ...frame,
      easing: Object.keys(nextEasing).length ? nextEasing : undefined,
    };
  });
}
