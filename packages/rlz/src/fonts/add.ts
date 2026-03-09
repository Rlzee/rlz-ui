import { type FontKey, FONT_DEFINITION } from "./def";
import type { Framework } from "@/types/framework";

import { addViteFont } from "./vite";
import { addNextFont } from "./next";

type AddFontOptions = {
  fontName: FontKey;
  framework: Framework;
  cwd?: string;
};

export function addFont({
  fontName,
  framework,
  cwd = process.cwd(),
}: AddFontOptions) {
  const font = FONT_DEFINITION[fontName];
  if (!font) throw new Error(`Font ${fontName} not found`);

  if (framework === "vite" || framework === "react") {
    addViteFont({ name: fontName, cwd });
  } else if (framework === "next") {
    addNextFont();
  } else {
    throw new Error(`Framework ${framework} not supported`);
  }
}
