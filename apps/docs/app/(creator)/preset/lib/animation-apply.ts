import type {
  PresetComponentCustomization,
  RegistryPreset,
} from "@rlz/registry";
import { partsOf } from "@rlz/ui/registry/resolve-capabilities";
import {
  compileCreatorAnimation,
  type AnimationPhase,
} from "./animation-compiler";
import type { CreatorAnimation } from "../components/animation-studio/model";
import type { AnimationMode } from "./animation-state";

const prefixOf = (phase: AnimationPhase) =>
  phase === "enter" ? "data-open:" : "data-ending-style:";

function isAnimationClass(token: string, phase: AnimationPhase) {
  const prefix = prefixOf(phase);
  if (!token.startsWith(prefix)) return false;
  const utility = token.slice(prefix.length);
  return /^(?:animate(?:-.+)?|fade-(?:in|out)(?:-.+)?|zoom-(?:in|out)(?:-.+)?|slide-(?:in|out)(?:-.+)?|spin-(?:in|out)(?:-.+)?|duration-.+|delay-.+|ease-.+|fill-mode-.+|direction-.+|repeat-.+)$/.test(
    utility
  );
}

function nameFor(slug: string, part: string, phase: AnimationPhase) {
  return `creator-${slug}-${part}-${phase}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Changes one phase on one part. The other phase and unrelated classes survive. */
export function setPartAnimation(
  preset: RegistryPreset,
  currentEdit: PresetComponentCustomization | undefined,
  slug: string,
  partName: string,
  phase: AnimationPhase,
  mode: AnimationMode,
  animation?: CreatorAnimation
): { preset: RegistryPreset; partClasses: string | undefined } {
  const part = partsOf(slug).find((item) => item.name === partName);
  if (!part) throw new Error(`Unknown animation part: ${slug}/${partName}`);
  const native = (part.classes ?? "").split(/\s+/).filter(Boolean);
  const current = (currentEdit?.partClasses?.[partName] ?? part.classes ?? "")
    .split(/\s+/)
    .filter(Boolean);
  const preserved = current.filter((token) => !isAnimationClass(token, phase));
  const generatedName = nameFor(slug, partName, phase);
  const animations = { ...preset.base.animations };
  delete animations[generatedName];
  let added: string[] = [];

  if (mode === "default") {
    added = native.filter((token) => isAnimationClass(token, phase));
  } else if (mode === "custom") {
    if (!animation) throw new Error("Missing custom animation");
    const compiled = compileCreatorAnimation(animation, phase, generatedName);
    added = compiled.classes;
    if (compiled.kind === "keyframes")
      animations[compiled.name] = compiled.animation;
  }

  const partClasses = [...new Set([...preserved, ...added])].join(" ");
  return {
    preset: {
      ...preset,
      base: {
        ...preset.base,
        animations: Object.keys(animations).length ? animations : undefined,
      },
    },
    partClasses: partClasses === (part.classes ?? "") ? undefined : partClasses,
  };
}

export function applyCreatorAnimation(
  preset: RegistryPreset,
  currentEdit: PresetComponentCustomization | undefined,
  slug: string,
  partName: string,
  phase: AnimationPhase,
  animation: CreatorAnimation
) {
  return setPartAnimation(
    preset,
    currentEdit,
    slug,
    partName,
    phase,
    "custom",
    animation
  );
}
