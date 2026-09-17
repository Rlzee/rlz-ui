import fs from "fs-extra";
import type {
  PresetColorToken,
  PresetColorConfig,
  PresetBaseConfig,
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

  await fs.writeFile(cssPath, css, "utf8");
}
