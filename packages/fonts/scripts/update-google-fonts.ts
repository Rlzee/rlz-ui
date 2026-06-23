import fs from "fs-extra";
import path from "path";
import type { FontInfo, GoogleFontsResponse } from "../src/types";
import "dotenv/config";

const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

function isVariableFont(variants: string[]) {
  return variants.some(
    (v) => v.includes("wght") || v.includes("ital") || v.includes("variable")
  );
}

async function main() {
  if (!API_KEY) {
    throw new Error("Missing GOOGLE_FONTS_API_KEY");
  }

  const res = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error(`Google Fonts API error: ${res.status}`);
  }

  const data = (await res.json()) as GoogleFontsResponse;

  const fonts: FontInfo[] = data.items.map((font) => ({
    family: font.family,
    category: font.category,
    variants: font.variants,
    variable: isVariableFont(font.variants),
  }));

  fonts.sort((a, b) => a.family.localeCompare(b.family));

  const outputPath =
    process.env.FONTS_OUTPUT_PATH ??
    path.resolve(process.cwd(), "data/google-fonts.json");

  await fs.ensureDir(path.dirname(outputPath));

  await fs.writeJson(outputPath, fonts, { spaces: 2 });

  console.log(`Generated ${fonts.length} fonts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
