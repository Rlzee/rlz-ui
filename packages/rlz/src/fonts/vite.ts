import { readConfig } from "@/config/read";
import fs from "fs-extra";
import type { FontInfo } from "@rlz/fonts";
import { buildGoogleFontImport } from "./utils";

type AddViteFontsOptions = {
  bodyFont: FontInfo;
  headingFont: FontInfo;
  cwd: string;
};

export async function addViteFonts({
  bodyFont,
  headingFont,
  cwd,
}: AddViteFontsOptions) {
  const config = readConfig(cwd);
  const cssPath = config.css;

  let css = await fs.readFile(cssPath, "utf8");

  const imports = [
    buildGoogleFontImport(bodyFont.family),
    buildGoogleFontImport(headingFont.family),
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join("\n");

  css = css
    .replace(
      /@import\s+url\(["']https:\/\/fonts\.googleapis\.com\/css2[^"']+["']\);?\s*/g,
      ""
    )
    .replace(
      /--font-body:\s*[^;]+;/,
      `--font-body: "${bodyFont.family}", ${bodyFont.category};`
    )
    .replace(
      /--font-heading:\s*[^;]+;/,
      `--font-heading: "${headingFont.family}", ${headingFont.category};`
    );

  css = `${imports}\n\n${css}`;

  await fs.writeFile(cssPath, css);
}
