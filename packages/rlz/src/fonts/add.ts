import type { Framework } from "@/types/framework";
import { getFontByFamily } from "@rlz/fonts";
import { addViteFonts } from "./vite";
import { addNextFonts } from "./next";

type AddFontsOptions = {
  fontSans: string;
  fontHeading: string;
  fontMono?: string;
  cwd: string;
  framework: Framework;
};

export async function addFonts({
  fontSans,
  fontHeading,
  fontMono,
  framework,
  cwd,
}: AddFontsOptions) {
  const sans = getFontByFamily(fontSans);
  const heading = getFontByFamily(fontHeading);
  const mono = fontMono ? getFontByFamily(fontMono) : undefined;

  if (!sans) {
    throw new Error(`Unknown sans font: ${fontSans}`);
  }

  if (!heading) {
    throw new Error(`Unknown heading font: ${fontHeading}`);
  }

  if (fontMono && !mono) {
    throw new Error(`Unknown mono font: ${fontMono}`);
  }

  if (framework === "vite" || framework === "react") {
    await addViteFonts({
      fontSans: sans,
      fontHeading: heading,
      fontMono: mono,
      cwd,
    });
  } else if (framework === "next") {
    await addNextFonts({
      fontSans: sans.family,
      fontHeading: heading.family,
      fontMono: mono?.family,
      cwd,
    });
  } else {
    throw new Error(`Framework ${framework} not supported`);
  }
}
