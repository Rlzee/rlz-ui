import fs from "fs-extra";
import {
  shadowPrimitives,
  type PresetColorToken,
  type PresetColorConfig,
  type PresetBaseConfig,
} from "@rlz/registry";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceVariable(css: string, cssVar: string, value: string): string {
  const regex = new RegExp(`(${escapeRegExp(cssVar)}\\s*:\\s*)[^;]+(;?)`, "g");

  return css.replace(regex, `$1${value}$2`);
}

function updateBlock(
  css: string,
  selector: string,
  colors: PresetColorToken[],
  mode: "light" | "dark"
): string {
  const selectorRegex = new RegExp(
    `(${escapeRegExp(selector)}\\s*\\{)([\\s\\S]*?)(\\})`,
    "g"
  );

  return css.replace(selectorRegex, (_, start, content, end) => {
    let updatedContent = content;

    for (const color of colors) {
      updatedContent = replaceVariable(
        updatedContent,
        color.cssVar,
        color[mode].value
      );
    }

    return `${start}${updatedContent}${end}`;
  });
}

export async function updateCssPreset(
  cssPath: string,
  preset: {
    base?: PresetBaseConfig;
    colors?: PresetColorConfig[];
  }
): Promise<void> {
  let css = await fs.readFile(cssPath, "utf8");

  if (preset.colors?.length) {
    const tokens = preset.colors.flatMap((section) => section.tokens);

    css = updateBlock(css, ":root", tokens, "light");
    css = updateBlock(css, ".dark", tokens, "dark");
  }

  if (preset.base?.layout?.radius !== undefined) {
    css = replaceVariable(css, "--radius", `${preset.base.layout.radius}rem`);
  }

  if (preset.base?.layout?.spacing !== undefined) {
    css = replaceVariable(css, "--spacing", `${preset.base.layout.spacing}rem`);
  }

  if (preset.base?.typography?.letterSpacing !== undefined) {
    css = replaceVariable(
      css,
      "--tracking-normal",
      `${preset.base.typography.letterSpacing}em`
    );
  }

  // The shadow box, six primitives at a time. Only the box is written: the app's own
  // `@theme inline` draws every `shadow-*` step from it, resolved on the element the
  // utility styles. A preset that says nothing about shadows leaves the sheet alone.
  if (preset.base?.shadows) {
    for (const [cssVar, value] of Object.entries(
      shadowPrimitives(preset.base.shadows)
    )) {
      css = replaceVariable(css, cssVar, value);
    }
  }

  await fs.writeFile(cssPath, css, "utf8");
}
