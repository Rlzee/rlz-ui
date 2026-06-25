import { GOOGLE_FONTS } from "./google-fonts";
import type { FontInfo } from "./types";

export function getFontByFamily(family: string): FontInfo | undefined {
  return GOOGLE_FONTS.find(
    (f) => f.family.toLowerCase() === family.toLowerCase()
  );
}

export function getFontsByCategory(category: FontInfo["category"]) {
  return GOOGLE_FONTS.filter((f) => f.category === category);
}

export function searchFonts(query: string) {
  const q = query.toLowerCase();
  return GOOGLE_FONTS.filter((f) => f.family.toLowerCase().includes(q));
}
