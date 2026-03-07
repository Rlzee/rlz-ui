import { FONT_DEFINITION } from "./def";
import type { rlzConfig } from "@/config/types";
import type { Framework } from "@/types/framework";
import type { FontKey } from "./def";

import { addViteFont } from "./vite";
import { addNextFont } from "./next";

type addFontProps = {
  framework: Framework;
  fontName: FontKey;
  cssPath: rlzConfig["css"];
  cwd: string;
  rootDir: string;
};

export async function addFont({
  framework,
  fontName,
  cssPath,
  cwd,
  rootDir,
}: addFontProps) {
  const font = FONT_DEFINITION[fontName];
  if (!font) throw new Error(`Font ${fontName} not found`);

  if (framework === "next") {
    await addNextFont({ fontName, rootDir });
  }

  if (framework === "react" || framework === "vite") {
    await addViteFont({ fontName, cssPath, cwd });
  }

  throw new Error(`Framework ${framework} not supported`);
}
