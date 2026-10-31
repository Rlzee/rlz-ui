import type { RegistryPreset } from "@rlz/registry";

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
 * Only the foundations are here. A component edit is a list of classes rather
 * than a declaration, so it belongs to the preset JSON, not to this sheet.
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

  return `${[rule(":root", light), rule(".dark", dark)].filter(Boolean).join("\n\n")}\n`;
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
