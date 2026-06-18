import { type FontKey, FONT_DEFINITION, fallbackMap } from "./def";
import { installDependencies } from "@/utils/install-dependencies";
import { readConfig } from "@/config/read";
import { defaultBodyFont, defaultHeadingFont } from "@/config";
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

  if (bodyFont === defaultBodyFont) return;
  if (headingFont === defaultHeadingFont) return;

  const config = readConfig(cwd);
  const cssPath = config.css;

  let css = await fs.readFile(cssPath, "utf8");

  const imports = [
    `@import "${body.vite.package}";`,
    `@import "${heading.vite.package}";`,
  ];

  for (const imp of imports) {
    if (!css.includes(imp)) {
      css = imp + "\n" + css;
    }
  }

  if (!css.includes("--font-body:")) {
    css += `\n  --font-body: "${body.vite.family}", ${
      fallbackMap[body.type]
    };\n`;
  }

  if (!css.includes("--font-heading:")) {
    css += `  --font-heading: "${heading.vite.family}", ${
      fallbackMap[heading.type]
    };\n`;
  }

  css = css
    .replace(
      /--font-body:\s*[^;]+;/,
      `--font-body: "${body.vite.family}", ${fallbackMap[body.type]};`
    )
    .replace(
      /--font-heading:\s*[^;]+;/,
      `--font-heading: "${heading.vite.family}", ${fallbackMap[heading.type]};`
    );

  await fs.writeFile(cssPath, css);
}
