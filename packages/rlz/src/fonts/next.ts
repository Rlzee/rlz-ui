import { type FontKey, FONT_DEFINITION } from "./def";
import { readConfig } from "@/config/read";
import path from "path";
import fs from "fs-extra";
import { updateNextRootLayout } from "@/utils/update-next-layout";

type AddNextFontsOptions = {
  bodyFont: FontKey;
  headingFont: FontKey;
  cwd: string;
};

export async function addNextFonts({
  bodyFont,
  headingFont,
  cwd,
}: AddNextFontsOptions) {
  const body = FONT_DEFINITION[bodyFont];
  const heading = FONT_DEFINITION[headingFont];

  if (!body.next)
    throw new Error(`Body font ${bodyFont} not supported by Next.js`);
  if (!heading.next)
    throw new Error(`Heading font ${headingFont} not supported by Next.js`);

  const config = readConfig(cwd);
  const rootDir = config.dirs.root;

  if (!rootDir || typeof rootDir !== "string") {
    throw new Error("Missing config.dirs.root");
  }

  const fontsDir = path.join(cwd, rootDir, "app", "fonts");
  await fs.mkdir(fontsDir, { recursive: true });

  const fontsPath = path.join(fontsDir, "fonts.ts");

  const bodyImport = body.next.import;
  const headingImport = heading.next.import;

  const content = `import { ${bodyImport}, ${headingImport} } from "next/font/google";

export const bodyFont = ${bodyImport}({
  variable: "--font-body",
  subsets: ["latin"],
});

export const headingFont = ${headingImport}({
  variable: "--font-heading",
  subsets: ["latin"],
});
`;

  await fs.writeFile(fontsPath, content, "utf8");

  await updateNextRootLayout({
    cwd,
    rootDir,
    fontBodyExport: "bodyFont",
    fontHeadingExport: "headingFont",
  });
}
