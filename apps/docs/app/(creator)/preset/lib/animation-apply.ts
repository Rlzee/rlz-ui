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

/** Use a readable name for the first owner of a custom animation. */
function nameFor(slug: string, part: string, phase: AnimationPhase) {
  return `creator-${slug}-${part}-${phase}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Compare the actual CSS animation, ignoring only its CSS identifier. */
function equivalentAnimation(
  left: { value: string; keyframes: unknown },
  right: { value: string; keyframes: unknown }
) {
  const withoutName = (value: string) => value.replace(/^\S+/, "");
  return (
    withoutName(left.value) === withoutName(right.value) &&
    JSON.stringify(left.keyframes) === JSON.stringify(right.keyframes)
  );
}

/** Find an existing preset animation so multiple parts can reference one rule. */
function existingNameFor(
  animations: NonNullable<RegistryPreset["base"]["animations"]>,
  candidate: { value: string; keyframes: unknown }
): string | undefined {
  return Object.entries(animations).find(([, value]) =>
    equivalentAnimation(value, candidate)
  )?.[0];
}

/** Remove generated keyframes only when no edited part still references them. */
export function pruneUnusedCreatorAnimations(
  preset: RegistryPreset,
  edits: Record<string, PresetComponentCustomization>
): RegistryPreset {
  if (!preset.base.animations) return preset;
  const used = new Set<string>();
  for (const edit of Object.values(edits)) {
    for (const classes of Object.values(edit.partClasses ?? {})) {
      for (const token of (classes ?? "").split(/\s+/)) {
        const match =
          /^(?:data-open:|data-ending-style:)animate-(creator-[a-z0-9-]+)$/.exec(
            token
          );
        if (match) used.add(match[1]);
      }
    }
  }
  const animations = { ...preset.base.animations };
  for (const name of Object.keys(animations)) {
    if (name.startsWith("creator-") && !used.has(name)) delete animations[name];
  }
  return {
    ...preset,
    base: {
      ...preset.base,
      animations: Object.keys(animations).length ? animations : undefined,
    },
  };
}

export function setPartAnimation(
  preset: RegistryPreset,
  currentEdit: PresetComponentCustomization | undefined,
  slug: string,
  partName: string,
  phase: AnimationPhase,
  mode: AnimationMode,
  animation?: CreatorAnimation,
  allEdits?: Record<string, PresetComponentCustomization>
): { preset: RegistryPreset; partClasses: string | undefined } {
  const part = partsOf(slug).find((item) => item.name === partName);
  if (!part) throw new Error(`Unknown animation part: ${slug}/${partName}`);
  const native = (part.classes ?? "").split(/\s+/).filter(Boolean);
  const current = (currentEdit?.partClasses?.[partName] ?? part.classes ?? "")
    .split(/\s+/)
    .filter(Boolean);
  const preserved = current.filter((token) => !isAnimationClass(token, phase));
  const animations = { ...preset.base.animations };
  const added: string[] = [];

  if (mode === "default") {
    added.push(...native.filter((token) => isAnimationClass(token, phase)));
  } else if (mode === "custom") {
    if (!animation) throw new Error("Missing custom animation");
    const preferredName = nameFor(slug, partName, phase);
    const compiled = compileCreatorAnimation(animation, phase, preferredName);
    if (compiled.kind === "keyframes") {
      const existingName = existingNameFor(animations, compiled.animation);
      // Never overwrite an existing definition: other parts may still use it.
      let actualName = existingName ?? compiled.name;
      if (!existingName && animations[actualName]) {
        let suffix = 2;
        while (animations[`${compiled.name}-${suffix}`]) suffix++;
        actualName = `${compiled.name}-${suffix}`;
      }
      added.push(
        ...compiled.classes.map((token) =>
          token.replace(`animate-${compiled.name}`, `animate-${actualName}`)
        )
      );
      if (!existingName) {
        const renamed =
          actualName === compiled.name
            ? compiled.animation
            : {
                ...compiled.animation,
                value: compiled.animation.value.replace(
                  compiled.name,
                  actualName
                ),
              };
        animations[actualName] = renamed;
      }
    } else {
      added.push(...compiled.classes);
    }
  }

  const classes = [...new Set([...preserved, ...added])].join(" ");
  const partClasses = classes === (part.classes ?? "") ? undefined : classes;
  let nextPreset: RegistryPreset = {
    ...preset,
    base: {
      ...preset.base,
      animations: Object.keys(animations).length ? animations : undefined,
    },
  };
  if (allEdits) {
    const nextEdits = {
      ...allEdits,
      [slug]: {
        ...currentEdit,
        partClasses: { ...currentEdit?.partClasses, [partName]: partClasses },
      },
    };
    nextPreset = pruneUnusedCreatorAnimations(nextPreset, nextEdits);
  }
  return { preset: nextPreset, partClasses };
}

export function applyCreatorAnimation(
  preset: RegistryPreset,
  currentEdit: PresetComponentCustomization | undefined,
  slug: string,
  partName: string,
  phase: AnimationPhase,
  animation: CreatorAnimation,
  allEdits?: Record<string, PresetComponentCustomization>
) {
  return setPartAnimation(
    preset,
    currentEdit,
    slug,
    partName,
    phase,
    "custom",
    animation,
    allEdits
  );
}
