import type { FontKey } from "./def";
import type { Framework } from "@/types/framework";

import { addViteFonts } from "./vite";
import { addNextFonts } from "./next";

type AddFontsOptions = {
  bodyFont: FontKey;
  headingFont: FontKey;
  cwd: string;
  framework: Framework;
};

export async function addFonts({
  bodyFont,
  headingFont,
  framework,
  cwd,
}: AddFontsOptions) {
  if (framework === "vite" || framework === "react") {
    await addViteFonts({
      bodyFont,
      headingFont,
      cwd,
    });
  } else if (framework === "next") {
    await addNextFonts({
      bodyFont,
      headingFont,
      cwd,
    });
  } else {
    throw new Error(`Framework ${framework} not supported`);
  }
}
