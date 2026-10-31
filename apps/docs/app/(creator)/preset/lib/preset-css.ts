import type { RegistryPreset } from "@rlz/registry";

import { designSystemUtilities } from "@rlz/ui/styles/utilities";

import { fontFamily, safe } from "./preset-styles";

/**
 * The stylesheet a consuming app ends up with: the design system reads every
 * color, radius and spacing through a custom property, so a preset is applied by
 * writing its values into the ones the app already declares - light values under
 * `:root`, dark values under `.dark`. This builds that sheet from the draft, so
 * the preview is the same text `rlz` puts in `globals.css`, and it reads the same
 * helpers the playground paints with (see `presetVariables`): one source for what
 * a value becomes, whether it is shown or applied.
 *
 * The four shared utility classes come along at the end, since a preset retunes
 * them through `base.utilities` rather than through a component. A per-component
 * edit stays out of this sheet: it is a list of classes for one box, not a
 * declaration the whole design system reads.
 */

type Declaration = [name: string, value: string];

export function themeCss(preset: RegistryPreset): string {
  const { radius, spacing } = preset.base.layout;
  const { letterSpacing } = preset.base.typography;
  const typography = preset.recommendations?.typography;

  const light: string[] = [];
  const dark: string[] = [];

  section(light, "Radius", [["--radius", sized(radius, "rem")]]);
  section(light, "Spacing", [["--spacing", sized(spacing, "rem")]]);
  section(light, "Tracking", [
    ["--tracking-normal", sized(letterSpacing, "em")],
  ]);

  // The recommended typefaces: the CLI installs them and exposes them under the
  // same three variables the design system reads.
  section(light, "Font", [
    [
      "--font-sans",
      typography?.fontSans ? fontFamily(typography.fontSans) : "",
    ],
    [
      "--font-heading",
      typography?.fontHeading ? fontFamily(typography.fontHeading) : "",
    ],
    [
      "--font-mono",
      typography?.fontMono ? fontFamily(typography.fontMono, "monospace") : "",
    ],
  ]);

  for (const group of preset.colors ?? []) {
    section(
      light,
      group.name,
      group.tokens.map(
        (token): Declaration => [token.cssVar, color(token.light.value)]
      )
    );

    section(
      dark,
      group.name,
      group.tokens.map(
        (token): Declaration => [token.cssVar, color(token.dark.value)]
      )
    );
  }

  return `${[
    rule(":root", light),
    rule(".dark", dark),
    utilityLayer(preset),
  ]
    .filter(Boolean)
    .join("\n\n")}\n`;
}

/**
 * The shared classes the components borrow from, rewritten by the draft where it
 * rewrote them. A class left without any class to apply writes nothing: the app
 * keeps the definition it ships with, which is what an empty field says.
 */
function utilityLayer(preset: RegistryPreset) {
  const rewritten = preset.base.utilities ?? {};
  const rules = Object.entries(designSystemUtilities)
    .map(([name, builtIn]) => utility(name, rewritten[name] ?? builtIn))
    .filter(Boolean);

  // A rewrite of a class the design system does not ship is still a class the
  // preset declares, so it belongs in the sheet too.
  rules.push(
    ...Object.entries(rewritten)
      .filter(([name]) => !(name in designSystemUtilities))
      .map(([name, classes]) => utility(name, classes))
      .filter(Boolean)
  );

  if (rules.length === 0) return "";

  return `@layer utilities {\n${rules.join("\n\n")}\n}`;
}

function utility(name: string, classes: string) {
  const applied = classes.replace(/\s+/g, " ").trim();

  if (!applied) return "";

  return `  .${name} {\n    @apply ${safe(applied)};\n  }`;
}

// A number the draft never settled (a cleared slider) writes nothing, so the app
// keeps the value it shipped with.
function sized(value: number | undefined, unit: string) {
  return Number.isFinite(value) ? `${value}${unit}` : "";
}

function color(value: string | undefined) {
  return safe(value ?? "").trim();
}

// One commented group of declarations, blank-separated from the previous one -
// the layout the design system's own stylesheet uses.
function section(lines: string[], title: string, declarations: Declaration[]) {
  const kept = declarations.filter(([, written]) => written !== "");

  if (kept.length === 0) return;

  if (lines.length > 0) lines.push("");

  lines.push(
    `/* ${title} */`,
    ...kept.map(([name, written]) => `${name}: ${written};`)
  );
}

function rule(selector: string, lines: string[]) {
  if (lines.length === 0) return "";

  const body = lines.map((line) => (line ? `  ${line}` : "")).join("\n");

  return `${selector} {\n${body}\n}`;
}
