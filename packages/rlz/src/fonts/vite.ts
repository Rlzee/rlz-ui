import { type FontKey, FONT_DEFINITION } from "./def";
import { installDependencies } from "@/utils/install-dependencies";
import { defaultFont } from "@/config";
import { readConfig } from "@/config/read";
import fs from "fs-extra";

type AddViteFontOptions = {
  name: FontKey;
  cwd: string;
};

export async function addViteFont({ name, cwd }: AddViteFontOptions) {
  const font = FONT_DEFINITION[name];
  if (!font.vite) throw new Error(`Font ${name} not supported by Vite`);

  await installDependencies([font.vite.package], cwd);

  if (name === defaultFont) return;

  const config = readConfig(cwd);
  const cssPath = config.css;

  let css = await fs.readFile(cssPath, "utf8");

  css = css
    .replace(
      /@import\s+"@fontsource-variable\/[^"]+"/,
      `@import "${font.vite.package}"`
    )
    .replace(/--font-sans:\s*[^;]+;/, `--font-sans: ${font.vite.family};`);

  await fs.writeFile(cssPath, css);
}
