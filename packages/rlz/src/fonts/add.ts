import type { Framework } from "@/types/framework";
import { getFontByFamily } from "@rlz/fonts";
import { addViteFonts } from "./vite";
import { addNextFonts } from "./next";

type AddFontsOptions = {
  bodyFont: string;
  headingFont: string;
  cwd: string;
  framework: Framework;
};

export async function addFonts({
  bodyFont,
  headingFont,
  framework,
  cwd,
}: AddFontsOptions) {
  const body = getFontByFamily(bodyFont);
  const heading = getFontByFamily(headingFont);

  if (!body) {
    throw new Error(`Unknown body font: ${bodyFont}`);
  }

  if (!heading) {
    throw new Error(`Unknown heading font: ${headingFont}`);
  }

  if (framework === "vite" || framework === "react") {
    await addViteFonts({
      bodyFont: body.family,
      headingFont: heading.family,
      cwd,
    });
  } else if (framework === "next") {
    await addNextFonts({
      bodyFont: body.family,
      headingFont: heading.family,
      cwd,
    });
  } else {
    throw new Error(`Framework ${framework} not supported`);
  }
}
