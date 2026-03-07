import { FONT_DEFINITION } from "./def";
import type { FontKey } from "./def";
import type { rlzConfig } from "@/config/types";
import { installDependencies } from "@/utils/install-dependencies";

type AddViteFontProps = {
  fontName: FontKey;
  cssPath: rlzConfig["css"];
  cwd: string;
};

export async function addViteFont({
  fontName,
  cssPath,
  cwd,
}: AddViteFontProps) {
  const font = FONT_DEFINITION[fontName];

  if (!font.vite) {
    throw new Error(`Font ${fontName} does not have a vite configuration`);
  }

  await installDependencies([font.vite.package], cwd);

  const cssImport = `@import "${font.vite.package}";`;
}
