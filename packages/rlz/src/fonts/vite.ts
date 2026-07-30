import { readConfig } from "@/config/read";
import fs from "fs-extra";
import type { FontInfo } from "@rlz/fonts";
import { buildGoogleFontImport } from "./utils";

type AddViteFontsOptions = {
  fontSans: FontInfo;
  fontHeading: FontInfo;
  fontMono?: FontInfo;
  cwd: string;
};

export async function addViteFonts({
  fontSans,
  fontHeading,
  fontMono,
  cwd,
}: AddViteFontsOptions) {
  const config = readConfig(cwd);
  const cssPath = config.css;

  let css = await fs.readFile(cssPath, "utf8");

  const imports = [
    buildGoogleFontImport(fontSans.family),
    buildGoogleFontImport(fontHeading.family),
    fontMono ? buildGoogleFontImport(fontMono.family) : null,
  ]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join("\n");

  css = css
    .replace(
      /@import\s+url\(["']https:\/\/fonts\.googleapis\.com\/css2[^"']+["']\);?\s*/g,
      ""
    )
    .replace(
      /--font-sans:\s*[^;]+;/,
      `--font-sans: "${fontSans.family}", ${fontSans.category};`
    )
    .replace(
      /--font-heading:\s*[^;]+;/,
      `--font-heading: "${fontHeading.family}", ${fontHeading.category};`
    );

  if (fontMono) {
    css = css.replace(
      /--font-mono:\s*[^;]+;/,
      `--font-mono: "${fontMono.family}", ${fontMono.category};`
    );
  }

  css = `${imports}\n\n${css}`;

  await fs.writeFile(cssPath, css);
}
