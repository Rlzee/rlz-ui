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

  if (!body || !heading) {
    throw new Error("Invalid font");
  }

  if (framework === "vite" || framework === "react") {
    await addViteFonts({
      bodyFont: body,
      headingFont: heading,
      cwd,
    });
  } else if (framework === "next") {
    await addNextFonts({
      bodyFont: body,
      headingFont: heading,
      cwd,
    });
  } else {
    throw new Error(`Framework ${framework} not supported`);
  }
}
