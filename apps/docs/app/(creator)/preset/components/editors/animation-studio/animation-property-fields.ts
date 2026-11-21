import type { AnimationProperty } from "../../../lib/animation-model";

export const ANIMATION_PROPERTY_FIELDS: {
  key: AnimationProperty;
  label: string;
  step: number;
  min?: number;
  max?: number;
}[] = [
  { key: "opacity", label: "Opacity", step: 0.05, min: 0, max: 1 },
  { key: "x", label: "Translate X (px)", step: 1 },
  { key: "y", label: "Translate Y (px)", step: 1 },
  { key: "scale", label: "Scale", step: 0.05, min: 0 },
  { key: "rotate", label: "Rotate (deg)", step: 1 },
];
