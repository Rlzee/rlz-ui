import { readConfig } from "@/config/read";
import fs from "fs-extra";
import { buildGoogleFontImport } from "./utils";

type AddViteFontsOptions = {
  bodyFont: string;
  headingFont: string;
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
    buildGoogleFontImport(bodyFont),
    buildGoogleFontImport(headingFont),
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join("\n");

  css = css
    .replace(
      /(@import url\("https:\/\/fonts\.googleapis\.com\/css2[^;]+;\s*)+/g,
      ""
    )
    .replace(/--body-font:\s*[^;]+;/, `--body-font: "${bodyFont}", sans-serif;`)
    .replace(
      /--heading-font:\s*[^;]+;/,
      `--heading-font: "${headingFont}", sans-serif;`
    );

  css = `${imports}\n\n${css}`;

  await fs.writeFile(cssPath, css);
}
