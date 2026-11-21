import type { AnimationPhase } from "./animation-compiler";

/** Prefer the animated popup/content when the saved part no longer exists. */
export function resolveAnimationPart<T extends { name: string }>(
  parts: readonly T[],
  partName: string
): T | undefined {
  return (
    parts.find((part) => part.name === partName) ??
    parts.find((part) => /popup|content/i.test(part.name)) ??
    parts[0]
  );
}

export function hasNativeAnimation(
  classes: string | undefined,
  phase: AnimationPhase
) {
  const prefix = phase === "enter" ? "data-open:" : "data-ending-style:";
  return (classes ?? "").split(/\s+/).some((token) => {
    if (!token.startsWith(prefix)) return false;
    return /^(?:animate(?:-.+)?|fade-(?:in|out)(?:-.+)?|zoom-(?:in|out)(?:-.+)?|slide-(?:in|out)(?:-.+)?|spin-(?:in|out)(?:-.+)?)$/.test(
      token.slice(prefix.length)
    );
  });
}
