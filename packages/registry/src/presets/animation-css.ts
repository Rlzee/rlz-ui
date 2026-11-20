import type { PresetBaseConfig } from "./types";

/** Shared by the Creator preview and the installer. Application stays in classes. */
export function presetAnimationsCss(
  animations: PresetBaseConfig["animations"]
): string {
  const entries = Object.entries(animations ?? {});

  if (entries.length === 0) return "";

  const theme = [
    "@theme {",
    ...entries.map(
      ([name, animation]) => `  --animate-${name}: ${animation.value};`
    ),
    "}",
  ].join("\n");

  const keyframes = entries.map(([name, animation]) => {
    const steps = Object.entries(animation.keyframes).map(
      ([selector, declarations]) =>
        [
          `  ${selector} {`,
          ...Object.entries(declarations).map(
            ([property, value]) => `    ${property}: ${value};`
          ),
          "  }",
        ].join("\n")
    );

    return `@keyframes ${name} {\n${steps.join("\n\n")}\n}`;
  });

  return [theme, ...keyframes].join("\n\n");
}
