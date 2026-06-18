import { type FontKey, FONT_DEFINITION, fallbackMap } from "./def";
import { installDependencies } from "@/utils/install-dependencies";
import { readConfig } from "@/config/read";
// import { defaultBodyFont, defaultHeadingFont } from "@/config";
import fs from "fs-extra";

type AddViteFontsOptions = {
  bodyFont: FontKey;
  headingFont: FontKey;
  cwd: string;
};

export async function addViteFonts({
  bodyFont,
  headingFont,
  cwd,
}: AddViteFontsOptions) {
  const body = FONT_DEFINITION[bodyFont];
  const heading = FONT_DEFINITION[headingFont];

  if (!body.vite)
    throw new Error(`Body font ${bodyFont} not supported by Vite`);
  if (!heading.vite)
    throw new Error(`Heading font ${headingFont} not supported by Vite`);

  await installDependencies(
    Array.from(new Set([body.vite.package, heading.vite.package])),
    cwd
  );

  const config = readConfig(cwd);
  const cssPath = config.css;

  let css = await fs.readFile(cssPath, "utf8");

  const fontImports = [
    `@import "${body.vite.package}";`,
    `@import "${heading.vite.package}";`,
  ]
    .filter((v, i, a) => a.indexOf(v) === i)
    .join("\n");

  css = css
    .replace(
      /(@import\s+"@fontsource-variable\/[^"]+";\s*)+/,
      `${fontImports}\n\n`
    )
    .replace(
      /--body-font:\s*[^;]+;/,
      `--body-font: "${body.vite.family}", ${fallbackMap[body.type]};`
    )
    .replace(
      /--heading-font:\s*[^;]+;/,
      `--heading-font: "${heading.vite.family}", ${fallbackMap[heading.type]};`
    );

  await fs.writeFile(cssPath, css);
}
