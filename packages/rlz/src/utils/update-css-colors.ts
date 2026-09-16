import fs from "fs-extra";
import type { PresetColorToken, PresetColorConfig } from "@rlz/registry";

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

export async function updateCssColors(
  cssPath: string,
  colors: PresetColorConfig[]
): Promise<void> {
  let css = await fs.readFile(cssPath, "utf8");

  const tokens = colors.flatMap((section) => section.tokens);

  css = updateBlock(css, ":root", tokens, "light");
  css = updateBlock(css, ".dark", tokens, "dark");

  await fs.writeFile(cssPath, css, "utf8");
}
